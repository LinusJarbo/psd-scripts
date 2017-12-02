/*
    UpOneLayerAndActivate.jsx, tested for psd-CS6
    2014 2 sep, by Linus Jarbo
 
    Goes up one layer and selects the layer
    (assign to hotkey)
*/
 
var doc = app.activeDocument;
var layerIndex = returnLayerIndex();
 
if(layerIndex > 0)
{
    doc.activeLayer = doc.layers[layerIndex-1];
    doc.activeLayer.selected = true;
}
 
function returnLayerIndex()
{
    for(var i=0;i < doc.layers.length;i++)
    {
        if(doc.layers[i].name == doc.activeLayer.name)
        {
            return(i);
        }
    }
}