import { useContext, useEffect, useRef } from "react";
import { MediaTimeline, VideoMediaTimeline } from "./Media";
import { fabric } from "fabric";
import { FabricContext } from "../context/FabricContext";
import { SelectCardContext } from "../context/SelectedCardContext";
import { TimelineMediaContext } from "../context/TimelineMediaContext";
import { Center } from "@chakra-ui/react";
import { PlayContext, TimeContext } from "../context/TimeContext";

interface IProps {
  key: number;
}

// props only used to rerender component on update
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Player(_props: IProps) {
  const [timelineMedia] = useContext(TimelineMediaContext);
  const reversedMedia = timelineMedia.slice().reverse();
  const selectCard = useContext(SelectCardContext);

  function HandleTime() {
    const elapsedTime = useContext(TimeContext);
    const [timelineMedia] = useContext(TimelineMediaContext);
    const [, , , , isPlaying] = useContext(PlayContext);
    const [canvas] = useContext(FabricContext);

    for (const i of timelineMedia) {
      if (!i.fabricObject) break;
      // console.log(i.media.objectURL);
      if (isPlaying) {
        if (elapsedTime >= i.end || elapsedTime < i.start) {
          i.fabricObject.visible = false;
          if (i.media.element instanceof HTMLVideoElement) {
            i.media.element.pause(); // assume time has been seeked to correct location
          }
        } else {
          i.fabricObject.visible = true;
          if (
            i.media.element instanceof HTMLVideoElement &&
            i.media.element.paused
          ) {
            i.media.element.oncanplaythrough = () => {
            }
            i.media.element.play(); // assume time has been seeked to correct location
          }
        }
      } else {
        if (elapsedTime >= i.end || elapsedTime < i.start) {
          i.fabricObject.visible = false;
          if (i.media.element instanceof HTMLVideoElement) {
            i.media.element.onseeked = () => {
              i.fabricObject!.visible = false;
              if (canvas && canvas.getContext()) canvas.renderAll();
            };
            i.media.element.pause();
            i.media.element.currentTime = 0;
          }
        } else {
          if (i instanceof VideoMediaTimeline) {
            i.media.element.onseeked = () => {
              i.fabricObject!.visible = true;
              if (canvas && canvas.getContext()) canvas.renderAll();
            };
            i.media.element.pause();
            i.media.element.currentTime =
              (elapsedTime - i.start + i.offsetStart) / 1000;
          } else i.fabricObject.visible = true;
        }
        if (canvas && canvas.getContext()) canvas.renderAll();
      }
    }
    useEffect(() => {
      let recurse = true;
      function render() {
        if (!canvas || !canvas.getContext()) return;
        canvas.renderAll();
        if (!recurse || !isPlaying) return;
        fabric.util.requestAnimFrame(render);
      }
      render();
      return () => {
        recurse = false;
      };
    }, [canvas, isPlaying]);
    return <></>;
  }

  function autoScaleCanvas(canvas: fabric.Canvas | null) {
    if (canvas) {
      canvas.setBackgroundColor("black", () => {});
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
      for (const i of reversedMedia) {
        const fabricImage = new fabric.Image(i.media.element, {
          top: i.y,
          left: i.x,
          angle: i.angle,
          scaleX: i.scaleX,
          scaleY: i.scaleY,
          objectCaching: false,
        });
        fabricImage.on("selected", () => {
          selectedHandler(i);
        });
        i.fabricObject = fabricImage;
        canvas.add(fabricImage);
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
        <HandleTime />
      </div>
    </Center>
  );
}
