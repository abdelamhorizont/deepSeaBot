import React from "react";
import { useRef, useEffect, useState } from "react";
// import Sketch from "react-p5";
import rosa from './rosa2.png'; // Tell webpack this JS file uses this image

import Loadable from "@loadable/component"

const Sketch = Loadable(
	() => import("react-p5")
)

const isBrowser = () => typeof window !== "undefined"
const windowWitdh = isBrowser() && window.innerWidth
const windowheight = isBrowser() && window.innerHeight


export default function Canvas() {
	const img = useRef(null)
	const brushDivs = useRef(null)
	let cnv;
	let incr = 0
	// let osc

	const [brush, setBrush] = useState({
		color: rosa,
		positions: [],
		osc: {
			x: 0,
			y: 0
		}
	})

	let positions = [1, 2, 3, 4]

	// let brush = {
	// 	color: rosa,
	// 	positions: [],
	// 	osc: {
	// 		x: 0,
	// 		y: 0
	// 	}
	// }

	// const [mouse, setMouse] = useState({
	// 	positions: []
	// })

	let mouse = {
		positions: []
	}

	const setup = (p5, canvasParentRef) => {
		cnv = p5.createCanvas(windowWitdh, windowheight).parent(canvasParentRef)
		p5.colorMode(p5.HSB)
		p5.rectMode(p5.CENTER)
		brush.rosa = p5.loadImage(rosa)
		// console.log(img.current)

	}

	const draw = (p5) => {
		p5.background(0)

		cursor(p5)
		drawing(p5)
	}

	const cursor = (p5) => {
		// p5.imageMode(p5.CENTER);
		// p5.image(brush.rosa, p5.mouseX, p5.mouseY, 200, 200);
		img.current.style = "position: fixed; top:" + (p5.mouseY - img.current.offsetHeight / 2) + "px; left:" + (p5.mouseX - img.current.offsetWidth / 2) + "px;"
		// console.log(brushDivs.current)
		// brushDivs.current.style = "position: fixed; top:" + 100 + "px; left:" + 100 + "px;"

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
		mouse.positions.push({ x: p5.mouseX, y: p5.mouseY })
		setBrush(prevState => ({
			...prevState,
			positions: [...prevState.positions, ...mouse.positions]
		}))

		console.log(brush)
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

	const divStyle = { 
		background: "radial-gradient(farthest-side at 50% 50%, pink, green, transparent",		
		width: "100px", 
		height: "100px" 
	}

	return (
		<div style={{ position: "fixed", top: "0rem", zIndex: "1" }}>
			<div ref={img}><div style={divStyle}></div></div>

			{
				brush.positions.map((pos) =>
					<div ref={brushDivs} style={{ position: "fixed", top: (pos.y - 50) + "px", left: (pos.x - 50) + "px", zIndex: "3" }}>
						<div style={divStyle}></div>
					</div>
				)
			}

			<Sketch
				setup={setup}
				draw={draw}
				mouseDragged={mouseDragged}
			/>
		</div>
	)
}

