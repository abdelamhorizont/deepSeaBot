import React from "react";
// import Sketch from "react-p5";
import rosa from './rosa2.png'; // Tell webpack this JS file uses this image

import Loadable from "@loadable/component"

const Sketch = Loadable(
  () => import("react-p5")
);

// export default LoadablePage;

const Canvas = () => {
	let rosaBrush;

	// const isBrowser = () => typeof window !== "undefined"
	// const windowWitdh = isBrowser() && window.screen.width
	// const windowheight = isBrowser() && window.screen.height

   // //  const preload = (p5) => {
	// // 	rosaBrush = p5.loadImage('./rosa2.png');
   // //  }

	const setup = (p5, canvasParentRef) => {
		p5.createCanvas(500, 500).parent(canvasParentRef);
        p5.colorMode(p5.HSB);
	};

	const draw = (p5) => {
		p5.background(0);

		p5.ellipse(p5.mouseX, p5.mouseY, 70, 70);
		// p5.image(rosaBrush, p5.mouseX, p5.mouseY, 200, 200);
	};

	return (
		<div style={{position : "fixed", top : "0rem", zIndex : "1"}}>
			hey
			<Sketch setup={setup} draw={draw} />
		</div>
	)
};

export default Canvas
