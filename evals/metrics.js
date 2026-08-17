/**
 * evals/metrics.js
 * Custom evaluation metrics for Promptfoo
 * Calculates Accuracy, Precision, Recall, F1, and Hallucination tracking
 */

const normalize = (str) => {
  if (typeof str !== 'string') return '';
  return str.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
};

const extractJson = (output) => {
  if (typeof output !== 'string') return output;
  // Try to find markdown json block
  const jsonMatch = output.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  // Try to find first { and last }
  const start = output.indexOf('{');
  const end = output.lastIndexOf('}');
  if (start !== -1 && end !== -1 && start < end) {
    return output.substring(start, end + 1);
  }
  return output;
};

module.exports = {
  // Evaluates F1, Precision, Recall for array outputs (e.g. extracted symptoms, remedies)
  evaluateInformationRetrieval: (output, context) => {
    let parsedOutput = {};
    try {
      const jsonStr = extractJson(output);
      parsedOutput = JSON.parse(jsonStr);
    } catch (e) {
      return { pass: false, score: 0, reason: "Output is not valid JSON. LLM returned: " + output.substring(0, 50) + "..." };
    }

    const targetField = context.vars.eval_target_field; // e.g. "symptoms"
    const expectedStr = context.vars.expected_items || "";
    const expectedItems = expectedStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    const predictedItems = parsedOutput[targetField] || [];

    if (!Array.isArray(predictedItems)) {
        return { pass: false, score: 0, reason: `Target field '${targetField}' must be an array in JSON.` };
    }

    if (expectedItems.length === 0 && predictedItems.length === 0) {
        return { pass: true, score: 1, reason: "Both expected and predicted are empty." };
    }

    const normExpected = expectedItems.map(normalize);
    const normPredicted = predictedItems.map(normalize);

    let truePositives = 0;
    
    // Simple subset matching to simulate semantic match (can be swapped with vector similarity)
    normPredicted.forEach(pred => {
      if (normExpected.some(exp => exp.includes(pred) || pred.includes(exp))) {
        truePositives++;
      }
    });

    const precision = truePositives / (normPredicted.length || 1);
    const recall = truePositives / (normExpected.length || 1);
    const f1 = (precision + recall) === 0 ? 0 : 2 * (precision * recall) / (precision + recall);

    return {
      pass: f1 > 0.5,
      score: f1,
      reason: `Precision: ${(precision * 100).toFixed(1)}%, Recall: ${(recall * 100).toFixed(1)}%, F1: ${(f1 * 100).toFixed(1)}%`,
    };
  },
  
  // Evaluates Exact match Accuracy for categorical outputs (e.g. crop identification)
  evaluateAccuracy: (output, context) => {
    let parsedOutput = {};
    try {
      const jsonStr = extractJson(output);
      parsedOutput = JSON.parse(jsonStr);
    } catch (e) {
      return { pass: false, score: 0, reason: "Output is not valid JSON. LLM returned: " + output.substring(0, 50) + "..." };
    }

    const targetField = context.vars.eval_accuracy_field; // e.g. "detectedCrop"
    const expectedValue = context.vars.expected_value;
    const predictedValue = parsedOutput[targetField];

    if (predictedValue === undefined) {
       return { pass: false, score: 0, reason: `Field '${targetField}' missing in output.` };
    }

    const isMatch = normalize(predictedValue) === normalize(expectedValue);
    
    return {
        pass: isMatch,
        score: isMatch ? 1 : 0,
        reason: isMatch ? `Accurate Match: ${predictedValue}` : `Expected '${expectedValue}', got '${predictedValue}'`
    };
  }
};
