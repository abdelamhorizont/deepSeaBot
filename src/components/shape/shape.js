import React from "react";
import { useState, useRef, useEffect } from "react";

import './shape.scss'

import osc from '../../functions/osc.js'

const isBrowser = () => typeof window !== "undefined"
const windowWitdh = isBrowser() && window.innerWidth
const windowHeight = isBrowser() && window.innerHeight

const { motion } = require("framer-motion");

export default function Shape({ shape, noise, live }) {

   useEffect(() => {
      const handleWindowResize = () => {
         windowWitdh = window.innerWidth
         windowHeight = window.innerHeight
      };

      window.addEventListener('resize', handleWindowResize);

      return () => {
         window.removeEventListener('resize', handleWindowResize);
      };
   });

   const [noiseArray, setNoiseArray] = useState(noise)

   const [shapeBoundingBox, setShapeBoundingBox] = useState("1000")
   const shapeObj = useRef()

   useEffect(() => {
      setShapeBoundingBox(shapeObj?.current?.getBoundingClientRect())
   }, [shapeBoundingBox])

   let factor = 40
   let shapeType = shape.type

   function osc(i, cos) {
      if (cos === true) {
         return (
            Math.cos(noise[i]) * factor
         )
      } else {
         return (
            Math.sin(noise[i]) * factor
         )
      }

   }

   shape.positions?.filter(pos => {
      return (pos.x || pos.y) !== undefined;
   })

   const variants = {
      hidden: {
         d: "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " S " +
            shape.positions?.map((pos, i) => + (pos.x) + "," + (pos.y)).join(' ') + " Z",
      },
      visible: {
         d: [
            "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " S " +
            shape.positions?.map((pos, i) => + (pos.x + osc(i)) + "," + (pos.y + osc(i, true))).join(' ') + " Z",
            "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " S " +
            shape.positions?.map((pos, i) => + (pos.x - osc(i)) + "," + (pos.y - osc(i, true))).join(' ') + " Z",
            "M " + (shape?.positions[0]?.x) + "," + shape?.positions[0]?.y + " S " +
            shape.positions?.map((pos, i) => + (pos.x + osc(i)) + "," + (pos.y + osc(i, true))).join(' ') + " Z",
         ],
         // x: [osc(5), -osc(5)],
         // y: [oscY(5), -oscY(5)],
         // fill: ['pink', 'blue', 'pink'],
         // fill: 'black',
         transition: {
            // duration: 1,
            repeat: Infinity,
            duration: osc(5) / 5,
            // when: "beforeChildren",
            // staggerChildren: 0.3,
         },
      },
   }

   const motionstyle = {
      background: "radial-gradient(farthest-side at 50% 50%, blue, transparent",
      width: "100px",
      height: "100px",
      position: "absolute",
   }

   return (
      <div key={shape.key} style={{ position: "fixed", top: "0rem", zIndex: "2", cursor: "none" }}>

         <div key={shape.key} class="wrapper">
            <rect x="0" y="0" width="100%" height="100%" fill="blue" />

            {/* svg shapes */}
            <motion.svg height={windowHeight*1.5} width={windowWitdh} key={shape.key}
            // initial={{ opacity: 1, x: 0, y: 0 }}
            // animate={{ opacity: 1, x: osc(shape.key), y: oscY(shape.key) }}
            >
               {/* inside gradient mask */}
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
                     <stop offset="0%" stopColor="white" />
                     <stop offset="50%" stopColor="blue" />
                     <stop offset="100%" stopColor="lightblue" />
                  </motion.radialGradient>
               </defs>

               {/* image mask */}
               {/* <defs>
                  <pattern id={'imgMask' + shape.key} width="1" height="1"
                     patternContentUnits="objectBoundingBox">
                     <image href={shape.imgSource} x="-0.5" y="0" width="2" height="2" />
                  </pattern>
               </defs> */}

               {/* video mask */}
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

               {(shapeType === "videoShape" || shapeType === "imageShape") &&
                  <motion.path className="shape"
                     ref={shapeObj}
                     initial="hidden"
                     animate="visible"
                     variants={variants}
                     style={{
                        fill: shapeType === "videoShape" ? 'black' : shapeType === "imageShape" ? 'url(#imgMask' + shape.key + ')' : 'url(#gradient1)',
                     }}
                  />
               }

               {shapeType === "videoShape" &&
                  <foreignObject className="video-shape" mask={"url(#mask" + shape.key + ")"} width={shapeBoundingBox?.width} height={shapeBoundingBox?.height} x={shapeBoundingBox?.x} y={shapeBoundingBox?.y}>
                     <video width="100%" height="100%" autoPlay loop webkit-playsinline="true" playsInline>
                        <source src={shape.videoSource} type="video/mp4" />
                     </video>
                  </foreignObject>
               }

               {shapeType === "imageShape" &&
                  <foreignObject className="video-shape" mask={"url(#mask" + shape.key + ")"} width={shapeBoundingBox?.width} height={shapeBoundingBox?.height} x={shapeBoundingBox?.x} y={shapeBoundingBox?.y}>
                     <img src={shape.imgSource} width="100%" height="100%" draggable="false" />
                  </foreignObject>
               }

               {/* softbrush */}
               <defs>
                  <radialGradient id="myGradient">
                     <stop offset="0%" stop-color="rgba(0,0,00,0.5)" />
                     <stop offset="100%" stop-color="rgba(200,200,300,0)" />
                     {/* <stop offset="0%" stop-color="rgba(200,200,200,0.5)" />
                     <stop offset="100%" stop-color="rgba(200,200,300,0)" /> */}
                  </radialGradient>
               </defs>

               <defs>
                  <radialGradient id="softVideo">
                     <stop offset="0%" stop-color="rgba(0,0,0,1)" />
                     <stop offset="100%" stop-color="rgba(0,0,0,0)" />
                  </radialGradient>
               </defs>

               {/* video soft brush */}
               {/* {shapeType === "videoShape" &&
                  shape.positions?.map((pos, i) => {
                     if (i % 2 == 0) {
                        return (
                           <motion.circle cx={pos.x} cy={pos.y} r={80} fill="url('#softVideo')" style={{ opacity: 0.9 }} className="black-circle"
                              animate={{
                                 x: [osc(i), -osc(i), osc(i)],
                                 y: [osc(i, true), -osc(i, true), osc(i, true)],
                                 // r: [50, i],
                                 // r: [50, i * 2 ],
                                 // cx: [ 0, windowWitdh ]
                              }}
                              transition={{
                                 ease: "easeInOut",
                                 duration: osc(5) / 5,
                                 repeat: Infinity,
                                 // repeatType: "mirror",
                              }}
                           />
                        )
                     }
                  })
               } */}

               {live &&
                  shape.positions?.map((pos, i) => {
                     if (i <= 100) {
                        return (
                           <motion.circle cx={pos.x} cy={pos.y} r={i} fill="url('#myGradient')" style={{ opacity: 0.9 }} className="soft-circle"
                              animate={{
                                 x: [osc(i), -osc(i)],
                                 y: [osc(i, true), -osc(i, true)],
                                 r: [50, i],
                                 // r: [50, i * 2 ],
                                 // cx: [ 0, windowWitdh ]
                              }}
                              transition={{
                                 ease: "easeInOut",
                                 duration: noise[i] / 5,
                                 repeat: Infinity,
                                 repeatType: "mirror",
                              }}
                           />
                        )
                     }
                  })
               }
            </motion.svg>
         </div>

      </div>
   )
}

