// This script will save the active document to a folder with an incremental sufix
// Change the options below to match your needs
var saveFolder = new Folder( '~/Desktop/incrementalsave' );
var saveExt = 'png';
var saveSufixStart = '_';
var saveSufixLength = 3;

pngOpts = new PNGSaveOptions();
pngOpts.embedColorProfile = true;
pngOpts.formatOptions = FormatOptions.STANDARDBASELINE; 
pngOpts.matte = MatteType.NONE; 
pngOpts.quality = 1; 
pngOpts.PNG8 = false; //24 bit PNG
pngOpts.transparency = true;
// End of user options

//==========================================
function zeroPad ( num, digit ){
   var tmp = num.toString();
   while (tmp.length < digit) { tmp = "0" + tmp;}
   return tmp;
}

var docName = decodeURI ( activeDocument.name );
docName = docName.match( /(.*)(\.[^\.]+)/ ) ? docName = docName.match( /(.*)(\.[^\.]+)/ ) : docName = [ docName, docName, undefined ];
var saveName = docName[ 1 ]; // activeDocument name with out ext
var files = saveFolder.getFiles( saveName + '*.' + saveExt );// get an array of files matching doc name prefix

if( files.length == 0 ) {  // no file with that name so start at one
   var saveNumber = 1; 
}

if( files.length == 1 ) { // one file found, see if it has a sufix
   var fileName = decodeURI ( files[ 0 ].name );
   fileName = fileName.match( /(.*)(\.[^\.]+)/ ) ? fileName = fileName.match( /(.*)(\.[^\.]+)/ ) : fileName = [ fileName, fileName, undefined ];
   if( fileName[1].match( /_(\d{3})$/ ) == null ){
      var saveNumber = 1;// does not have sufix so set to one
   } else{// has sufix
      var saveNumber = Number( fileName[ 1 ].match( /_(\d{3})$/ )[1] ) + 1; // strip the ext and get the sufix , convert to number and add 1
   }
}

if( files.length > 1 ){
   files.sort();
   var fileName = decodeURI ( files[ files.length -1 ].name );
   fileName = fileName.match( /(.*)(\.[^\.]+)/ ) ? fileName = fileName.match( /(.*)(\.[^\.]+)/ ) : fileName = [ fileName, fileName, undefined ];
   var saveNumber = Number( fileName[ 1 ].match( /_(\d{3})$/ )[1] ) + 1; // strip the ext and get the sufix , convert to number and add 1
}
var saveFile = new File( saveFolder + '/' + saveName + '_' + zeroPad( saveNumber, saveSufixLength ) + '.' + saveExt );
app.activeDocument.saveAs( saveFile, pngOpts ,true ,Extension.LOWERCASE);