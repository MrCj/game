var requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();
window.oncontextmenu = function (){return false;} // disable context menu

var canvas;
var miniCanvas;
$(document).ready(function(){    
    createMenu();
    canvas = document.createElement("canvas");
    canvas.width = 800;//WINDOW_SIZE.width;
    canvas.height = 600;//WINDOW_SIZE.height;
    document.body.appendChild(canvas);

    miniCanvas = document.createElement("canvas");
    miniCanvas.width = 300;//WINDOW_SIZE.width;
    miniCanvas.height = 200;//WINDOW_SIZE.height;
    document.body.appendChild(miniCanvas);

    document.body.addEventListener('keydown', onKeyDown, false);
    document.body.addEventListener('keypress', onKeyPress, false);
    canvas.addEventListener('mouseup', onMouseUpFunc, false);
    canvas.addEventListener('mousemove', onMouseMove, false);
    miniCanvas.addEventListener('click', onMinimapClick, false);

    Map.init(canvas, miniCanvas, CONFIG.game.countCellX, CONFIG.game.countCellY);
    Map.setWindowSize(canvas.width, canvas.height);
    Map.moveWindow(0, 0);

    resources.onReady(function()
    {
        Map.setBGImage(resources.get("img/mask.png"), resources.get("img/bg.png") );
        main();
    });
    
    // load img begin
    var buf = [];
    var buf2;
    for (var i in CONFIG.buildingType)
    {
        buf2 = CONFIG.buildingImgInfo(CONFIG.buildingType[i]);
        for (var j=0; j< buf2.imgCount; j++)
            buf.push(buf2.img[j]);
    }
    buf.push("img/mask.png");
    buf.push("img/man5.png");
    buf.push("img/bg.png");
    buf.push("img/grass2.png");
    resources.load(buf);
    delete buf;
    delete buf2;
    // load img end
    
});
var dt;
var lastTime = getTime();

var buildPrev = {draw:false, type:-1};
var flatMode = false;

function main()
{
    var t = getTime(); // calc time delay
    dt = t - lastTime;
    lastTime = t;
    
    Map.recalc(dt); // recalc game
    Map.draw(resources.get("img/grass2.png")); // draw game
    
    $(".fps").text("fps: " + Math.floor(1000/dt)); // print fps
    $(".time").text((getTime() - t) + "ms");
    requestAnimFrame(main);
}

function onKeyDown(e) // move map
{
    var code = (e.keyCode ? e.keyCode : e.which);
    if(code == 37) { //left arrow
        Map.moveWindow(-10)
    }else if(code == 38) { //up arrow
        Map.moveWindow("", -10)
    }else if(code == 39) { //right arrow
        Map.moveWindow(10)
    }else if(code == 40) { //down arrow
        Map.moveWindow("", 10)
    }
}
function onMouseMove(e)
{
    if (buildPrev.draw)
        Map.enableDrawBuildPrev(buildPrev.type, e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
}	
function onMouseUpFunc(e) // click to map
{
    if (e.button == 2)//right button
    {
        buildPrev.draw = false;
        Map.disableDrawBuildPrev();
        return;
    }
    if (e.button == 0)//left button
    {
        if (buildPrev.draw) // create building
        {
            var cell = Map.getCell(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
            Map.createBuilding(buildPrev.type, cell.x, cell.y);
            buildPrev.draw = false;
            Map.disableDrawBuildPrev();
            return;
        }
        //get building info
        Map.getBuildInfo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
    }
}
    
function onMinimapClick(e) // minimap ckicked
{
    Map.minimapClick(e.pageX - miniCanvas.offsetLeft, e.pageY - miniCanvas.offsetTop);
}

function blockClick(type)
{
    buildPrev.draw = true;
    buildPrev.type = type;        
}

function onKeyPress(e)
{
    if (e.charCode == 32) //пробіл
    {
        flatMode = !flatMode;
        Map.setFlatMode(flatMode);
    }
}

function createMenu()
{
    for (var i in CONFIG.buildingType)
    {
        $(".buildings").append('<div class="block" onclick="blockClick('+CONFIG.buildingType[i]+')">\
                <div class="title">'+i+'</div>\
                <div class="img" style="background-image:url(\''+ CONFIG.buildingImgInfo(CONFIG.buildingType[i]).img[0] +'\')"></div>\
                <div class="descr">descr</div>\
            </div>');
    }
}