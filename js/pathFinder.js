function findPath(startX, startY, endX, endY)
{
	var	abs = Math.abs;
	var	max = Math.max;
	var	pow = Math.pow;
	var	sqrt = Math.sqrt;

	var maxWalkableTileNum = 0;

	var worldWidth = Map.map[0].length;
	var worldHeight = Map.map.length;
	var worldSize =	worldWidth * worldHeight;

	var distanceFunction = ManhattanDistance;
    
	function ManhattanDistance(Point, Goal)
	{
		return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
	}

	function DiagonalDistance(Point, Goal)
	{
		return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
	}

	function EuclideanDistance(Point, Goal)
	{
		return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
	}
	
	function Neighbours(x, y)
	{
        var result = [];
        var N_W=false, N_E = false, S_W=false, S_E = false;
		
		var k = (y & 1)? 1 : 0; // (y % 2 == 1) === (y & 1)
		
        if (!Map.map[x-1 +k][y-1].bold)
        {
            result.push({x:(x-1 +k), y:(y-1)});
            N_W = true;
        }
        if (!Map.map[x +k][y-1].bold)
        {
            result.push({x:x +k, y:(y-1)});
            N_E = true;
        }
        if (!Map.map[x +k][y+1].bold)
        {
            result.push({x:x +k, y:(y+1)});
            S_W = true;
        }
        if (!Map.map[x-1 +k][y+1].bold)
        {
            result.push({x:(x-1 +k), y:(y+1)});
            S_E = true;
        }
        
        if (!Map.map[x][y-2].bold)// N
            if (N_W && N_E)
                result.push({x:x, y:(y-2)});
        
        if (!Map.map[x+1][y].bold)// E
            if (N_E && S_E)
                result.push({x:(x+1), y:y});
        
        if (!Map.map[x][y+2].bold)// S
            if (S_W && S_E)
                result.push({x:x, y:(y+2)});
        
        if (!Map.map[x-1][y].bold)// W
            if (N_W && S_W)
                result.push({x:(x-1), y:y});
        
		return result;        
	}

	function Node(Parent, Point)
	{
		return {
			Parent:Parent,
			value: Point.x + (Point.y * worldWidth), //  переробити ваги клітинок // можливо  добавити можливість мануального задання
			x:Point.x,
			y:Point.y,
			f:0,
			g:0
		};
	}

	function calculatePath()
	{
		var	mypathStart = Node(null, {x:startX, y:startY});
		var mypathEnd = Node(null, {x:endX, y:endY});
		var AStar = new Array(worldSize);
		var Open = [mypathStart];
		var Closed = [];
		var result = [];
		var myNeighbours;
		var myNode;
		var myPath;
		var length, max, min, i, j;
		while(length = Open.length)
		{
			max = worldSize;
			min = -1;
			for(i = 0; i < length; i++)
			{
				if(Open[i].f < max)
				{
					max = Open[i].f;
					min = i;
				}
			}
			myNode = Open.splice(min, 1)[0];
			if(myNode.value === mypathEnd.value)
			{
				myPath = Closed[Closed.push(myNode) - 1];
				do
				{
					result.push({x: myPath.x, y: myPath.y});
				}
				while (myPath = myPath.Parent);
				AStar = Closed = Open = [];
				result.reverse();
			}
			else
			{
				myNeighbours = Neighbours(myNode.x, myNode.y);
				for(i = 0, j = myNeighbours.length; i < j; i++)
				{
					myPath = Node(myNode, myNeighbours[i]);
					if (!AStar[myPath.value])
					{
						myPath.g = myNode.g + distanceFunction(myNeighbours[i], myNode);
						myPath.f = myPath.g + distanceFunction(myNeighbours[i], mypathEnd);
						Open.push(myPath);
						AStar[myPath.value] = true;
					}
				}
				Closed.push(myNode);
			}
		}
		return result;
	}

	return calculatePath();

}