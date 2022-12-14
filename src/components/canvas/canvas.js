import React from "react";
import { useRef, useEffect, useState } from "react";
// import { motion } from "framer-motion"

import rosa from './rosa2.png'; // Tell webpack this JS file uses this image
import './canvas.css'

import Loadable from "@loadable/component"
const Sketch = Loadable(
	() => import("react-p5")
)

const { motion } = require("framer-motion");

const isBrowser = () => typeof window !== "undefined"
const windowWitdh = isBrowser() && window.innerWidth
const windowheight = isBrowser() && window.innerHeight


export default function Canvas() {
	const img = useRef(null)
	const brushDivs = useRef(null)
	let cnv;

	const [cursor, setCursor] = useState({
		x: 0,
		y: 0
	});

	const [shape, setShape] = useState({
		positions: []
	})

	const [shapes, setShapes] = useState([shape])

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
		p5.colorMode(p5.HSB)
		p5.rectMode(p5.CENTER)
		// brush.rosa = p5.loadImage(rosa)
	}

	const draw = (p5) => {
		p5.background(0, 0)
		drawing(p5)
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
			positions: [...shape?.positions, {
				x: p5.mouseX,
				y: p5.mouseY
			}]
		})
	}

	const mouseReleased = (p5) => {
		// const shapeCopy = JSON.parse(JSON.stringify(shapes));
		setShape({
			positions: []
		})

		setShapes([...shapes, shape])
		console.log(shapes);
	}

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

	return (
		// <div style={{ position: "fixed", top: "0rem", zIndex: "1" }}>
		<div onPointerMove={e => {
			setCursor({
				x: e.clientX,
				y: e.clientY
			})
		}}
			style={{
				position: 'relative',
				width: '100vw',
				height: '100vh',
				backgroundColor: "black",
				cursor: "none"
			}}
		>
			{/* framer motio test */}
			{/* <motion.div animate={{ x: 100 }}>
				<div style={motionstyle}></div>
			</motion.div> */}

			{/* cursor brush style */}
			<div style={cursorStyle}></div>

			{/* svg drawings */}

			<div style={{ position: "fixed", top: "0rem", zIndex: "1" }}>
				<svg height={windowheight} width={windowWitdh} fill="yellow">
					<path d={"M" + shape.positions[0]?.x + " " + shape.positions[0]?.y + "L" +
						shape.positions?.map((pos) =>
							+ pos.x + " " + pos.y
						)
						+ " Z"} />
				</svg>
			</div>

			{
				shapes.map((shape) => {
					return (
						<div style={{ position: "fixed", top: "0rem", zIndex: "1" }}>
							<svg height={windowheight} width={windowWitdh} fill="yellow">
								<path d={"M" + shape.positions[0]?.x + " " + shape.positions[0]?.y + "L" +
									shape.positions?.map((pos) =>
										+ pos.x + " " + pos.y
									)
									+ "Z"} />
							</svg>
						</div>
					)
				})
			}

			{/* {
				brush.positions.map((pos) =>
					<div className="brush" ref={brushDivs} style={{ position: "fixed", top: (pos.y - 50) + "px", left: (pos.x - 50) + "px", zIndex: "3" }}>
						<div style={cursorStyle}></div>
					</div>
				)
			} */}

			<Sketch
				style={{ position: "fixed", top: "0rem", zIndex: "1" }}
				setup={setup}
				draw={draw}
				mouseDragged={mouseDragged}
				mouseReleased={mouseReleased}
			/>
		</div>
	)
}

