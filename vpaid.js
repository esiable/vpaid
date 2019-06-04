var SampleVPAID = function(){
	console.log('new SampleVPAID');
	this._slot = null;
	this._videoSlot = null;
	this._listeners = {};
	this._contexts = {};
	this._log = function(msg) {
		var m = "SampleVPAID > " + msg;
		if (this._slot) {
			var a = document.createElement('p');
			a.style.width = "500px";
			a.style.padding = "5px";
			a.innerHTML = m;
			this._slot.appendChild(a);
		}
		console.log(m);
	};
	this._playBtn = document.createElement('button');
	this._currentTimeQueryTimer = null;
	this._playheadTime = 0;
	this._duration = 0;
};

SampleVPAID.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
	this._slot = environmentVars.slot;
	this._videoSlot = environmentVars.videoSlot;
	
	// setup play button
	this._playBtn.style.display = "none";
	this._playBtn.style.padding = "10px";
	this._playBtn.style.width = "100px";
	this._playBtn.textContent = "PLAY";
	this._playBtn.onclick = function(evt) {
		this._videoSlot.play();
	}.bind(this);
	this._slot.appendChild(this._playBtn);
	console.log('initAd() %o', environmentVars);
	this.dispatchEvent('AdLoaded');
};

SampleVPAID.prototype.startAd = function() {
	this._log('startAd()');
	this._videoSlot.setAttribute("type","video/mp4");
	this._videoSlot.setAttribute("webkit-playsinline", "webkit-playsinline");
	this._videoSlot.setAttribute("playsinline", "playsinline");
	this._videoSlot.src = "http://www.w3schools.com/jsref/mov_bbb.mp4";
	this._videoSlot.addEventListener('ended', function(evt){
		this.dispatchEvent("AdStopped");
	}.bind(this));
	this._videoSlot.load();
	var prom = this._videoSlot.play();
	if (prom) {
        prom.catch(function(reason) {
            console.log('Error: ' + reason);
            this._playBtn.style.display = "block";
        }.bind(this));
    }
	this._currentTimeQueryTimer = setInterval(function(){
		this._playheadTime = this._videoSlot.currentTime;
		if (this._playheadTime > 1) {
			this._playBtn.style.display = "none";
		}
	}.bind(this), 100);
	this.dispatchEvent('AdStarted');
	this.dispatchEvent('AdImpression');
};

SampleVPAID.prototype.stopAd = function() {
	this._log('stopAd()');
	this.dispatchEvent('AdStopped');
}

SampleVPAID.prototype.subscribe = function(callback, eventName, context) {
	this._log('subscribe ' + eventName);
	this._listeners[eventName] = callback;
	this._contexts[eventName] = context;
};

SampleVPAID.prototype.unsubscribe = function(eventName) {
	delete this._listeners[eventName];
	delete this._contexts[eventName];
};

SampleVPAID.prototype.resizeAd = function(eventName) {
	this._log('resizeAd');
};

SampleVPAID.prototype.dispatchEvent = function(eventName) {
	if (this._listeners[eventName]) {
		this._log('dispatchEvent: ' + eventName);
		this._listeners[eventName].call(this._contexts[eventName]);
	}
};

SampleVPAID.prototype.handshakeVersion = function(playerVPAIDVersions) {
	return '2';
};

SampleVPAID.prototype.getAdLinear = function() {
	return true;
};

SampleVPAID.prototype.getAdRemainingTime = function() {
	return this.getAdDuration() - this._playheadTime;
};

SampleVPAID.prototype.getAdDuration = function() {
	if (this._videoSlot) {
		this._duration = this._videoSlot.duration;
	}
	return this._duration;
}

function getVPAIDAd() {
	return new SampleVPAID();
}