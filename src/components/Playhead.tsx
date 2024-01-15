import { Stack, Icon } from "@chakra-ui/react";
import { IconTriangleInverted } from "@tabler/icons-react";
import { useContext } from "react";
import {
  TimeContext,
  PlayContext,
  TimeRatioContext,
} from "../context/TimeContext";
import { SnapTimesContext } from "../context/TimelineMediaContext";

export default function Playhead() {
  const [ratio] = useContext(TimeRatioContext);
  const [snapTimes] = useContext(SnapTimesContext);
  const elapsedTime = useContext(TimeContext);
  const [, handlePause, , , isPlaying, setElapsedTime] =
    useContext(PlayContext);
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
    handlePause();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isPlaying) {
      handleClick(e);
      return;
    }
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const time = (e.pageX - 13) * ratio;
      setElapsedTime(snapToEdge(time));
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
    handlePause();
  };

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
