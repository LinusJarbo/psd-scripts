/*
    Tested in psd cc 2018
    
    Does:
    divides the image in horizontal and vertical guides based on columns and rows and modifies the document to have pixelperfect dimensions.
*/

var doc;

var originalUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;

CheckDoc()

function CheckDoc()
{
    if(app.documents.length == 0)
    {
        alert("No document open");
        return;
    }
    doc = app.activeDocument;
    doc.suspendHistory("Guide division of document", "initScript();");
}

function initScript()
{
    //debugg
    $.writeln ("initscript called");
    
    //get columns and rows
    // get user input on column count
	var colWidth = parseInt( prompt("Vertical division?", 5));
    var colHeight = parseInt( prompt("Horizontal division?", 5));
    
    //get width and height
    var docWidth = doc.width;
    var docHeight = doc.height;
    
    //get shouldbevalues
    var perfectw = docWidth;
    var perfecth = docHeight;
    
    while(perfectw%colWidth != 0)
    {
        perfectw +=1;
    }

    while(perfecth%colHeight != 0)
    {
        perfecth +=1;
    }

    doc.resizeCanvas(UnitValue(perfectw,"px"),UnitValue(perfecth,"px"));
    
    //add rulers
    var deltaw = perfectw/colWidth;
    var i=deltaw;
    while(i<perfectw)
    {
        guideLine(i, 'Vrtc')
        i+=deltaw;
    }

    var deltah = perfecth/colHeight;
    var j=deltah;
    while(j<perfecth)
    {
        guideLine(j, 'Hrzn')
        j+=deltah;
    }
    
    //clean up
    resetPref();
    
    if(perfectw-docWidth || perfecth-docHeight)
    {
        $.writeln("width and/or height larger");
        alert("Resized and added to canvas with: " + (perfectw-docWidth) + " in width and " + (perfecth-docHeight) + " in height");
    }
}

function resetPref()
{
    preferences.rulerUnits = originalUnit;
}

function guideLine(position, type) 
{ 
   var id296 = charIDToTypeID( "Mk  " ); 
       var desc50 = new ActionDescriptor(); 
       var id297 = charIDToTypeID( "Nw  " ); 
           var desc51 = new ActionDescriptor(); 
           var id298 = charIDToTypeID( "Pstn" ); 
           var id299 = charIDToTypeID( "#Pxl" ); 
           desc51.putUnitDouble( id298, id299, position ); 
           var id300 = charIDToTypeID( "Ornt" ); 
           var id301 = charIDToTypeID( "Ornt" ); 
           var id302 = charIDToTypeID( type ); 
          desc51.putEnumerated( id300, id301, id302 ); 
          var id303 = charIDToTypeID( "Gd  " ); 
       desc50.putObject( id297, id303, desc51 ); 
   executeAction( id296, desc50, DialogModes.NO ); 
};
