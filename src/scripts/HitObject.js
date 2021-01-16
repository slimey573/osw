define(function(require) {
	let utils = require("./utils.js");
	return {
		HitCircle: class HitCircle {
			constructor(x, y, time, type, hitSound, objectParams, hitSample) {
				this.x = x;
				this.y = y;
				/* convert to seconds */
				this.time = time / 1000;
				this.type = utils.reverse(utils.binary(type));
				this.hitSound = hitSound;
				this.objectParams = objectParams;
				this.hitSample = hitSample;
			}
		},
		Slider: class Slider {
			constructor(x, y, time, type, hitSound, curveTypecurvePoints, slides, length, edgeSounds, edgeSets, hitSample) {
				this.x = x;
				this.y = y;
				this.time = time / 1000;
				this.type = utils.reverse(utils.binary(type));
				this.hitSound = hitSound;
				this.curveType = curveTypecurvePoints[0]
				this.curvePoints = curveTypecurvePoints.substr(1).split("|");
				for (var i = 0; i < this.curvePoints.length; i++) {
					if (this.curvePoints[i] === "") {
						this.curvePoints.splice(i, 1);
					}
					let split = this.curvePoints[i].split(":");
					this.curvePoints[i] = {
						x: parseInt(split[0]),
						y: parseInt(split[1]),
					};
				}
				this.slides = slides;
				this.length = length;
				this.edgeSounds = edgeSounds;
				this.edgeSets = edgeSets;
				this.hitSample = hitSample;
			}
		},
		Spinner: class Spinner {
			constructor(x ,y, time, type, hitSound, endTime, hitSample) {
				this.x = x;
				this.y = y;
				/* convert to seconds */
				this.time = time / 1000;
				this.type = utils.reverse(utils.binary(type));
				this.hitSound = hitSound;
				this.endTime = endTime / 1000;
				this.hitSample = hitSample;
			}
		},
		TimingPoint: class TimingPoint {
			constructor(time, beatLength, meter, sampleSet, sampleIndex, volume, uninherited, effects) {
				this.time = time;
				this.beatLength = beatLength;
				this.meter = meter;
				this.sampleSet = sampleSet;
				this.sampleIndex = sampleIndex;
				this.volume = volume;
				this.uninherited = uninherited;
				this.effects = effects;
			}
		}
	};
});