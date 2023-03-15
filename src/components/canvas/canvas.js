import React from "react";
import { useRef, useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion"

import Shape from "../shape/shape";

import rosa from './rosa2.png'; // Tell webpack this JS file uses this image
import testVideo from '../../assets/ocean-glow-up.mp4'

import './canvas.scss'

import Loadable from "@loadable/component"
const Sketch = Loadable(
	() => import("react-p5")
)

const { motion } = require("framer-motion");

const isBrowser = () => typeof window !== "undefined"
const windowWitdh = isBrowser() && window.innerWidth
const windowheight = isBrowser() && window.innerHeight

export default function Canvas({ getNoise }) {
	let cnv;
	let noiseArray = []

	const [xoff, setxoff] = useState(0)
	const [noise, setNoise] = useState([0])

	const [cursor, setCursor] = useState({
		x: 0,
		y: 0
	})

	const [shape, setShape] = useState({
		positions: [],
		osc: 0,
		key: 0
	})

	const [shapes, setShapes] = useState([shape])
	shapes.filter(() => {
		return shapes.positions?.length > 1;
	})

	const [brush, setBrush] = useState({
		color: rosa,
		positions: [],
		osc: {
			x: 0,
			y: 0
		}
	})

	const setup = (p5, canvasParentRef) => {
		cnv = p5.createCanvas(windowWitdh, windowheight).parent(canvasParentRef)

		for (let i = 0; i < 10; i += 0.05) {
			noiseArray.push(Math.round((p5.noise(i) * 10) * 100) / 100)
			setNoise(noiseArray)
			getNoise(noiseArray)
		}

	}

	const draw = (p5) => {
		p5.background(0, 0)
	}

	const drawing = (p5) => {
		// brush.positions = [...mouse.positions]
		// brush.positions.map((pos) => {
		// p5.image(brush.rosa, pos.x + brush.osc.x, pos.y + brush.osc.y, 200, 200)

		// incr += 0.4

		// let x = p5.map(p5.noise(incr), 0, 1, 0, 4);
		// brush.osc.x = p5.sin(incr) * x
		// brush.osc.y = p5.cos(incr) * x

		// const newDiv = document.createElement("div");
		// console.log(newDiv);
		// newDiv.style.backgroundColor = "blue"
		// newDiv.current.style = "position: fixed; top:" + (p5.mouseY - img.current.offsetHeight/2) + "px; left:" + (p5.mouseX - img.current.offsetWidth/2) + "px;"
		// })
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
		// const shapeCopy = JSON.parse(JSON.stringify(shapes));
		setShape({
			...shape,
			positions: [],
			key: shapes.length
		})

		setShapes([...shapes, shape])
	}
	// console.log(shapes);

	class NoiseLoop {
		constructor(diameter, min, max) {
			this.diameter = diameter;
			this.min = min;
			this.max = max;
			this.cx = Math.random(1000);
			this.cy = Math.random(1000);
		}

		value(p5, a) {
			let xoff = p5.map(p5.cos(a), -1, 1, this.cx, this.cx + this.diameter);
			let yoff = p5.map(p5.sin(a), -1, 1, this.cy, this.cy + this.diameter);
			let r = p5.noise(xoff, yoff);
			return p5.map(r, 0, 1, this.min, this.max);
		}
	}

	const cursorStyle = {
		transform: `translate(${cursor.x - 50}px, ${cursor.y - 50}px)`,
		background: "radial-gradient(farthest-side at 50% 50%, blue, transparent",
		width: "100px",
		height: "100px",
	}

	const motionstyle = {
		background: "radial-gradient(farthest-side at 50% 50%, blue, transparent",
		width: "100px",
		height: "100px",
		position: "absolute",
	}

	const variants = {
		initial: { opacity: 1 },
		animate: { opacity: 1 }
	}

	return (
		<div onPointerMove={e => {
			setCursor({
				x: e.clientX,
				y: e.clientY
			})
		}}
			className="canvas-wrapper"
		>
			{/* framer motion test */}
			{/* <AnimatePresence> */}
			<motion.div
				// initial={false}
				variants={variants}
				initial="initial"
				animate="animate"
				transition={{
					ease: "easeInOut",
					duration: 1,
					repeat: Infinity,
				}}
			>
				<div style={motionstyle}></div>
			</motion.div>

			{/* cursor brush style */}
			<div style={cursorStyle} className=""></div>

			{/* svg drawings */}

			{/* background */}
			{/* <motion.svg height={windowheight} width={windowWitdh} >
				<defs>
					<motion.radialGradient
						id="bGgradient"
						fr={0.2}
						fx={0.32}
						fy={0.32}
						r={0.7}
						animate={{ fr: 0.05, fx: 0.2, fy: 0.35, r: 0.6 }}
						transition={{
							repeat: Infinity,
							repeatType: "mirror",
							ease: "easeInOut",
							duration: 3,
						}}
					>
						<stop offset="0%" stopColor="blue" />
						<stop offset="100%" stopColor="FloralWhite" />
					</motion.radialGradient>
				</defs>

				<rect
					width="100"
					height="100"
					fill='url(bGgradient)'
				/>

				<motion.path className="shape"
					initial={{
						fill: 'url(bGgradient)'
					}}
				/>

			</motion.svg> */}



			<Sketch
				style={{ position: "fixed", top: "0rem", zIndex: "1" }}
				setup={setup}
				draw={draw}
				mouseDragged={mouseDragged}
				mouseReleased={mouseReleased}
			/>

			{shapes?.length > 0 &&
				shapes.map((shape, i) => {
					// console.log(shape);
					if (shape.positions.length > 1) {
						return (
							<Shape key={i} shape={shape} noise={noise} video={testVideo} />
						)
					}
				})
			}
			
			<Shape shape={shape} noise={noise} />

		</div>
	)
}

