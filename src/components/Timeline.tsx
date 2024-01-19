import { SelectCardContext } from "../context/SelectedCardContext";
import {
  SnapTimesContext,
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import { TimelineMediaCard } from "./MediaCards";
import { Stack } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import Playhead from "./Playhead";
import { FabricContext } from "../context/FabricContext";
import { fabric } from "fabric";
import { MediaTimeline } from "./Media";

export default function Timeline() {
  const selectCard = useContext(SelectCardContext);
  const [timelineMedia, setTimelineMedia] = useContext(TimelineMediaContext);
  const [, refreshSnapTimes] = useContext(SnapTimesContext);
  const [canvas] = useContext(FabricContext);
  useEffect(() => {
    refreshSnapTimes();
  });
  useEffect(() => {
    function DeleteCard() {
      if (canvas && canvas.getActiveObject()) {
        setTimelineMedia(
          timelineMedia.filter(
            (media) => media !== canvas.getActiveObject()?.toObject().media
          )
        );
        selectCard(null);
      }
    }
    function processKey(e: globalThis.KeyboardEvent) {
      if (e.repeat || document.activeElement!.tagName.toLowerCase() == "input")
        return;
      switch (e.key) {
        case "Delete":
        case "Backspace":
          DeleteCard();
          break;
      }
    }
    document.addEventListener("keydown", processKey);
    return () => {
      document.removeEventListener("keydown", processKey);
    };
  }, [canvas, selectCard, setTimelineMedia, timelineMedia]);
  const reversedMedia = timelineMedia.slice().reverse();
  function modifiedHandler(e: fabric.IEvent<MouseEvent>, m: MediaTimeline) {
    const mediaObject = m;
    const fabricObject = e.target;
    if (fabricObject) {
      mediaObject.x = fabricObject.left!;
      mediaObject.y = fabricObject.top!;
      mediaObject.scaleX = fabricObject.scaleX!;
      mediaObject.scaleY = fabricObject.scaleY!;
      mediaObject.angle = fabricObject.angle!;
      mediaObject.flipX = fabricObject.flipX!;
      mediaObject.flipY = fabricObject.flipY!;
    }
  }
  function selectedHandler(mediaObject: MediaTimeline) {
    selectCard(mediaObject);
  }

  function updateCanvas() {
    const container = document.getElementById("playerContainer");
    if (container && canvas) {
      canvas.clear();
      canvas.setBackgroundColor("black", () => {});
      for (const i of reversedMedia) {
        const fabricImage = new fabric.Image(i.media.element, {
          // top: i.y,
          // left: i.x,
          originX: "center",
          originY: "center",
          angle: i.angle,
          scaleX: i.scaleX,
          scaleY: i.scaleY,
          centeredScaling: true,
          objectCaching: true,
        });
        fabricImage.on("selected", () => {
          selectedHandler(i);
        });
        fabricImage.toObject = function () {
          return {
            media: i,
          };
        };
        canvas.viewportCenterObject(fabricImage)
        i.x = fabricImage.left!;
        i.y = fabricImage.top!;
        i.fabricObject = fabricImage;
        canvas.add(fabricImage);
      }
      canvas.on("object:modified", (e) => {
        modifiedHandler(e, e.target?.toObject().media);
      });
    }
  }
  updateCanvas();

  function RenderImageCards() {
    return (
      <>
        <Stack padding="26px 14px" height="100%">
          {timelineMedia.map((media, index) => (
            <TimelineMediaCard
              media={media}
              height={75}
              track={index}
              key={index}
            />
          ))}
        </Stack>
      </>
    );
  }

  return (
    <div>
      <Playhead />
      <RenderImageCards />
    </div>
  );
}
