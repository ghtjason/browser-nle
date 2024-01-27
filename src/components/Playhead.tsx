import { Stack, Icon } from "@chakra-ui/react";
import { IconTriangleInverted } from "@tabler/icons-react";
import { memo, useContext, useEffect } from "react";
import {
  TimeContext,
  PlayContext,
  TimeRatioContext,
} from "../context/TimeContext";
import { SnapTimesContext } from "../context/TimelineMediaContext";
import { FabricContext } from "../context/FabricContext";
import { fabric } from "fabric";
import { SelectCardContext } from "../context/SelectedCardContext";

const Playhead = memo(function Playhead() {
  const [ratio] = useContext(TimeRatioContext);
  const [snapTimes] = useContext(SnapTimesContext);
  const elapsedTime = useContext(TimeContext);
  const [, handlePause, , , isPlaying, setElapsedTime] =
    useContext(PlayContext);

  const [canvas] = useContext(FabricContext);
  const setSelectedCard = useContext(SelectCardContext);
  const offset = Math.floor(5 + elapsedTime / ratio);
  // why does defining ml within icon cause rendering bugs
  const boxStyle = { marginLeft: offset };
  const color =
    !isPlaying && snapTimes.includes(elapsedTime) ? "#ECC94B" : "#E53E3E";

  // if (!isPlaying) canvas?.requestRenderAll();

  function snapToEdge(n: number) {
    for (const snap of snapTimes) {
      if (Math.abs(n - snap) < 10 * ratio) return snap;
    }
    return n;
  }
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const time = (e.pageX - 13) * ratio;
    if (canvas) canvas.discardActiveObject();
    setSelectedCard(null);
    setElapsedTime(snapToEdge(time));
    // canvas?.renderAll();
    handlePause();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isPlaying) {
      handleClick(e);
      return;
    }
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      // canvas?.renderAll();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const time = (e.pageX - 13) * ratio;
      setElapsedTime(snapToEdge(time));
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
    handlePause();
  };

  useEffect(() => {
    let recurse = true;
    function render() {
      if (!canvas || !canvas.getContext()) return;
      canvas.requestRenderAll();
      if (!recurse || !isPlaying) return;
      setTimeout(() => fabric.util.requestAnimFrame(render), 100 / 6); // 60 fps
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
        zIndex={3}
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
        />
      </Stack>
    </>
  );
});

export default Playhead;
