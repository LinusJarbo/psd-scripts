/*
    if you don't need to review the image content, there might be faster methods outside photoshop to setup document?
    tested in photoshop CC 19.1.12

    Does:
    This sets a document mode to RGB, 300 dpi without rescaling 
    (and to color profile Adobe RGB(1998) if you switch the false statement to true)

    Usage:
    run this script from an action, and run that action from a hotkey set to run selected action
*/

#target photoshop

var doc = app.activeDocument;

//set color mode to RGB
if(doc.mode != DocumentMode.RGB) {
       alert("doc mode is not RGB - will set to RGB");
       doc.changeMode(ChangeMode.RGB);
}

//set resolution only, no resample
if(doc.resolution != 300){
    alert("doc resolution is not 300 - will set to 300");
    doc.resizeImage(undefined, undefined, 300, ResampleMethod.NONE);
 };

//set colorprofile
try{
    if((doc.colorProfileName != "Adobe RGB (1998)"))
    {
        alert("wrong profile: " + doc.colorProfileName);
    }else{
        alert("OK");
    }
}catch(e)
{
    alert("No colorprofile");
}

//set to true if you trust the convertProfile function.
 if(false){
      var blackPointCompensation = true;
      var dither = true;
      var intentcolor = Intent.RELATIVECOLORIMETRIC;
      doc.convertProfile ("Adobe RGB (1998)", intentcolor, blackPointCompensation, dither); 
 }