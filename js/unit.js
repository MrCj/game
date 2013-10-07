var Unit = function (unitType, cellX, cellY, x, y)
{
    var type;
    
    this.posX = x;
    this.posY = y;
    this.direction=CONFIG.direction.north;
    
    this.mapCell = { x: cellX, y: cellY, cell: (Map.map[cellX][cellY])};
    this.cellArrPos = this.mapCell.cell.units.length;
    this.mapCell.cell.units.push(this);
    
    this.path = [];
    this.pathPos = 0;
    
    this.imgInfo = CONFIG.unitImgInfo(unitType);
    this.imgInfo.img = resources.get( this.imgInfo.img );
    this.imgInfo.spriteFrame = 0; // direction:  0 == right, 1 == left;
    this.time = 0;
    this.goTo = function (cellX, cellY)
    {
        this.path = findPath(this.mapCell.x, this.mapCell.y, cellX, cellY);
        this.pathPos = 0;
    }
    
    this.recalc = function (dt)
    {
        /*  move unit   */
        //begin
        if (this.path.length == 0)
            return;
        if (this.pathPos >= this.path.length-1)
            return;
        		
        //var k = dt /1000;
		var k = 0.04;
        var A_X = this.path[this.pathPos].x;
        var A_Y = this.path[this.pathPos].y;
        var B_X = this.path[this.pathPos+1].x;
        var B_Y = this.path[this.pathPos+1].y;
                
		var bufX = (B_Y & 1)? 0 : 1; // (B_Y % 2 == 1) === (B_Y & 1)
        
        if (A_X == B_X && A_Y-2 == B_Y)
        {
            this.direction = CONFIG.direction.north;
            this.posY -= k * CONFIG.unitSpeed.y;
        }
        else if (A_X == B_X && A_Y+2 == B_Y)
        {
            this.direction = CONFIG.direction.south;
            this.posY += k * CONFIG.unitSpeed.y;
        }
        else if (A_X+bufX == B_X && A_Y-1 == B_Y)
        {
            this.direction = CONFIG.direction.north_east;
            this.posX += k * CONFIG.unitSpeed.x;
            this.posY -= k * CONFIG.unitSpeed.y;
        }
        else if (A_X+bufX == B_X && A_Y+1 == B_Y)
        {
            this.direction = CONFIG.direction.south_east;
            this.posX += k * CONFIG.unitSpeed.x;
            this.posY += k * CONFIG.unitSpeed.y;
        }
        else if (A_X+1 == B_X && A_Y == B_Y)
        {
            this.direction = CONFIG.direction.east;
            this.posX += k * CONFIG.unitSpeed.x;
        }
        else if (A_X-1+bufX == B_X && A_Y-1 == B_Y)
        {
            this.direction = CONFIG.direction.north_west;
            this.posX -= k * CONFIG.unitSpeed.x;
            this.posY -= k * CONFIG.unitSpeed.y;
        }
        else if (A_X-1+bufX == B_X && A_Y+1 == B_Y)
        {
            this.direction = CONFIG.direction.south_west;
            this.posX -= k * CONFIG.unitSpeed.x;
            this.posY += k * CONFIG.unitSpeed.y;
        }
        else if (A_X-1 == B_X && A_Y == B_Y)
        {
            this.direction = CONFIG.direction.west;
            this.posX -= k * CONFIG.unitSpeed.x;
        }
        
		var bufCell = Map.getCell(this.posX, this.posY, true);
		if (bufCell.x != this.mapCell.x || bufCell.y != this.mapCell.y)
		{
            var bufMapCell = Map.map[ B_X ][ B_Y ];
			if ( Math.abs(bufMapCell.x - this.posX + CONFIG.cellSize.wDiv2) <= 2 && Math.abs(bufMapCell.y - this.posY + CONFIG.cellSize.hDiv2) <= 2)
            {				
                this.posX = bufMapCell.x + CONFIG.cellSize.wDiv2;
                this.posY = bufMapCell.y + CONFIG.cellSize.hDiv2;				
				
                this.mapCell.cell.units.splice(this.cellArrPos, 1);
                this.mapCell.cell = Map.getCell(this.posX, this.posY, true).cell;
                this.cellArrPos = this.mapCell.cell.units.length;
                this.mapCell.cell.units.push(this);
                this.pathPos++;
            }
		}        
        //end
        
        this.time += dt;
        if (this.time >= this.imgInfo.spriteSpeed)
        {
            this.time -= this.imgInfo.spriteSpeed;
            if (this.imgInfo.spriteFrame < this.imgInfo.spriteAnimCount-1)
                this.imgInfo.spriteFrame++;
            else
                this.imgInfo.spriteFrame = 0;
        }        
    }

    this.draw = function (ctx, windowPosX, windowPosY)
    {
		
		var x = this.posX - windowPosX;
		var y = this.posY - windowPosY;
		// here draw logic
        
		ctx.drawImage(  this.imgInfo.img, // img
						this.imgInfo.spriteFrame * this.imgInfo.spriteW, this.direction * this.imgInfo.spriteH, // get part img from x,y
						this.imgInfo.spriteW, this.imgInfo.spriteH,  // get part img with w,h
						this.posX - windowPosX, this.posY - windowPosY, // put img to x,y
						this.imgInfo.spriteW, this.imgInfo.spriteH // put img with w,h
		);
		
		
    }
}