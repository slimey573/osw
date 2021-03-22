let canvas = document.getElementById("intro-logo");
canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerWidth;
let ctx = canvas.getContext("2d");

let pointArrays = [];


window.addEventListener("mousemove", function(e) {
	console.log(map(e.x, 0, window.innerHeight * 0.8, 0, 1) + ", " + map(e.y, 0, window.innerHeight * 0.8, 0, 1));
})

let middle = canvas.height * 0.5;

/* generate outside of logo */
pointArrays.push([]);
for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 64) {
	let x = middle + Math.cos(i) * canvas.height * 0.5;
	let y = middle + Math.sin(i) * canvas.height * 0.5;
	pointArrays[pointArrays.length - 1].push({x: x, y: y});
}

/* generate inside of logo */
pointArrays.push([]);
for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 64) {
	let x = middle + Math.cos(i) * canvas.height * 0.45;
	let y = middle + Math.sin(i) * canvas.height * 0.45;
	pointArrays[pointArrays.length - 1].push({x: x, y: y});
}

/* generate outside of O */
pointArrays.push([]);
for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 64) {
	let offset = 1;
	if (i <= Math.PI / 2) {
		offset = map(i, 0, Math.PI / 2, 0.9, 1);
	} else if (i <= Math.PI) {
		offset = map(i, Math.PI / 2, Math.PI, 1, 0.9);
	} else if (i <= Math.PI * 1.5) {
		offset = map(i, Math.PI, Math.PI * 1.5, 0.9, 1);
	} else {
		offset = map(i, Math.PI * 1.5, Math.PI * 2, 1, 0.9);
	}
	let x = canvas.height * 0.25 + Math.cos(i) * canvas.height * 0.1 * offset;
	let y = canvas.height * 0.5 + Math.sin(i) * canvas.height * 0.1;
	pointArrays[pointArrays.length - 1].push({x: x, y: y});
}
/* generate inside of O */
pointArrays.push([]);
for (let i = 0; i <= 2 * Math.PI; i += Math.PI / 64) {
	let x = canvas.height * 0.25 + Math.cos(i) * canvas.height * 0.05 * 0.8;
	let y = canvas.height * 0.5 + Math.sin(i) * canvas.height * 0.05 * 1.2;
	pointArrays[pointArrays.length - 1].push({x: x, y: y});
}

/* generate exclamation dot */
pointArrays.push([
	{
		x: 0.75 * canvas.height,
		y: 0.54 * canvas.height
	},
	{
		x: 0.805 * canvas.height,
		y: 0.54 * canvas.height
	},
	{
		x: 0.805 * canvas.height,
		y: 0.595 * canvas.height
	},
	{
		x: 0.75 * canvas.height,
		y: 0.595 * canvas.height
	},
	{
		x: 0.75 * canvas.height,
		y: 0.54 * canvas.height
	},
]);

let points = bezier([
	{
		x: 0.5,
		y: 0.42,
	},
	{
		x: 0.44,
		y: 0.40,
	},
	{
		x: 0.38,
		y: 0.44,
	},
	{
		x: 0.38,
		y: 0.55,
	},
]);
pointArrays.push(points);

console.log(pointArrays);

ctx.strokeStyle = "#f00";
ctx.lineWidth = 3;
for (let i = 0; i < pointArrays.length; i++) {
	ctx.beginPath();
	for (let j = 0; j < pointArrays[i].length; j++) {
		ctx.lineTo(pointArrays[i][j].x, pointArrays[i][j].y);
	}
	ctx.stroke();
}



// let first = true;
// window.addEventListener("click", function() {
// 	if (first) {
// 		document.getElementById("audio").play();
// 		document.getElementById("audio").playbackRate = 1;
// 		document.getElementById("audio").volume = 0.1;
// 		first = false;
// 		animate();
// 	}
// 	console.log(audio.currentTime);
// });

function map(num, numMin, numMax, mapMin, mapMax) {
	return mapMin + ((mapMax - mapMin) / (numMax - numMin)) * (num - numMin);
}

function distance(a, b) {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}
/** Computes factorial*/
function fact(k) {
	let total = 1;
	for (let i = 2; i <= k; i++) {
		total *= i;
	}
	return total;
}
/**	Computes Bernstain
 *	@param {Integer} i - the i-th index
 *	@param {Integer} n - the total number of points
 *	@param {Number} t - the value of parameter t , between 0 and 1
 **/
function B(i, n, t) {
	return fact(n) / (fact(i) * fact(n - i)) * Math.pow(t, i) * Math.pow(1 - t, n - i);
}
/** Computes a point's coordinates for a value of t
 *	@param {Number} t - a value between o and 1
 *	@param {Array} points - an {Array} of [x,y] coodinates. The initial points
 **/
function P(t, points) {
	let r = {
		x: 0,
		y: 0,
	};
	let n = points.length - 1;
	for (let i = 0; i <= n; i++) {
		r.x += points[i][0] * B(i, n, t);
		r.y += points[i][1] * B(i, n, t);
	}
	return r;
}
/** Computes the drawing/support points for the Bezier curve*/
function computeSupportPoints(points) {
	/** Compute the incremental step*/
	let tLength = 0;
	for (let i = 0; i < points.length - 1; i++) {
		tLength += distance(points[i], points[i + 1]);
	}
	let step = 0.1 / tLength;
	// compute the support points
	let temp = [];
	for (let t = 0; t <= 1; t += step) {
		let p = P(t, points);
		temp.push(p);
	}
	return temp;
}
/* Draws a N grade bezier curve from current point on the context */
function bezier(points) {
	// transform initial arguments into an {x: n, y: n} of [x,y] coordinates
	let initialPoints = [];
	for (let i = 0; i < points.length; i++) {
		initialPoints.push([points[i].x, points[i].y]);
	}
	return computeSupportPoints(initialPoints);
};

// function setPositions(elements, width, newWidth, range, newRange) {
// 	for (let i = 0; i < elements.length; i++) {
// 		elements[i].style.transition = "";
// 		setTimeout(function() {
// 			elements[i].style.width = width + "vh";
// 			elements[i].style.top = (50 - width / 2) + "vh";
// 			elements[i].style.left = 50 - width / 4 + map(i, 0, elements.length - 1, -range, range) + "vw";
// 			elements[i].style.transition = "0.1s";
// 			setTimeout(function() {
// 				elements[i].style.width = newWidth + "vh";
// 				elements[i].style.top = (50 - newWidth / 2) + "vh";
// 				elements[i].style.left = 50 - newWidth / 4 + map(i, 0, elements.length - 1, -newRange, newRange) + "vw";
// 			}, 0);
// 		}, 0)
// 	}
// }

// function randomInt(min, max) {
// 	return Math.round((Math.random() * (max - min)) + min);
// }

// let eventDone = [false, false, false, false, false, false, false, false, false];

// let triangleNumber = 0;

// let numberOfTriangles = 22;
// let timeBetweenEachTriangle = 0.022;
// let triangleFadeOutTime = 0.12; 

// function createTriangle(type, x, y, size, triangleN) {
// 	document.getElementById("triangles-container").innerHTML += `<svg class="intro-triangle" id="triangle-${triangleN}" style="position: absolute; top: ${y}px; left: ${x};" height="${size}" width="${size}">
// 	<polygon points="${size * 3 / 6},${size / 6} ${size * 5 / 6},${size * 5 / 6} ${size / 6},${size * 5 / 6}" style="fill:${(type === 0) ? "white" : "transparent"};stroke:white;stroke-width:2" />
// 	</svg>`
// 	document.getElementById(`triangle-${triangleN}`).querySelector("polygon").style.animationDelay = 1 + triangleN * 0.022 + "s";
// 	document.getElementById(`triangle-${triangleN}`).querySelector("polygon").style.animation = `${triangleFadeOutTime}s ease ${1 + triangleN * timeBetweenEachTriangle}s 1 normal none running fade-in-out`;
// }

// function animate() {
// 	let audio = document.getElementById("audio");
// 	while (triangleNumber <= numberOfTriangles) {
// 		createTriangle(randomInt(0, 1), randomInt(window.innerWidth * 0.25, window.innerWidth * 0.75), randomInt(window.innerHeight * 0.4, window.innerHeight * 0.6), randomInt(10, 90), triangleNumber);
// 		triangleNumber++;
// 	}
// 	if (audio.currentTime >= 0.2 && eventDone[0] === false) {
// 		document.getElementById("intro-text").textContent = "wel";
// 		eventDone[0] = true;
// 	}
// 	if (audio.currentTime >= 0.4 && eventDone[1] === false) {
// 		document.getElementById("intro-text").textContent = "welcome";
// 		eventDone[1] = true;
// 	}
// 	if (audio.currentTime >= 0.6 && eventDone[2] === false) {
// 		document.getElementById("intro-text").textContent = "welcome to";
// 		eventDone[2] = true;
// 	}
// 	if (audio.currentTime >= 0.9 && eventDone[3] === false) {
// 		document.getElementById("intro-text").textContent = "welcome to osu!";
// 		document.getElementById("intro-text").style.letterSpacing = "0.325vh";
// 		eventDone[3] = true;
// 	}
// 	if (audio.currentTime >= 1.6 && eventDone[4] === false) {
// 		let introGamemodes = document.getElementsByClassName("intro-gamemodes");
// 		document.getElementById("intro-text").style.display = "none";
// 		setPositions(document.getElementsByClassName("intro-gamemodes"), 4, 3.5, 25, 24);
// 		eventDone[4] = true;
// 	}
// 	if (audio.currentTime >= 1.8 && eventDone[5] === false) {
// 		let introGamemodes = document.getElementsByClassName("intro-gamemodes");
// 		document.getElementById("intro-text").style.display = "none";
// 		setPositions(document.getElementsByClassName("intro-gamemodes"), 8, 7, 12.5, 11);
// 		eventDone[5] = true;
// 	}
// 	if (audio.currentTime >= 2 && eventDone[6] === false) {
// 		let introGamemodes = document.getElementsByClassName("intro-gamemodes");
// 		document.getElementById("intro-text").style.display = "none";
// 		setPositions(document.getElementsByClassName("intro-gamemodes"), 16, 18, 17.5, 20);
// 		eventDone[6] = true;
// 	}
// 	if (audio.currentTime >= 2.2 && eventDone[7] === false) {
// 		let introGamemodes = document.getElementsByClassName("intro-gamemodes");
// 		document.getElementById("intro-text").style.display = "none";
// 		for (let i = 0; i < introGamemodes.length; i++) {
// 			introGamemodes[i].style.display = "none";
// 		}
// 		eventDone[7] = true;
// 	}
// 	if (audio.currentTime >= 3.1 && eventDone[8] === false) {
// 		let introGamemodes = document.getElementsByClassName("intro-gamemodes");
// 		document.getElementById("intro").style.background = "#fff";
// 		document.getElementById("intro").style.opacity = 0;
// 		for (let i = 0; i < introGamemodes.length; i++) {
// 			introGamemodes[i].style.display = "none";
// 		}
// 		eventDone[8] = true;
// 	}
// 	requestAnimationFrame(animate);
// }