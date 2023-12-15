import React from 'react'
import { useState } from "react";

import './text.scss'

const { motion } = require("framer-motion");

//now every letter gets one noise value spacing -> make it change to some other values

function map_range(value, low1, high1, low2, high2) {
   return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

export default function Text({ text, noise, pos }) {
   const [noiseArray, setNoiseArray] = useState(noise)
   const [spacing, setspacing] = useState(0)

   function osc(i) {
      // setInterval(() => {
      //    i++
      //    setspacing(Math.sin(noise[i]) + 1)
      // }, 5000)

      return (
         Math.sin(noise[i]) + 1
      )
   }

   // noise = noise.map((value) => value + 'rem')
   // console.log(osc(1));

   const variants = {
      hidden: { letterSpacing: '0rem' },
      visible: (key) => ({
         letterSpacing: [osc(key) + 'rem', osc(key + 10) + 'rem']
         // margin: [noise(key) * 5, osc(key + 10) * 5]
         // letterSpacing: noise
      }),
   }

   String.prototype.map = function (func) {
      let stringArray = this.split("");

      let newStringArray = stringArray.map((item, index) => {
         return func.call(window, item, index, this);
      });

      return newStringArray.join("");
   };

   let textArray = []

   text?.map(function (letter, i) {
      textArray.push(letter)
   })

   text = textArray?.map((letter, i) =>
      <motion.span
         initial="hidden"
         animate="visible"
         key={i}
         custom={i}
         transition={{
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            // duration: 1,
            duration: noise[i]/3,
         }}
         variants={variants}
      >
         {letter}
      </motion.span>
   )

   return (
      <div className="text-wrapper">      
      <motion.div
         className='text'
         style={{marginTop: 45 + 'vh'}}
         // style={{marginTop: pos + 'vh'}}
         // initial="hidden"
         // animate={{ marginLeft: [osc(1) * 5, osc(10) * 5] }}
         // key={text}
         // transition={{
         //    repeat: Infinity,
         //    repeatType: "mirror",
         //    ease: "easeInOut",
         //    duration: 1,
         // }}
      >
         <p>{text}
         </p>
      </motion.div>
      </div>
   )
}
