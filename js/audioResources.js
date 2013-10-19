(function(){
    var resourceCache = {};
    var readyCallback = function(){};
    var resCount = 0;
    var readyResCount = 0;
    
    var playQueue = {};
    
    function load(urlOrArr){
        var codec = getSupport();
        if (!codec) throw 'AudioNotSupported';
        codec = "." + codec;
        resCount = urlOrArr.length;
        for (var i in urlOrArr)
        {
            _load(urlOrArr[i], codec);
            playQueue[urlOrArr[i]] =[];
        }
    }
    
    function getSupport(){
        var bufAudio = new Audio;
        return !bufAudio.canPlayType ? false :
            bufAudio.canPlayType('audio/ogg;') ? 'ogg' :
                bufAudio.canPlayType('audio/mpeg;') ? 'mp3' : false;
    }
    
    function _load(url, type){
        if(resourceCache[url]) return;
        var audio = new Audio;
        
        audio.addEventListener('canplaythrough', function() {
            resourceCache[url] = audio;
            readyResCount++;
            if (readyResCount == resCount)
                readyCallback();
        }, false);
        resourceCache[url] = audio;
        audio.src = url + type;
    }
    
    function finishedPlaying(){
        var e = playQueue[this.playQueueIndex].shift();
        e.removeEventListener('ended', finishedPlaying, false);
        e = null;
    }
    
    function onReady(fnc){
        readyCallback = fnc;
    }
    
    function play(name){
        if (resourceCache[name] ==null ) return;
        
        var qu = playQueue[name];
        qu.push( cloneAudio(name) );
        
        var e = qu[ qu.length-1 ];
        e.playQueueIndex = name;
        e.addEventListener('ended', finishedPlaying, false);
        // firefox 3.5 starting audio bug
        //e.currentTime = 0.025;
        e.play();
    }
    
    function cloneAudio(src) {
        var audioClone;
        if (window.opera) { // Reported Opera bug DSK-309302
            audioClone = new Audio;
            audioClone.src = src;
        }
        else
            audioClone = resourceCache[src].cloneNode(true);
        audioClone.load();
        return audioClone;
    }
    
    window.AudioResources = {
        load: load,
        onReady: onReady,
        play: play
    };
})();