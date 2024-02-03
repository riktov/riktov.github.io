function drawCellBorder(row, column) {
	var ctx = canvas.getContext("2d") ;//ready to draw into
	
	//ctx.fillRect(0, 0, width/2, width/2) ;
	//ctx.fillRect(0, width/2, width/2, width/2) ;

	subWidth = canvas.width / orderX ;
	subHeight = canvas.height / orderY ;
	originX = column * subWidth ;
	originY = row * subHeight ;
	
	ctx.strokeStyle = "gray" ;
	ctx.lineWidth = 5;
	ctx.strokeRect(originX + ctx.lineWidth / 2, originY + ctx.lineWidth/2, subWidth - ctx.lineWidth, subWidth - ctx.lineWidth) ;
//	ctx.fillRect(originX , originY, inset, inset) ;	
}

function drawColorPalette() {
	var ctx ;
    if(canvas.getContext){
        ctx = canvas.getContext('2d') ;
    } else {
        return null;
    }
    
	var width = canvas.width ;
	var subDim = width / orderX ;
	
	var tiledCanvas = document.createElement("canvas") ;
	tiledCanvas.width = width ;
	tiledCanvas.height = width ;
	var tiledImg = tiledCanvas.getContext("2d") ;//ready to draw into
	
	for(var row = 0 ; row < colors.length ; row++) {
		for(var col = 0 ; col < colors[0].length ; col++) {
			tiledImg.putImageData(filledPaletteCell(subDim, colors[row][col]), col * subDim, row * subDim) ;
		}
	}
	
	ctx.putImageData(tiledImg.getImageData(0, 0, width, width), 0, 0) ;
// 	placeColorPickers(canvas) ;
}

function filledPaletteCell(width, colorStr) {
	var cv = document.createElement("canvas") ;
	cv.width = width ;
	cv.height = width ;
	var ctx = cv.getContext("2d") ;//ready to draw into
	ctx.fillStyle = colorStr ;
	
	//ctx.fillRect(0, 0, width/2, width/2) ;
	//ctx.fillRect(0, width/2, width/2, width/2) ;
	var inset = 10 ;

	ctx.fillRect(inset, inset, width - (2 * inset), width - (2 * inset)) ;

	return ctx.getImageData(0, 0, width, width) ;
}



