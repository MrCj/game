(function(){
    var resourceCache = {};
    var readyCallback = function(){};
    var resCount = 0;
    var readyResCount = 0;
	
	var playQueue = [];
	
	function load(urlOrArr){		
		var codec = getSupport();
		if (!codec) throw 'AudioNotSupported';
		codec = "." + codec;
		resCount = urlOrArr.length;
		for (var i in urlOrArr)
			_load(urlOrArr[i]+codec);
	}
	
	function getSupport(){
		return !this.audio.canPlayType ? false :
			this.audio.canPlayType('audio/ogg;')  ? 'ogg' :
			this.audio.canPlayType('audio/mpeg;') ? 'mp3' : false;
	}
	
	function _load(url){
		if(resourceCache[url])
            return;
		var audio = new Audio;
		audio.oncanplaythrough = function() {
			resourceCache[url] = audio;
			readyResCount++;
			if (readyResCount == resCount)
				readyCallback();
		}
        resourceCache[url] = false;
        audio.src = url;
		audio.ended = finishedPlaying;
		audio.load();	
	}
	
	function finishedPlaying(){
		playQueue.shift();
	}
	
	function onReady(fnc){
		readyCallback = fnc;
	}	
	
	function play(name){
		playQueue.push( cloneAudio(name) );
		var e = playQueue[ playQueue.length-1 ];
		// firefox 3.5 starting audio bug
		e.currentTime = 0.025;
		e.play();
	}
	
	function cloneAudio(src) {
		var audioClone;
		if (window.opera) { // Reported Opera bug DSK-309302
			audioClone = new Audio;
			audioClone.src = src;
		} else {
			audioClone = resourceCache[src].cloneNode(true);
		}
		audioClone.load();
		return audioClone;
	},
	
	window.AudioResources = {
        load: load,
        onReady: onReady,
		play: play
    };
})();