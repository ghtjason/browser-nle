import { Stack, Icon } from "@chakra-ui/react";
import { IconTriangleInverted } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import {
  TimeContext,
  PlayContext,
  TimeRatioContext,
} from "../context/TimeContext";
import {
  SnapTimesContext,
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import { FabricContext } from "../context/FabricContext";
import { VideoMediaTimeline } from "./Media";
import { fabric } from "fabric";

export default function Playhead() {
  const [ratio] = useContext(TimeRatioContext);
  const [snapTimes] = useContext(SnapTimesContext);
  const elapsedTime = useContext(TimeContext);
  const [, handlePause, , , isPlaying, setElapsedTime] =
    useContext(PlayContext);

  const [timelineMedia] = useContext(TimelineMediaContext);
  const [canvas] = useContext(FabricContext);
  const [updateFabric, setUpdateFabric] = useState(true);

  const offset = Math.floor(5 + elapsedTime / ratio);
  // why does defining ml within icon cause rendering bugs
  const boxStyle = { marginLeft: offset };

  const color =
    !isPlaying && snapTimes.has(elapsedTime) ? "#ECC94B" : "#E53E3E";

  function snapToEdge(n: number) {
    for (const snap of snapTimes) {
      if (Math.abs(n - snap) < 10 * ratio) return snap;
    }
    return n;
  }
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const time = (e.pageX - 13) * ratio;
    setElapsedTime(snapToEdge(time));
    setUpdateFabric(true);
    handlePause();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let throttle: number;
    if (isPlaying) {
      handleClick(e);
      return;
    }
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (throttle) clearTimeout(throttle);
      // mouse must be still for 60ms before updating canvas
      throttle = setTimeout(() => setUpdateFabric(true), 60);
      const time = (e.pageX - 13) * ratio;
      setUpdateFabric(false);
      setElapsedTime(snapToEdge(time));
    };
    setUpdateFabric(false);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
    handlePause();
  };

  function handleTime() {
    for (const i of timelineMedia) {
      if (!i.fabricObject) break;
      // console.log(i.media.objectURL);
      if (isPlaying) {
        if (elapsedTime >= i.end || elapsedTime < i.start) {
          i.fabricObject.visible = false;
          if (i instanceof VideoMediaTimeline) {
            i.media.element.pause();
            if (elapsedTime < i.end)
              // weird flashing bug when not meant to be visible
              i.media.element.currentTime = i.offsetStart / 1000;
          }
        } else {
          i.fabricObject.visible = true;
          if (i instanceof VideoMediaTimeline && i.media.element.paused) {
            i.media.element.play(); // assume time has been seeked to correct location
          }
        }
      } else {
        if (elapsedTime >= i.end || elapsedTime < i.start) {
          i.fabricObject.visible = false;
          if (i instanceof VideoMediaTimeline) {
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
  }

  if (updateFabric) handleTime();
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

  return (
    <>
      <div
        onClick={(e) => handleClick(e)}
        style={{ width: "100%", height: "100%", position: "absolute" }}
        onMouseDown={(e) => handleMouseDown(e)}
        id="timelineBody"
      />
      <Stack
        position="absolute"
        style={boxStyle}
        mt="6px"
        height="100%"
        spacing={0}
        pointerEvents="none"
        zIndex={2}
      >
        <Icon as={IconTriangleInverted} color={color} boxSize="17px" />
        <div
          style={{
            width: "1px",
            backgroundColor: color,
            height: "100%",
            margin: "auto",
            marginTop: 0,
          }}
        ></div>
      </Stack>
    </>
  );
}
