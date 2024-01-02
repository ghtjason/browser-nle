import { useContext, useEffect, useRef } from "react";
import { MediaTimeline } from "./Media";
import { fabric } from "fabric";
import { FabricContext } from "../context/FabricContext";
import { SelectCardContext } from "../context/SelectedCardContext";
import { TimelineMediaContext } from "../context/TimelineMediaContext";

interface IProps {
  key: number;
}

// props only used to rerender component on update
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Player(_props: IProps) {
  const [timelineMedia] = useContext(TimelineMediaContext);
  const reversedMedia = timelineMedia.slice().reverse();
  const selectCard = useContext(SelectCardContext);
  function autoScaleCanvas(canvas: fabric.Canvas | null) {
    if (canvas) {
      canvas.setBackgroundColor("black", () => {});
      const container = document.getElementById("video");
      if (container && canvas.getWidth() == 1920) {
        const scale = container.offsetWidth / 1920;
        canvas.setZoom(scale);
        canvas.setHeight(canvas.getHeight() * scale);
        canvas.setWidth(canvas.getWidth() * scale);
      }
    }
  }

  function modifiedHandler(e: fabric.IEvent<MouseEvent>, index: number) {
    const mediaObject = reversedMedia[index];
    const fabricObject = e.target!;
    mediaObject.x = fabricObject.left!;
    mediaObject.y = fabricObject.top!;
    mediaObject.scaleX = fabricObject.scaleX!;
    mediaObject.scaleY = fabricObject.scaleY!;
    mediaObject.angle = fabricObject.angle!;
    mediaObject.flipX = fabricObject.flipX!;
    mediaObject.flipY = fabricObject.flipY!;
  }

  function selectedHandler(mediaObject: MediaTimeline) {
    selectCard(mediaObject);
    console.log("selected!!!z");
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
      // make the fabric.Canvas instance available to your app
      return () => {
        canvas.dispose();
      };
    }, []);

    const container = document.getElementById("video");
    if (container && canvas && canvas.getWidth() == 1920) {
      for (const i of reversedMedia) {
        const url = i.media.objectURL;
        fabric.Image.fromURL(url, function (oImg) {
          i.fabricObject = oImg;
          oImg.top = i.y;
          oImg.left = i.x;
          oImg.angle = i.angle;
          oImg.scaleX = i.scaleX;
          oImg.scaleY = i.scaleY;
          oImg.on("selected", () => {
            selectedHandler(i);
          });
          canvas.add(oImg);
        });
      }
      autoScaleCanvas(canvas);
      canvas.on("object:modified", (e) =>
        modifiedHandler(e, canvas.getObjects().indexOf(e.target!))
      );
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
