/*
    Linus Jarbo 2018-04-11
    
    within psd:
    record opening this script in a action, then assign hotkey to run current selected action.
    
    Does:
    Converts a selected layer to a transparent desaturated image. 
    (I guess unsaturated is not possible? unless one mask per channel? but how?)
    
    Usage:
    For example: 
    -if you want to preserve floor shadow on cut out object in an otherwise transparent image.
    -if multiply is not available but transparency is.
    -expert masking.
    
    How:
    you will need to include stdlib.js from xbytor - in a folder you named "include"
*/

#target photoshop

// @include 'include/stdlib.js'

//vars
var scaler = 10;

//get current doc and layer
var currDoc;
var currLayer; 

main();

 function createSmartObject(layer)
 {
     var idnewPlacedLayer = stringIDToTypeID( 'newPlacedLayer' );
     executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
 }

function main()
{
    try{
            currDoc = app.activeDocument;
           
        }catch(e){
            alert("No documents found");
            return;
         }

    //create smart object of selected layer
    if ( currDoc.activeLayer.kind != LayerKind.SMARTOBJECT ){
            createSmartObject(currDoc.activeLayer);
    }

    currDoc.activeLayer.name = "Desaturated Transparent";  
    
    //open smart object
    var smartObjectDoc = Stdlib.editSmartObject(currDoc, currDoc.activeLayer);

    //set colormode to grayscale
     smartObjectDoc.changeMode(ChangeMode.GRAYSCALE);

    //increase doc size to 500%
    smartObjectDoc.resizeImage(smartObjectDoc.width*scaler, smartObjectDoc.height*scaler, undefined, ResampleMethod.BICUBIC);

    //set doc mode to bitmap
    var bmpOpts = new BitmapConversionOptions();
     bmpOpts.method = BitmapConversionType.DIFFUSIONDITHER;
    bmpOpts.resolution = smartObjectDoc.resolution;
    smartObjectDoc.changeMode(ChangeMode.BITMAP,  bmpOpts);
    
    //set docmode to grayscale
    smartObjectDoc.changeMode(ChangeMode.GRAYSCALE);
    
    //make layer not background
    smartObjectDoc.activeLayer.name = "From Background";  
    
    //select white
    var chercheCouleur = new SolidColor();
    chercheCouleur.rgb.red=255;
    chercheCouleur.rgb.green=255;
    chercheCouleur.rgb.blue=255;
    selectColorRange(chercheCouleur);
    
    //delete white
    smartObjectDoc.selection.cut();

    //blur image gaussian 1px
    smartObjectDoc.activeLayer.applyGaussianBlur(2);
    
    //scale down image to 20%
    smartObjectDoc.resizeImage(smartObjectDoc.width/scaler, smartObjectDoc.height/scaler, undefined, ResampleMethod.BICUBIC);

    //save and close
    smartObjectDoc.close(SaveOptions.SAVECHANGES);

    //break smart object
    rasterizeLayer();
    
    //done, afk restriction over...
    alert("done");
}

function rasterizeLayer()
{
    var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
    var desc5 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref4 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref4.putEnumerated( idLyr, idOrdn, idTrgt );
    desc5.putReference( idnull, ref4 );
    var idWhat = charIDToTypeID( "What" );
    var idrasterizeItem = stringIDToTypeID( "rasterizeItem" );
    var idlayerStyle = stringIDToTypeID( "layerStyle" );
    desc5.putEnumerated( idWhat, idrasterizeItem, idlayerStyle );
    
    executeAction( idrasterizeLayer, desc5, DialogModes.NO );
}

function selectColorRange(scObj)
{
    var desc = new ActionDescriptor();
    desc.putInteger( charIDToTypeID( "Fzns" ), 0 );
    var cDesc = new ActionDescriptor();
    cDesc.putDouble( charIDToTypeID( "Rd  " ), scObj.rgb.red);
    cDesc.putDouble( charIDToTypeID( "Grn " ), scObj.rgb.green);
    cDesc.putDouble( charIDToTypeID( "Bl  " ), scObj.rgb.blue );
    desc.putObject( charIDToTypeID( "Mnm " ), charIDToTypeID( "RGBC" ), cDesc );
    desc.putObject( charIDToTypeID( "Mxm " ), charIDToTypeID( "RGBC" ), cDesc );
    executeAction( charIDToTypeID( "ClrR" ), desc, DialogModes.NO );
}