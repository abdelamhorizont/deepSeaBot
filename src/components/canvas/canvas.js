import React from "react";
import { useEffect, useState } from "react";
import _ from 'lodash'

import Shape from "../shape/shape";
import Text from '../text/text'

import './canvas.scss'
import Loadable from "@loadable/component"

function importAll(r) {
	let images = {};
	r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
	return images
}

const images = importAll(require.context('../../assets/images', false, /\.(png|jpe?g|svg)$/));
const videos = importAll(require.context('../../assets/videos', false, /\.(mp4)$/));

const Sketch = Loadable(
	() => import("react-p5")
)

// const { motion } = require("framer-motion");

const isBrowser = () => typeof window !== "undefined"
const windowWidth = isBrowser() && window.innerWidth
const windowHeight = isBrowser() && window.innerHeight

let capture;
let vScale = 16;

// Store the x,y position of brightest pixel
let brightLoc = {
	x: 0,
	y: 0
};

let v

let brightOn = false
let brightOff = true

const devices = [];

export default function Canvas({ getNoise }) {
	// let textArray = [
	// 	// "OCEAN VIEW, PARADISE AIR, abdel am meer",
	// 	"",
	// 	"",
	// 	// "البحر الأبيض  \n MARE MEDITERRANEUM  \n AKDENIZ  ",
	// 	// "The Mediterranean Sea as a border, \n as a place, as a space", 
	// 	// "- for wind, waves and ground, \n for journeys, for escape,",
	// 	//  "for sea dwellers, cargo ships \n and narratives,",
	// 	//   "for longing, for memories, \n for stagnation, for movement, for currents.",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "",
	// 	  "Black Feminist Lessons from Marine Mammals by Alexis Pauline Gumbs,",
	// 	  "‚Saying Water‘, a monologue by Roni Horn",
	// 	  "PURPLE SEA — Amel Alzakout"
	// ]

	let textArray = [
		"OCEAN VIEW, PARADISE AIR, abdel am meer",
		'',
		'',
		"the ocean as a place",
		"the ocean as a space",
		"beautiful glowing bubbles rising to the surface in 4K",
		"mysticly glowing jellyfish, can I touch?",
		"60fps smooth and soothing movement of seaweed",
		"if i was a fish what kind of one would I be?",
		// "„International law doesn’t protect citizens of an island that has submerged under the ocean“ — Erum Jaffery), aj+",
		"if I had to flee where would I go to?",
		"Water surrounding people, water cutting through people",
		"In the night the water is heavy, deep and ominous",
		"cold, vast and terrifying",
		"'I am not afraid of death because I know that I am already dead'says Tierry",
		"'the only salvation is the sea'",
		"how long did the turtle live?"
	]

	const [text, setText] = useState(textArray[0])
	const [textCount, setTextCount] = useState(0)
	const [textPos, settextPos] = useState(50)

	const [videoCount, setvideoCount] = useState(0)
	const [imgCount, setImgCount] = useState(0)

	let videoArray = Object.keys(videos).map(function (k) { return videos[k] });
	let video = videoArray[videoCount].default
	let imageArray = Object.keys(images).map(function (k) { return images[k] });
	let image = imageArray[imgCount].default

	let noiseArray = []

	const [noise, setNoise] = useState([
		0.78,
		0.8,
		0.84,
		0.91,
		1.07,
		1.19,
		1.32,
		1.56,
		1.73,
		1.77,
		1.78,
		1.87,
		2.08,
		2.3,
		2.47,
		2.63,
		2.86,
		3.09,
		3.06,
		2.72,
		2.51,
		2.72,
		3.1,
		3.3,
		3.42,
		3.58,
		3.67,
		3.67,
		3.84,
		4.3,
		4.64,
		4.8,
		5.02,
		5.27,
		5.45,
		5.5,
		5.27,
		4.8,
		4.42,
		4.27,
		4.24,
		4.35,
		4.63,
		4.99,
		5.28,
		5.46,
		5.44,
		5.31,
		5.36,
		5.65,
		5.88,
		5.82,
		5.57,
		5.41,
		5.3,
		5.27,
		5.49,
		5.96,
		6.31,
		6.43,
		6.44,
		6.5,
		6.61,
		6.66,
		6.63,
		6.67,
		6.85,
		7.04,
		7.1,
		7.14,
		7.1,
		6.8,
		6.26,
		5.74,
		5.38,
		5.01,
		4.5,
		4.02,
		3.88,
		4.02,
		4.13,
		4.14,
		4.21,
		4.43,
		4.73,
		5.06,
		5.24,
		5.28,
		5.49,
		5.91,
		6.16,
		5.96,
		5.54,
		5.3,
		5.35,
		5.39,
		5.28,
		5.23,
		5.41,
		5.66,
		5.77,
		5.75,
		5.61,
		5.24,
		4.6,
		4.13,
		3.94,
		3.8,
		3.65,
		3.65,
		3.64,
		3.61,
		3.73,
		4.13,
		4.75,
		5.25,
		5.46,
		5.52,
		5.55,
		5.5,
		5.46,
		5.45,
		5.48,
		5.62,
		5.87,
		6.06,
		6.09,
		6.04,
		6.05,
		6.13,
		6.3,
		6.64,
		7.09,
		7.37,
		7.34,
		7.35,
		7.48,
		7.6,
		7.78,
		8.15,
		8.34,
		8.08,
		7.54,
		7.15,
		7.02,
		6.78,
		6.4,
		6.12,
		5.87,
		5.52,
		5.14,
		4.59,
		3.9,
		3.44,
		3.37,
		3.35,
		3.17,
		3.02,
		3.22,
		3.69,
		3.95,
		3.78,
		3.53,
		3.51,
		3.55,
		3.68,
		4.01,
		4.43,
		4.75,
		5.04,
		5.33,
		5.6,
		5.75,
		5.73,
		5.54,
		5.52,
		5.75,
		6.11,
		6.51,
		6.88,
		7.03,
		6.93,
		6.63,
		6.18,
		5.79,
		5.48,
		5.27,
		5.2,
		5.24,
		5.19,
		5.08,
		5.02,
		4.97,
		4.84,
		4.7,
		4.75,
		5.1,
		5.56,
		5.83,
		6.03
	 ])

	const [cursor, setCursor] = useState({
		x: 0,
		y: 0
	})

	let shapeTypesArray = ['videoShape', 'imageShape']
	// let shapeTypesArray = ['softShape', 'videoShape', 'imageShape', 'text']

	const [shapeTypeCount, setShapeTypeCount] = useState(1)
	const [shapeType, setShapeType] = useState(shapeTypesArray[shapeTypeCount])
	const [shape, setShape] = useState({
		osc: 0,
		key: 0,
		type: '',
		videoSource: '',
		imgSource: '',
		positions: [],
	})

	const [shapeCount, setshapeCount] = useState(0)
	const [lightSource, setlightSource] = useState(false)

	const [shapes, setShapes] = useState([shape])
	const [activeShapes, setActiveShapes] = useState(shapes)
	const [arrayLimitBool, setarrayLimitBool] = useState(false)

	// const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	// const [windowHeight, setWindowHeight] = useState(window.innerHeight);

	// useEffect(() => {
	// 	const handleWindowResize = () => {
	// 		setWindowWidth(window.innerWidth);
	// 		setWindowHeight(window.innerHeight);
	// 		// windowWidth = window.innerWidth
	// 		// windowHeight = window.innerHeight
	// 	};

	// 	window.addEventListener('resize', handleWindowResize);

	// 	return () => {
	// 		window.removeEventListener('resize', handleWindowResize);
	// 	};
	// });

	// useEffect(() => {
	// 	const handleWindowResize = () => {
	// 		setWindowWidth(window.innerWidth);
	// 		setWindowHeight(window.innerHeight);
	// 		// windowWidth = window.innerWidth
	// 		// windowHeight = window.innerHeight
	// 	};

	// 	window.addEventListener('resize', handleWindowResize);

	// }, [])


	shapes.filter(() => {
		return shapes.positions?.length > 1;
	})

	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(windowWidth, windowHeight*1.5).parent(canvasParentRef)

		for (let i = 0; i < 10; i += 0.05) {
			noiseArray.push(Math.round((p5.noise(i) * 10) * 100) / 100)
		}

		getNoise(noise)

		p5.pixelDensity(1);
	
		navigator.mediaDevices.enumerateDevices()
		.then(gotDevices);

			 var constraints = {
				video: {
				  deviceId: {
					 exact: "GXijeroR+hrr8SuZHCjrqw6SwlUhAc6nnu6LA79gWPU="
				  },
				}
			 };

			 capture = p5.createCapture(p5.VIDEO);
			 capture.size(p5.width / vScale, p5.height / vScale);


		p5.frameRate(10);
		p5.colorMode(p5.HSB, 255);

		v = p5.createVector(brightLoc.x, brightLoc.y);
	}


	function gotDevices(p5, deviceInfos) {
		if (!navigator.mediaDevices?.enumerateDevices) {
			console.log("enumerateDevices() not supported.");
		 } else {
			// List cameras and microphones.
			navigator.mediaDevices
			  .enumerateDevices()
			  .then((devices) => {
				 devices.forEach((device) => {
					console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
				 });
			  })
			  .catch((err) => {
				 console.error(`${err.name}: ${err.message}`);
			  });
		 }

	 }

	const draw = (p5) => {
		// p5.image(capture, 0, 0, p5.width, p5.height);
		// p5.background(0);

		// Store the brightest value we've found
		let brightest = 0;

		// Iterate through webcam image pixel by pixel
		capture.loadPixels();
		p5.loadPixels();

		for (var x = 0; x < capture.width; x += 1) {
			for (var y = 0; y < capture.height; y += 1) {
				var index = (capture.width - x + 1 + (y * capture.width)) * 4;
				var r = capture.pixels[index + 0];
				var g = capture.pixels[index + 1];
				var b = capture.pixels[index + 2];

				let c = p5.color(r, g, b);
				var bright = p5.brightness(c);

				// var bright = (r * g * b)/3;
				// p5.fill(bright);
				// p5.rect(x * vScale, y * vScale, vScale, vScale);

				if (bright > brightest) {
					brightest = bright;

					if (brightest > 20^0) {
						let pos = p5.createVector(x, y);
						v.lerp(pos, 0.5)

						brightLoc.x = v.x * vScale;
						brightLoc.y = v.y * vScale;
					}

				}
			}
		}

		if (brightest > 250) {
			brightOn = true
			brightOff = false

		} else {
			brightOn = false
			brightOff = true
		}

		// p5.fill(255);
		// p5.ellipse(brightLoc.x, brightLoc.y, 100, 100);
	}

	const mouseDragged = (p5) => {
		setShape({
			...shape,
			positions: [...shape?.positions, {
				x: Math.floor(p5.mouseX),
				y: Math.floor(p5.mouseY)
			}]
		})
	}

	const mouseReleased = (p5) => {
		setShape({
			...shape,
			key: shapeCount,
			type: shapeType,
			videoSource: video,
			imgSource: image,
			positions: [],
		})

		setShapes([...shapes, shape])

	}

	const windowResized = (p5) => {
		p5.resizeCanvas(windowWidth, windowHeight)
	}

	useEffect(() => {
		if (shapes.length > 0) {
			setarrayLimitBool(true)
		}

		if (arrayLimitBool) {
			setActiveShapes(shapes.shift())
		}

		if (shapeType !== 'softShape') {
			setvideoCount((prev) => prev += 1)
			setImgCount((prev) => prev += 1)
		}

		setshapeCount((prev) => prev += 1)

		setActiveShapes(shapes)

		setShapeType(shapeTypesArray[shapeTypeCount])
		setShapeTypeCount((prev) => prev += 1)

		if (shapeTypeCount >= shapeTypesArray.length - 1) {
			setShapeTypeCount(0)
		}

		if (videoCount >= videoArray.length - 1) {
			setvideoCount(0)
		}

		if (imgCount >= imageArray.length - 1) {
			setImgCount(0)
		}

		if (textCount >= textArray.length - 1) {
			setTextCount(0)
		}

			setTextCount((prev) => prev += 1)
			// settextPos(Math.floor(Math.random() * 95))
			setText(textArray[textCount])
	}, [shapes])

	useEffect(() => {
		setCursor({
			x: brightLoc.x,
			y: brightLoc.y
		})

		setlightSource(brightOn)

		if (lightSource) {
			setShape({
				...shape,
				positions: [...shape?.positions, {
					x: Math.floor(brightLoc.x),
					y: Math.floor(brightLoc.y)
				}]
			})
		}
	}, [draw])

	useEffect(() => {
		if (!lightSource) {
			setShape({
				...shape,
				key: shapeCount,
				type: shapeType,
				videoSource: video,
				imgSource: image,
				positions: [],
			})

			setShapes([...shapes, shape])
		}
	}, [lightSource])


	// class NoiseLoop {
	// 	constructor(diameter, min, max) {
	// 		this.diameter = diameter;
	// 		this.min = min;
	// 		this.max = max;
	// 		this.cx = Math.random(1000);
	// 		this.cy = Math.random(1000);
	// 	}

	// 	value(p5, a) {
	// 		let xoff = p5.map(p5.cos(a), -1, 1, this.cx, this.cx + this.diameter);
	// 		let yoff = p5.map(p5.sin(a), -1, 1, this.cy, this.cy + this.diameter);
	// 		let r = p5.noise(xoff, yoff);
	// 		return p5.map(r, 0, 1, this.min, this.max);
	// 	}
	// }

	const cursorStyle = {
		transform: `translate(${cursor.x - 50}px, ${cursor.y - 50}px)`,
		// background: "blue",
		background: "radial-gradient(farthest-side at 50% 50%, rgba(0,100,100,0.8), transparent",
		width: "100px",
		height: "100px",
		position: "absolute",
		zIndex: "1000"
	}

	return (
		<div onPointerMove={e => {
			setCursor({
				x: e.clientX,
				y: e.clientY
			})
		}}
			className="canvas-wrapper"
			style={{
				backgroundColor: "rgba(0,0,200,1)",
				// background: "linear-gradient(rgba(0,0,255,1), rgba(0,0,100,1), rgba(0,0,255,1))",
				// cursor: "none",
				zIndex: "10"
			}}
		>

			<Sketch
				style={{ position: "fixed", top: "0rem", zIndex: "1" }}
				setup={setup}
				draw={draw}
				mouseDragged={mouseDragged}
				mouseReleased={mouseReleased}
				windowResized={windowResized}
			/>

			<div style={cursorStyle} className="custom-cursor"></div>

			{activeShapes?.length > 0 &&
				activeShapes.map((shape, i) => {
					if (shape.positions.length > 0) {
						return (
							<Shape shape={shape} noise={noise} />
						)
					}
				})
			}

			<Shape shape={shape} noise={noise} live={false} />
			<Text text={text} noise={noise} pos={textPos} />

		</div>
	)
}

