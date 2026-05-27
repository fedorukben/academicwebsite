// Modal control functions
function openGCDCalc() {
    const modal = document.getElementById('gcdModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    initGCD();
}

function closeGCDCalc() {
    const modal = document.getElementById('gcdModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeGCDCalc();
    }
});

// Close modal when clicking outside
document.getElementById('gcdModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closeGCDCalc();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gcdCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const stepBtn = document.getElementById('step-btn-gcd');
    const completeBtn = document.getElementById('complete-btn-gcd');
    const resetBtn = document.getElementById('reset-btn-gcd');
    const resultDiv = document.getElementById('gcd-result');

    let steps = [];
    let currentStep = 0;
    let isComplete = false;

    class Step {
        constructor(a, b, quotient, remainder) {
            this.a = a;
            this.b = b;
            this.quotient = quotient;
            this.remainder = remainder;
        }
    }

    function calculateGCDSteps(a, b) {
        const steps = [];
        while (b !== 0) {
            const quotient = Math.floor(a / b);
            const remainder = a % b;
            steps.push(new Step(a, b, quotient, remainder));
            a = b;
            b = remainder;
        }
        return steps;
    }

    function drawStep(step, x, y, isHighlighted) {
        const boxWidth = 200;
        const boxHeight = 60;
        
        // Draw division box
        ctx.beginPath();
        ctx.rect(x, y, boxWidth, boxHeight);
        ctx.fillStyle = isHighlighted ? '#bae6fd' : '#f0f9ff';
        ctx.fill();
        ctx.strokeStyle = isHighlighted ? '#0284c7' : '#64748b';
        ctx.lineWidth = isHighlighted ? 3 : 2;
        ctx.stroke();

        // Draw division line and numbers
        ctx.font = '18px system-ui';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        
        // Draw quotient above
        ctx.textAlign = 'left';
        ctx.fillText(`${step.quotient}`, x + boxWidth - 40, y - 10);

        // Draw division structure
        ctx.fillText(`${step.a}`, x + 20, y + 20);
        ctx.fillText(`${step.b}`, x + 20, y + 50);
        
        // Draw line between numbers
        ctx.beginPath();
        ctx.moveTo(x + 10, y + 35);
        ctx.lineTo(x + boxWidth - 10, y + 35);
        ctx.stroke();

        // Draw remainder
        ctx.textAlign = 'right';
        ctx.fillText(`r = ${step.remainder}`, x + boxWidth - 10, y + 20);
    }

    function drawArrow(fromX, fromY, toX, toY) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(toY - fromY, toX - fromX);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI / 6), toY - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI / 6), toY - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
    }

    function calculateCanvasHeight() {
        const stepHeight = 100;  // Height of each step
        const padding = 100;     // Extra padding
        return (steps.length * stepHeight) + padding;
    }

    function drawVisualization() {
        // Update canvas height based on number of steps
        const requiredHeight = calculateCanvasHeight();
        if (canvas.height < requiredHeight) {
            canvas.height = requiredHeight;
        }
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const startX = 50;
        let startY = 50;
        const stepHeight = 100;
    
        steps.forEach((step, index) => {
            drawStep(step, startX, startY, index === currentStep);
            
            if (index < steps.length - 1) {
                drawArrow(startX + 100, startY + 70, startX + 100, startY + stepHeight);
            }
            
            startY += stepHeight;
        });
    }

    function gcdStep() {
        if (isComplete) return;

        currentStep++;
        if (currentStep >= steps.length) {
            isComplete = true;
            const finalGCD = steps[steps.length - 1].b;
            const initialNumbers = steps[0];
            resultDiv.textContent = `GCD(${initialNumbers.a}, ${initialNumbers.b}) = ${finalGCD}`;
        }

        drawVisualization();
    }

    function completeGCD() {
        while (!isComplete) {
            gcdStep();
        }
    }
    function initGCD() {
        const a = Math.abs(parseInt(num1Input.value)) || 48;
        const b = Math.abs(parseInt(num2Input.value)) || 18;
        
        num1Input.value = a;
        num2Input.value = b;
        
        steps = calculateGCDSteps(Math.max(a, b), Math.min(a, b));
        currentStep = 0;
        isComplete = false;
        
        // Reset canvas height to default if it was previously expanded
        canvas.height = 400;
        
        resultDiv.textContent = `Finding GCD(${a}, ${b})...`;
        drawVisualization();
    
        // Scroll to top when initializing
        canvas.parentElement.scrollTop = 0;
    }

    // Event listeners
    num1Input.addEventListener('change', initGCD);
    num2Input.addEventListener('change', initGCD);
    stepBtn.addEventListener('click', gcdStep);
    completeBtn.addEventListener('click', completeGCD);
    resetBtn.addEventListener('click', initGCD);

    // Initialize
    initGCD();
});

// Tooltip functionality
document.addEventListener('DOMContentLoaded', function() {
    const helpButton = document.getElementById('helpButtonGCD');
    const helpTooltip = document.getElementById('helpTooltipGCD');
    let tooltipTimeout;

    helpButton.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
        helpTooltip.classList.remove('hidden');
    });

    helpButton.addEventListener('mouseleave', () => {
        tooltipTimeout = setTimeout(() => {
            helpTooltip.classList.add('hidden');
        }, 300);
    });

    helpTooltip.addEventListener('mouseenter', () => {
        clearTimeout(tooltipTimeout);
    });

    helpTooltip.addEventListener('mouseleave', () => {
        tooltipTimeout = setTimeout(() => {
            helpTooltip.classList.add('hidden');
        }, 300);
    });
});

