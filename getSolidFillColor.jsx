/*
    Tested with PSD CS5:
    
    Get all layers of type SOLIDFILL and return Color.

 */

var doc = app.activeDocument;
var len = doc.layers.length;

for (var i = 0; i < len; i++) 
{
    var layer = doc.layers[i];
    if (layer.kind == LayerKind.SOLIDFILL)
    {
        doc.activeLayer = layer;
        alert(layer.name);
        alert(getFillColor().rgb.red);
    }
}

function getFillColor()
{
    var ref = new ActionReference();
    ref.putEnumerated( stringIDToTypeID( "contentLayer" ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ));
    var ref1 = executeActionGet( ref );
    var list =  ref1.getList( charIDToTypeID( "Adjs" ) ) ;
    var solidColorLayer = list.getObjectValue(0);        
    var color = solidColorLayer.getObjectValue(charIDToTypeID('Clr ')); 
    
    var fillcolor = new SolidColor;    
    fillcolor.rgb.red = color.getDouble(charIDToTypeID('Rd  '));
    fillcolor.rgb.green = color.getDouble(charIDToTypeID('Grn '));
    fillcolor.rgb.blue = color.getDouble(charIDToTypeID('Bl  '));

    return fillcolor;
}