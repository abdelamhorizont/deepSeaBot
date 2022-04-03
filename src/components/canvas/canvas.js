import React from "react";
import Sketch from "react-p5";

const Canvas = (props) => {

	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        // p5.background(0, 0, 0);
	};

	const draw = (p5) => {
		p5.background(0, 0, 0);
		p5.ellipse(p5.mouseX, p5.mouseY, 70, 70);
	};

	return (
		<div style={{position : "fixed", top : "0rem", zIndex : "1"}}>
			<Sketch setup={setup} draw={draw} />
		</div>
	)
};

export default Canvas
