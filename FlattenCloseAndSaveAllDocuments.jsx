/*
    Warning!
    
    Does:
    Flattens, saves and close all open documents.
    
    Usage:
    if your all done and want to close it all with a flatten.
    
    How:
*/

#target photoshop

var result = confirm("Warning!!! Do you really want to FLATTEN(!), CLOSE and SAVE all your documents?", false);  
if (result == true) {  
    while (app.documents.length >=1){
        try{
            app.activeDocument.flatten();
            app.activeDocument.save();
            app.activeDocument.close();
         }catch(e){ 
             alert("You need to save all document first!");
             break;
          }
    }
}; 