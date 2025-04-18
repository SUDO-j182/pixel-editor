// ====================
//  DOM Caching & Globals
// ====================
const gridContainer = document.querySelector('.drawing-grid-container');
const gridSizeSelector = document.getElementById("grid-size");
const toggleLineButton = document.getElementById("toggle-line-mode");
const clearGridButton = document.getElementById("clear-grid");
const toggleGridButton = document.getElementById("toggle-grid");
const saveArtButton = document.getElementById("save-art");
const loadArtButton = document.getElementById("load-art");
const exportArtButton = document.getElementById("export-art");
const colorPalette = document.querySelector('.color-palette');

const gridDimension = 320;
let currentGridSize = 16;
let currentColor = "#000000";
let isMouseDown = false;
let lineMode = false;
let startCell = null;

// ====================
//  Grid Creation
// ====================
function createGrid(size) {
    gridContainer.innerHTML = "";
    const cellSize = gridDimension / size;

    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    gridContainer.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.border = "1px solid black";

        // Single click coloring or line drawing
        cell.addEventListener("click", () => handleCellClick(cell, size));
        // Drag-to-paint
        cell.addEventListener("mouseover", () => {
            if (isMouseDown && currentColor !== null) {
                cell.style.backgroundColor = currentColor;
            }
        });

        gridContainer.appendChild(cell);
    }
}

function handleCellClick(cell, size) {
    if (lineMode) {
        if (!startCell) {
            startCell = cell;
        } else {
            drawLine(startCell, cell, size);
            startCell = null;
        }
    } else {
        cell.style.backgroundColor = currentColor;
    }
}

// ====================
//  Grid Drawing Logic
// ====================
function drawLine(start, end, gridSize) {
    const gridCells = Array.from(document.querySelectorAll('.grid-cell'));
    const startIndex = gridCells.indexOf(start);
    const endIndex = gridCells.indexOf(end);

    const [startRow, startCol] = [Math.floor(startIndex / gridSize), startIndex % gridSize];
    const [endRow, endCol] = [Math.floor(endIndex / gridSize), endIndex % gridSize];

    if (startRow === endRow) {
        for (let col = Math.min(startCol, endCol); col <= Math.max(startCol, endCol); col++) {
            gridCells[startRow * gridSize + col].style.backgroundColor = currentColor;
        }
    } else if (startCol === endCol) {
        for (let row = Math.min(startRow, endRow); row <= Math.max(startRow, endRow); row++) {
            gridCells[row * gridSize + startCol].style.backgroundColor = currentColor;
        }
    }
}

// ====================
//  Color Palette
// ====================
const colors = [
    "#000000", "#0000AA", "#00AA00", "#00AAAA",
    "#AA0000", "#AA00AA", "#AA5500", "#AAAAAA",
    "#555555", "#5555FF", "#55FF55", "#55FFFF",
    "#FF5555", "#FF55FF", "#FFFF55", "#FFFFFF"
];

function createColorOptions() {
    // Deselect color box
    const clearSelection = document.createElement('div');
    clearSelection.classList.add('color-option');
    Object.assign(clearSelection.style, {
        backgroundColor: "transparent",
        border: "2px dashed black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer"
    });
    clearSelection.innerText = "X";
    clearSelection.addEventListener("click", () => currentColor = null);
    colorPalette.appendChild(clearSelection);

    // Palette colors
    colors.forEach(color => {
        const option = document.createElement("div");
        option.classList.add("color-option");
        option.style.backgroundColor = color;
        option.addEventListener("click", () => currentColor = color);
        colorPalette.appendChild(option);
    });
}

// ====================
//  Event Listeners
// ====================
toggleLineButton.addEventListener('click', () => {
    lineMode = !lineMode;
    toggleLineButton.innerText = lineMode ? "Line Mode: ON" : "Line Mode: OFF";
});

clearGridButton.addEventListener('click', () => {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.backgroundColor = "";
    });
});

toggleGridButton.addEventListener('click', () => {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.style.border = cell.style.border === "none" ? "1px solid black" : "none";
    });
});

exportArtButton.addEventListener('click', () => {
    html2canvas(gridContainer).then(canvas => {
        const link = document.createElement("a");
        link.download = "pixel-art.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
});

saveArtButton.addEventListener('click', () => {
    const savedGrid = Array.from(document.querySelectorAll('.grid-cell'))
        .map(cell => cell.style.backgroundColor || "");
    localStorage.setItem("pixelArt", JSON.stringify(savedGrid));
});

loadArtButton.addEventListener('click', () => {
    const savedGrid = JSON.parse(localStorage.getItem("pixelArt"));
    if (!savedGrid) return;
    const gridCells = document.querySelectorAll('.grid-cell');
    savedGrid.forEach((color, i) => {
        if (gridCells[i]) gridCells[i].style.backgroundColor = color;
    });
});

gridSizeSelector.addEventListener("change", () => {
    currentGridSize = parseInt(gridSizeSelector.value);
    createGrid(currentGridSize);
});

document.addEventListener("mousedown", () => isMouseDown = true);
document.addEventListener("mouseup", () => isMouseDown = false);

// ====================
// Initialize App
// ====================
createColorOptions();
createGrid(currentGridSize);

