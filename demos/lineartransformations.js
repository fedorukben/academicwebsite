// Initialize variables
const svg = document.getElementById('transformViz');
const controls = document.getElementById('transformControls');
const matrixDisplay = document.getElementById('matrixDisplay');
let currentTransform = {
    type: 'none',
    angle: 0,
    scaleX: 1,
    scaleY: 1,
    shearX: 0
};

// Set up grid and axes
function initGrid() {
    // Clear existing content
    svg.innerHTML = `
        <defs>
            <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="red"/>
            </marker>
            <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="blue"/>
            </marker>
        </defs>
    `;

    // Draw grid lines
    for (let i = 0; i <= 400; i += 40) {
        createLine(i, 0, i, 400, '#ddd', 1);
        createLine(0, i, 400, i, '#ddd', 1);
    }

    // Draw axes
    createLine(200, 0, 200, 400, '#666', 2);
    createLine(0, 200, 400, 200, '#666', 2);

    // Draw unit vectors
    updateVectors();
}

function createLine(x1, y1, x2, y2, color, width) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', width);
    svg.appendChild(line);
}

function updateVectors() {
    // Remove old vectors
    const vectors = svg.querySelectorAll('.vector');
    vectors.forEach(v => v.remove());

    // Get transformation matrix
    const { matrix, display } = getTransformMatrix();

    // Create i vector (red)
    const iVector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    iVector.classList.add('vector');
    iVector.setAttribute('x1', 200);
    iVector.setAttribute('y1', 200);
    iVector.setAttribute('x2', 240);
    iVector.setAttribute('y2', 200);
    iVector.setAttribute('stroke', 'red');
    iVector.setAttribute('stroke-width', 2);
    iVector.setAttribute('marker-end', 'url(#arrowhead-red)');
    iVector.setAttribute('transform', matrix);

    // Create j vector (blue)
    const jVector = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    jVector.classList.add('vector');
    jVector.setAttribute('x1', 200);
    jVector.setAttribute('y1', 200);
    jVector.setAttribute('x2', 200);
    jVector.setAttribute('y2', 160); // Points up
    jVector.setAttribute('stroke', 'blue');
    jVector.setAttribute('stroke-width', 2);
    jVector.setAttribute('marker-end', 'url(#arrowhead-blue)');
    jVector.setAttribute('transform', matrix);

    svg.appendChild(iVector);
    svg.appendChild(jVector);

    // Update matrix display
    matrixDisplay.innerHTML = `
        <div class="grid grid-cols-2 gap-4 text-center">
            <div>${display[0][0]}</div>
            <div>${display[0][1]}</div>
            <div>${display[1][0]}</div>
            <div>${display[1][1]}</div>
        </div>
    `;
}

function getTransformMatrix() {
    const center = 'translate(200,200)';
    switch (currentTransform.type) {
        case 'rotate': {
            const rad = (currentTransform.angle * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            return {
                matrix: `${center} matrix(${cos},${sin},${-sin},${cos},0,0) translate(-200,-200)`,
                display: [
                    [cos.toFixed(2), -sin.toFixed(2)],
                    [sin.toFixed(2), cos.toFixed(2)]
                ]
            };
        }
        case 'scale':
            return {
                matrix: `${center} matrix(${currentTransform.scaleX},0,0,${currentTransform.scaleY},0,0) translate(-200,-200)`,
                display: [
                    [currentTransform.scaleX.toFixed(2), '0'],
                    ['0', currentTransform.scaleY.toFixed(2)]
                ]
            };
        case 'shear':
            return {
                matrix: `${center} matrix(1,0,${currentTransform.shearX},1,0,0) translate(-200,-200)`,
                display: [
                    ['1', currentTransform.shearX.toFixed(2)],
                    ['0', '1']
                ]
            };
        case 'reflect':
            return {
                matrix: `${center} matrix(${currentTransform.reflectX ? -1 : 1},0,0,${currentTransform.reflectY ? -1 : 1},0,0) translate(-200,-200)`,
                display: [
                    [currentTransform.reflectX ? '-1' : '1', '0'],
                    ['0', currentTransform.reflectY ? '-1' : '1']
                ]
            };
        default:
            return {
                matrix: `${center} matrix(1,0,0,1,0,0) translate(-200,-200)`,
                display: [['1', '0'], ['0', '1']]
            };
    }
}

function setTransform(type) {
    currentTransform.type = type;
    
    // Update active button
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('bg-accent', 'text-white');
        if (btn.textContent.toLowerCase().includes(type)) {
            btn.classList.add('bg-accent', 'text-white');
        }
    });

    // Update controls
    let controlsHTML = '';
    switch (type) {
        case 'rotate':
            controlsHTML = `
                <div class="mb-2">Angle: <span id="angleValue">0°</span></div>
                <input type="range" min="0" max="360" value="0" 
                    class="w-full" oninput="updateRotation(this.value)">
            `;
            break;
        case 'scale':
            controlsHTML = `
                <div class="mb-2">Scale X: <span id="scaleXValue">1</span></div>
                <input type="range" min="0.1" max="2" step="0.1" value="1" 
                    class="w-full mb-4" oninput="updateScale('x', this.value)">
                <div class="mb-2">Scale Y: <span id="scaleYValue">1</span></div>
                <input type="range" min="0.1" max="2" step="0.1" value="1" 
                    class="w-full" oninput="updateScale('y', this.value)">
            `;
            break;
        case 'shear':
            controlsHTML = `
                <div class="mb-2">Shear X: <span id="shearValue">0</span></div>
                <input type="range" min="-2" max="2" step="0.1" value="0" 
                    class="w-full" oninput="updateShear(this.value)">
            `;
            break;
        case 'reflect':
            controlsHTML = `
                <div class="space-x-4">
                    <label>
                        <input type="checkbox" onchange="updateReflection('x', this.checked)"> 
                        Reflect X
                    </label>
                    <label>
                        <input type="checkbox" onchange="updateReflection('y', this.checked)">
                        Reflect Y
                    </label>
                </div>
            `;
            break;
    }
    controls.innerHTML = controlsHTML;
    updateVectors();
}

// Update functions for each transformation type
function updateRotation(angle) {
    document.getElementById('angleValue').textContent = `${angle}°`;
    currentTransform.angle = parseFloat(angle);
    updateVectors();
}

function updateScale(axis, value) {
    if (axis === 'x') {
        document.getElementById('scaleXValue').textContent = value;
        currentTransform.scaleX = parseFloat(value);
    } else {
        document.getElementById('scaleYValue').textContent = value;
        currentTransform.scaleY = parseFloat(value);
    }
    updateVectors();
}

function updateShear(value) {
    document.getElementById('shearValue').textContent = value;
    currentTransform.shearX = parseFloat(value);
    updateVectors();
}

function updateReflection(axis, checked) {
    if (axis === 'x') {
        currentTransform.reflectX = checked;
    } else {
        currentTransform.reflectY = checked;
    }
    updateVectors();
}

// Initialize the visualization
initGrid();