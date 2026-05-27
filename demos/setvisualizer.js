// Modal control functions
function openSetCounter() {
    const modal = document.getElementById('setCounterModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    initSets();
}

function closeSetCounter() {
    const modal = document.getElementById('setCounterModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('setCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const numInput = document.getElementById('numInput');
    const addToABtn = document.getElementById('addToA');
    const addToBBtn = document.getElementById('addToB');
    const clearBtn = document.getElementById('clearSets');

    let setA = new Set();
    let setB = new Set();

    function drawSets() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw set A (left circle)
        ctx.beginPath();
        ctx.arc(200, 150, 100, 0, Math.PI * 2);
        ctx.strokeStyle = '#3b82f6';  // blue-500
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';  // blue-500 with opacity
        ctx.fill();

        // Draw set B (right circle)
        ctx.beginPath();
        ctx.arc(300, 150, 100, 0, Math.PI * 2);
        ctx.strokeStyle = '#22c55e';  // green-500
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';  // green-500 with opacity
        ctx.fill();

        // Draw labels
        ctx.font = '20px system-ui';
        ctx.fillStyle = '#1e293b';  // slate-800
        ctx.fillText('A', 150, 150);
        ctx.fillText('B', 350, 150);

        // Draw numbers in sets
        ctx.font = '14px system-ui';
        let intersection = new Set([...setA].filter(x => setB.has(x)));
        
        // Draw numbers in A only
        let aOnly = [...setA].filter(x => !setB.has(x));
        aOnly.forEach((num, i) => {
            ctx.fillText(num.toString(), 170, 130 + i * 20);
        });

        // Draw numbers in B only
        let bOnly = [...setB].filter(x => !setA.has(x));
        bOnly.forEach((num, i) => {
            ctx.fillText(num.toString(), 330, 130 + i * 20);
        });

        // Draw intersection numbers
        [...intersection].forEach((num, i) => {
            ctx.fillText(num.toString(), 250, 130 + i * 20);
        });

        // Update info displays
        document.getElementById('setA-info').textContent = `|A| = ${setA.size}`;
        document.getElementById('setB-info').textContent = `|B| = ${setB.size}`;
        document.getElementById('intersection-info').textContent = `|A ∩ B| = ${intersection.size}`;
        document.getElementById('union-info').textContent = `|A ∪ B| = ${[...setA, ...setB].filter((x, i, a) => a.indexOf(x) === i).length}`;
    }

    function addNumber(toSetA) {
        const num = parseInt(numInput.value);
        if (isNaN(num)) {
            return;
        }

        if (toSetA) {
            setA.add(num);
        } else {
            setB.add(num);
        }

        numInput.value = '';
        drawSets();
    }

    function initSets() {
        setA.clear();
        setB.clear();
        drawSets();
    }

    // Event listeners
    addToABtn.addEventListener('click', () => addNumber(true));
    addToBBtn.addEventListener('click', () => addNumber(false));
    clearBtn.addEventListener('click', initSets);

    numInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addNumber(true);  // Default to set A on enter
        }
    });

    // Initialize
    initSets();
});

// Tooltip functionality
document.addEventListener('DOMContentLoaded', function() {
    const helpButton = document.getElementById('helpButtonSet');
    const helpTooltip = document.getElementById('helpTooltipSet');
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