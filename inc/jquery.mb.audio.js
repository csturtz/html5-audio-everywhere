/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.audio.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Modified Work Copyright (c) 2014. Chad Sturtz;
 *  email: sturtz70@gmail.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 10/10/2014
 *  *****************************************************************************
 *
 *
 *  Modifications by Chad Sturtz
 */

/*
 *
 * Works on all modern browsers.
 *
 * */

var ua = navigator.userAgent.toLowerCase();
var isAndroid = /android/.test(ua);
var isiOs = /(iphone|ipod|ipad)/.test(ua);
var isStandAlone = window.navigator.standalone;
var isiPad = ua.match(/ipad/);
var isDevice = 'ontouchstart' in window;
var isChrome = "chrome" in window;
var isMoz = "mozAnimationStartTime" in window;


String.prototype.asId = function () {
	return this.replace(/[^a-zA-Z0-9_]+/g, '');
};

function supportType(audioType) {
	var myAudio = document.createElement('audio');
	var isSupp = myAudio.canPlayType &&  myAudio.canPlayType(audioType);
	if (isSupp == "") {
		isSupp = false;
	} else {
		isSupp = true;
	}
	return isSupp;
}

(function ($) {

	$.mbAudio = {
		name             : "mb.audio",
		author           : "Matteo Bicocchi",
		version          : "1.5",
		defaults         : {
			id    : "",
			ogg   : "",
			mp3   : "",
			volume: 10
		},
		sounds           : {},
		players          : {},
		loaded           : {},
		playing          : [],
		ch               : [],
		soundsMutedByHand: false,

		build: function (sound) {

			if (!$.mbAudio.isInit) {
				$(window).on("blur",function () {

					$.mbAudio.soundsMutedByHand = true;
					$.mbAudio.muteAllSounds();
				}).on("focus", function () {

							$.mbAudio.soundsMutedByHand = false;
							$.mbAudio.unMuteAllSounds();
						});

				$.mbAudio.isInit = true;

			}

			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;
			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());

			if ($.mbAudio.loaded[sID] != 1) {
				var url = supportType("audio/mpeg") ? soundEl.mp3 : soundEl.ogg;

				 $.mbAudio.players[sID] = new Audio(url);
				 $.mbAudio.players[sID].load();
				 $.mbAudio.players[sID].pause();

				$.mbAudio.loaded[sID] = 1;
			}
		},

		getPlayer: function (ID) {
			var el = document.getElementById("mbAudio_" + ID);
			if ($(el).length == 0 || !$.mbAudio.players[ID]) {
				var soundEl = typeof ID == "string" ? $.mbAudio.sounds[ID] : ID;
				var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());
				ID = sID;
			}

			return $.mbAudio.players[ID];
		},

		preload: function () {
				for (var sID in $.mbAudio.sounds) {
					$.mbAudio.build(sID);
				}

			$(document).trigger("soundsLoaded");
		},

		play: function (sound, callback) {

			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;

			if (!soundEl)
				return;

			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());
			var volume = typeof soundEl.volume == "number" ? soundEl.volume : $.mbAudio.defaults.volume;
			volume = volume > 10 ? 10 : volume;

			//if ($.mbAudio.loaded[sID] != 1)
			$.mbAudio.build(sound);

			var player = $.mbAudio.getPlayer(sID);
			player.vol = volume;

			if (!$.mbAudio.allMuted)
				player.volume = player.vol / 10;
			else
				player.volume = 0;

			$(player).off("ended." + sID + ",paused." + sID);

			$(player).on("ended." + sID + ",paused." + sID, function () {

				$.mbAudio.playing.splice(sID, 1);
				delete player.isPlaying;

				if (typeof callback == "function")
					callback(player);

			});
			
			player.pause();
			
			player.play();

			var idx = jQuery.inArray(sID, $.mbAudio.playing);
			$.mbAudio.playing.splice(idx, 1);
			$.mbAudio.playing.push(sID);
			player.isPlaying = true;
		},

		stop: function (sound, callback) {

			if (!sound)
				return;

			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;

			if (!soundEl)
				return;

			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());

			var player = $.mbAudio.getPlayer(sID);

			if ($.mbAudio.loaded[sID] != 1)
				$.mbAudio.build(sound);

			player.pause();
			if (player.currentTime)
				player.currentTime = 0;

			$(player).off('ended.' + sID);

			if (typeof callback == "function")
				callback(player);

			var idx = jQuery.inArray(sID, $.mbAudio.playing);
			$.mbAudio.playing.splice(idx, 1);
			delete player.isPlaying;
			delete player.counter;

		},

		pause: function (sound, callback) {
			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;
			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());

			if ($.mbAudio.loaded[sID] != 1) {
				$.mbAudio.build(sound);
			}

			var player = $.mbAudio.getPlayer(sID);
			player.pause();

			$(player).off('ended.' + sID);

			var idx = jQuery.inArray(sID, $.mbAudio.playing);
			if (idx > -1)
				$.mbAudio.playing.splice(idx, 1);

			delete player.isPlaying;
			delete player.counter;

			clearTimeout(player.timeOut);

			if (typeof callback == "function")
				callback();

		},

		destroy: function (sound) {
			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;
			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());
			$.mbAudio.loaded[sID] = 0;
			var idx = jQuery.inArray(sID, $.mbAudio.playing);
			$.mbAudio.playing.splice(idx, 1);

			var player = $.mbAudio.getPlayer(sID);

			if (!player)
				return;

			$(player).remove();

		},

		muteAllSounds: function () {
			var sounds = $.mbAudio.loaded;
			if (!sounds)
				return;

			for (var sID in sounds) {
				var player = $.mbAudio.getPlayer(sID);
				player.vol = player.volume * 10;
				player.volume = 0;
			}
			$.mbAudio.allMuted = true;
		},

		unMuteAllSounds: function () {
			var sounds = $.mbAudio.loaded;
			if (!sounds)
				return;

			for (var sID in sounds) {
				var player = $.mbAudio.getPlayer(sID);
				player.volume = player.vol / 10;
			}
			$.mbAudio.allMuted = false;
		},

		stopAllSounds: function () {
			var sounds = $.mbAudio.loaded;
			if (!sounds)
				return;


			for (var i in sounds) {
				$.mbAudio.destroy(i);
			}
			$.mbAudio.allMuted = true;
		},

		setVolume: function (sound, vol) {
			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;
			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());

			if ($.mbAudio.loaded[sID] != 1)
				$.mbAudio.build(sound);

			var player = $.mbAudio.getPlayer(sID);
			vol = vol > 10 ? 10 : vol;
			player.vol = vol;

			player.volume = player.vol;

		},

		fadeIn: function (sound, duration, callback) {

			if (!duration)
				duration = 3000;

			duration = duration / 4;

			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;
			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());

			if ($.mbAudio.loaded[sID] != 1)
				$.mbAudio.build(sound);

			var player = $.mbAudio.getPlayer(sID);
			var volume = typeof soundEl.volume == "number" ? soundEl.volume : $.mbAudio.defaults.volume;
			volume = volume > 10 ? 10 : volume;

			var step = (volume / 10) / duration;

			clearInterval(player.fade);

			player.play();
			if (player.currentTime)
				player.currentTime = 0;

			player.volume = 0;

			if (!$.mbAudio.allMuted) {
				var v = 0;
				player.fade = setInterval(function () {

					if (v >= volume / 10) {
						clearInterval(player.fade);
						if (typeof (callback) == "function")
							callback(player);
						return;
					}

					player.volume = v;
					v += step;

				}, 0);
			}

			$.mbAudio.playing.push(sID);
			player.isPlaying = true;

		},

		fadeOut: function (sound, duration, callback) {

			if (!duration)
				duration = 3000;

			duration = duration / 4;

			var soundEl = typeof sound == "string" ? $.mbAudio.sounds[sound] : sound;
			var sID = soundEl.id ? soundEl.id : (typeof sound == "string" ? sound : sound.mp3.split(".")[0].asId());

			if ($.mbAudio.loaded[sID] != 1)
				$.mbAudio.build(sound);

			var player = $.mbAudio.getPlayer(sID);
			var volume = player.volume ? player.volume * 10 : (typeof soundEl.volume == "number" ? soundEl.volume : $.mbAudio.defaults.volume);
			volume = volume > 10 ? 10 : volume;

			var step = (volume / 10) / duration;

			clearInterval(player.fade);

			player.volume = volume / 10;
			player.play();

			var v = player.volume;

			player.fade = setInterval(function () {

				if (v <= 0) {
					v = 0;
					clearInterval(player.fade);

					player.volume = 0
					player.isPlaying = false;
					var idx = jQuery.inArray(sID, $.mbAudio.playing);
					$.mbAudio.playing.splice(idx, 1);

					player.pause();

					if (typeof (callback) == "function")
						callback(player);

					return;
				}

				player.volume = v;
				v -= step;

			}, 0);
		},

	};

	function Channel(soundID) {
		this.name = typeof soundID == "string" ? soundID : soundID.mp3.split(".")[0].asId();
		this.soundInPlay = null;
		this.playingSounds = [];
		this.isMuted = false;
		$.mbAudio.ch.push(this);
	}


})(jQuery);
