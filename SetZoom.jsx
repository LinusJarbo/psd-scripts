/*
    Does:
    setZoom function takes a value from 1-100 and uses that as percentage for zoom
    
    Usage:
    if you want a certain percentage of zoom at a specifik task or edit.
    
    How:
    you will need to include stdlib.js from xbytor - in a folder you named "include"
*/

#target photoshop

// @include 'include/stdlib.js'

Stdlib.zoomFitOnScreen(); //this function is from stdlib.js and is used to center image if it is of center.
setZoom (25);

function setZoom( zoom ) {
   cTID = function(s) { return app.charIDToTypeID(s); };
   var docRes = app.activeDocument.resolution;
   app.activeDocument.resizeImage( undefined, undefined, 72/(zoom/100), ResampleMethod.NONE );
   var desc = new ActionDescriptor();
   var ref = new ActionReference();
   ref.putEnumerated( cTID( "Mn  " ), cTID( "MnIt" ), cTID( 'PrnS' ) );
   desc.putReference( cTID( "null" ), ref );
   executeAction( cTID( "slct" ), desc, DialogModes.NO );
   activeDocument.resizeImage( undefined, undefined, docRes, ResampleMethod.NONE );
}