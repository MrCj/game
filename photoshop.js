/*  photoshop  */
function createFile(fileName)
{
    var idMk = charIDToTypeID( "Mk  " );
        var desc1 = new ActionDescriptor();
        var idNw = charIDToTypeID( "Nw  " );
            var desc2 = new ActionDescriptor();
            var idNm = charIDToTypeID( "Nm  " );
            desc2.putString( idNm, fileName );
            var idMd = charIDToTypeID( "Md  " );
            var idRGBM = charIDToTypeID( "RGBM" );
            desc2.putClass( idMd, idRGBM );
            var idWdth = charIDToTypeID( "Wdth" );
            var idRlt = charIDToTypeID( "#Rlt" );
            desc2.putUnitDouble( idWdth, idRlt, 1.000000 );
            var idHght = charIDToTypeID( "Hght" );
            var idRlt = charIDToTypeID( "#Rlt" );
            desc2.putUnitDouble( idHght, idRlt, 1.000000 );
            var idRslt = charIDToTypeID( "Rslt" );
            var idRsl = charIDToTypeID( "#Rsl" );
            desc2.putUnitDouble( idRslt, idRsl, 1.000000 ); // normal 72
            var idpixelScaleFactor = stringIDToTypeID( "pixelScaleFactor" );
            desc2.putDouble( idpixelScaleFactor, 1.000000 );
            var idFl = charIDToTypeID( "Fl  " );
            var idFl = charIDToTypeID( "Fl  " );
            var idTrns = charIDToTypeID( "Trns" );
            desc2.putEnumerated( idFl, idFl, idTrns );
            var idDpth = charIDToTypeID( "Dpth" );
            desc2.putInteger( idDpth, 8 );
            var idprofile = stringIDToTypeID( "profile" );
            desc2.putString( idprofile, "sRGB IEC61966-2.1" );
        var idDcmn = charIDToTypeID( "Dcmn" );
        desc1.putObject( idNw, idDcmn, desc2 );
    executeAction( idMk, desc1, DialogModes.NO );
}

function changeSize(newWidth, newHeight)
{
    var idCnvS = charIDToTypeID( "CnvS" );
        var desc3 = new ActionDescriptor();
        var idRltv = charIDToTypeID( "Rltv" );
        desc3.putBoolean( idRltv, true );
        var idWdth = charIDToTypeID( "Wdth" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc3.putUnitDouble( idWdth, idPxl, newWidth );
        var idHght = charIDToTypeID( "Hght" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc3.putUnitDouble( idHght, idPxl, newHeight );
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idHrzL = charIDToTypeID( "HrzL" );
        var idLeft = charIDToTypeID( "Left" );
        desc3.putEnumerated( idHrzn, idHrzL, idLeft );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idVrtL = charIDToTypeID( "VrtL" );
        var idTop = charIDToTypeID( "Top " );
        desc3.putEnumerated( idVrtc, idVrtL, idTop );
    executeAction( idCnvS, desc3, DialogModes.NO );
}

function copyTransparent(filePath)
{
    // ================== open file
    var idOpn = charIDToTypeID( "Opn " );
        var desc1 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
        desc1.putPath( idnull, new File( filePath ) );
    executeAction( idOpn, desc1, DialogModes.NO );
    
    // ================== duplicate layer
    var idDplc = charIDToTypeID( "Dplc" );
        var desc2 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref1 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref1.putEnumerated( idLyr, idOrdn, idTrgt );
        desc2.putReference( idnull, ref1 );
        var idVrsn = charIDToTypeID( "Vrsn" );
        desc2.putInteger( idVrsn, 2 );
    executeAction( idDplc, desc2, DialogModes.NO );
    
    // ==================
    var idHd = charIDToTypeID( "Hd  " );
        var desc3 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var list1 = new ActionList();
                var ref2 = new ActionReference();
                var idLyr = charIDToTypeID( "Lyr " );
                var idBckg = charIDToTypeID( "Bckg" );
                ref2.putProperty( idLyr, idBckg );
            list1.putReference( ref2 );
        desc3.putList( idnull, list1 );
    executeAction( idHd, desc3, DialogModes.NO );
    
    // ================== select range with magicWand at point (0,0)
    var idsetd = charIDToTypeID( "setd" );
        var desc4 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref3 = new ActionReference();
            var idChnl = charIDToTypeID( "Chnl" );
            var idfsel = charIDToTypeID( "fsel" );
            ref3.putProperty( idChnl, idfsel );
        desc4.putReference( idnull, ref3 );
        var idT = charIDToTypeID( "T   " );
            var desc5 = new ActionDescriptor();
            var idHrzn = charIDToTypeID( "Hrzn" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc5.putUnitDouble( idHrzn, idPxl, 0.000000 );
            var idVrtc = charIDToTypeID( "Vrtc" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc5.putUnitDouble( idVrtc, idPxl, 0.000000 );
        var idPnt = charIDToTypeID( "Pnt " );
        desc4.putObject( idT, idPnt, desc5 );
        var idTlrn = charIDToTypeID( "Tlrn" );
        desc4.putInteger( idTlrn, 1 );
        var idCntg = charIDToTypeID( "Cntg" );
        desc4.putBoolean( idCntg, false );
    executeAction( idsetd, desc4, DialogModes.NO );
    
    // ================== delete
    var idDlt = charIDToTypeID( "Dlt " );
    executeAction( idDlt, undefined, DialogModes.NO );
    
    // ==================
    var idslct = charIDToTypeID( "slct" );
        var desc6 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref4 = new ActionReference();
            var idmarqueeRectTool = stringIDToTypeID( "marqueeRectTool" );
            ref4.putClass( idmarqueeRectTool );
        desc6.putReference( idnull, ref4 );
        var iddontRecord = stringIDToTypeID( "dontRecord" );
        desc6.putBoolean( iddontRecord, true );
        var idforceNotify = stringIDToTypeID( "forceNotify" );
        desc6.putBoolean( idforceNotify, true );
    executeAction( idslct, desc6, DialogModes.NO );
    
    // ==================
    var idsetd = charIDToTypeID( "setd" );
        var desc7 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref5 = new ActionReference();
            var idChnl = charIDToTypeID( "Chnl" );
            var idfsel = charIDToTypeID( "fsel" );
            ref5.putProperty( idChnl, idfsel );
        desc7.putReference( idnull, ref5 );
        var idT = charIDToTypeID( "T   " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idNone = charIDToTypeID( "None" );
        desc7.putEnumerated( idT, idOrdn, idNone );
    executeAction( idsetd, desc7, DialogModes.NO );
    
    // ================== 
    var idsetd = charIDToTypeID( "setd" );
        var desc8 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref6 = new ActionReference();
            var idChnl = charIDToTypeID( "Chnl" );
            var idfsel = charIDToTypeID( "fsel" );
            ref6.putProperty( idChnl, idfsel );
        desc8.putReference( idnull, ref6 );
        var idT = charIDToTypeID( "T   " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idAl = charIDToTypeID( "Al  " );
        desc8.putEnumerated( idT, idOrdn, idAl );
    executeAction( idsetd, desc8, DialogModes.NO );
    
    // ================== copy
    var idcopy = charIDToTypeID( "copy" );
    executeAction( idcopy, undefined, DialogModes.NO );
    
   /* // ================== past
    var idpast = charIDToTypeID( "past" );
        var desc9 = new ActionDescriptor();
        var idAntA = charIDToTypeID( "AntA" );
        var idAnnt = charIDToTypeID( "Annt" );
        var idAnno = charIDToTypeID( "Anno" );
        desc9.putEnumerated( idAntA, idAnnt, idAnno );
    executeAction( idpast, desc9, DialogModes.NO );*/
    
    // ================== close
    var idCls = charIDToTypeID( "Cls " );
        var desc10 = new ActionDescriptor();
        var idSvng = charIDToTypeID( "Svng" );
        var idYsN = charIDToTypeID( "YsN " );
        var idN = charIDToTypeID( "N   " );
        desc10.putEnumerated( idSvng, idYsN, idN );
    executeAction( idCls, desc10, DialogModes.NO );
}

function paste(posX, posY)
{
    // ================== paste
    var idpast = charIDToTypeID( "past" );
        var desc14 = new ActionDescriptor();
        var idAntA = charIDToTypeID( "AntA" );
        var idAnnt = charIDToTypeID( "Annt" );
        var idAnno = charIDToTypeID( "Anno" );
        desc14.putEnumerated( idAntA, idAnnt, idAnno );
    executeAction( idpast, desc14, DialogModes.NO );
    
    // =======================================================
    var idslct = charIDToTypeID( "slct" );
        var desc15 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref9 = new ActionReference();
            var idmoveTool = stringIDToTypeID( "moveTool" );
            ref9.putClass( idmoveTool );
        desc15.putReference( idnull, ref9 );
        var iddontRecord = stringIDToTypeID( "dontRecord" );
        desc15.putBoolean( iddontRecord, true );
        var idforceNotify = stringIDToTypeID( "forceNotify" );
        desc15.putBoolean( idforceNotify, true );
    executeAction( idslct, desc15, DialogModes.NO );
    
    // ================== moce to pos
    var idmove = charIDToTypeID( "move" );
        var desc16 = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
            var ref10 = new ActionReference();
            var idLyr = charIDToTypeID( "Lyr " );
            var idOrdn = charIDToTypeID( "Ordn" );
            var idTrgt = charIDToTypeID( "Trgt" );
            ref10.putEnumerated( idLyr, idOrdn, idTrgt );
        desc16.putReference( idnull, ref10 );
        var idT = charIDToTypeID( "T   " );
            var desc17 = new ActionDescriptor();
            var idHrzn = charIDToTypeID( "Hrzn" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc17.putUnitDouble( idHrzn, idPxl, posX );
            var idVrtc = charIDToTypeID( "Vrtc" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc17.putUnitDouble( idVrtc, idPxl, posY );
        var idOfst = charIDToTypeID( "Ofst" );
        desc16.putObject( idT, idOfst, desc17 );
    executeAction( idmove, desc16, DialogModes.NO );
}

function save(path)
{
    var idsave = charIDToTypeID( "save" );
        var desc18 = new ActionDescriptor();
        var idAs = charIDToTypeID( "As  " );
            var desc19 = new ActionDescriptor();
            var idPGIT = charIDToTypeID( "PGIT" );
            var idPGIT = charIDToTypeID( "PGIT" );
            var idPGIN = charIDToTypeID( "PGIN" );
            desc19.putEnumerated( idPGIT, idPGIT, idPGIN );
            var idPNGf = charIDToTypeID( "PNGf" );
            var idPNGf = charIDToTypeID( "PNGf" );
            var idPGAd = charIDToTypeID( "PGAd" );
            desc19.putEnumerated( idPNGf, idPNGf, idPGAd );
        var idPNGF = charIDToTypeID( "PNGF" );
        desc18.putObject( idAs, idPNGF, desc19 );
        var idIn = charIDToTypeID( "In  " );
        desc18.putPath( idIn, new File( path ) );
        var idCpy = charIDToTypeID( "Cpy " );
        desc18.putBoolean( idCpy, true );
    executeAction( idsave, desc18, DialogModes.NO );
    
    
    // ================== close
    var idCls = charIDToTypeID( "Cls " );
        var desc10 = new ActionDescriptor();
        var idSvng = charIDToTypeID( "Svng" );
        var idYsN = charIDToTypeID( "YsN " );
        var idN = charIDToTypeID( "N   " );
        desc10.putEnumerated( idSvng, idYsN, idN );
    executeAction( idCls, desc10, DialogModes.NO );
}

function crop(w, h)
{
    if (w <= 0 || h <= 0)
        return;
    var idCrop = charIDToTypeID( "Crop" );
        var desc2 = new ActionDescriptor();
        var idT = charIDToTypeID( "T   " );
            var desc3 = new ActionDescriptor();
            var idTop = charIDToTypeID( "Top " );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc3.putUnitDouble( idTop, idPxl, 0.000000 );
            var idLeft = charIDToTypeID( "Left" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc3.putUnitDouble( idLeft, idPxl, 0.000000 );
            var idBtom = charIDToTypeID( "Btom" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc3.putUnitDouble( idBtom, idPxl, h );
            var idRght = charIDToTypeID( "Rght" );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc3.putUnitDouble( idRght, idPxl, w );
        var idRctn = charIDToTypeID( "Rctn" );
        desc2.putObject( idT, idRctn, desc3 );
        var idAngl = charIDToTypeID( "Angl" );
        var idAng = charIDToTypeID( "#Ang" );
        desc2.putUnitDouble( idAngl, idAng, 0.000000 );
        var idWdth = charIDToTypeID( "Wdth" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc2.putUnitDouble( idWdth, idPxl, 0.000000 );
        var idHght = charIDToTypeID( "Hght" );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc2.putUnitDouble( idHght, idPxl, 0.000000 );
        var idRslt = charIDToTypeID( "Rslt" );
        var idRsl = charIDToTypeID( "#Rsl" );
        desc2.putUnitDouble( idRslt, idRsl, 0.000000 );
    executeAction( idCrop, desc2, DialogModes.NO );
}


/*  logic  */
function sortFnc(a, b)
{
    function indexed(name)
    {
        if (name == "n")
            return 8;
        if (name == "ne")
            return 7;
        if (name == "e")
            return 6;
        if (name == "se")
            return 5;
        if (name == "s")
            return 4;
        if (name == "sw")
            return 3;
        if (name == "w")
            return 2;
        if (name == "nw")
            return 1;
        return 0;
    }
    
    if (a.type != b.type)
        return 1;
    if (a.process != b.process)
        return 1;    
    if (a.dir != b.dir)
        return indexed(b.dir) - indexed(a.dir);
    return a.index - b.index;
}

function prepareStr(str)
{
    var res = {src: str};
    str = str.toString();
    var filename = str.replace(/^.*[\\\/]/, '');
    filename = filename.substr(0, filename.lastIndexOf("."));
    
    res.process = filename.substr(0, filename.lastIndexOf("%20"));
    var buf = filename.substr(filename.lastIndexOf("%20")+3);
    res.dir = buf.substr(0, buf.search(/\d/));
    res.index = buf.substr(buf.search(/\d/),  buf.length);
    res.index = parseInt(res.index.substr(2,4));   
    //alert(res.type + "\n" + res.process + "\n" + res.dir + "\n" + res.index);
    return res;
}

function main()
{
    var buf = prompt("INPUT FOLDERS COUNT","1");
    var INPUT_FOLDERS = [];
    for (var i=0; i<buf; i++)
        INPUT_FOLDERS.push(prompt("INPUT FOLDER "+i,""));
    var OUTPUT_FOLDERS = prompt("OUTPUT FOLDER","");
    var FILE_MASK = prompt("MASK","*.*");
    var FILES = [];
    var SPRITE_SIZE = {w: 128, h: 128, wDiv2: 64, hDiv2: 64};
           
    for (var i in  INPUT_FOLDERS) // get all files
    {        
		var folder = Folder(INPUT_FOLDERS[i]);
        var files = folder.getFiles(FILE_MASK);
        
		for (var i=0, iLength=files.length; i<iLength; i++)
            FILES.push( prepareStr(files[i]) );
    }
    
    //sort files
    FILES = FILES.sort(sortFnc);
        
    createFile("newFile_1");
    changeSize(SPRITE_SIZE.w-1, SPRITE_SIZE.h-1);
  
    var tempType = "";
    var temDir = "";
    var file;
    var posX = -SPRITE_SIZE.w*15 + SPRITE_SIZE.wDiv2, posY = -SPRITE_SIZE.h*4 - SPRITE_SIZE.hDiv2;
    var allWidth = SPRITE_SIZE.w;
    var k=0;
    for (var i=0, iLength=FILES.length; i<iLength; i++)
    {
        file = FILES[i];
        
        if (tempType != file.process)
        {
            tempType = file.process;
            crop(k*SPRITE_SIZE.w, SPRITE_SIZE.h*8);
            save( OUTPUT_FOLDERS );
            createFile("newFile_" + file.process);
            changeSize(SPRITE_SIZE.w*30, SPRITE_SIZE.h*8);
            posX = -SPRITE_SIZE.w*15 + SPRITE_SIZE.wDiv2;
            posY = -SPRITE_SIZE.h*4 - SPRITE_SIZE.hDiv2;
            allWidth = SPRITE_SIZE.w;
            temDir="";
        }
        if (file.dir != temDir)
        {
            k=0;
            temDir = file.dir;
            posY += SPRITE_SIZE.h;
            posX = -SPRITE_SIZE.w*15 + SPRITE_SIZE.wDiv2;
        }
        copyTransparent(file.src);
        paste(posX, posY);
        posX += SPRITE_SIZE.w;
        k++;
    }
    crop(k*SPRITE_SIZE.w, SPRITE_SIZE.h*8);
    save( OUTPUT_FOLDERS );
    
    
    alert("finish!");
}

main();