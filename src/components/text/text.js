import React from 'react'

import './text.scss'

const { motion } = require("framer-motion");


function map_range(value, low1, high1, low2, high2) {
   return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


export default function Text({ text, noise }) {
   function osc(i) {
      return (
         Math.sin(noise[i]) + 1
      )
   }

   const variants = {
      hidden: { letterSpacing: '0rem' },
      visible: (key) => ({
         letterSpacing: [osc(key) + 'rem', osc(key + 10) + 'rem']
      }),
   }

   const isBrowser = () => typeof window !== "undefined"
   const windows = isBrowser() && window

   String.prototype.map = function (func) {
      let stringArray = this.split("");

      let newStringArray = stringArray.map((item, index) => {
         return func.call(windows, item, index, this);
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
            duration: noise[i] / 3,
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
            style={{ marginTop: 45 + 'vh' }}
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
