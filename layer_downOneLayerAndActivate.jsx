/*
    DownOneLayerAndActivate.jsx
    2014 7 sep, by Linus Jarbo

    Goes Down one layer and selects the layer
*/

var doc = app.activeDocument;
var layerIndex = returnLayerIndex();

if(layerIndex < doc.layers.length-1)
{
    doc.activeLayer = doc.layers[layerIndex+1];
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