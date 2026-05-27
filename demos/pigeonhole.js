// modals.js

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Add modal HTML to the page
    document.body.insertAdjacentHTML('beforeend', `
        <div id="pigeonholeModal" class="modal-backdrop hidden">
            <div class="modal p-6 max-w-3xl w-full bg-white rounded-lg shadow-lg relative">
                <button onclick="closePigeonholeDemo()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 class="text-2xl font-bold mb-4">Pigeonhole Principle Demonstrator</h2>
                
                <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Pigeons: <span id="pigeonsValue">5</span></label>
                            <input type="range" id="pigeons" min="1" max="10" value="5" class="w-full">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Holes: <span id="holesValue">4</span></label>
                            <input type="range" id="holes" min="1" max="8" value="4" class="w-full">
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow-lg p-4">
                        <canvas id="pigeonholeCanvas" width="600" height="400" class="w-full"></canvas>
                    </div>

                    <div class="flex justify-between gap-4">
                        <button id="addPigeon" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                            Add Pigeon
                        </button>
                        <button id="resetDemo" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300">
                            Reset Demo
                        </button>
                    </div>

                    <div id="demoResult" class="p-4 rounded text-center">
                        Click "Add Pigeon" to begin the demonstration.
                    </div>
                </div>
            </div>
        </div>
    `);

    // Initialize the demo
    initializePigeonholeDemo();
});

// Global variables for the demo
let canvas, ctx, pigeons, holes, placedPigeons, isAnimating, animationId;
let pigeonsInput, holesInput, pigeonsValue, holesValue, resetButton, addPigeonButton, resultDiv;

// Modal control functions
window.openPigeonholeDemo = function() {
    const modal = document.getElementById('pigeonholeModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        resetDemo(); // Reset the demo when opening
    }
};

window.closePigeonholeDemo = function() {
    const modal = document.getElementById('pigeonholeModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
};

// Initialize the demo
function initializePigeonholeDemo() {
    // Get DOM elements
    canvas = document.getElementById('pigeonholeCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    pigeonsInput = document.getElementById('pigeons');
    holesInput = document.getElementById('holes');
    pigeonsValue = document.getElementById('pigeonsValue');
    holesValue = document.getElementById('holesValue');
    resetButton = document.getElementById('resetDemo');
    addPigeonButton = document.getElementById('addPigeon');
    resultDiv = document.getElementById('demoResult');

    // Initialize variables
    pigeons = 5;
    holes = 4;
    placedPigeons = [];
    isAnimating = false;
    animationId = null;

    // Add event listeners
    pigeonsInput.addEventListener('input', handlePigeonsChange);
    holesInput.addEventListener('input', handleHolesChange);
    resetButton.addEventListener('click', resetDemo);
    addPigeonButton.addEventListener('click', addPigeon);

    // Handle escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePigeonholeDemo();
        }
    });

    // Handle clicking outside modal
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            closePigeonholeDemo();
        }
    });

    // Initial draw
    resetDemo();
}

function handlePigeonsChange(e) {
    pigeons = parseInt(e.target.value);
    pigeonsValue.textContent = pigeons;
    resetDemo();
}

function handleHolesChange(e) {
    holes = parseInt(e.target.value);
    holesValue.textContent = holes;
    resetDemo();
}

function drawHoles() {
    const width = canvas.width;
    const height = canvas.height;
    const holeRadius = Math.min(width / (holes * 3), 30);
    const startX = (width - (holes * (holeRadius * 3))) / 2;
    const y = height - 60;

    // Draw holes
    for (let i = 0; i < holes; i++) {
        const x = startX + (i * (holeRadius * 3));
        ctx.beginPath();
        ctx.arc(x + holeRadius, y, holeRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw hole number
        ctx.fillStyle = '#1e293b';
        ctx.font = '14px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(i + 1, x + holeRadius, y + holeRadius + 20);
    }
    return { holeRadius, startX, y };
}

function drawPigeons(holeInfo) {
    const { holeRadius, startX, y } = holeInfo;
    
    placedPigeons.forEach((pigeon, index) => {
        const targetX = startX + (pigeon.hole * (holeRadius * 3)) + holeRadius;
        const targetY = y - (pigeon.stackPosition * 30);
        
        if (pigeon.currentX !== targetX || pigeon.currentY !== targetY) {
            pigeon.currentX += (targetX - pigeon.currentX) * 0.1;
            pigeon.currentY += (targetY - pigeon.currentY) * 0.1;
            isAnimating = true;
        }

        ctx.beginPath();
        ctx.fillStyle = '#3b82f6';
        ctx.arc(pigeon.currentX, pigeon.currentY, 15, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(index + 1, pigeon.currentX, pigeon.currentY + 4);
    });
}

function animate() {
    if (!canvas.isConnected) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const holeInfo = drawHoles();
    drawPigeons(holeInfo);

    if (isAnimating) {
        isAnimating = false;
        placedPigeons.forEach(pigeon => {
            const targetX = holeInfo.startX + (pigeon.hole * (holeInfo.holeRadius * 3)) + holeInfo.holeRadius;
            const targetY = holeInfo.y - (pigeon.stackPosition * 30);
            if (Math.abs(pigeon.currentX - targetX) > 0.1 || Math.abs(pigeon.currentY - targetY) > 0.1) {
                isAnimating = true;
            }
        });
        animationId = requestAnimationFrame(animate);
    }

    checkPigeonholePrinciple();
}

function addPigeon() {
    if (placedPigeons.length >= pigeons || isAnimating) return;

    const randomHole = Math.floor(Math.random() * holes);
    const pigeonsInHole = placedPigeons.filter(p => p.hole === randomHole).length;

    const newPigeon = {
        hole: randomHole,
        stackPosition: pigeonsInHole,
        currentX: canvas.width / 2,
        currentY: 50
    };

    placedPigeons.push(newPigeon);
    isAnimating = true;
    animate();
}

function checkPigeonholePrinciple() {
    const holeCounts = new Array(holes).fill(0);
    placedPigeons.forEach(pigeon => holeCounts[pigeon.hole]++);
    
    const maxPigeonsInHole = Math.max(...holeCounts);
    
    if (maxPigeonsInHole > 1) {
        resultDiv.textContent = `Principle demonstrated! Hole ${holeCounts.indexOf(maxPigeonsInHole) + 1} contains ${maxPigeonsInHole} pigeons.`;
        resultDiv.classList.add('bg-green-100', 'text-green-800');
        resultDiv.classList.remove('bg-blue-100', 'text-blue-800');
    } else {
        resultDiv.textContent = `${placedPigeons.length} pigeons placed. No collisions yet.`;
        resultDiv.classList.add('bg-blue-100', 'text-blue-800');
        resultDiv.classList.remove('bg-green-100', 'text-green-800');
    }
}

function resetDemo() {
    placedPigeons = [];
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawHoles();
        resultDiv.textContent = 'Click "Add Pigeon" to begin the demonstration.';
        resultDiv.classList.remove('bg-green-100', 'text-green-800', 'bg-blue-100', 'text-blue-800');
    }
}