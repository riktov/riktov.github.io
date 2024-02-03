let radioSquare = document.getElementById("radio_square") ;
let radioCircle = document.getElementById("radio_circle") ;
let radioDiamond = document.getElementById("radio_diamond") ;
let colorPicker = document.getElementById("colorpicker_wrapper") ;
let modeButton = document.getElementById("mode_button") ;
let randomStatesButton = document.getElementById("random_states_button") ;
let shuffleColorsButton = document.getElementById("shuffle_colors_button") ;
let scaleUpButton = document.getElementById("scale_up_button") ;
let scaleDownButton = document.getElementById("scale_down_button") ;
let pasteButton = document.getElementById("paste_button") ;

var paletteSelection = {} ;
var savedColor = null ;

function onModeButtonClick() {
	if(isPlayMode) {
		//switch to palette mode
		paletteMode() ;
	} else {
		playMode() ;
	}
}

function paletteMode() {
	isPlayMode = false ;
	modeButton.innerHTML = "Done" ;
	$(colorPicker).show() ;
	$(".PlayControls button, .PlayControls input").prop("disabled", true) ;
	pasteButton.disabled = true ;
	drawColorPalette() ;
	selectCellToChange(0, 0) ;
}

function playMode() {
	isPlayMode = true ;
	modeButton.innerHTML = "Change Colors" ;
	$(colorPicker).hide() ;
	$(".PlayControls button, .PlayControls input").prop("disabled", false) ;
	draw() ;
}


function selectCellToChange(row, column) {
	paletteSelection.column = column ;
	paletteSelection.row = row ;
	drawColorPalette() ;
	drawCellBorder(row, column) ;
	let selectedCellColor = colors[row][column] ;
	console.log("Selected cell color: ", "#" + selectedCellColor) ;
	
	$("#colorpicker").spectrum("set", selectedCellColor);
}


function onCopyColor() {
	savedColor = colors[paletteSelection.row][paletteSelection.column] ;
	pasteButton.disabled = false ;
}

function onPasteColor() {
	colors[paletteSelection.row][paletteSelection.column] = savedColor ;
	drawColorPalette();
	drawCellBorder(paletteSelection.row, paletteSelection.column) ;
	$("#colorpicker").spectrum("set", savedColor);
}


var isPlayMode = true ;
playMode() ;

colorPicker.hidden = true ;