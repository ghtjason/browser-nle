import { useContext, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { FabricContext } from "../context/FabricContext";
import { Center } from "@chakra-ui/react";

export default function Player() {
  function autoScaleCanvas(canvas: fabric.Canvas | null) {
    if (canvas && canvas.getContext()) {
      const container = document.getElementById("playerContainer");
      if (container) {
        const scale = Math.min(
          container.offsetWidth / canvas.getWidth(),
          container.offsetHeight / canvas.getHeight()
        );

        canvas.setZoom(canvas.getZoom() * scale);
        canvas.setHeight(canvas.getHeight() * scale);
        canvas.setWidth(canvas.getWidth() * scale);
      }
    }
  }

  function CanvasApp() {
    const [canvas, initCanvas] = useContext(FabricContext);
    const canvasEl = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      const options = {
        height: 1080,
        width: 1920,
        preserveObjectStacking: true,
        selection: false,
      };
      const canvas = new fabric.Canvas(canvasEl.current, options);
      initCanvas(canvas);

      return () => {
        canvas.dispose();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const container = document.getElementById("playerContainer");

    let throttle: number;
    function throttledScaleCanvas() {
      if (throttle) clearTimeout(throttle);
      // 0 ms callback prevents flashing
      throttle = setTimeout(() => autoScaleCanvas(canvas), 0);
    }
    if (container) new ResizeObserver(throttledScaleCanvas).observe(container);
    return (
      <div>
        <canvas ref={canvasEl} id="fabric-canvas" />
      </div>
    );
  }

  return (
    <Center
      position="absolute"
      bottom="40px"
      top="0"
      width="100%"
      backgroundColor="#171923"
      id="playerContainer"
    >
      <div id="player">
        <CanvasApp />
      </div>
    </Center>
  );
}
