(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];
    var imgCount = 0;
    var readyImgCount = 0;

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        for (var name in urlOrArr) // only for object (associative array)
            imgCount++;
        for (var name in urlOrArr)
            _load(urlOrArr[name]);
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;
                readyImgCount ++;
                if (readyImgCount == imgCount)
                {
                    if(isReady())
                    {
                        readyCallbacks.forEach(function(func) { func(); });
                    }
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                return false;
            }
        }
        return true;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();