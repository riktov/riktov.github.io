/* Module for  
 */
function rearrangeCddbString(cddbStr) {
    /* rearrange a CDDB string to place the least random digits at the front.*/
    let checkSum     = cddbStr.substring(0, 2) ;    //reliably random
    let trackTime1   = cddbStr.substring(2, 3) ; //almost always 0, sometimes 1 (over 68 minutes), never greater
    let trackTime234 = cddbStr.substring(3, 6) ; // reliably random towards the tail
    let numTracks    = cddbStr.substring(6) ;    //first digit usually 0, second usually between 8 and d?

    return trackTime1 + numTracks + trackTime234 + checkSum ;
}

function int32ToGrid(num32) {
    //convert a 32-bit integer to a 3x3 grids of state and color.
    //values are taken from the tail end.
    //a state of True means recursing, not filled with solid color

    var numFilled = 0 ;

    var states = [] ;

    for(var i = 0 ; i < 9 ; i++) {
        var isRecursing = ((num32 % 2) == 1) ;   //last bit
        states[i] = isRecursing ;
        if(!isRecursing) {
            numFilled++ ;
        }
        num32 >>= 1 ;
    }

    //There is a 1/512 chance that all the state bits will recursing
    //check for that, and in that case invert one of them
    //all non-recursing is boring but will display
    if(numFilled == 0) {
        states[4] = !states[4] ;
        numFilled = 1;
    }

    //We only need as many colors as there are non-recursing cells,
    //so we distribute all remaining bits among the colors. The fewer colors needed,
    //the more possible values for those colors.

    var colorPalette = [] ;

    //initialize the palette to the number of filled cells
    for(var i = 0 ; i < numFilled ; i++) {
        colorPalette[i] = 0 ;
    }

    var idx = 0 ;

    //deal the bits off the tail to the palette trays
    for(var i = 0 ; i < 23 ; i++) {
        idx = i % numFilled ;
        let bit = num32 % 2 ;

        colorPalette[idx] = (colorPalette[idx] * 2) + bit ;
        num32 >>= 1 ;        
    }

    var colors = [] ;

    for(var i = 0 ; i < 9 ; i++) {
        if(!states[i]) {
            colors[i] = intToRGB(colorPalette.pop()) ;
        } else {
            colors[i] = "#000000" ;
        }
    }
    
    let slicedStates = [
        states.slice(0, 3),
        states.slice(3, 6),
        states.slice(6),
    ]

    let slicedColors = [
        colors.slice(0, 3),
        colors.slice(3, 6),
        colors.slice(6),
    ]

    return {
        "states": slicedStates,
        "colors": slicedColors
    } ;
}

function intToRGB(n) {
    //convert an integer of any size up to 24 bits to a
    //string representation of 24-bit color
    
    //replace black with something nicer
    if(n == 0) {
        return "#de2bef" ;
    }

    var rgbChannel = [
        0,0,0
    ]
    
    //Deal out the bits from the tail to the the three channels
    for(var i = 0 ; i < 24; i++) {
        let bit = n % 2 ;
        let idx = i % 3 ;
        rgbChannel[idx] = rgbChannel[idx] * 2 + bit ;
        n >>= 1 ;
    }

    
    
    var rgbStr = "" ;


    for(var i = 0 ; i < 3 ; i++) {
        let chan =  (rgbChannel[i]).toString(16) ;
        if(chan.length == 1) {  //pad
            chan = "0" + chan ;
        }
        rgbStr += chan;
    }
    
    //Since we have few bits to work with, most colors will be mostly zero. 
    //We prefer bright colors, so invert the bits.        
    rgbStr = "#" + rgbStr.replaceAll('0', 'a') ;

    return rgbStr ;
}
