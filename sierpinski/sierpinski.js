/* sierpinski.js */
"use strict" ;

var scale = 3 ;
var orderX = 3 ;
var orderY = 3 ;

//true means recurse, false means solid
// var states = [
//     [true, true, true],
//     [true, false, true],
//     [true, true, true],
// ] ;

var colors = [
    ["blue", "green", "red"],
    ["orange", "black", "purple"],
    ["cyan", "magenta", "yellow"],
] ;

var states = [
    [true, true, true, ],
    [true, false, true, ],
    [true, true, true,],
] ;

// var colors = [
//     ["black", "red", "black", "red"],
//     ["red", "black", "red", "black"],
//     ["black", "red", "black", "red"],
//     ["red", "black", "red", "black"],
// ] ;

var canvas=document.getElementById('sierpinski') ;

function draw() {
    var ctx ;
    if(canvas.getContext){
        ctx = canvas.getContext('2d') ;
    } else {
        return null;
    }

    var image = renderCell(canvas.width) ;

    ctx.putImageData(image, 0, 0) ;
	setFavicon() ;
}

function filledCell(width, colorStr) {
	var cv = document.createElement("canvas") ;
	cv.width = width ;
	cv.height = width ;
	var ctx = cv.getContext("2d") ;//ready to draw into
	ctx.fillStyle = colorStr ;
	
	//ctx.fillRect(0, 0, width/2, width/2) ;
	//ctx.fillRect(0, width/2, width/2, width/2) ;
	if(radioSquare.checked) {
		ctx.fillRect(0, 0, width, width) ;
	}

	if(radioDiamond.checked) {
		ctx.beginPath();
		ctx.moveTo(width/2, 0);
		ctx.lineTo(width, width/2);
		ctx.lineTo(width/2, width);
		ctx.lineTo(0, width/2);
		ctx.fill() ;
	}

	 if(radioCircle.checked) {
	 	ctx.arc(width/2, width/2, width/2, 0, 2 * Math.PI);
	 	ctx.fill() ;
	}

	/*
	if(radioCircle.checked) {
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(width, 0);
		ctx.lineTo(0, width);
		ctx.lineTo(0, 0) ;
		ctx.fill() ;
	}
	*/


	return ctx.getImageData(0, 0, width, width) ;
}


function renderCell(width) {
	if(width < orderX) {
		return null ;
	}
	
	var subDim = width / orderX ;
	
	var tiledCanvas = document.createElement("canvas") ;
	tiledCanvas.width = width ;
	tiledCanvas.height = width ;
 	var tiledImg = tiledCanvas.getContext("2d") ;//ready to draw into
 
//     tiledImg.fillRect(0, 0, width, width) ;
	
// 	var solidSubImg = null ; 
	var recursedSubImg = null ;
  
	//console.log("Start generating image for size ", width) ;
	for(var row = 0 ; row < states.length ; row++) {
		for(var col = 0 ; col < states[0].length ; col++) {
			if(!states[row][col]) {
				tiledImg.putImageData(filledCell(subDim, colors[row][col]), col * subDim, row * subDim) ;
			} else {
				if(recursedSubImg == null) {//not initialized
					recursedSubImg = renderCell(subDim) ;
				}  
	
				if(recursedSubImg != null) {
					tiledImg.putImageData(recursedSubImg, col * subDim, row * subDim) ;
				} 
				// else bottomed out, so don't draw, or background 
				//tiledImg.putImageData(filledCell(subDim, "pink"), col * subDim, row * subDim) ;		
			}
		}
	}
  //console.log("Finished generating image for size ", width) ;
  return tiledImg.getImageData(0, 0, width, width) ;
}

//Get Mouse Position
function getMouseGridPos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((orderX * (evt.clientX - rect.left)) / rect.width),
        y: Math.floor((orderY * (evt.clientY - rect.top)) / rect.height)
    };
}


function randomizeStates() {
	for(var row = 0 ; row < states.length ; row++) {
		for(var col = 0 ; col < states[0].length ; col++) {
			states[row][col] = (Math.random() < 0.5)
		}
	}
	draw() ;
}

function shuffle(arr) {
    var i;
    for (i = arr.length - 1; i > 0; i--) {
        let selectedIdx = Math.floor(Math.random() * (i + 1));
        let tailVal = arr[i];
        arr[i] = arr[selectedIdx];
        arr[selectedIdx] = tailVal;
    }
    return arr;
}

function shuffleColors() {
	var arrColors = [] ;
	var indices = [] ;
	
	var idxOrig = 0 ;
	
	for(var row = 0 ; row < colors.length ; row++) {
		for(var col = 0 ; col < colors[0].length ; col++) {
			arrColors.push(colors[row][col]) ;
			indices.push(idxOrig) ;
			idxOrig++ ;
		}
	}
	//console.log("arrColors", arrColors) ;
	let shuffled = shuffle(arrColors) ;
	//console.log("shuffled", shuffled) ;
	
	for(var row = 0 ; row < colors.length ; row++) {
		for(var col = 0 ; col < colors[0].length ; col++) {
			colors[row][col] = shuffled.shift() ;
		}
	}
	console.log(colors) ;
	draw() ;
}

function scaleDown() {
	let dim = canvas.width

	let newWidth = dim / orderX ;
	let newHeight = dim / orderY ;
	if(newWidth < orderX || newHeight < orderY) { return ; } 

	canvas.width = newWidth ;
	canvas.height = newHeight ;

	console.log("Canvas scaled down to", canvas.width, "x", canvas.height) ;
	draw() ;
}

function scaleUp() {
	let dim = canvas.width ;

	canvas.width = dim * orderX ;
	canvas.height = dim * orderY ;

	console.log("Canvas scaled up to", canvas.width, "x", canvas.height) ;
	draw() ;
}


function setFromGrid(grid) {
	console.log("grid in setFromGrid", grid) ;
	states = grid.states ;
	colors = grid.colors ;
	draw() ;
}
///////////////////////////////////////////////////////////
// initialize from here

canvas.addEventListener("click", function (evt) {
    var gridPos = getMouseGridPos(canvas, evt);
	if(isPlayMode) {
		let gridState = states[gridPos.y][gridPos.x] ;
		states[gridPos.y][gridPos.x] = !gridState ;
		draw() ;
	} else {
		console.log("Palette Selection: ", paletteSelection) ;
		selectCellToChange(gridPos.y, gridPos.x) ;
	}
}, false);

$("#colorpicker").spectrum({
	color: "#f00",
	change: function(color) {
		//$("#basic-log").text("change called: " + color.toHexString());
		colors[paletteSelection.row][paletteSelection.column] = color.toHexString() ;
		drawColorPalette();
		drawCellBorder(paletteSelection.row, paletteSelection.column) ;
	}
});
