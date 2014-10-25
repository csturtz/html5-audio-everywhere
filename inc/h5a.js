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

	// Player Object
	return funtion(url){
		var   id
			, loaded = false
			;

		this.audio = new Audio(url);
		
		this.load = function(){
			if (loaded) return;

			this.audio.load();
			this.audio.pause();

			loaded = true;
		};

		this.play = function(){
			if (!loaded) this.load();

			this.audio.pause();
			this.audio.play();
		};

		this.pause = function(){
			this.audio.pause();
			clearTimeout(audio.timeOut);
		};

		this.stop = function(){
			this.audio.pause();
			if (this.audio.currentTime)
				this.audio.currentTime = 0;
		};

		// Preload
		this.load();
	};
	
})();