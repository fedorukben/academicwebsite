// Modal control functions
function openPrimeTree() {
    const modal = document.getElementById('primeTreeModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    initTree();
}

function closePrimeTree() {
    const modal = document.getElementById('primeTreeModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Handle escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePrimeTree();
    }
});

// Close modal when clicking outside
document.getElementById('primeTreeModal').addEventListener('click', function(event) {
    if (event.target === this) {
        closePrimeTree();
    }
});

// Tree visualization logic
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('treeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const numberInput = document.getElementById('number-input');
    const stepBtn = document.getElementById('step-btn');
    const completeBtn = document.getElementById('complete-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultDiv = document.getElementById('factorization-result');

    let nodes = [];
    let currentStep = 0;
    let factorizationComplete = false;

    class Node {
        constructor(value, x, y, parent = null) {
            this.value = value;
            this.x = x;
            this.y = y;
            this.displayX = x;
            this.displayY = y;
            this.parent = parent;
            this.leftChild = null;
            this.rightChild = null;
            this.isPrime = isPrime(value);
        }
    }

    function isPrime(num) {
        if (num < 2) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    function findSmallestFactor(num) {
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return i;
        }
        return num;
    }

    function calculateTreeDimensions(nodes) {
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        
        nodes.forEach(node => {
            minX = Math.min(minX, node.x);
            maxX = Math.max(maxX, node.x);
            minY = Math.min(minY, node.y);
            maxY = Math.max(maxY, node.y);
        });
        
        return { minX, maxX, minY, maxY };
    }

    function adjustTreePosition() {
        const padding = 40;
        const dims = calculateTreeDimensions(nodes);
        
        // Calculate scaling factor to fit within canvas
        const scaleX = (canvas.width - 2 * padding) / (dims.maxX - dims.minX || 1);
        const scaleY = (canvas.height - 2 * padding) / (dims.maxY - dims.minY || 1);
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down if needed
        
        // Store the scale factor for use in drawing
        nodes.forEach(node => {
            node.displayX = node.x * scale + (-dims.minX * scale + padding + (canvas.width - (dims.maxX - dims.minX) * scale) / 2);
            node.displayY = node.y * scale + (-dims.minY * scale + padding);
            node.scale = scale; // Store scale factor for each node
        });
    
        return scale; // Return scale for use in drawing
    }

    function drawNode(node, highlight = false) {
        // Base radius scaled by the tree's scale factor
        const baseRadius = 20;
        const radius = Math.max(baseRadius * node.scale, 12); // Minimum size of 12px
        
        // Scale font size proportionally
        const baseFontSize = 16;
        const fontSize = Math.max(baseFontSize * node.scale, 10); // Minimum font size of 10px
    
        // Draw circle
        ctx.beginPath();
        ctx.arc(node.displayX, node.displayY, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isPrime ? '#bae6fd' : '#f0f9ff';
        ctx.fill();
        ctx.strokeStyle = highlight ? '#0284c7' : '#64748b';
        ctx.lineWidth = highlight ? 3 * node.scale : 2 * node.scale;
        ctx.stroke();
    
        // Draw text
        ctx.font = `${fontSize}px system-ui`;
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.value.toString(), node.displayX, node.displayY);
    
        return radius; // Return radius for use in line connections
    }

    function drawLine(node1, node2) {
        const radius1 = Math.max(20 * node1.scale, 12);
        const radius2 = Math.max(20 * node2.scale, 12);
        
        // Calculate start and end points considering node sizes
        const angle = Math.atan2(node2.displayY - node1.displayY, node2.displayX - node1.displayX);
        
        const startX = node1.displayX + Math.cos(angle) * radius1;
        const startY = node1.displayY + Math.sin(angle) * radius1;
        const endX = node2.displayX - Math.cos(angle) * radius2;
        const endY = node2.displayY - Math.sin(angle) * radius2;
    
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = Math.max(2 * node1.scale, 1); // Scale line width with minimum of 1px
        ctx.stroke();
    }

    function drawTree() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scale = adjustTreePosition();
        
        // Draw lines first
        nodes.forEach(node => {
            if (node.parent) {
                drawLine(node.parent, node);
            }
        });
    
        // Draw nodes
        nodes.forEach((node, index) => {
            drawNode(node, index === currentStep);
        });
    }

    function completeFactorization() {
        while (!factorizationComplete) {
            factorizationStep();
        }
    }

    function factorizationStep() {
        if (factorizationComplete) return;

        let currentNode = nodes[currentStep];
        if (!currentNode.isPrime) {
            const factor = findSmallestFactor(currentNode.value);
            const remainder = currentNode.value / factor;

            // Calculate positions for children
            const nextY = currentNode.y + 80;
            const offsetX = 80;

            // Create child nodes
            currentNode.leftChild = new Node(factor, currentNode.x - offsetX, nextY, currentNode);
            currentNode.rightChild = new Node(remainder, currentNode.x + offsetX, nextY, currentNode);

            nodes.push(currentNode.leftChild, currentNode.rightChild);
            
            // Check if factorization is complete (all leaves are prime)
            let allLeavesPrime = true;
            nodes.forEach(node => {
                if (!node.leftChild && !node.rightChild && !node.isPrime) {
                    allLeavesPrime = false;
                }
            });
            factorizationComplete = allLeavesPrime;
        }

        currentStep++;
        if (currentStep >= nodes.length) {
            if (!factorizationComplete) currentStep = nodes.length - 1;
        }

        updateResult();
        drawTree();
    }

    function updateResult() {
        // Collect prime factors (only from leaf nodes)
        const factors = nodes
            .filter(node => !node.leftChild && !node.rightChild && node.isPrime)
            .map(node => node.value)
            .sort((a, b) => a - b);
    
        // Count occurrences
        const counts = {};
        factors.forEach(factor => {
            counts[factor] = (counts[factor] || 0) + 1;
        });
    
        // Format result with ^ for exponents
        const result = Object.entries(counts)
            .map(([base, exp]) => exp > 1 ? `${base}^${exp}` : base)
            .join(' × ');
    
        resultDiv.textContent = `${numberInput.value} = ${result}`;
    }

    function initTree() {
        const number = parseInt(numberInput.value) || 60;
        if (number < 2) {
            numberInput.value = 2;
            return initTree();
        }
        nodes = [new Node(number, canvas.width / 2, 40)];
        currentStep = 0;
        factorizationComplete = false;
        drawTree();
        resultDiv.textContent = `${number} = ...`;
    }

    // Event listeners
    numberInput.addEventListener('change', initTree);
    stepBtn.addEventListener('click', factorizationStep);
    completeBtn.addEventListener('click', completeFactorization);
    resetBtn.addEventListener('click', initTree);

    // Handle window resize
    window.addEventListener('resize', () => {
        if (canvas.isConnected) {
            drawTree();
        }
    });

    // Initialize
    initTree();
});

// Tooltip functionality
document.addEventListener('DOMContentLoaded', function() {
    const helpButton = document.getElementById('helpButtonTree');
    const helpTooltip = document.getElementById('helpTooltipTree');
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