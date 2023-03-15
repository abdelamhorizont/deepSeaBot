import * as React from "react"
import { useRef, useEffect, useState } from "react";

import Canvas from '../components/canvas/canvas'
import Text from '../components/text/text'
import Brush from '../components/brush/brush'
import testVideo from '../assets/ocean-glow-up.mp4'

import './reset.scss'

const IndexPage = () => {
  const [noise, setNoise] = useState(1)

  const getNoise = (noise) => {
    setNoise(noise)
  }

  return (
    <div>
      {/* <Text text={"kamiyagiri"} noise={noise} /> */}
      <Canvas getNoise={getNoise} />
    </div>
  )
}

export default IndexPage
