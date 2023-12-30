import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
} from "react";
import { MediaTimeline } from "./Media";
import { fabric } from "fabric";
import { FabricContext } from "../context/FabricContext";

interface IProps {
  selectedCard: MediaTimeline | undefined;
  setSelectedCard: Dispatch<SetStateAction<MediaTimeline | undefined>>;
  key: number;
  timelineMedia: MediaTimeline[];
}

export default function Player(props: IProps) {
  function AutoScaleCanvas(canvas: fabric.Canvas | null) {
    if (canvas) {
      const container = document.getElementById("video");
      if (container && canvas.getWidth() == 1920) {
        const scale = container.offsetWidth / 1920;
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
      const options = { height: 1080, width: 1920, backgroundColor: "black" };
      const canvas = new fabric.Canvas(canvasEl.current, options);
      initCanvas(canvas);
      // make the fabric.Canvas instance available to your app
      return () => {
        canvas.dispose();
      };
    }, []);

    const circle = new fabric.Circle({
      radius: 20,
      fill: "green",
      left: 100,
      top: 100,
    });
    const triangle = new fabric.Triangle({
      width: 20,
      height: 30,
      fill: "blue",
      left: 50,
      top: 50,
    });

    const container = document.getElementById("video");
    if (container && canvas && canvas.getWidth() == 1920) {
      canvas.add(circle, triangle);
      for (const i of props.timelineMedia) {
        const url = i.media.objectURL;
        fabric.Image.fromURL(url, function (oImg) {
          canvas.add(oImg);
          // console.log(canvas.getObjects())
          AutoScaleCanvas(canvas);
        });
      }
      AutoScaleCanvas(canvas);
    }

    return (
      <div>
        <canvas ref={canvasEl} id="fabric-canvas" />
      </div>
    );
  }

  return (
    <div id="video" style={{ height: "100%", width: "100%" }}>
      <CanvasApp />
    </div>
  );
}
