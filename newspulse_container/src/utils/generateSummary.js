//
// PUBLIC_INTERFACE
/**
 * Generates a mock/demo AI summary for a given article text.
 * This simulates an AI-generated summary for demo purposes.
 * @param {string} text - Original article text.
 * @returns {string} Short, "AI-generated" summary.
 */
export function generateSummary(text) {
  if (!text || typeof text !== "string") return "No summary available.";
  // Demo: Just pick out the first ~28 words, append ellipsis.
  const limit = 28;
  const words = text.split(/\s+/);
  if (words.length <= limit) {
    return text.trim();
  }
  // Simulate "summarization":
  return words.slice(0, limit).join(" ") + " ...";
}
