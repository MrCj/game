function getTime()
{
    var d = new Date();
    return d.getTime();
}
function rand(from, to)
{
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

var CONFIG = {
    game: {
        countCellX: 200,
        countCellY: 400,
        cellDraw: 26,
    },
    
    cellSize: {
        width : 44, //px
        height : 32,
        wDiv2 : 22,
        hDiv2 : 16,
    },
    
    buildingType: {
        mill: 0,
        castle: 1,
        house: 2,
        forester: 3
    },
    
    unitType: {
        mill: 0
    },
    
    unitSpeed: { // int k; 
        x: 32, // x, y must be int;
        y: 16 // must: y * k == cellSize.wDiv2 && x * k == cellSize.hDiv2
    },
    
    direction: {
        north: 0,
        north_east: 1,
        east: 2,
        south_east: 3,
        south: 4,
        south_west: 5,
        west: 6,
        north_west: 7
    },
    
    buildingCellInfo: function(type) {
        if (type == this.buildingType.mill)
            return {
                w: 4, h: 12, // size of cellArray
                x: -3, y: -11, // start cell (from central building cell)
                cells: [[-1, -1, 0, -1], // cell bold value (1 if bold | 0 if not bold | -1 nothing) (start from felt top cell)
                        [-1, 0, 0, -1], // 1 == true, 0 == false 
                        [-1, 0, 0, 0],
                        [0, 0, 0, -1],
                        [-1, 0, 0, 0],
                        [0, 0, 0, -1],
                        [-1, 0, 1, 0],
                        [0, 1, 1, -1],
                        [1, 1, 1, 1],
                        [1, 1, 1, -1],
                        [-1, 1, 1, -1],
                        [-1, 1, -1, -1]],                
                mainCellX: 2, mainCellY: 12 // cell when start drawing proccess (usually it's middle bottom cell. but for big building it's central cell)
            };
        else if (type == this.buildingType.castle)
            return {
                w: 8, h: 27,
                x: -5, y: -27,
                cells: [[-1, -1, -1, 0, 0, 0, -1, -1],
                        [-1, -1, -1, 0, 0, -1, -1, -1],
                        [-1, -1, -1, 0, 0, 0, -1, -1],
                        [-1, -1, 0, 0, 0, 0, -1, -1],
                        [-1, -1, 0, 0, 0, 0, 0, -1],
                        [-1, -1, 0, 0, 0, 0, -1, -1],
                        [-1, -1, 0, 0, 0, 0, 0, -1],
                        [-1, -1, 0, 0, 0, 0, -1, -1],
                        [-1, -1, 0, 0, 0, 0, 0, -1],
                        [-1, -1, 0, 0, 0, 0, 0, -1],
                        [-1, -1, 0, 0, 0, 0, 0, 0],
                        [-1, 0, 0, 0, 0, 0, 0, 0],
                        [-1, 0, 0, 0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0, 0, 0, 0],
                        [-1, 0, 0, 0, 1, 0, 0, 0],
                        [0, 0, 0, 1, 1, 0, 0, 0],
                        [-1, 0, 0, 1, 1, 1, 0, 0],
                        [0, 0, 1, 1, 1, 1, 0, 0],
                        [-1, 0, 1, 1, 1, 1, 1, 0],
                        [0, 1, 1, 1, 1, 1, 1, 0],
                        [-1, 1, 1, 1, 1, 1, 1, 1],
                        [-1, 1, 1, 1, 1, 1, 1, -1],
                        [-1, -1, 1, 1, 1, 1, 1, -1],
                        [-1, -1, 1, 1, 1, 1, -1, -1],
                        [-1, -1, -1, 1, 1, 1, -1, -1],
                        [-1, -1, -1, 1, 1, -1, -1, -1],
                        [-1, -1, -1, -1, 1, -1, -1, -1]],                
                mainCellX: 5, mainCellY: 22
            };
        else if (type == this.buildingType.house)
            return {
                w: 5, h: 12,
                x: -3, y: -12,
                cells: [[0,0,-1,-1,-1],
                        [-1,0,0,-1,-1],
                        [0,0,0,-1,-1],
                        [0,0,0,0,-1],
                        [0,0,0,0,-1],
                        [0,0,1,0,0],
                        [0,1,1,0,-1],
                        [0,1,1,1,0],
                        [1,1,1,1,-1],
                        [-1,1,1,1,-1],
                        [-1,1,1,-1,-1],
                        [-1,-1,1,-1,-1]],                
                mainCellX: 3, mainCellY: 10
            };
        else if (type == this.buildingType.forester)
            return {
                w: 4, h:10,
                x: -3, y: -9,
                cells: [[-1,0,0,-1],
                        [-1,0,0,-1],
                        [-1,0,0,0],
                        [0,0,0,0],
                        [-1,0,1,0],
                        [0,1,1,0],
                        [-1,1,1,1],
                        [0,1,1,-1],
                        [-1,1,1,-1],
                        [-1,1,-1,-1]],                
                mainCellX: 2, mainCellY: 10
            };
    },
    
    buildingImgInfo: function(type) {
        if (type == this.buildingType.mill)
            return {
                imgCount: 1,
                img: ["img/mill_1.png"],
                drawX: -87, drawY: -174, // from bottom middle cell
                spriteW: 175, spriteH: 174, // img size
                redZoneX: 0, redZoneY: 0,
                zone: [{x:0, y:174, speed: 50, count: 24}] // x,y - start point of graphic zone; speed of sprite animation; count of sprite
            };
        if (type == this.buildingType.castle)
            return {
                imgCount: 1,
                img: ["img/castle_1.png"],
                drawX: -124, drawY: -428,
                spriteW: 300, spriteH: 420,
                redZoneX: 0, redZoneY: 0,
                zone: [{x:0, y:420, speed: 0, count: 1}]
            };
        if (type == this.buildingType.house)
            return {
                imgCount: 2,
                img: ["img/house_1.png","img/house_2.png"],
                drawX: -66, drawY: -208 ,
                spriteW: 192, spriteH: 207,
                redZoneX: 0, redZoneY: 0,
                zone: [{x:0, y:207, speed: 0, count: 1}]
            };
        if (type == this.buildingType.forester)
            return {
                imgCount: 3,
                img: ["img/forester_1.png","img/forester_2.png","img/forester_3.png"],
                drawX: -55, drawY: -150,
                spriteW: 161, spriteH: 160,
                redZoneX: 0, redZoneY: 0,
                zone: [{x:0, y:160, speed: 0, count: 1}]
            };
    },
    
    unitImgInfo: function(type) {
        if (type == this.buildingType.mill)
            return {
                img: "img/man5.png",
                drawX:0, drawY:-91, // from bottom middle cell
                spriteW: 78, spriteH: 91, // sprite size
                spriteSpeed: 150, // ms per frame    //90
                spriteAnimCount: 4
            };
    }
}