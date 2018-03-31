/*
   Tested with CC 2018:
     
    Does:
    If you ctrl-select a layer in photoshop. That will select all pixels according to the inverse of the transparency on that layer.
    This script distributes each selection island to its own layer. i.e similar to "distribute to layers" concept.
    
    How?:
    Ctrl-select a single layer in photoshop that you want to distribute to layers. 
    Hide anything below that you don't want to be merged into the layer distribution.
    
    Usage:
    -Remove noisy image garbage by reviewing a layered list with pixel content (layers), instead of the actual image.
    -Split rasterized text(other solitair pixel data) - to layers.
    
    Notes: 
    -This script halts on "makeWorkPath" if there is no path layer
    Add an empty path layer first. Then it should work like intended by using ctrl+select a layer.
    
    -do not count on that the makeWorkPath encloses your selection perfectly, 
    it will shop of some pixels here and there, that is why there is a expandSelectionPixel
    included in the script to give the path some room for mistakes.
    
 */

//set ruler
var originalUnit = preferences.rulerUnits;
//preferences.rulerUnits = Units.CM;
preferences.rulerUnits = Units.PIXELS;

var counter = 1;
var expandSelectionPixelval = "2 pixels";
var copyMerge = true;
var suffixLength = 3;

//removeAllPathItems();//use this to clean up

//create single historystate for the entire document, this actually call the init funtion
app.activeDocument.suspendHistory("Distribute Selection to Layers", "subSelectionsToLayers();");
//subSelectionsToLayers(); //this is called from the suspendHistory!

function resetPref()
{
    preferences.rulerUnits = originalUnit;
}

function extractSubPathInfo(pathObj)
{
    //var limxw = app.activeDocument.height;
    //var limyh = app.activeDocument.width;
    
    // Create an array of pathItems. Each pathObj is added to a new pathItem, with only one subPathItem (itself).
    // Each element can be used as the second arugment in pathItems.add()
    // I.e., doc.pathItems.add("myPath1", pathArray[0]);
    var pathArray = new Array();
    var pl = pathObj.subPathItems.length;

    // Define the path.
    var limx = app.activeDocument.height;
    var limy = app.activeDocument.width;

    var pArray;
    var subPathArray;
    
    for(var s=0;s<pl;s++)
    {
        pArray = new Array();
        // Create new PathInfo item for this subPathItem
        for(var i=0;i<pathObj.subPathItems[s].pathPoints.length;i++)
        {
            if( limx > pathObj.subPathItems[s].pathPoints[i].anchor[0] )
            {
                limx = pathObj.subPathItems[s].pathPoints[i].anchor[0];
            }

            if( limy > pathObj.subPathItems[s].pathPoints[i].anchor[1] )
            {
                limy = pathObj.subPathItems[s].pathPoints[i].anchor[1];
            }

            pArray[i] = new PathPointInfo;
            pArray[i].kind = pathObj.subPathItems[s].pathPoints[i].kind;
            pArray[i].anchor = pathObj.subPathItems[s].pathPoints[i].anchor;
            pArray[i].leftDirection = pathObj.subPathItems[s].pathPoints[i].leftDirection;
            pArray[i].rightDirection = pathObj.subPathItems[s].pathPoints[i].rightDirection;
        }

        // Create a new SubPathInfo for this subPathItem.
        subPathArray = new Array();
        subPathArray[0] = new SubPathInfo();
        subPathArray[0].operation = ShapeOperation.SHAPEADD;
        subPathArray[0].closed = true;
        subPathArray[0].entireSubPath = pArray;
    
        //alert("this is subpath" + subPathArray[0].entireSubPath);
        
        pathArray.push(subPathArray);
        pathArray.push(new Array(limx, limy));
    }

    return pathArray;
 }

function subSelectionsToLayers()
{
    //check if any document is open
    if (app.documents.length > 0)
    {
        //check if the selected layer is background
        if (app.activeDocument.activeLayer.isBackgroundLayer == false)
        {
            var ndoc = app.activeDocument;
            var lyr = ndoc.activeLayer;
            //alert(ndoc + " " + lyr);
            
            //active layername
            var lyrName = lyr.name;
            
            //doesnt catch the 'no selection'
            alert("did you ctrl-select a layer by clicking on its layer thumb? (and did it have transparency and got selection islands?)");
            //does not work if there is no path layer
            alert("please add an empty layer in 'Paths' if there is none, or script that function and replace in this script. makeWorkPath does not wokr without an empty layer");
            
            ndoc.selection.makeWorkPath(1);

            var p = ndoc.pathItems["Work Path"];
            //alert ("p.subPathItems.length = " + p.subPathItems.length);

            var currentPathItem;
            var myPathsArray;
            var myPathItem;

            myPathsArray = extractSubPathInfo(p);
            
            if(myPathsArray.length == 2)
            {
                alert("There is only ONE continuous selection path, this script will exit.");
                return;
            }

            //create a new path with each subPath
            for(var s=0; s<myPathsArray.length; s+=2)
            {
                // Keep layer active for next selection.
                ndoc.activeLayer = lyr;

                // Create a new pathItem in the document.
                myPathItem = ndoc.pathItems.add('myPath'+s, myPathsArray[s]);

                // Make selection from path.
                myPathItem.makeSelection();

                // Copy and paste the selection's content into a new layer.
                ndoc.selection.expand(expandSelectionPixelval);
                //ndoc.selection.feather(0);
                ndoc.selection.copy(copyMerge);
                var layerRef = ndoc.paste();
                
                layerRef.name = lyrName + "_" + zeroPad(counter, suffixLength);
                counter++;

                // Destroy the pathItem from the document. (Not necesssary)
                myPathItem.remove();
            }
        }
        else
        {
            alert("Operation cannot be performed on background layer");
        }
    }
    else
    {
        alert("Create a document with an active selection before running this script!");
    }
    resetPref()
}

//list props in objects
function testObject(obj){
    for (var prop in obj){
        alert(prop);
        }
}

function removeAllPathItems()
{
    var patharr = app.activeDocument.pathItems;
    
    for(var i=app.activeDocument.pathItems.length;i>0;i--)
    {
        patharr[i-1].remove();
    }
}

function zeroPad ( num, digit )
{
   var tmp = num.toString();
   while (tmp.length < digit) { tmp = "0" + tmp;}
   return tmp;
}
