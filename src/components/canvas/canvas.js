import React from "react";
import { useRef } from "react";
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
	// const img = useRef(null)
	let cnv;
	let incr = 0
	let osc

	let brush = {
		color: rosa,
		positions: []
	}

	let mouse = {
		positions: []
	}

	const setup = (p5, canvasParentRef) => {
		cnv = p5.createCanvas(windowWitdh, windowheight).parent(canvasParentRef)
		p5.colorMode(p5.HSB)
		p5.rectMode(p5.CENTER)
		brush.rosa = p5.loadImage(rosa)
	}

	const draw = (p5) => {
		p5.background(0)

		cursor(p5)
		drawing(p5)
	}

	const cursor = (p5) => {
		p5.imageMode(p5.CENTER);
		p5.image(brush.rosa, p5.mouseX, p5.mouseY, 200, 200);
		// img.current.style = "position: fixed; top:" + (p5.mouseY - img.current.offsetHeight/2) + "px; left:" + (p5.mouseX - img.current.offsetWidth/2) + "px;"
	}

	const drawing = (p5) => {
		brush.positions = [...mouse.positions]
		brush.positions.map((pos) => {
			p5.image(brush.rosa, pos.x + osc, pos.y, 200, 200)
			incr += 0.01
			osc = Math.sin(incr) * 100
		})
	}

	const mouseDragged = (p5) => {
		mouse.positions.push({ x: p5.mouseX, y: p5.mouseY })
	}

	return (
		<div style={{ position: "fixed", top: "0rem", zIndex: "1" }}>
			{/* <div ref={img}><img src={rosa} alt="rosa" /></div> */}
			<Sketch
				setup={setup}
				draw={draw}
				mouseDragged={mouseDragged}
			/>
		</div>
	)
}

