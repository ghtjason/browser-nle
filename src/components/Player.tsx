import { useContext, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { FabricContext } from "../context/FabricContext";
import { Center } from "@chakra-ui/react";

interface IProps {
  key: number;
}

// props only used to rerender component on update
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Player(_props: IProps) {
  function autoScaleCanvas(canvas: fabric.Canvas | null) {
    if (canvas) {
      const container = document.getElementById("playerContainer");
      if (container && canvas.getWidth() == 1920) {
        const scale = Math.min(
          container.offsetWidth / 1920,
          container.offsetHeight / 1080
        );
        canvas.setZoom(scale);
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

    if (container && canvas && canvas.getWidth() == 1920) {
      autoScaleCanvas(canvas);
    }
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
