// Modal control functions
function openModClock() {
    const modal = document.getElementById('modClockModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    initClock();
}

function closeModClock() {
    const modal = document.getElementById('modClockModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModClock();
    }
});

// Close modal when clicking outside
document.getElementById('modClockModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeModClock();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('clockCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const modulusInput = document.getElementById('modulus');
    const modulusValue = document.getElementById('modulusValue');
    const numberInput = document.getElementById('number');
    const resultDiv = document.getElementById('result');

    let currentNumber = 0;
    let currentModulus = 12;
    let animationId = null;
    let currentAngle = 0;
    let targetAngle = 0;

    function evaluateExpression(expr, mod) {
        // Remove all spaces from the expression
        expr = expr.replace(/\s+/g, '');
        
        // Basic input validation
        if (!expr) {
            throw new Error('Please enter an expression');
        }
    
        // Check for invalid characters
        if (/[^0-9+\-*/^().]/.test(expr)) {
            throw new Error('Expression contains invalid characters. Only numbers, operators (+, -, *, /, ^), and brackets are allowed.');
        }
    
        // Check bracket matching
        let bracketCount = 0;
        for (let char of expr) {
            if (char === '(') bracketCount++;
            if (char === ')') bracketCount--;
            if (bracketCount < 0) {
                throw new Error('Invalid bracket placement: unexpected closing bracket');
            }
        }
        if (bracketCount !== 0) {
            throw new Error('Unmatched brackets: please check your brackets');
        }
    
        // Check for empty brackets
        if (expr.includes('()')) {
            throw new Error('Empty brackets are not allowed');
        }
    
        function evaluateSubExpression(tokens) {
            let result = 0;
            let currentOperator = '+';
            
            for (let i = 0; i < tokens.length; i++) {
                let token = tokens[i];
    
                // Handle nested brackets
                if (token === '(') {
                    let nestedBracketCount = 1;
                    let j = i + 1;
                    for (; j < tokens.length && nestedBracketCount > 0; j++) {
                        if (tokens[j] === '(') nestedBracketCount++;
                        if (tokens[j] === ')') nestedBracketCount--;
                    }
                    if (nestedBracketCount === 0) {
                        // Recursively evaluate the sub-expression inside brackets
                        token = evaluateSubExpression(tokens.slice(i + 1, j - 1));
                        i = j - 1;
                    }
                }
    
                if (typeof token === 'number' || /^-?\d+$/.test(token)) {
                    let value = parseInt(token);
                    
                    switch (currentOperator) {
                        case '+':
                            result = (result + value) % mod;
                            break;
                        case '-':
                            result = ((result - value) % mod + mod) % mod;
                            break;
                        case '*':
                            result = (result * value) % mod;
                            break;
                        case '/':
                            // Check for division by zero
                            if (value === 0) {
                                throw new Error('Division by zero is not allowed');
                            }
                            // Find multiplicative inverse
                            let inverse = -1;
                            for (let j = 0; j < mod; j++) {
                                if ((value * j) % mod === 1) {
                                    inverse = j;
                                    break;
                                }
                            }
                            if (inverse === -1) {
                                throw new Error(`${value} has no multiplicative inverse modulo ${mod}. Division is only possible when the divisor and modulus are coprime.`);
                            }
                            result = (result * inverse) % mod;
                            break;
                        case '^':
                            if (value < 0) {
                                throw new Error('Negative exponents are not supported');
                            }
                            if (value > 100) {
                                throw new Error('Exponent is too large (maximum is 100)');
                            }
                            let base = result;
                            result = 1;
                            for (let exp = value; exp > 0; exp--) {
                                result = (result * base) % mod;
                            }
                            break;
                    }
                } else if (/^[+\-*/^]$/.test(token)) {
                    currentOperator = token;
                }
            }
            
            return result;
        }
    
        try {
            // Tokenize the expression
            const tokens = [];
            let currentNumber = '';
            
            for (let i = 0; i < expr.length; i++) {
                const char = expr[i];
                if (/\d/.test(char)) {
                    currentNumber += char;
                } else {
                    if (currentNumber) {
                        tokens.push(currentNumber);
                        currentNumber = '';
                    }
                    if (char === '-' && (i === 0 || /[+\-*/^(]/.test(expr[i-1]))) {
                        // Handle negative numbers
                        currentNumber = '-';
                    } else {
                        tokens.push(char);
                    }
                }
            }
            if (currentNumber) {
                tokens.push(currentNumber);
            }
    
            // Evaluate the tokenized expression
            const result = evaluateSubExpression(tokens);
            return ((result % mod) + mod) % mod;
        } catch (error) {
            if (error.message !== 'Invalid expression') {
                throw error;
            }
            throw new Error('Invalid expression format. Please check your input.');
        }
    }

    function drawClock() {
        const width = canvas.width;
        const height = canvas.height;
        const radius = Math.min(width, height) / 2 - 20;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw clock circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw numbers
        ctx.font = '16px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < currentModulus; i++) {
            const angle = (i * 2 * Math.PI / currentModulus) - Math.PI / 2;
            const x = centerX + (radius - 25) * Math.cos(angle);
            const y = centerY + (radius - 25) * Math.sin(angle);
            
            // Draw number circle
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#f8fafc';
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.stroke();
            
            // Draw number
            ctx.fillStyle = '#1e293b';
            ctx.fillText(i.toString(), x, y);
        }

        // Draw hand
        const handLength = radius - 40;
        const x = centerX + handLength * Math.cos(currentAngle - Math.PI / 2);
        const y = centerY + handLength * Math.sin(currentAngle - Math.PI / 2);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw center dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
    }

    function animateHand() {
        if (!canvas.isConnected) return;
        
        const difference = targetAngle - currentAngle;
        const speed = difference * 0.1;

        if (Math.abs(difference) > 0.01) {
            currentAngle += speed;
            drawClock();
            animationId = requestAnimationFrame(animateHand);
        } else {
            currentAngle = targetAngle;
            drawClock();
        }
    }

    function updateClock() {
        try {
            const expr = numberInput.value.trim();
            const modResult = evaluateExpression(expr, currentModulus);
            currentNumber = modResult;
            
            targetAngle = (modResult * 2 * Math.PI / currentModulus);
            
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            resultDiv.textContent = `${expr} ≡ ${modResult} (mod ${currentModulus})`;
            resultDiv.classList.remove('bg-red-100', 'text-red-800');
            animateHand();
        } catch (error) {
            resultDiv.textContent = error.message;
            resultDiv.classList.add('bg-red-100', 'text-red-800');
        }
    }

    // Event listeners
    modulusInput.addEventListener('input', (e) => {
        currentModulus = parseInt(e.target.value);
        modulusValue.textContent = currentModulus;
        updateClock();
    });

    numberInput.addEventListener('input', updateClock);

    // Style adjustments for range input
    modulusInput.classList.add('accent-blue-600');

    // Initialize function to be called when modal opens
    function initClock() {
        if (modulusValue) modulusValue.textContent = currentModulus;
        if (numberInput) {
            numberInput.value = "0";  // Set initial value to "0"
            numberInput.type = "text"; // Change type to text to allow expressions
            // Optional: Select the text when focused
            numberInput.addEventListener('focus', function() {
                this.select();
            });
        }
        updateClock();
    }

    numberInput.addEventListener('blur', function() {
        // If empty when losing focus, reset to 0
        if (!this.value.trim()) {
            this.value = "0";
            updateClock();
        }
    });

    // Clean up on page changes
    return () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };

    initClock();
});