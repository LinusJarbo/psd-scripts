/***********
PSD

20171120 - tested and works in Photoshop CC 2018

save this as .jsx in folder -> CS5/Presets/Scripts/ 
restart psd
create and save a psd document
goto file/script and run your script...

Does:
- Exports selected layer (single layer) to AIR icons [128, 48, 32, 16].
- Saves to active documents path.
- Prompts for icon name


************/

//set sizes you want to export to...
var sizearr = [1024,512,128,48,32,16];

//set unit preferences
var strtRulerUnits = app.preferences.rulerUnits;
var strtTypeUnits = app.preferences.typeUnits;
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

//create a new aarray of icons
function createAirIcons()
{            
    var orginalDoc = app.activeDocument;
  
    try{
    var orgpath = orginalDoc.path;
    }catch(e){
        alert("You need to save your document, icons will be saved at same location.");
        return;
    }
    var duplicateDoc = app.activeDocument.duplicate();      

    // Set RGB Mode.
    duplicateDoc.changeMode(ChangeMode.RGB);  
                                       
    // All other layers off.
    setInvisibleAllArtLayers(duplicateDoc);
                           
    // Selected layer visible.
    if(duplicateDoc.artLayers.length > 1){
        duplicateDoc.activeLayer.visible = true; 
    }
    
    // file name.
    var fileName = prompt("Name your ICON, No extension, Only saves current single layer to icons.", ""); 
    if(fileName==null) return; // You clicked cancel.
    
    // save options PNG
    var pngOptions = new PNGSaveOptions();
    pngOptions.interlaced = false;
    
    for(var i=0;i<sizearr.length;i++)
    {
        orginalDoc = app.activeDocument;//duplicate
        duplicateDoc = app.activeDocument.duplicate();
        activeDocument.resizeImage(sizearr[i],sizearr[i],null,ResampleMethod.BICUBICSHARPER);
        activeDocument.saveAs(File(orgpath + "/" + fileName + "_" + sizearr[i] + ".png"), pngOptions, true);
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }

    //close duplicate
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
 
}      
// layers off.
function setInvisibleAllArtLayers(obj) {
    for( var i = 0; i < obj.artLayers.length; i++) {
        if (obj.artLayers[i].name != "Background") {
            obj.artLayers[i].allLocked = false;
            obj.artLayers[i].visible = false;
        }
    }
    for( var i = 0; i < obj.layerSets.length; i++) {
        setInvisibleAllArtLayers(obj.layerSets[i]);
    }
}

//create air icons
createAirIcons();