define(function(require) {
	"use strict";
	/* RequireJS Module Loading */
	const Formulas = require("./src/scripts/Formulas.js");
	const Mouse = require("./src/scripts/Mouse.js");
	const Keyboard = require("./src/scripts/Keyboard.js");
	const Song = require("./src/scripts/Song.js");
	const beatmap = require("./src/scripts/BeatMap.js");
	const Beizer = require("./src/scripts/Beizer.js");
	const utils = require("./src/scripts/utils.js");
	const HitObject = require("./src/scripts/HitObject.js");
	const AssetLoader = require("./src/scripts/AssetLoader.js");
	/* canvas setup */
	let canvas = document.createElement("canvas");
	canvas.id = "gameplay";
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.style.margin = "0";
	document.querySelector("body").appendChild(canvas);
	let ctx = canvas.getContext("2d");
	/* inputs setup */
	let mouse = new Mouse("body", 10);
	let keyboard = new Keyboard("body");
	mouse.setPosition(0, 0);
	mouse.init();
	mouse.sensitivity = 1;
	mouse.positionBound(0, 0, window.innerWidth, window.innerHeight);
	keyboard.init();
	/* cursor assets */
	let cursor = AssetLoader.image("src/images/gameplay/cursor.png");
	let cursorTrail = AssetLoader.image("src/images/gameplay/cursortrail.png");
	/* hit circle assets */
	let hitCircle = AssetLoader.image("src/images/gameplay/hitCircle.png");
	let hitCircleOverlay = AssetLoader.image("src/images/gameplay/hitCircleoverlay.png");
	let approachCircle = AssetLoader.image("src/images/gameplay/approachcircle.png");
	/* slider assets */
	let sliderBody = AssetLoader.image("src/images/gameplay/sliderb0.png");
	let sliderFollowCircle = AssetLoader.image("src/images/gameplay/sliderfollowcircle.png");
	let sliderScorePoint = AssetLoader.image("src/images/gameplay/sliderscorepoint.png");
	let reverseArrow = AssetLoader.image("src/images/gameplay/reverseArrow.png");
	/* spinner assets */
	let spinnerApproachCircle = AssetLoader.image("src/images/gameplay/spinner-approachcircle.png");
	let spinnerRPM = AssetLoader.image("src/images/gameplay/spinner-rpm.png");
	let spinnerTop = AssetLoader.image("src/images/gameplay/spinner-top.png");
	/* combo number assets */
	let comboNumbers = [
		AssetLoader.image("src/images/gameplay/fonts/aller/default-0.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-1.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-2.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-3.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-4.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-5.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-6.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-7.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-8.png"),
		AssetLoader.image("src/images/gameplay/fonts/aller/default-9.png"),
	];
	/* hit score number assets */
	let scoreNumbers = [
		AssetLoader.image("src/images/gameplay/hit300.png"),
		AssetLoader.image("src/images/gameplay/hit100.png"),
		AssetLoader.image("src/images/gameplay/hit50.png"),
		AssetLoader.image("src/images/gameplay/hit0.png"),
	];
	ctx.font = "16px Arial";
	ctx.fillStyle = "#fff";
	let currentHitObject = 0;
	let hitObjects = [];
	let scoreObjects = [];
	let firstClick = true;
	/* Playfield calculations and data */
	let playfieldSize = 0.8;
	let playfieldXOffset = 0;
	let playfieldYOffset = canvas.height / 50;
	/* Beatmap difficulty data */
	let arTime = Formulas.AR(beatmap.ApproachRate);
	let arFadeIn = Formulas.ARFadeIn(beatmap.ApproachRate);
	// Map from osu!pixels to screen pixels 
	let circleDiameter = utils.map(Formulas.CS(beatmap.CircleSize) * 2, 0, 512, 0, canvas.height * playfieldSize * (4 / 3));
	let difficultyMultiplier = utils.difficultyPoints(beatmap.CircleSize, beatmap.HPDrainRate, beatmap.OverallDifficulty);
	let odTime = Formulas.ODHitWindow(beatmap.OverallDifficulty);
	/* Applied Mods*/
	let mods = {
		easy: false,
		noFail: false,
		halfTime: false,
		hardRock: false,
		suddenDeath: false,
		perfect: false,
		doubleTime: false,
		nightCore: false,
		hidden: false,
		flashLight: false,
		relax: false,
		autoPilot: false,
		spunOut: false,
		auto: false,
		cinema: false,
		scoreV2: false,
	};
	/* Timing point indexes */
	let timingPointUninheritedIndex = 0;
	let currentTimingPoint = 0;
	/* Score variables */
	let score = 0;
	let scoreDisplay = 0;
	let total300 = 0;
	let total300g = 0;
	let total100 = 0;
	let total100g = 0;
	let total50 = 0;
	let totalMisses = 0;
	/* Combo variables */
	let combo = 0;
	let comboPulseSize = 1;
	/* Audio variables */
	let audio = AssetLoader.audio(`src/audio/${beatmap.AudioFilename}`);
	audio.currentTime = beatmap.hitObjectsParsed[0].time - 5;
	audio.playbackRate = 1;
	window.addEventListener("click", function() {
		if (firstClick) {
			firstClick = false;
			mouse.lockPointer();
			setTimeout(function() {
				audio.play();
			}, 1000);
		}
		(function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.strokeStyle = "#000";
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.rect(playfieldXOffset + canvas.width / 2 - canvas.height * playfieldSize * (4 / 3) / 2, playfieldYOffset + canvas.height / 2 - canvas.height * playfieldSize / 2, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize);
			ctx.stroke();
			ctx.closePath();
			while (currentHitObject < beatmap.hitObjectsParsed.length && audio.currentTime >= beatmap.hitObjectsParsed[currentHitObject].time - arTime) {
				hitObjects.push(beatmap.hitObjectsParsed[currentHitObject]);
				currentHitObject++;
			}
			/* +1 because the given time is beginning time, not end time */
			while (currentTimingPoint < beatmap.timingPointsParsed.length - 1 && audio.currentTime >= beatmap.timingPointsParsed[currentTimingPoint + 1].time) {
				currentTimingPoint++;
				if (beatmap.timingPointsParsed[currentTimingPoint].uninherited === 1) {
					timingPointUninheritedIndex = currentTimingPoint;
				}
			}
			let hitObjectOffsetX = playfieldXOffset + canvas.width / 2 - canvas.height * playfieldSize * (4 / 3) / 2;
			let hitObjectOffsetY = playfieldYOffset + canvas.height / 2 - canvas.height * playfieldSize / 2;
			for (let i = 0; i < hitObjects.length; i++) {
				let sliderSpeedMultiplier = beatmap.SliderMultiplier;
				/* inherited timing point */
				if (beatmap.timingPointsParsed[currentTimingPoint].uninherited === 0) {
					sliderSpeedMultiplier *= utils.sliderMultiplier(beatmap.timingPointsParsed[currentTimingPoint].beatLength);
				}
				/* in order for 2b maps like Mayday to work, SliderMultiplier values need to be cached in the slider itself*/
				if (audio.currentTime > hitObjects[i].time && hitObjects[i].cache.sliderInheritedMultiplier === undefined) {
					hitObjects[i].cache.sliderInheritedMultiplier = sliderSpeedMultiplier;
					hitObjects[i].cache.timingPointUninheritedIndex = timingPointUninheritedIndex;
					hitObjects[i].cache.currentSlide = 0;
					let timePerTick = beatmap.timingPointsParsed[timingPointUninheritedIndex].beatLength / beatmap.SliderTickRate;
					let sliderTime = hitObjects[i].length / (hitObjects[i].cache.sliderInheritedMultiplier * 100) * beatmap.timingPointsParsed[hitObjects[i].cache.timingPointUninheritedIndex].beatLength;
					hitObjects[i].cache.totalSliderTicks = sliderTime / timePerTick;
					if (beatmap.timingPointsParsed[currentTimingPoint].uninherited === false) {
						hitObjects[i].cache.totalSliderTicks *= utils.sliderMultiplier(beatmap.timingPointsParsed[currentTimingPoint].beatLength)
					}
					// hitObjects[i].cache.totalSliderTicks -= 1;
				}
				if (hitObjects[i].cache.hasHit === undefined) {
					hitObjects[i].cache.hasHit = false;
					hitObjects[i].cache.missedHead = false;
					hitObjects[i].cache.onFollowCircle = false;
					hitObjects[i].cache.hasHitAtAll = false;
				}
				let approachCircleSize = utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arTime, 5, 1.6);
				let hitObjectMapped = utils.mapToOsuPixels(hitObjects[i].x, hitObjects[i].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
				/* approach circle min and max sizes */
				if (approachCircleSize >= 5) {
					approachCircleSize = 5;
				}
				if (approachCircleSize <= 1.6) {
					approachCircleSize = 1.6;
					mouse.setPosition(hitObjectMapped.x, hitObjectMapped.y);
					mouse.click();
				}
				if (hitObjects[i].type[0] === "1") {
					if (mods.hidden) {
						/* hidden fade in and out for hit circle */
						if (utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arTime, 0, 1) < 0.4) {
							ctx.globalAlpha = utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arTime * 0.4, 0, 1);
						} else if (utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arTime, 0, 1) < 0.7) {
							ctx.globalAlpha = utils.map(audio.currentTime - (hitObjects[i].time - arTime), arTime * 0.4, arTime * 0.7, 1, 0);
						} else {
							ctx.globalAlpha = 0;
						}
					} else {
						/* normal fade in and out for hit circle */
						if (utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arTime, 0, 1) <= 1) {
							ctx.globalAlpha = utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arFadeIn, 0, 1);
						} else {
							let alpha = utils.map(audio.currentTime - (hitObjects[i].time - arTime), arTime, arTime + odTime[0] / 2, 1, 0);
							if (alpha < 0) {
								alpha = 0;
							}
							ctx.globalAlpha = alpha;
						}
					}
				} else if (hitObjects[i].type[1] === "1") {
					if (utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arTime, 0, 1) <= 1) {
						ctx.globalAlpha = utils.map(audio.currentTime - (hitObjects[i].time - arTime), 0, arFadeIn, 0, 1);
					} else {
						ctx.globalAlpha = 1;
					}
				}
				if (hitObjects[i].type[0] === "1") {
					/* draw hit circle */
					ctx.drawImage(hitCircle, hitObjectMapped.x - circleDiameter / 2, hitObjectMapped.y - circleDiameter / 2, circleDiameter, circleDiameter);
					ctx.drawImage(hitCircleOverlay, hitObjectMapped.x - circleDiameter / 2, hitObjectMapped.y - circleDiameter / 2, circleDiameter, circleDiameter);
					ctx.drawImage(approachCircle, hitObjectMapped.x - (circleDiameter * approachCircleSize) / 2, hitObjectMapped.y - (circleDiameter * approachCircleSize) / 2, circleDiameter * approachCircleSize, circleDiameter * approachCircleSize);
					ctx.drawImage(comboNumbers[1], hitObjectMapped.x - comboNumbers[1].width / 2, hitObjectMapped.y - comboNumbers[1].width / 1.25);
				} else if (hitObjects[i].type[1] === "1") {
					/* draw slider */
					let points = []
					if (hitObjects[i].curveType === "B" || hitObjects[i].curveType === "C" || hitObjects[i].curveType === "L") {
						/* determine slider red / white anchor */
						let beizerTemp = [];
						for (let j = 0; j < hitObjects[i].curvePoints.length; j++) {
							if (hitObjects[i].curvePoints[j + 1] && hitObjects[i].curvePoints[j].x === hitObjects[i].curvePoints[j + 1].x && hitObjects[i].curvePoints[j].y === hitObjects[i].curvePoints[j + 1].y) {
								beizerTemp.push(hitObjects[i].curvePoints[j]);
								let point = Beizer(beizerTemp);
								for (let k = 0; k < point.length - 1; k++) {
									points.push(point[k]);
								}
								beizerTemp = [];
							} else {
								beizerTemp.push(hitObjects[i].curvePoints[j]);
							}
						}
						let point = Beizer(beizerTemp);
						for (let k = 0; k < point.length; k++) {
							points.push(point[k]);
						}
						beizerTemp = [];
					} else if (hitObjects[i].curveType === "P" && hitObjects[i].curvePoints.length === 3) {
						let circle = utils.circumcircle(hitObjects[i].curvePoints[0], hitObjects[i].curvePoints[1], hitObjects[i].curvePoints[2]);
						points = utils.circleToPoints(circle.x, circle.y, circle.r, hitObjects[i].length, -utils.direction(circle.x, circle.y, hitObjects[i].curvePoints[0].x, hitObjects[i].curvePoints[0].y) - Math.PI / 2, utils.orientation(hitObjects[i].curvePoints[0], hitObjects[i].curvePoints[1], hitObjects[i].curvePoints[2]));
					}
					ctx.lineWidth = circleDiameter;
					ctx.strokeStyle = "rgba(255, 255, 255, " + ctx.globalAlpha + ")";
					ctx.lineCap = "round";
					ctx.lineJoin = 'round';
					ctx.beginPath();
					for (let j = 0; j < points.length; j++) {
						let mapped = utils.mapToOsuPixels(points[j].x, points[j].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
						ctx.lineTo(mapped.x, mapped.y);
					}
					ctx.stroke();
					ctx.lineWidth = circleDiameter / 1.1;
					ctx.strokeStyle = "#222";
					ctx.lineCap = "round";
					ctx.lineJoin = 'round';
					ctx.beginPath();
					for (let j = 0; j < points.length; j++) {
						let mapped = utils.mapToOsuPixels(points[j].x, points[j].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
						ctx.lineTo(mapped.x, mapped.y);
					}
					ctx.stroke();
					// for (let j = 0; j < points.length; j += 1) {
					// 	let mapped = utils.mapToOsuPixels(points[Math.floor(j)].x, points[Math.floor(j)].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
					// 	ctx.drawImage(sliderScorePoint, mapped.x - sliderScorePoint.width / 2, mapped.y - sliderScorePoint.height / 2);
					// }
					if (hitObjects[i].slides > 1) {
						let mapped = utils.mapToOsuPixels(points[points.length - 1].x, points[points.length - 1].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
						ctx.translate(mapped.x, mapped.y);
						ctx.rotate(-utils.direction(points[points.length - 4].x, points[points.length - 3].y, points[points.length - 2].x, points[points.length - 1].y) + Math.PI / 2);
						ctx.drawImage(reverseArrow, -circleDiameter / 2, -circleDiameter / 2, circleDiameter, circleDiameter);
						ctx.resetTransform();
					} else {
						let mapped = utils.mapToOsuPixels(points[points.length - 1].x, points[points.length - 1].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
						ctx.drawImage(hitCircle, mapped.x - circleDiameter / 2, mapped.y - circleDiameter / 2, circleDiameter, circleDiameter);
						ctx.drawImage(hitCircleOverlay, mapped.x - circleDiameter / 2, mapped.y - circleDiameter / 2, circleDiameter, circleDiameter);
					}
					if (audio.currentTime > hitObjects[i].time) {
						let sliderTime = 0;
						let sliderRepeat = false;
						let time = hitObjects[i].length / (hitObjects[i].cache.sliderInheritedMultiplier * 100) * beatmap.timingPointsParsed[hitObjects[i].cache.timingPointUninheritedIndex].beatLength;
						if (hitObjects[i].cache.currentSlide % 2 === 0 && hitObjects[i].cache.currentSlide < hitObjects[i].slides) {
							sliderTime = Math.floor(utils.map(audio.currentTime, hitObjects[i].time + time * hitObjects[i].cache.currentSlide, hitObjects[i].time + time * (hitObjects[i].cache.currentSlide + 1), 0, points.length - 1));
							if (sliderTime >= points.length - 1) {
								sliderTime = points.length - 1;
								sliderRepeat = true;
								hitObjects[i].cache.currentSlide++;
							}
						} else if (hitObjects[i].cache.currentSlide % 2 === 1 && hitObjects[i].cache.currentSlide < hitObjects[i].slides) {
							sliderTime = Math.floor(utils.map(audio.currentTime, hitObjects[i].time + time * hitObjects[i].cache.currentSlide, hitObjects[i].time + time * (hitObjects[i].cache.currentSlide + 1), points.length - 1, 0));
							if (sliderTime <= 0) {
								sliderTime = 0;
								sliderRepeat = true;
								hitObjects[i].cache.currentSlide++;
							}
						} else {
							hitObjects[i].cache.ended = true;
						}
						if (sliderTime >= points.length - 1) {
							sliderTime = 0;
						}
						if (sliderTime <= 0) {
							sliderTime = points.length - 1;
						}
						let mapped = utils.mapToOsuPixels(points[sliderTime].x, points[sliderTime].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
						if (sliderRepeat && utils.dist(mouse.position.x, mouse.position.y, mapped.x, mapped.y) <= circleDiameter * 2.4 / 2) {
							score += 30;
							if (hitObjects[i].cache.currentSlide < hitObjects[i].slides) {
								combo++;
							}	
							comboPulseSize = 1;
						} else if (sliderRepeat && utils.dist(mouse.position.x, mouse.position.y, mapped.x, mapped.y) > circleDiameter * 2.4 / 2) {
							console.log("slider end / repeat miss");
							combo = 0;
							document.getElementById("combo-container").innerHTML = "";
						}
						mouse.setPosition(mapped.x, mapped.y);
						ctx.drawImage(sliderBody, mapped.x - circleDiameter / 2, mapped.y - circleDiameter / 2, circleDiameter, circleDiameter);
						if (utils.dist(mouse.position.x, mouse.position.y, mapped.x, mapped.y) < circleDiameter * 2.4 / 2 && (mouse.isLeftButtonDown || keyboard.getKeyDown("z") || keyboard.getKeyDown("x"))) {
							ctx.drawImage(sliderFollowCircle, mapped.x - circleDiameter * 2.4 / 2, mapped.y - circleDiameter * 2.4 /2 , circleDiameter * 2.4, circleDiameter * 2.4);
							hitObjects[i].cache.onFollowCircle = true;
							hitObjects[i].cache.hasHitAtAll = true;
						} else {
							hitObjects[i].cache.onFollowCircle = false;
						}
					}
					if (hitObjects[i].cache.hasHit === false && hitObjects[i].cache.missedHead === false) {
						ctx.drawImage(hitCircle, hitObjectMapped.x - circleDiameter / 2, hitObjectMapped.y - circleDiameter / 2, circleDiameter, circleDiameter);
						ctx.drawImage(hitCircleOverlay, hitObjectMapped.x - circleDiameter / 2, hitObjectMapped.y - circleDiameter / 2, circleDiameter, circleDiameter);
						ctx.drawImage(approachCircle, hitObjectMapped.x - (circleDiameter * approachCircleSize) / 2, hitObjectMapped.y - (circleDiameter * approachCircleSize) / 2, circleDiameter * approachCircleSize, circleDiameter * approachCircleSize);
						ctx.drawImage(comboNumbers[1], hitObjectMapped.x - comboNumbers[1].width / 2, hitObjectMapped.y - comboNumbers[1].width / 1.25);
					}
				} else if (hitObjects[i].type[3] === "1") {
					/* draw spinner */
					let size = utils.map(hitObjects[i].endTime - audio.currentTime, 0, hitObjects[i].endTime - (hitObjects[i].time - arTime), 0, 0.8);
					ctx.drawImage(spinnerApproachCircle, hitObjectMapped.x - size * window.innerHeight / 2, hitObjectMapped.y - size * window.innerHeight / 2, size * window.innerHeight, size * window.innerHeight);
					ctx.drawImage(spinnerTop, hitObjectMapped.x - 0.2 * window.innerHeight / 2, hitObjectMapped.y - 0.2 * window.innerHeight / 2, 0.2 * window.innerHeight, 0.2 * window.innerHeight);
				}
				if (audio.currentTime >= hitObjects[i].time + odTime[0] / 2 && hitObjects[i].cache.hasHit === false && hitObjects[i].cache.missedHead === false) {
					hitObjects[i].cache.missedHead = true;
				}
				if (hitObjects[i].type[0] === "1" && utils.dist(mouse.position.x, mouse.position.y, hitObjectMapped.x, hitObjectMapped.y) < circleDiameter / 2 && (mouse.isLeftButtonDown || keyboard.getKeyDown("z") || keyboard.getKeyDown("x"))) {
					let hitWindowScore = 0;
					if (utils.withinRange(audio.currentTime, hitObjects[i].time, odTime[0])) {
						if (utils.withinRange(audio.currentTime, hitObjects[i].time, odTime[2])) {
							total300++;
							hitWindowScore = 300;
						} else if (utils.withinRange(audio.currentTime, hitObjects[i].time, odTime[1])) {
							total100++;
							hitWindowScore = 100;
						} else if (utils.withinRange(audio.currentTime, hitObjects[i].time, odTime[0])) {
							total50++;
							hitWindowScore = 50;
						}
						combo++;
						comboPulseSize = 1;
					} else {
						console.log("hitcircle miss");
						totalMisses++;
						hitWindowScore = 0;
						combo = 0;
						document.getElementById("combo-container").innerHTML = "";
					}
					score += utils.hitScore(hitWindowScore, combo, difficultyMultiplier, 1);
					scoreObjects.push(new HitObject.ScoreObject(hitWindowScore, hitObjectMapped.x, hitObjectMapped.y, audio.currentTime + 1));
					hitObjects.splice(i, 1);
					i--;
					mouse.unClick();
				} else if (hitObjects[i].type[1] === "1" && hitObjects[i].cache.hasHit === false && utils.dist(mouse.position.x, mouse.position.y, hitObjectMapped.x, hitObjectMapped.y) < circleDiameter / 2 && (mouse.isLeftButtonDown || keyboard.getKeyDown("z") || keyboard.getKeyDown("x"))) {
					if (utils.withinRange(audio.currentTime, hitObjects[i].time, odTime[0])) {
						score += 30;
						combo++;
						comboPulseSize = 1;
						hitObjects[i].cache.hasHit = true;
						hitObjects[i].cache.hasHitAtAll = true;
					} else {
						console.log("slider head miss");
						combo = 0;
						hitObjects[i].cache.missedHead = true;
					}
				}
				if (i <= -1) {
					i = 0;
					if (hitObjects.length === 0) {
						continue;
					}
				}
				let miss = false;
				if (hitObjects[i].type[0] === "1" && audio.currentTime > hitObjects[i].time + odTime[0] / 2) {
					miss = true;
					scoreObjects.push(new HitObject.ScoreObject(0, hitObjectMapped.x, hitObjectMapped.y, audio.currentTime + 1));
				} else if (hitObjects[i].type[1] === "1" && hitObjects[i].cache.ended) {
					let mapped = utils.mapToOsuPixels(hitObjects[i].curvePoints[hitObjects[i].curvePoints.length - 1].x, hitObjects[i].curvePoints[hitObjects[i].curvePoints.length - 1].y, canvas.height * playfieldSize * (4 / 3), canvas.height * playfieldSize, hitObjectOffsetX, hitObjectOffsetY);
					if (hitObjects[i].cache.hasHit === true) {
						if (hitObjects[i].cache.onFollowCircle === true) {
							total300++;
							score += utils.hitScore(300, combo, difficultyMultiplier, 1);
							combo++;
							scoreObjects.push(new HitObject.ScoreObject(300, mapped.x, mapped.y, audio.currentTime + 1));
							comboPulseSize = 1;
						} else {
							console.log("slider end miss 100");
							/* missed slider end */
							total100++;
							score += utils.hitScore(100, combo, difficultyMultiplier, 1);
							scoreObjects.push(new HitObject.ScoreObject(100, mapped.x, mapped.y, audio.currentTime + 1));
						}
						hitObjects.splice(i, 1);
						i--;
					} else if (hitObjects[i].cache.onFollowCircle === true || hitObjects[i].cache.hasHitAtAll === true) {
						console.log("slider end and head miss 100");
						total100++;
						score += utils.hitScore(100, combo, difficultyMultiplier, 1);
						scoreObjects.push(new HitObject.ScoreObject(100, mapped.x, mapped.y, audio.currentTime + 1));
						hitObjects.splice(i, 1);
						i--;
					} else {
						console.log("slider never hit");
						miss = true;
						scoreObjects.push(new HitObject.ScoreObject(0, mapped.x, mapped.y, audio.currentTime + 1));
					}
				} else if (hitObjects[i].type[3] === "1" && audio.currentTime >= hitObjects[i].endTime) {
					miss = true;
					scoreObjects.push(new HitObject.ScoreObject(0, hitObjectMapped.x, hitObjectMapped.y, audio.currentTime + 1));
				}
				if (miss === true) {
					combo = 0;
					totalMisses++;
					hitObjects.splice(i, 1);
					i--;
					document.getElementById("combo-container").innerHTML = "";
				}
				ctx.globalAlpha = 1;
			}
			let size = 1;
			if (mouse.isLeftButtonDown || keyboard.getKeyDown("z") || keyboard.getKeyDown("x")) {
				size = 0.8;
			}
			for (let i = 0; i < scoreObjects.length; i++) {
				if (scoreObjects[i].lifetime - audio.currentTime > 0) {
					let useImage = -1;
					switch (scoreObjects[i].score) {
						case 300:
							useImage = 0;
							break;
						case 100:
							useImage = 1;
							break;
						case 50:
							useImage = 2;
							break;
						case 0:
							useImage = 3;
							break;
					}
					ctx.globalAlpha = utils.map(scoreObjects[i].lifetime - audio.currentTime, 1, 0, 1, 0);
					let size = circleDiameter * 0.75 * utils.map(scoreObjects[i].lifetime - audio.currentTime, 1, 0, 1, 1.1);
					ctx.drawImage(scoreNumbers[useImage], scoreObjects[i].x - size / 2, scoreObjects[i].y - size / 2, size, size);
				} else {
					scoreObjects.splice(i, 1);
					i--;
				}
			}
			ctx.globalAlpha = 1;
			comboPulseSize -= comboPulseSize / 8;
			scoreDisplay += (score - scoreDisplay) / 8;
			/* update score html element */
			utils.htmlCounter(utils.reverse(Math.round(scoreDisplay) + ""), "score-container", "score-digit-", "src/images/gameplay/fonts/aller/score-", "left", "calc(100vw - " + (document.getElementById("score-container").childNodes.length * 2) + "vw)");
			/* update combo html element */
			utils.htmlCounter(utils.reverse(combo + "x"), "combo-container", "combo-digit-", "src/images/gameplay/fonts/aller/score-", "top", "calc(100vh - 52 / 32 * " + 2 * (comboPulseSize + 1) + "vw)");
			/* update accuracy html element */
			utils.htmlCounter("%" + utils.reverse("" + (utils.accuracy(total300, total100, total50, totalMisses) * 100).toPrecision(4)), "accuracy-container", "accuracy-digit-", "src/images/gameplay/fonts/aller/score-", "left", "calc(100vw - " + (document.getElementById("accuracy-container").childNodes.length * 1) + "vw)");
			/* rank grade */
			document.getElementById("grade").src = "src/images/gameplay/ranking-" + utils.grade(total300, total100, total50, totalMisses, false) + "-small.png";
			/* combo pulse size */
			let els = document.getElementById("combo-container").querySelectorAll("img");
			for (let i = 0; i < els.length; i++) {
				els[i].style.width = 2 * (comboPulseSize + 1) + "vw";
			}
			/* mouse trails */
			for (let i = 0; i < mouse.previousPositions.x.length - 1; i++) {
				ctx.globalAlpha = utils.map(i, 0, mouse.previousPositions.x.length - 1, 0, 1);
				for (let j = 0; j < utils.dist(mouse.previousPositions.x[i], mouse.previousPositions.y[i], mouse.previousPositions.x[i + 1], mouse.previousPositions.y[i + 1]) / (cursorTrail.width / 2); j++) {
					ctx.drawImage(cursorTrail, utils.map(j, 0, utils.dist(mouse.previousPositions.x[i], mouse.previousPositions.y[i], mouse.previousPositions.x[i + 1], mouse.previousPositions.y[i + 1]) / (cursorTrail.width / 2), mouse.previousPositions.x[i], mouse.previousPositions.x[i + 1]) - cursorTrail.width / 2, utils.map(j, 0, utils.dist(mouse.previousPositions.x[i], mouse.previousPositions.y[i], mouse.previousPositions.x[i + 1], mouse.previousPositions.y[i + 1]) / (cursorTrail.width / 2), mouse.previousPositions.y[i], mouse.previousPositions.y[i + 1]) - cursorTrail.height / 2);
				}
			}
			ctx.globalAlpha = 1;
			ctx.drawImage(cursor, mouse.position.x - (cursor.width * size) / 2, mouse.position.y - (cursor.height * size) / 2, cursor.width * size, cursor.height * size);
			ctx.fillStyle = "#fff";
			ctx.fillText(frameRate + "fps", 10, 20);
			ctx.fillText(audio.currentTime + "s", 10, 40);
			setTimeout(animate, 0);
		})();
	});
	/* Profiling ----------------------------------------------------------------------------------------------- */
	let times = [];
	let frameRate = 0;

	function calculateFPS() {
		window.setTimeout(() => {
			const now = Date.now();
			while (times.length > 0 && times[0] <= now - 1000) {
				times.shift();
			}
			times.push(now);
			frameRate = times.length;
			calculateFPS();
		}, 0);
	}
	calculateFPS();
});