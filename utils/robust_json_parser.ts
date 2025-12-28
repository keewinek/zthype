/**
 * Ultimate JSON Parser - Handles malformed JSON from AI responses
 * Attempts multiple strategies to parse JSON that may have common syntax errors
 */

export function robustJsonParse<T = any>(jsonString: string): T {
    // First, try standard parsing
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        // If that fails, try fixing common issues
    }

    // Strategy 1: Fix common issues and try again
    let fixed = fixCommonJsonIssues(jsonString);
    try {
        return JSON.parse(fixed);
    } catch (e) {
        // Continue to next strategy
    }

    // Strategy 2: Use state machine to fix JSON intelligently
    fixed = intelligentJsonFix(jsonString);
    try {
        return JSON.parse(fixed);
    } catch (e) {
        // Continue to next strategy
    }

    // Strategy 3: Try to extract and fix JSON object/array
    fixed = extractAndFixJson(jsonString);
    try {
        return JSON.parse(fixed);
    } catch (e) {
        // Continue to next strategy
    }

    // Strategy 4: Try parsing with more aggressive fixes
    fixed = aggressiveJsonFix(jsonString);
    try {
        return JSON.parse(fixed);
    } catch (e) {
        // Continue to next strategy
    }

    // Strategy 5: Try to reconstruct JSON from broken structure
    fixed = reconstructJson(jsonString);
    try {
        return JSON.parse(fixed);
    } catch (e) {
        // Last resort: throw with helpful error
        throw new Error(`Failed to parse JSON after all recovery attempts. Original error: ${e instanceof Error ? e.message : String(e)}`);
    }
}

/**
 * Intelligent JSON fixer using state machine to properly handle strings
 * This is the most reliable method as it respects string boundaries
 */
function intelligentJsonFix(json: string): string {
    let result = '';
    let inString = false;
    let escapeNext = false;
    let depth = 0;
    let lastChar = '';
    let lastNonWhitespace = '';
    let expectingComma = false;
    
    for (let i = 0; i < json.length; i++) {
        const char = json[i];
        const nextChar = i < json.length - 1 ? json[i + 1] : '';
        const prevChar = i > 0 ? json[i - 1] : '';
        
        if (escapeNext) {
            result += char;
            escapeNext = false;
            lastChar = char;
            if (!/\s/.test(char)) lastNonWhitespace = char;
            continue;
        }
        
        if (char === '\\') {
            escapeNext = true;
            result += char;
            lastChar = char;
            continue;
        }
        
        if (char === '"' && !escapeNext) {
            inString = !inString;
            result += char;
            lastChar = char;
            lastNonWhitespace = char;
            expectingComma = false;
            continue;
        }
        
        if (inString) {
            // Inside string - just copy everything
            result += char;
            lastChar = char;
            if (!/\s/.test(char)) lastNonWhitespace = char;
            continue;
        }
        
        // Outside string - we can fix structure
        if (char === '{' || char === '[') {
            depth++;
            // Check if we need a comma before this
            if (expectingComma && (lastNonWhitespace === '}' || lastNonWhitespace === ']' || lastNonWhitespace === '"' || /[0-9]/.test(lastNonWhitespace))) {
                result += ',';
            }
            result += char;
            lastChar = char;
            lastNonWhitespace = char;
            expectingComma = false;
            continue;
        }
        
        if (char === '}' || char === ']') {
            depth--;
            // Remove trailing comma before closing
            if (lastNonWhitespace === ',') {
                // Remove the last comma
                result = result.replace(/,\s*$/, '');
            }
            result += char;
            lastChar = char;
            lastNonWhitespace = char;
            expectingComma = true;
            continue;
        }
        
        if (char === ':') {
            result += char;
            lastChar = char;
            lastNonWhitespace = char;
            expectingComma = false;
            continue;
        }
        
        if (char === ',') {
            // Check if this comma is actually needed
            if (expectingComma || lastNonWhitespace === '}' || lastNonWhitespace === ']' || lastNonWhitespace === '"' || /[0-9]/.test(lastNonWhitespace)) {
                result += char;
                lastChar = char;
                lastNonWhitespace = char;
                expectingComma = false;
            }
            // Otherwise skip duplicate comma
            continue;
        }
        
        // Check if we need to add a comma before this character
        // This handles cases where a value is followed directly by another value or property
        if (expectingComma && (char === '"' || char === '{' || char === '[' || /[0-9-]/.test(char))) {
            // We're expecting a comma but found a value - add it
            // But don't add if we just had an opening brace/bracket or colon
            if (lastNonWhitespace !== ',' && lastNonWhitespace !== '{' && lastNonWhitespace !== '[' && lastNonWhitespace !== ':') {
                result += ',';
                lastNonWhitespace = ',';
            }
            expectingComma = false;
        }
        
        // Handle whitespace - we need to track if we're in a position where comma might be missing
        if (/\s/.test(char)) {
            result += char;
            lastChar = char;
            continue;
        }
        
        result += char;
        lastChar = char;
        lastNonWhitespace = char;
        
        // After a value, we might expect a comma
        if (char === '"' || char === '}' || char === ']' || /[0-9]/.test(char)) {
            expectingComma = true;
        } else if (char === ':' || char === '{' || char === '[') {
            expectingComma = false;
        }
    }
    
    // Final cleanup - remove trailing commas before closing braces/brackets
    // We do this carefully to avoid affecting strings
    let cleaned = '';
    let inStringClean = false;
    let escapeNextClean = false;
    
    for (let i = 0; i < result.length; i++) {
        const char = result[i];
        const nextChar = i < result.length - 1 ? result[i + 1] : '';
        
        if (escapeNextClean) {
            cleaned += char;
            escapeNextClean = false;
            continue;
        }
        
        if (char === '\\') {
            escapeNextClean = true;
            cleaned += char;
            continue;
        }
        
        if (char === '"') {
            inStringClean = !inStringClean;
            cleaned += char;
            continue;
        }
        
        if (inStringClean) {
            cleaned += char;
            continue;
        }
        
        // Outside string - apply fixes
        // Remove trailing commas before } or ]
        if (char === ',' && (nextChar === '}' || nextChar === ']')) {
            // Skip this comma
            continue;
        }
        
        // Remove commas right after { or [
        if (char === ',' && i > 0) {
            let j = i - 1;
            while (j >= 0 && /\s/.test(result[j])) j--;
            if (j >= 0 && (result[j] === '{' || result[j] === '[')) {
                // Skip this comma
                continue;
            }
        }
        
        cleaned += char;
    }
    
    return cleaned;
}

/**
 * Fixes common JSON issues:
 * - Trailing commas
 * - Missing commas between properties
 * - Unescaped quotes in strings (basic)
 */
function fixCommonJsonIssues(json: string): string {
    let result = json;

    // Remove trailing commas before } or ]
    result = result.replace(/,(\s*[}\]])/g, '$1');

    // Fix missing commas between properties (look for }" or ]" followed by " or {
    result = result.replace(/([}\]])"(\s*")/g, '$1,"$2');
    result = result.replace(/([}\]])"(\s*{)/g, '$1,"$2');
    result = result.replace(/([}\]])"(\s*\[)/g, '$1,"$2');
    
    // Fix missing commas between values and properties
    result = result.replace(/([0-9"}\]\]])\s*"([a-zA-Z_$])/g, '$1,"$2');
    result = result.replace(/([0-9"}\]\]])\s*{/g, '$1,{');
    result = result.replace(/([0-9"}\]\]])\s*\[/g, '$1,[');

    // Fix missing commas in arrays
    result = result.replace(/([0-9"}\]\]])\s*([0-9"{\[])/g, '$1,$2');

    return result;
}

/**
 * Extracts JSON from text and attempts to fix structure
 */
function extractAndFixJson(text: string): string {
    // Find the first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        // Try arrays
        const firstBracket = text.indexOf('[');
        const lastBracket = text.lastIndexOf(']');
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
            return fixCommonJsonIssues(text.substring(firstBracket, lastBracket + 1));
        }
        return text;
    }

    return fixCommonJsonIssues(text.substring(firstBrace, lastBrace + 1));
}

/**
 * More aggressive JSON fixing - handles edge cases
 */
function aggressiveJsonFix(json: string): string {
    let result = json;

    // Remove any comments (single-line and multi-line)
    result = result.replace(/\/\/.*$/gm, '');
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');

    // Fix unescaped newlines in strings (replace with \n)
    // This is tricky - we need to be careful not to break valid JSON
    // We'll only fix obvious cases where newlines appear in string values
    
    // Fix control characters in strings
    result = result.replace(/(["'])((?:(?!\1)[^\\]|\\.)*?)\1/g, (match, quote, content) => {
        // Only fix if it looks like it has unescaped control chars
        if (content.includes('\n') && !content.includes('\\n')) {
            content = content.replace(/\n/g, '\\n');
            content = content.replace(/\r/g, '\\r');
            content = content.replace(/\t/g, '\\t');
        }
        return quote + content + quote;
    });

    // Fix missing quotes around keys (basic attempt)
    result = result.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

    // Fix trailing commas (more aggressive)
    result = result.replace(/,(\s*[}\]])/g, '$1');
    result = result.replace(/,(\s*[}\]])/g, '$1'); // Run twice to catch nested cases

    // Fix missing commas (more aggressive)
    result = result.replace(/([}\]"])\s*"([a-zA-Z_$])/g, '$1,"$2');
    result = result.replace(/([0-9"}\]\]])\s*"([a-zA-Z_$])/g, '$1,"$2');

    return result;
}

/**
 * Attempts to reconstruct JSON from severely broken structure
 * This is a last resort that tries to parse the structure manually
 */
function reconstructJson(json: string): string {
    // Extract the main object
    const extracted = extractAndFixJson(json);
    
    // Try to fix string escaping issues
    let result = extracted;
    
    // Fix common string escaping problems
    // Look for strings that might have unescaped quotes
    const lines = result.split('\n');
    const fixedLines: string[] = [];
    let inString = false;
    let stringStart = -1;
    let escapeNext = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let fixedLine = '';
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            const prevChar = j > 0 ? line[j - 1] : '';
            
            if (escapeNext) {
                fixedLine += char;
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                fixedLine += char;
                continue;
            }
            
            if (char === '"' && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringStart = j;
                } else {
                    // Check if this is a closing quote or an unescaped quote in content
                    // Look ahead to see if there's a colon or comma
                    const nextNonSpace = line.substring(j + 1).match(/^\s*([:,}\]])/);
                    if (nextNonSpace) {
                        inString = false;
                    } else {
                        // This might be an unescaped quote - escape it
                        fixedLine += '\\"';
                        continue;
                    }
                }
            }
            
            fixedLine += char;
        }
        
        fixedLines.push(fixedLine);
    }
    
    result = fixedLines.join('\n');
    
    // Apply all previous fixes
    result = aggressiveJsonFix(result);
    
    return result;
}

/**
 * Attempts to parse JSON with multiple fallback strategies
 * Returns the parsed object or throws an error
 */
export function safeJsonParse<T = any>(jsonString: string, fallback?: T): T {
    try {
        return robustJsonParse<T>(jsonString);
    } catch (error) {
        if (fallback !== undefined) {
            return fallback;
        }
        throw error;
    }
}

