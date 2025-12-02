// lib/validation.ts

/**
 * Validates rule quality and returns detailed error messages
 */
export function validateRule(rule: string, index: number): { valid: boolean; error?: string } {
  // Check if rule is empty
  if (!rule || rule.trim().length === 0) {
    return { valid: false, error: `Rule ${index + 1} cannot be empty` };
  }

  // Check minimum length
  if (rule.trim().length < 10) {
    return { 
      valid: false, 
      error: `Rule ${index + 1} is too short (minimum 10 characters). Be more specific.` 
    };
  }

  // Check maximum length
  if (rule.trim().length > 200) {
    return { 
      valid: false, 
      error: `Rule ${index + 1} is too long (maximum 200 characters). Keep it concise.` 
    };
  }

  // Check if rule is a question (should be a statement)
  if (rule.trim().endsWith('?')) {
    return { 
      valid: false, 
      error: `Rule ${index + 1} should be a statement, not a question. Example: "Document must have..." instead of "Does document have...?"` 
    };
  }

  // Check for meaningless content (all numbers or special chars)
  const meaningfulChars = rule.replace(/[^a-zA-Z]/g, '').length;
  if (meaningfulChars < 5) {
    return { 
      valid: false, 
      error: `Rule ${index + 1} must contain meaningful text` 
    };
  }

  return { valid: true };
}

/**
 * Validates all rules and checks for duplicates
 */
export function validateAllRules(rules: string[]): { valid: boolean; error?: string } {
  // Check if all rules are provided
  if (rules.length !== 3) {
    return { valid: false, error: "Exactly 3 rules are required" };
  }

  // Validate each rule individually
  for (let i = 0; i < rules.length; i++) {
    const validation = validateRule(rules[i], i);
    if (!validation.valid) {
      return validation;
    }
  }

  // Check for duplicate rules (case-insensitive)
  const normalizedRules = rules.map(r => r.trim().toLowerCase());
  const uniqueRules = new Set(normalizedRules);
  
  if (uniqueRules.size !== rules.length) {
    return { 
      valid: false, 
      error: "Duplicate rules detected. Each rule must be unique." 
    };
  }

  // Check for very similar rules (optional - catches near-duplicates)
  for (let i = 0; i < normalizedRules.length; i++) {
    for (let j = i + 1; j < normalizedRules.length; j++) {
      const similarity = calculateSimilarity(normalizedRules[i], normalizedRules[j]);
      if (similarity > 0.8) { // 80% similar
        return { 
          valid: false, 
          error: `Rules ${i + 1} and ${j + 1} are too similar. Make them more distinct.` 
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Calculate similarity between two strings (0 = different, 1 = identical)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance (edit distance) between two strings
 */
function getEditDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}