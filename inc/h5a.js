;(function(){
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
	
})();