import React from "react";
import { useState, useRef, useEffect } from "react";
import './shape.scss'

import osc from '../../functions/osc.js'
import testImg from '../../assets/tree.jpg'
import testVideo from '../../assets/ocean-glow-up.mp4'

const isBrowser = () => typeof window !== "undefined"
const windowWitdh = isBrowser() && window.innerWidth
const windowheight = isBrowser() && window.innerHeight

const { motion } = require("framer-motion");

export default function Shape({ shape, noise, video }) {
   const [noiseArray, setNoiseArray] = useState(noise)

   const [shapeBoundingBox, setShapeBoundingBox] = useState("1000")
   const shapeObj = useRef()

   useEffect(() => {
      setShapeBoundingBox(shapeObj?.current?.getBoundingClientRect())
   }, [shapeBoundingBox])

   function osc(i) {
      return (
         Math.sin(noise[i]) * 10
         // 15
      )
   }

   function oscY(i) {
      return (
         Math.cos(noise[i]) * 10
         // 15
      )
   }

   shape.positions?.filter(pos => {
      return (pos.x || pos.y) !== undefined;
   })

   const variants = {
      hidden: {
         d: "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " Q " +
            shape.positions?.map((pos, i) => + (pos.x) + "," + (pos.y)).join(' ') + " Z",
      },
      visible: {
         d: [
            "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " Q " +
            shape.positions?.map((pos, i) => + (pos.x + osc(i)) + "," + (pos.y + oscY(i))).join(' ') + " Z",
            "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " Q " +
            shape.positions?.map((pos, i) => + (pos.x - osc(i)) + "," + (pos.y - oscY(i))).join(' ') + " Z",
            "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " Q " +
            shape.positions?.map((pos, i) => + (pos.x + osc(i)) + "," + (pos.y + oscY(i))).join(' ') + " Z",
         ],
         // fill: ['pink', 'blue', 'pink'],
         // fill: 'black',
         transition: {
            duration: 1,
            repeat: Infinity,
            // when: "beforeChildren",
            // staggerChildren: 0.3,
         },
      },
   }

   const softBrushVariants = {
      visible: (brush) => ({
         x: [osc(brush.key), -osc(brush.key), osc(brush.key)],
         y: [oscY(brush.key), -oscY(brush.key), oscY(brush.key)],
         // background: [
         //    "radial-gradient(farthest-side at 50% 50%," + 'black' + " , transparent",
         //    "radial-gradient(farthest-side at 50% 50%," + 'cyan' + " , transparent",
         //    "radial-gradient(farthest-side at 50% 50%," + 'black' + " , transparent"],
         transition: {
            ease: "easeInOut",
            duration: 1,
            repeat: Infinity,
         },
      })
   }

   const motionstyle = {
      background: "radial-gradient(farthest-side at 50% 50%, blue, transparent",
      width: "100px",
      height: "100px",
      position: "absolute",
   }

   return (
      <div key={shape.key} style={{ position: "fixed", top: "0rem", zIndex: "2" }}>

         {/* softBrush */}
         {
            shape.positions?.map((pos, i) => {
               let brushWidth = 120

               let brush = {
                  color: 'white',
                  width: 120,
                  x: pos.x - brushWidth / 2,
                  y: pos.y - brushWidth / 2,
                  key: i
               }

               return (
                  <motion.div
                     // variants={softBrushVariants}
                     animate={{
                        x: [osc(brush.key), -osc(brush.key), osc(brush.key)],
                        y: [oscY(brush.key), -oscY(brush.key), oscY(brush.key)],
                     }}
                     // custom={brush}
                     // key={i}
                     style={{
                        background: "radial-gradient(farthest-side at 50% 50%," + 'black' + " , transparent",
                        width: brush.width,
                        height: brush.width,
                        position: "absolute",
                        top: brush.y,
                        left: brush.x,
                        color: 'white',
                        opacity: 0.5,
                        zIndex: 10
                     }}
                  >
                  </motion.div>
               )
            })
         }

         <div key={shape.key} class="wrapper">
            {/* <video key={"key"} width="100%" height="100%" muted autoPlay loop webkit-playsinline="true" playsInline>
               <source src={testVideo} type="video/mp4" />
            </video> */}
            <rect x="0" y="0" width="100%" height="100%" fill="blue" />

            {/* svg shapes */}
            <motion.svg height={windowheight} width={windowWitdh} key={shape.key}
               initial={{ opacity: 1, x:0, y: 0 }}
               animate={{ opacity: 1, x: osc(shape.key), y: oscY(shape.key) }}
               transition={{
                  duration:1
               }}
            >
               <defs>
                  <motion.radialGradient
                     id="gradient1"
                     fr={0.1}
                     fx={0.32}
                     fy={0.32}
                     r={1.5}
                     key={shape.key}
                     // spreadMethod={"reflect"}
                     animate={{ fr: 0.05, fx: 0.2, fy: 0.2, r: 6 }}
                     transition={{
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        duration: 3,
                     }}
                  >
                     <stop offset="0%" stopColor="red" />
                     <stop offset="50%" stopColor="blue" />
                     <stop offset="100%" stopColor="lightblue" />
                  </motion.radialGradient>
               </defs>

               <defs>
                  <pattern id="img1" width="1" height="1"
                     patternContentUnits="objectBoundingBox">
                     <image href={testImg} x="-0.5" y="0" width="2" height="2" />
                  </pattern>
               </defs>

               {/* <defs>
                  <pattern id="video" width="1" height="1"
                     patternContentUnits="objectBoundingBox">
                     <foreignObject width="1000" height="2" x="0.5" y="0">
                        <video key={"key"} width="2" height="100" muted autoPlay loop webkit-playsinline="true" playsInline>
                           <source src={testVideo} type="video/mp4" />
                        </video>
                     </foreignObject>
                  </pattern>
               </defs> */}

               <defs>
                  <mask id={'mask' + shape.key} x="0" y="0" width="100%" height="100%" >
                     <rect x="0" y="0" width="100%" height="100%" fill="white" />

                     <mask id={'invertMask' + shape.key} x="0" y="0" width="100%" height="100%">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />

                        <motion.path className="shape"
                           initial="hidden"
                           animate="visible"
                           variants={variants}
                        />

                     </mask>
                     <rect mask={"url(#invertMask" + shape.key + ")"} x="0" y="0" width="100%" height="100%" fill="black" />

                  </mask>
               </defs>

               {
                  <motion.path className="shape"
                     ref={shapeObj}
                     initial="hidden"
                     animate="visible"
                     variants={variants}
                     style={{
                        // fill: 'url(#gradient1)',
                        // fill: 'url(#img1)',
                        fill: 'black',
                     }}
                  />
               }

               <foreignObject className="video-shape" mask={"url(#mask" + shape.key + ")"} width={shapeBoundingBox?.width} height={shapeBoundingBox?.height} x={shapeBoundingBox?.x} y={shapeBoundingBox?.y}>
                  <video key={"key"} width="100%" height="100%" muted autoPlay loop webkit-playsinline="true" playsInline>
                     <source src={testVideo} type="video/mp4" />
                  </video>
               </foreignObject>


               {/* <image href={testImg} x="-0.5" y="0" width="800" height="800" />
            <rect x="0" y="0" width="1000" height="800" fill="yellow" mask="url(#myMask)" /> */}

            </motion.svg>
         </div>

      </div>
   )
}

