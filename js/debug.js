function debug(str, reset)
{
	if (reset)
		$(".debug").empty();
	if (str.length < 1)
	return;
	$(".debug").append("<br>"+str);
}
function var_dump(obj, inAlert)
{
	if (typeof(inAlert) === "undefined")
		inAlert = true;
	var newLine = (inAlert)? "\n" : "<br>";
	var tabulation = (inAlert)? "\t" : "&nbsp;&nbsp;&nbsp;&nbsp;";
	var print_r = function (obj, t) 
	{	 
		// define tab spacing
		var tab = t || '';
		 
		// check if it's array
		var isArr = Object.prototype.toString.call(obj) === '[object Array]';
		// use {} for object, [] for array
		var str = isArr ? ('Array'+newLine + tab + '['+newLine) : ('Object'+newLine + tab + '{'+newLine);
		 
		// walk through it's properties
		for (var prop in obj)
		{
			if (obj.hasOwnProperty(prop))
			{
				var val1 = obj[prop];
				var val2 = '';
				var type = Object.prototype.toString.call(val1);
				switch (type)
				{// recursive if object/array
					case '[object Array]':
					case '[object Object]':
					val2 = print_r(val1, (tab + tabulation));
					break;
					case '[object String]':
					val2 = '\'' + val1 + '\'';
					break;
					default:
					val2 = val1;
				}
				str += tab + tabulation + prop + ' => ' + val2 + ',' + newLine;
			}
		}
		// remove extra comma for last property
		str = str.substring(0, str.length - newLine.length - 1) + newLine + tab;
		return isArr ? (str + ']') : (str + '}');
	}
	var s = print_r(obj);
	if (inAlert)
		alert(s);
	else
		return s;
}