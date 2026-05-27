// Modal control functions
function openTruthTable() {
    const modal = document.getElementById('truthTableModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeTruthTable() {
    const modal = document.getElementById('truthTableModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeTruthTable();
    }
});

// Close modal when clicking outside
document.getElementById('truthTableModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeTruthTable();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const expressionInput = document.getElementById('expressionInput');
    const errorDisplay = document.getElementById('errorDisplay');
    const truthTable = document.getElementById('truthTable');

    function insertOperator(operator) {
        const start = expressionInput.selectionStart;
        const end = expressionInput.selectionEnd;
        const currentValue = expressionInput.value;
        
        // Add spaces around operators except NOT and parentheses
        const spacesBefore = operator === '¬' || operator === '(' ? '' : ' ';
        const spacesAfter = operator === ')' ? '' : ' ';
        
        const newValue = currentValue.slice(0, start) + 
                        spacesBefore + operator + spacesAfter + 
                        currentValue.slice(end);
        
        expressionInput.value = newValue;
        
        // Set cursor position after operator
        const newPosition = start + operator.length + spacesBefore.length + spacesAfter.length;
        expressionInput.setSelectionRange(newPosition, newPosition);
        expressionInput.focus();
    }

    function extractVariables(expression) {
        const variables = new Set();
        const chars = expression.split('');
        
        chars.forEach(char => {
            if (/[a-zA-Z]/.test(char) && 
                !['T', 'F', 'V'].includes(char.toUpperCase())) {
                variables.add(char);
            }
        });
        
        return Array.from(variables).sort();
    }

    function validateExpression(expression) {
        // Check for empty expression
        if (!expression.trim()) {
            throw new Error('Expression cannot be empty');
        }

        // Check for balanced parentheses
        let parenCount = 0;
        for (let char of expression) {
            if (char === '(') parenCount++;
            if (char === ')') parenCount--;
            if (parenCount < 0) {
                throw new Error('Unmatched parentheses');
            }
        }
        if (parenCount !== 0) {
            throw new Error('Unmatched parentheses');
        }

        // Check for invalid operator combinations
        const operators = ['∧', '∨', '→', '↔', '⊕'];
        let prevChar = '';
        for (let char of expression) {
            if (operators.includes(prevChar) && operators.includes(char)) {
                throw new Error('Invalid operator combination');
            }
            prevChar = char;
        }

        // Check for invalid characters
        const validChars = /[a-zA-Z0-9\s∧∨¬→↔⊕()]/;
        for (let char of expression) {
            if (!validChars.test(char)) {
                throw new Error(`Invalid character: ${char}`);
            }
        }
    }

    function evaluateExpression(expression, values) {
        // Remove extra spaces
        expression = expression.replace(/\s+/g, '');

        // Replace variables with their values
        Object.keys(values).forEach(variable => {
            const regex = new RegExp(variable, 'g');
            expression = expression.replace(regex, values[variable].toString());
        });

        // Evaluate NOT (¬)
        while (expression.includes('¬')) {
            expression = expression.replace(/¬([TF])/g, match => {
                return match[1] === 'T' ? 'F' : 'T';
            });
        }

        // Evaluate parentheses first
        while (expression.includes('(')) {
            expression = expression.replace(/\(([^()]+)\)/g, (match, group) => {
                return evaluateExpression(group, {});
            });
        }

        // Evaluate operators in order of precedence
        // AND (∧)
        while (expression.includes('∧')) {
            expression = expression.replace(/([TF])∧([TF])/g, (match, a, b) => {
                return (a === 'T' && b === 'T') ? 'T' : 'F';
            });
        }

        // OR (∨)
        while (expression.includes('∨')) {
            expression = expression.replace(/([TF])∨([TF])/g, (match, a, b) => {
                return (a === 'T' || b === 'T') ? 'T' : 'F';
            });
        }

        // XOR (⊕)
        while (expression.includes('⊕')) {
            expression = expression.replace(/([TF])⊕([TF])/g, (match, a, b) => {
                return (a !== b) ? 'T' : 'F';
            });
        }

        // IMPLIES (→)
        while (expression.includes('→')) {
            expression = expression.replace(/([TF])→([TF])/g, (match, a, b) => {
                return (a === 'T' && b === 'F') ? 'F' : 'T';
            });
        }

        // IFF (↔)
        while (expression.includes('↔')) {
            expression = expression.replace(/([TF])↔([TF])/g, (match, a, b) => {
                return (a === b) ? 'T' : 'F';
            });
        }

        return expression;
    }

    function generateAllCombinations(variables) {
        const combinations = [];
        const numCombinations = Math.pow(2, variables.length);
        
        for (let i = 0; i < numCombinations; i++) {
            const combination = {};
            for (let j = 0; j < variables.length; j++) {
                combination[variables[j]] = ((i >> (variables.length - 1 - j)) & 1) ? 'T' : 'F';
            }
            combinations.push(combination);
        }
        
        return combinations;
    }

    function generateTable() {
        try {
            const expression = expressionInput.value;
            validateExpression(expression);
            
            // Clear previous error
            errorDisplay.classList.add('hidden');
            errorDisplay.textContent = '';
            
            // Get variables and generate combinations
            const variables = extractVariables(expression);
            const combinations = generateAllCombinations(variables);
            
            // Generate table headers
            let headerRow = '<tr class="bg-gray-50 border-b">';
            variables.forEach(variable => {
                headerRow += `<th class="p-2 border sticky top-0 bg-gray-50">${variable}</th>`;
            });
            headerRow += `<th class="p-2 border sticky top-0 bg-gray-50">${expression}</th></tr>`;

            let tableBody = '';
            combinations.forEach(combination => {
                let row = '<tr class="border-b hover:bg-gray-50">';
                variables.forEach(variable => {
                    row += `<td class="p-2 border whitespace-nowrap text-center">${combination[variable]}</td>`;
                });
                const result = evaluateExpression(expression, combination);
                row += `<td class="p-2 border whitespace-nowrap text-center">${result}</td></tr>`;
                tableBody += row;
            });
            
            // Update table
            truthTable.innerHTML = `<thead>${headerRow}</thead><tbody>${tableBody}</tbody>`;
            
        } catch (error) {
            errorDisplay.textContent = error.message;
            errorDisplay.classList.remove('hidden');
        }
    }

    function simplifyExpression() {
        try {
            const expression = expressionInput.value.trim();
            validateExpression(expression);
            
            // Start with basic simplification steps
            let simplified = expression;
            let steps = [];
            steps.push(`Original: ${expression}`);
    
            // Apply De Morgan's Laws
            if (simplified.includes('¬(')) {
                const deMorgansResult = applyDeMorgansLaws(simplified);
                if (deMorgansResult !== simplified) {
                    steps.push(`De Morgan's Laws: ${deMorgansResult}`);
                    simplified = deMorgansResult;
                }
            }
    
            // Apply basic simplification rules
            let prevResult;
            do {
                prevResult = simplified;
                
                // Idempotent Laws
                simplified = simplified.replace(/([p-z])\s*∧\s*\1/g, '$1');  // p ∧ p → p
                simplified = simplified.replace(/([p-z])\s*∨\s*\1/g, '$1');  // p ∨ p → p
                
                // Identity Laws
                simplified = simplified.replace(/([p-z])\s*∧\s*T/g, '$1');   // p ∧ T → p
                simplified = simplified.replace(/T\s*∧\s*([p-z])/g, '$1');   // T ∧ p → p
                simplified = simplified.replace(/([p-z])\s*∨\s*F/g, '$1');   // p ∨ F → p
                simplified = simplified.replace(/F\s*∨\s*([p-z])/g, '$1');   // F ∨ p → p
                
                // Domination Laws
                simplified = simplified.replace(/([p-z])\s*∧\s*F/g, 'F');    // p ∧ F → F
                simplified = simplified.replace(/F\s*∧\s*([p-z])/g, 'F');    // F ∧ p → F
                simplified = simplified.replace(/([p-z])\s*∨\s*T/g, 'T');    // p ∨ T → T
                simplified = simplified.replace(/T\s*∨\s*([p-z])/g, 'T');    // T ∨ p → T
                
                // Double Negation
                simplified = simplified.replace(/¬\s*¬\s*([p-z])/g, '$1');   // ¬¬p → p
    
                // Complement Laws
                simplified = simplified.replace(/([p-z])\s*∧\s*¬\1/g, 'F');  // p ∧ ¬p → F
                simplified = simplified.replace(/¬([p-z])\s*∧\s*\1/g, 'F');  // ¬p ∧ p → F
                simplified = simplified.replace(/([p-z])\s*∨\s*¬\1/g, 'T');  // p ∨ ¬p → T
                simplified = simplified.replace(/¬([p-z])\s*∨\s*\1/g, 'T');  // ¬p ∨ p → T
    
                if (simplified !== prevResult) {
                    steps.push(`Simplification: ${simplified}`);
                }
            } while (simplified !== prevResult);
    
            // Display result with steps
            const simplifiedResult = document.getElementById('simplifiedResult');
            if (simplified === expression) {
                simplifiedResult.textContent = "Expression is already in its simplest form.";
            } else {
                simplifiedResult.innerHTML = steps.join('<br>');
            }
            simplifiedResult.classList.remove('hidden');
    
        } catch (error) {
            errorDisplay.textContent = error.message;
            errorDisplay.classList.remove('hidden');
        }
    }
    
    function applyDeMorgansLaws(expression) {
        let result = expression;
        
        // ¬(p ∧ q) → ¬p ∨ ¬q
        result = result.replace(/¬\s*\(\s*([p-z])\s*∧\s*([p-z])\s*\)/g, '¬$1 ∨ ¬$2');
        
        // ¬(p ∨ q) → ¬p ∧ ¬q
        result = result.replace(/¬\s*\(\s*([p-z])\s*∨\s*([p-z])\s*\)/g, '¬$1 ∧ ¬$2');
        
        // Handle cases with already negated variables
        // ¬(¬p ∧ q) → p ∨ ¬q
        result = result.replace(/¬\s*\(\s*¬\s*([p-z])\s*∧\s*([p-z])\s*\)/g, '$1 ∨ ¬$2');
        
        // ¬(p ∧ ¬q) → ¬p ∨ q
        result = result.replace(/¬\s*\(\s*([p-z])\s*∧\s*¬\s*([p-z])\s*\)/g, '¬$1 ∨ $2');
        
        return result;
    }
    
    // Add this helper function to check if expression contains De Morgan's pattern
    function containsDeMorgansPattern(expression) {
        return /¬\([^()]+[∨∧][^()]+\)/.test(expression);
    }
    
    function findSimplifiedExpression(variables, minterms) {
        // Group minterms by number of 1s
        const groups = new Map();
        minterms.forEach(minterm => {
            const ones = Object.values(minterm).filter(v => v === 'T').length;
            if (!groups.has(ones)) groups.set(ones, []);
            groups.get(ones).push(minterm);
        });
    
        // Find prime implicants
        let primeImplicants = [...groups.values()].flat();
        let combinedTerms = new Set();
        
        // Combine terms that differ by one variable
        for (let i = 0; i < primeImplicants.length; i++) {
            for (let j = i + 1; j < primeImplicants.length; j++) {
                const combined = combineTerms(primeImplicants[i], primeImplicants[j]);
                if (combined) {
                    combinedTerms.add(JSON.stringify(combined));
                }
            }
        }
    
        // Convert combined terms back to expression
        let terms = [...combinedTerms].map(term => {
            const parsed = JSON.parse(term);
            return termToExpression(parsed, variables);
        });
    
        // If no combinations found, use original terms
        if (terms.length === 0) {
            terms = minterms.map(term => termToExpression(term, variables));
        }
    
        return terms.join(' ∨ ');
    }

    function simplifyExpressionWithSteps() {
        try {
            const expression = expressionInput.value;
            validateExpression(expression);
            
            const steps = [];
            steps.push(`Original: ${expression}`);
            
            // Apply De Morgan's Laws
            let current = expression;
            
            // Keep applying De Morgan's while patterns exist (with safety counter)
            let maxIterations = 10;
            let iteration = 0;
            
            while (containsDeMorgansPattern(current) && iteration < maxIterations) {
                let next = applyDeMorgansLaws(current);
                if (next === current) break;  // No changes made
                steps.push(`Step ${iteration + 1}: ${next}`);
                current = next;
                iteration++;
            }
    
            // Display all steps
            const simplifiedResult = document.getElementById('simplifiedResult');
            simplifiedResult.innerHTML = steps.join('<br>');
            simplifiedResult.classList.remove('hidden');
    
        } catch (error) {
            errorDisplay.textContent = error.message;
            errorDisplay.classList.remove('hidden');
        }
    }
    
    function combineTerms(term1, term2) {
        let diffCount = 0;
        let combined = {};
        
        for (let key in term1) {
            if (term1[key] !== term2[key]) {
                diffCount++;
                combined[key] = '-';
            } else {
                combined[key] = term1[key];
            }
        }
        
        return diffCount === 1 ? combined : null;
    }
    
    function termToExpression(term, variables) {
        const parts = [];
        variables.forEach(variable => {
            if (term[variable] === 'T') {
                parts.push(variable);
            } else if (term[variable] === 'F') {
                parts.push(`¬${variable}`);
            }
        });
        return parts.length === 1 ? parts[0] : `(${parts.join(' ∧ ')})`;
    }
    
    // Add helper function to check logical equivalence
    function areExpressionsEquivalent(expr1, expr2, variables) {
        const combinations = generateAllCombinations(variables);
        
        for (let combination of combinations) {
            const result1 = evaluateExpression(expr1, combination);
            const result2 = evaluateExpression(expr2, combination);
            if (result1 !== result2) return false;
        }
        
        return true;
    }

    // Event listeners
    window.insertOperator = insertOperator;  // Make function globally available for buttons
    window.generateTable = generateTable;
    window.simplifyExpression = simplifyExpression;
    window.simplifyExpressionWithSteps = simplifyExpressionWithSteps;

    expressionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            generateTable();
        }
    });
});