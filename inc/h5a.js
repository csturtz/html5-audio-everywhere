/*
 * ******************************************************************************
 *  file: h5a.js
 *
 *  Original Work from jQuery Plugin Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  New and Modified Work for h5a.js Copyright (c) 2014. Chad Sturtz;
 *  email: sturtz70@gmail.com
 *
 *  Licences: MIT
 *  http://www.opensource.org/licenses/mit-license.php
 *  
 *  *****************************************************************************
 *
 */

;var H5A = (function(){
	var   ua
		, isAndroid
		, isiOs
		, isStandAlone
		, isiPad
		, isDevice
		, isChrome
		, isMoz
		, defaults
		, sounds
		, players
		, loaded
		, playing
		, ch
		, soundsMutedByHand
		, initComplete
		;

	// Browser & Device Detection
	ua = navigator.userAgent.toLowerCase();
	isAndroid = /android/.test(ua);
	isiOs = /(iphone|ipod|ipad)/.test(ua);
	isStandAlone = window.navigator.standalone;
	isiPad = ua.match(/ipad/);
	isDevice = 'ontouchstart' in window;
	isChrome = "chrome" in window;
	isMoz = "mozAnimationStartTime" in window;

	// Misc Var Initialization
	defaults = {
		id    : "",
		ogg   : "",
		mp3   : "",
		volume: 10
	};
	sounds = {};
	players = {};
	loaded = {};
	playing = [];
	ch = [];
	soundsMutedByHand = false;
	initComplete = false;


	// functions
	function init() {
		if (initComplete) return;

		$(window).on("blur",function () {
				soundsMutedByHand = true;
				muteAllPlayers();
			}).on("focus", function () {
				soundsMutedByHand = false;
				unMuteAllPlayers();
			});

		$.mbAudio.isInit = true;
	};

	function muteAllPlayers(){
		for (var player in players) {
			player.vol = player.volume * 10;
			player.volume = 0;
		}
	};
	
	function unMuteAllPlayers(){
		for (var player in players) {
			player.volume = player.vol / 10;
		}
	};


	// Player Object
	return funtion(options){
		var id;

		id = generatePlayerId();
		players[id] = this;


	};
	
})();