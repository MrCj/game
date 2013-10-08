(function ()
{
    var canvas;
	var ctx;
    // minimap
    var minimapCanvas;
    var minimapCtx;
    var cellCountX;
    var cellCountY;
    var bgMinimapImg;
    var minimapRec;

    var bgImg;

    var windowSize = {};
    var map;
    var mapSize = {};
	var flatMode = false;

    var drawCell = {};

    var drawBuildPrev = {};
    
    var buildings = [];
    var units = [];

    function init(canvas, minimapCanvas, cellCountX, cellCountY)
    {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
        this.minimapCanvas = minimapCanvas;
        this.minimapCtx = minimapCanvas.getContext("2d");

        this.cellCountX = cellCountX +CONFIG.game.cellDraw;
        this.cellCountY = cellCountY +CONFIG.game.cellDraw;
        this.windowSize = {}; // ?
        this.drawCell = {}; // ?
        this.windowSize.x = 0;
        this.windowSize.y = 0;
        this.mapSize = {};
        this.mapSize.width = cellCountX * CONFIG.cellSize.width;
        this.mapSize.height = cellCountY * CONFIG.cellSize.hDiv2;
        this.minimapRec = {};
        this.buildings = [];
        this.units = [];

        this.map = new Array(this.cellCountX +CONFIG.game.cellDraw);
        for (var i=-CONFIG.game.cellDraw; i<this.cellCountX; i++)//create map
        {
            this.map[i] = new Array(this.cellCountY +2);
            for (var j=-CONFIG.game.cellDraw; j<this.cellCountY; j++)
            {
                this.map[i][j] = {bold: false, building: null, units: []};
                this.map[i][j].x = ((j&1)? CONFIG.cellSize.wDiv2 : 0) + (i * CONFIG.cellSize.width);
                this.map[i][j].y = j * CONFIG.cellSize.hDiv2;
            }
        }

        for (var i=-CONFIG.game.cellDraw; i<this.cellCountX; i++)
        {
            for (var j=1; j<=CONFIG.game.cellDraw; j++)
            {
                this.map[i][-j].bold = true;
                this.map[i][this.cellCountY-j].bold = true;
            }            
        }
        for (var i=-CONFIG.game.cellDraw; i<this.cellCountY; i++)
        {            
            for (var j=1; j<=CONFIG.game.cellDraw; j++)
            {
                this.map[-j][i].bold = true;
                this.map[this.cellCountX-j][i].bold = true;
            }
        }
		
		this.drawBuildPrev = {draw: false};
    }

    function drawMinimap()
    {
        this.minimapCtx.fillStyle = this.bgMinimapImgPattern;
        this.minimapCtx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

        this.minimapCtx.beginPath();
        this.minimapCtx.rect(this.minimapRec.x, this.minimapRec.y, this.minimapRec.width, this.minimapRec.height);
        this.minimapCtx.lineWidth = 1;
        this.minimapCtx.strokeStyle = 'black';
        this.minimapCtx.stroke();
    }

    function setWindowSize(w, h)
    {
        this.windowSize.w = w;
        this.windowSize.h = h;
        this.drawCell.countX = Math.floor(w / CONFIG.cellSize.width) +2 * CONFIG.game.cellDraw;
        this.drawCell.countY = Math.floor(h / CONFIG.cellSize.hDiv2) +2 + CONFIG.game.cellDraw;

        this.minimapRec.height = Math.floor(h / this.mapSize.height * this.minimapCanvas.height);
        this.minimapRec.width = Math.floor(w / this.mapSize.width * this.minimapCanvas.width);
    }

    function moveWindow(countX, countY)
    {
        if (typeof countX != "undefined" && countX != "")
            this.windowSize.x += countX;
        if (typeof countY != "undefined" && countY != "")
            this.windowSize.y += countY;

        if (this.windowSize.x < 0) this.windowSize.x = 0;
        if (this.windowSize.y < 0) this.windowSize.y = 0;
        if (this.windowSize.x + this.windowSize.w > this.mapSize.width + CONFIG.cellSize.wDiv2)
            this.windowSize.x = this.mapSize.width - this.windowSize.w + CONFIG.cellSize.wDiv2;

        if (this.windowSize.y + this.windowSize.h > this.mapSize.height + CONFIG.cellSize.hDiv2)
            this.windowSize.y = this.mapSize.height - this.windowSize.h + CONFIG.cellSize.hDiv2 -1;

        this.drawCell.x = Math.floor(this.windowSize.x / CONFIG.cellSize.width) -CONFIG.game.cellDraw;
        this.drawCell.y = Math.floor(this.windowSize.y / CONFIG.cellSize.hDiv2) -2;
        this.drawCell.toX = this.drawCell.x + this.drawCell.countX;
        this.drawCell.toY = this.drawCell.y + this.drawCell.countY;

        this.minimapRec.x = Math.floor( this.windowSize.x / this.mapSize.width * this.minimapCanvas.width);
        this.minimapRec.y = Math.floor( this.windowSize.y / this.mapSize.height * this.minimapCanvas.height);
    }

    function minimapClick(x, y)
    {
        x -= this.minimapRec.width / 2;
        y -= this.minimapRec.height / 2;
        this.windowSize.x = Math.floor(x / this.minimapCanvas.width * this.mapSize.width);
        this.windowSize.y = Math.floor(y / this.minimapCanvas.height * this.mapSize.height);
        this.moveWindow(0,0);
    }

    function draw(bufImg)
    {
        this.ctx.fillStyle = this.bgImagePattern;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = "#000";
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        var x=0;
        var y=0;
        var buf=0;
        var startX=0;
        var starty=0;
        
        for (var j=this.drawCell.y; j<this.drawCell.toY; j++)
        {
            y = this.map[0][j].y - this.windowSize.y;
            for (var i=this.drawCell.x; i<this.drawCell.toX; i++)
            {
                x = this.map[i][j].x - this.windowSize.x;

				if (this.map[i][j].bold)
				{
					startX = (this.map[i][j].bold)? CONFIG.cellSize.width : 0;
	
	
					///////////////////////
	
	/*
					this.ctx.drawImage( bufImg, // img
										startX, starty, // get part img from x,y
										CONFIG.cellSize.width, CONFIG.cellSize.height,  // get part img with h,w
										x, y, // put img to x,y
										CONFIG.cellSize.width, CONFIG.cellSize.height // put img with h,w
									  );
					*/
					////////////////////////////////////////////////
					
				}
                
                // draw buildings
                if (this.map[i][j].building)
                {
                    if (j == this.map[i][j].building.cellY &&  i == this.map[i][j].building.cellX)
                        this.map[i][j].building.draw(this.ctx, this.windowSize.x, this.windowSize.y);
                }
                
                for (var u in this.map[i][j].units)
                    this.map[i][j].units[u].draw(this.ctx, this.windowSize.x, this.windowSize.y);
                //this.ctx.fillText(i + " | " + j, x + CONFIG.cellSize.wDiv2, y + CONFIG.cellSize.hDiv2); // 3-4 ms!!! but why?!
            }
        }
		
		
		// draw building prev
		if ( this.drawBuildPrev.draw )
			this.ctx.drawImage( this.drawBuildPrev.img, // img
								this.drawBuildPrev.imgPosX, this.drawBuildPrev.imgPosY, // get part img from x,y
								this.drawBuildPrev.w, this.drawBuildPrev.h,  // get part img with h,w
								this.drawBuildPrev.x, this.drawBuildPrev.y, // put img to x,y
								this.drawBuildPrev.w, this.drawBuildPrev.h // put img with h,w
			);

        this.debug(this.drawCell.x + " | " + this.drawCell.y + " | " + this.drawCell.countX + " | " + this.drawCell.countY);

        this.drawMinimap();
    }

    function getCell(origX, origY, global)
    {
        var x = origX;
        var y = origY;
        if (typeof global == "undefined" || global == false)
        {
            x += this.windowSize.x;
            y += this.windowSize.y;
        }
        
        var i = Math.floor(x / CONFIG.cellSize.width);
        var j = Math.floor(y / CONFIG.cellSize.height);

        var dx = x - i*CONFIG.cellSize.width;
        var dy = y - j*CONFIG.cellSize.height;

        j *= 2;

        do{
            if (CONFIG.cellSize.wDiv2 * (dy - CONFIG.cellSize.hDiv2) + CONFIG.cellSize.hDiv2 * dx  < 0)
            {
                i--;
                j--;
                break;
            }
            if (CONFIG.cellSize.wDiv2 * dy - CONFIG.cellSize.hDiv2 * (dx - CONFIG.cellSize.wDiv2) < 0)
            {
                j--;
                break;
            }
            if (CONFIG.cellSize.wDiv2 * (dy - CONFIG.cellSize.hDiv2) + CONFIG.cellSize.hDiv2 * (dx - CONFIG.cellSize.width)  > 0)
            {
                j++;
                break;
            }
            if (CONFIG.cellSize.wDiv2 * (dy - CONFIG.cellSize.hDiv2) - CONFIG.cellSize.hDiv2 * dx  > 0)
            {
                i--;
                j++;
                break;
            }
        } while (0);
        return {x:i, y:j, cell:this.map[i][j]};
    }

    function setBGImage(clickedCellMask, img)
    {
        this.bgImagePattern = this.ctx.createPattern(img, "repeat");
        this.bgMinimapImgPattern = this.minimapCtx.createPattern(img, "repeat");
        this.bgImg = img;
    }

    function debug(data)
    {
		this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(data, 0, 10);
    }

    function enableDrawBuildPrev(buildType, x, y)
    {
		var bufImg = CONFIG.buildingImgInfo(buildType);
        this.drawBuildPrev.x = x + bufImg.drawX - CONFIG.cellSize.wDiv2;
        this.drawBuildPrev.y = y + bufImg.drawY + CONFIG.cellSize.hDiv2;
        
		var cell = this.getCell(x, y);
        if ( this.checkBuilding(buildType, cell.x, cell.y) )
        {
            this.drawBuildPrev.imgPosY = bufImg.zone[CONFIG.buildingImgZone.build_normal].y;
            this.drawBuildPrev.imgPosX = bufImg.zone[CONFIG.buildingImgZone.build_normal].x;
        } else
        {
            this.drawBuildPrev.imgPosY = bufImg.zone[CONFIG.buildingImgZone.build_bad].y;
            this.drawBuildPrev.imgPosX = bufImg.zone[CONFIG.buildingImgZone.build_bad].x;
        }
        if (this.drawBuildPrev.draw && buildType == this.drawBuildPrev.type)
            return;
        
        var bufBuild = CONFIG.buildingCellInfo(buildType);
        
        this.drawBuildPrev.type = buildType;
        this.drawBuildPrev.imgPos = rand(1, bufImg.imgCount) -1;
        this.drawBuildPrev.img = resources.get( bufImg.img[ this.drawBuildPrev.imgPos ] );
        this.drawBuildPrev.w = bufImg.spriteW;
        this.drawBuildPrev.h = bufImg.spriteH;
        
		this.drawBuildPrev.draw = true;
    }
	
	function disableDrawBuildPrev()
	{
		this.drawBuildPrev.draw = false;
	}

	function checkBuilding(buildType, cellX, cellY)
	{
		var buf;
		var moveCellBuff = (cellY % 2 == 0)? 0 : 1;
        var buildCell = CONFIG.buildingCellInfo(buildType);
		
		// check
		
        for (var i=0, mapJ=cellY +1+buildCell.y; i<buildCell.h; i++, mapJ++)
        {
			buf = (i & 1)? moveCellBuff : 0;
            for (var j=0, mapI=cellX +1+buf+buildCell.x; j<buildCell.w; j++, mapI++)
            {
                if (this.map[mapI] == null)
                    continue;
                if (this.map[mapI][mapJ] == null)
                    continue;
				if (this.map[mapI][mapJ] == null && buildCell.cells[i][j] == 1)
					return false;
                if (buildCell.cells[i][j] == 1 && this.map[mapI][mapJ].bold)
					return false;
            }
        }
		return true;
	}
	
    function createBuilding(buildType, cellX, cellY)
    {
		var y = this.map[cellX][cellY].y + CONFIG.cellSize.height;		
        var x = this.map[cellX][cellY].x;
		
		var buf;
		var moveCellBuff = (cellY & 1)? 1 : 0;
        var buildCell = CONFIG.buildingCellInfo(buildType);
		
		// check
		if (!this.checkBuilding(buildType, cellX, cellY))
			return;
		
		// build
        var imgPos = this.drawBuildPrev.imgPos == null ? 0 : this.drawBuildPrev.imgPos;
        var build = new Building(buildType, imgPos, buildCell.mainCellX+cellX+buildCell.x, buildCell.mainCellY+cellY+buildCell.y, x, y);
        this.buildings.push(build);
        for (var i=0, mapJ=cellY +1+buildCell.y; i<buildCell.h; i++, mapJ++)
        {
			buf = (mapJ & 1)? 0 : moveCellBuff;
            for (var j=0, mapI=cellX +1+buf+buildCell.x; j<buildCell.w; j++, mapI++)
            {
                if (this.map[mapI] == null || this.map[mapI][mapJ] == null || buildCell.cells[i][j] == -1)
                    continue;
                this.map[mapI][mapJ].bold |= buildCell.cells[i][j];
                if (this.map[mapI][mapJ].building != null)
                    if (this.map[mapI][mapJ].building.cellY > build.cellY || (this.map[mapI][mapJ].building.cellY == mapJ && this.map[mapI][mapJ].building.cellX == mapI))
                        continue;
                this.map[mapI][mapJ].building = build;
            }
        }
        this.map[build.cellX][build.cellY].building = build;
    }
	
	function recalc(dt)
	{
        for (var i in this.buildings)
            this.buildings[i].recalc(dt);
        for (var i in this.units)
            this.units[i].recalc(dt);
	}
    
    function getBuildInfo(x, y)
    {
		var cell = this.getCell(x, y).cell;		
		if (this.flatMode)
			if (!cell.bold)
				return null;
        return cell.building;
    }
	
	function setFlatMode(flat)
	{
		if (this.flatMode == flat)
			return;
		for (var i=0, iLength=this.buildings.length; i<iLength; i++)
			this.buildings[i].setFlatMode(flat);
		this.flatMode = flat;
	}

	window.Map = {
        debug: debug,

        init: init,
        setBGImage: setBGImage,

        setWindowSize: setWindowSize,
        moveWindow: moveWindow,
        minimapClick: minimapClick,
		setFlatMode: setFlatMode,

        getCell: getCell,
        drawMinimap: drawMinimap,
        getBuildInfo: getBuildInfo,
				
        enableDrawBuildPrev: enableDrawBuildPrev,
		disableDrawBuildPrev: disableDrawBuildPrev,
		
		checkBuilding: checkBuilding,
        createBuilding: createBuilding,
		
		recalc: recalc,

        draw: draw
    };
})();