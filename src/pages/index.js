import * as React from "react"
import { useRef, useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

import Canvas from '../components/canvas/canvas'
import Text from '../components/text/text'
import Brush from '../components/brush/brush'
// import testVideo from '../assets/ocean-glow-up.mp4'

import './reset.scss'

const IndexPage = () => {
  const [noise, setNoise] = useState(1)
  const handle = useFullScreenHandle();

  const getNoise = (noise) => {
    setNoise(noise)
  }

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleFullScreenKey(e) {
    if (e.code.includes("KeyF")) {
      handle.enter()
    }
  }


  function handleFullScreenExitKey(e) {
    if (e.code.includes("Escape")) {
      handle.exit()
    }
  }

  function handleReload(e) {
    if (e.code.includes("KeyR")) {
      window.location.reload(true);
    }
  }


  useEffect(() => {
    window.addEventListener("keydown", handleFullScreenExitKey)
    // handle.active ? setFullScreen(true) : setFullScreen(false)
  }, [handleFullScreenExitKey]);

  useEffect(() => {
    window.addEventListener("keydown", handleFullScreenKey)
    // handle.active ? setFullScreen(true) : setFullScreen(false)
  }, [handleFullScreenKey]);

  useEffect(() => {
    window.addEventListener("keydown", handleReload)
    // handle.active ? setFullScreen(true) : setFullScreen(false)
  }, [handleReload]);


  return (
    <div>
      <FullScreen handle={handle}>

        {/* <div className="text-wrapper">
          <Text text={"OCEAN VIEW"} noise={noise} /> */}
          {/* <Text text={"2023/03/26"} noise={noise} />
          <Text text={"4PM—6PM, 508"} noise={noise} /> */}
          {/* <Text text={"PARADISE AIR"} noise={noise} />
          <Text text={"abdel am meer"} noise={noise} />
        </div> */}

        <Canvas getNoise={getNoise} />
      </FullScreen>

    </div>
  )
}

export default IndexPage
