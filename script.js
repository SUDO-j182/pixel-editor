// ====================
// DOM SELECTIONS & GLOBALS
// ====================

const gridContainer=document.querySelector('.drawing-grid-container');
const gridSizeSelector=document.getElementById("grid-size");
const toggleLineButton=document.getElementById("toggle-line-mode");
const clearGridButton=document.getElementById("clear-grid");
const toggleGridButton=document.getElementById("toggle-grid");
const saveArtButton=document.getElementById("save-art");
const loadArtButton=document.getElementById("load-art");
const exportArtButton=document.getElementById("export-art");
const colorPalette=document.querySelector('.color-palette');

const gridDimension=320;
let currentGridSize=16;
let currentColor="#000000";
let isMouseDown=false;
let lineMode=false;
let startCell=null;
let previewCells=[]; //STORES PREVIEW CELLS TEMPORARILY
let zoomLevel=1;

// ====================
// HELPER FUNCTIONS
// ====================

//CLEARS TEMPORARY LINE PREVIEW FROM GRID
function clearPreview() {
    previewCells.forEach(cell=>{
        if(cell.dataset.preview==='true'){
            cell.style.backgroundColor='';
            delete cell.dataset.preview;
        }
    });
    previewCells=[];
}

//ZOOMS IN BY INCREASING CELL SIZE
function zoomIn() {
    if(zoomLevel<3){
        zoomLevel+=0.25;
        resizeGridCells();
    }
}

//ZOOMS OUT BY DECREASING CELL SIZE
function zoomOut() {
    if(zoomLevel>0.5){
        zoomLevel-=0.25;
        resizeGridCells();
    }
}

//RESIZES ALL GRID CELLS BASED ON CURRENT ZOOM
function resizeGridCells() {
    const gridCells=document.querySelectorAll('.grid-cell');
    const baseSize=gridDimension/currentGridSize;
    gridCells.forEach(cell=>{
        cell.style.width=`${baseSize*zoomLevel}px`;
        cell.style.height=`${baseSize*zoomLevel}px`;
    });

    gridContainer.style.gridTemplateColumns=`repeat(${currentGridSize},${baseSize*zoomLevel}px)`;
    gridContainer.style.gridTemplateRows=`repeat(${currentGridSize},${baseSize*zoomLevel}px)`;
}

// ====================
// MAIN FUNCTIONS
// ====================

//CREATES GRID BASED ON SELECTED GRID SIZE
function createGrid(size) {
    gridContainer.innerHTML="";
    const baseSize=gridDimension/size;

    gridContainer.style.display="grid";
    gridContainer.style.gridTemplateColumns=`repeat(${size},${baseSize*zoomLevel}px)`;
    gridContainer.style.gridTemplateRows=`repeat(${size},${baseSize*zoomLevel}px)`;

    for(let i=0;i<size*size;i++){
        const cell=document.createElement("div");
        cell.classList.add("grid-cell");
        cell.style.width=`${baseSize*zoomLevel}px`;
        cell.style.height=`${baseSize*zoomLevel}px`;
        cell.style.border="1px solid black";

                                                             //HANDLES SINGLE CLICK COLORING OR LINE DRAWING
        cell.addEventListener("click",()=>handleCellClick(cell,size));

                                               //HANDLES DRAG-TO-PAINT FUNCTIONALITY AND LINE PREVIEW
        cell.addEventListener("mouseover",()=>{
            if(isMouseDown&&currentColor!==null&&!lineMode){
                cell.style.backgroundColor=currentColor;
            }
            if(lineMode&&startCell&&cell!==startCell){
                clearPreview();
                previewLine(startCell,cell,currentGridSize);
            }
        });

        gridContainer.appendChild(cell);
    }
}

//HANDLES CELL CLICK EVENTS (COLORING OR LINE MODE)
function handleCellClick(cell, size) {
    if(lineMode){
        if(!startCell){
            startCell=cell; //STORE FIRST CLICKED CELL
        }else{
            clearPreview(); //CLEAR PREVIEW WHEN LINE IS FINALIZED
            drawLine(startCell,cell,size); //DRAW ACTUAL LINE
            startCell=null; //RESET FOR NEXT LINE
        }
    }else{
        cell.style.backgroundColor=currentColor;
    }
}

//PREVIEWS TEMPORARY LINE BETWEEN TWO CELLS
function previewLine(start, end, gridSize) {
    const gridCells=Array.from(document.querySelectorAll('.grid-cell'));
    const startIndex=gridCells.indexOf(start);
    const endIndex=gridCells.indexOf(end);

    let x0=startIndex%gridSize;
    let y0=Math.floor(startIndex/gridSize);
    let x1=endIndex%gridSize;
    let y1=Math.floor(endIndex/gridSize);

    let dx=Math.abs(x1-x0);
    let dy=Math.abs(y1-y0);
    let sx=x0<x1?1:-1;
    let sy=y0<y1?1:-1;
    let err=dx-dy;

    while(true){
        const cell=gridCells[y0*gridSize+x0];
        if(!cell.style.backgroundColor||cell.style.backgroundColor===""){
            cell.style.backgroundColor=currentColor;
            cell.dataset.preview="true";
            previewCells.push(cell);
        }
        if(x0===x1&&y0===y1)break;
        let e2=2*err;
        if(e2>-dy){
            err-=dy;
            x0+=sx;
        }
        if(e2<dx){
            err+=dx;
            y0+=sy;
        }
    }
}

//DRAWS LINE BETWEEN TWO CELLS (INCLUDING DIAGONAL)
function drawLine(start, end, gridSize) {
    const gridCells=Array.from(document.querySelectorAll('.grid-cell'));
    const startIndex=gridCells.indexOf(start);
    const endIndex=gridCells.indexOf(end);

    let x0=startIndex%gridSize;
    let y0=Math.floor(startIndex/gridSize);
    let x1=endIndex%gridSize;
    let y1=Math.floor(endIndex/gridSize);

    let dx=Math.abs(x1-x0);
    let dy=Math.abs(y1-y0);
    let sx=x0<x1?1:-1;
    let sy=y0<y1?1:-1;
    let err=dx-dy;

    while(true){
        gridCells[y0*gridSize+x0].style.backgroundColor=currentColor;
        if(x0===x1&&y0===y1)break;
        let e2=2*err;
        if(e2>-dy){
            err-=dy;
            x0+=sx;
        }
        if(e2<dx){
            err+=dx;
            y0+=sy;
        }
    }
}

// ====================
// COLOR PALETTE SETUP
// ====================

//DEFINED TEMPLEOS-INSPIRED COLORS
const colors=[
    "#000000","#0000AA","#00AA00","#00AAAA",
    "#AA0000","#AA00AA","#AA5500","#AAAAAA",
    "#555555","#5555FF","#55FF55","#55FFFF",
    "#FF5555","#FF55FF","#FFFF55","#FFFFFF"
];

//GENERATES COLOR PALETTE UI
function createColorOptions() {
                                                     //OPTION TO DESELECT CURRENT COLOR
    const clearSelection=document.createElement('div');
    clearSelection.classList.add('color-option');
    Object.assign(clearSelection.style,{
        backgroundColor:"transparent",
        border:"2px dashed black",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        fontSize:"14px",
        fontWeight:"bold",
        cursor:"pointer"
    });
    clearSelection.innerText="X";
    clearSelection.addEventListener("click",()=>currentColor=null);
    colorPalette.appendChild(clearSelection);

                           //GENERATE COLOR OPTIONS
    colors.forEach(color=>{
        const option=document.createElement("div");
        option.classList.add("color-option");
        option.style.backgroundColor=color;
        option.addEventListener("click",()=>currentColor=color);
        colorPalette.appendChild(option);
    });
}

// ====================
// EVENT LISTENERS SETUP
// ====================

toggleLineButton.addEventListener('click',()=>{
    lineMode=!lineMode;
    toggleLineButton.innerText=lineMode?"Line Mode: ON":"Line Mode: OFF";
});

clearGridButton.addEventListener('click',()=>{
    document.querySelectorAll('.grid-cell').forEach(cell=>{
        cell.style.backgroundColor="";
    });
});

toggleGridButton.addEventListener('click',()=>{
    document.querySelectorAll('.grid-cell').forEach(cell=>{
        cell.style.border=cell.style.border==="none"?"1px solid black":"none";
    });
});

exportArtButton.addEventListener('click',()=>{
    html2canvas(gridContainer).then(canvas=>{
        const link=document.createElement("a");
        link.download="pixel-art.png";
        link.href=canvas.toDataURL("image/png");
        link.click();
    });
});

saveArtButton.addEventListener('click',()=>{
    const savedGrid=Array.from(document.querySelectorAll('.grid-cell'))
        .map(cell=>cell.style.backgroundColor||"");
    localStorage.setItem("pixelArt",JSON.stringify(savedGrid));
});

loadArtButton.addEventListener('click',()=>{
    const savedGrid=JSON.parse(localStorage.getItem("pixelArt"));
    if(!savedGrid)return;
    const gridCells=document.querySelectorAll('.grid-cell');
    savedGrid.forEach((color,i)=>{
        if(gridCells[i])gridCells[i].style.backgroundColor=color;
    });
});

gridSizeSelector.addEventListener("change",()=>{
    currentGridSize=parseInt(gridSizeSelector.value);
    createGrid(currentGridSize);
});

document.addEventListener("mousedown",()=>isMouseDown=true);
document.addEventListener("mouseup",()=>isMouseDown=false);

document.getElementById("zoom-in").addEventListener("click",zoomIn);
document.getElementById("zoom-out").addEventListener("click",zoomOut);

//ESCAPE KEY TO CANCEL PREVIEW LINE
document.addEventListener('keydown',(e)=>{
    if(e.key==="Escape"&&lineMode){
        clearPreview();
        startCell=null;
    }
});

// ====================
// INITIALIZE APPLICATION
// ====================

//BUILD COLOUR PALETTE UI
createColorOptions();

//BUILD INITIAL GRID
createGrid(currentGridSize);
