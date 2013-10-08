var Building = function (buildingType, imgPos, cellX, cellY, x, y)
{
    var type = buildingType;
        
    this.cellX = cellX;
    this.cellY = cellY;
    
    this.imgData = CONFIG.buildingImgInfo(buildingType);
        this.imgData.drawX += x;
        this.imgData.drawY += y;
    this.img = resources.get( this.imgData.img[imgPos] );
    
	this.setFlatMode = function(flat)
	{
		if (flat)
			this.buildingZone = this.imgData.zone.flat;
		else
			this.buildingZone = this.imgData.zone.normal;
		this.spriteFrame.y = this.buildingZone.y;
		this.spriteFrame.x = this.buildingZone.x;
		this.spriteFrame.pos = 0;
	}
    
    this.buildingZone = this.imgData.zone.normal;
    this.time = 0;
    this.spriteFrame = {pos: 0, x: this.buildingZone.x, y: this.buildingZone.y};
    
    this.recalc = function(dt)
    {   
        this.time += dt;
        if (this.buildingZone.count < 2)
        {
            this.time = 0;
            return;
        }
        if (this.time >= this.buildingZone.speed)
        {
            this.time -= this.buildingZone.speed;
            if (this.spriteFrame.pos < this.buildingZone.count-1)
            {
                this.spriteFrame.pos++;
                this.spriteFrame.x += this.imgData.spriteW;
            }
            else
            {
                this.spriteFrame.pos = 0;
                this.spriteFrame.x = this.buildingZone.x;
            }
        }        
    }    

    this.draw = function (ctx, windowPosX, windowPosY)
    {
		
		var x = this.imgData.drawX - windowPosX;
		var y = this.imgData.drawY - windowPosY;
		// here draw logic
        
		ctx.drawImage(  this.img, // img
						this.spriteFrame.x, this.spriteFrame.y, // get part img from x,y
						this.imgData.spriteW, this.imgData.spriteH,  // get part img with w,h
						x, y, // put img to x,y
						this.imgData.spriteW, this.imgData.spriteH // put img with w,h
		);
		
		
    }
}