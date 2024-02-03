function setFavicon() {
    var favIconCanvas = document.createElement("canvas") ;
    favIconCanvas.width = 32 ;
    favIconCanvas.height = 32 ;
    var favIconImg = favIconCanvas.getContext("2d") ;//ready to draw into
    
    let scaleWidth = 32 / canvas.width ;
    let scaleHeight = 32 / canvas.height ;
    favIconImg.scale(scaleWidth, scaleHeight) ;
    favIconImg.drawImage(canvas, 0, 0) ;
    
    let link = document.getElementById("shortcut_icon") ;
    link.href = favIconCanvas.toDataURL("image/x-icon");
}
    