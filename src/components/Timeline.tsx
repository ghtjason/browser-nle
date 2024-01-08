import { IconTriangleInverted } from "@tabler/icons-react";
import { SelectedCardContext } from "../context/SelectedCardContext";
import { PlayContext, TimeContext } from "../context/TimeContext";
import {
  SnapTimesContext,
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import { TimelineMediaCard } from "./MediaCards";
import { Icon, Stack } from "@chakra-ui/react";
import { useContext, useEffect } from "react";

export default function Timeline() {
  const selectedCard = useContext(SelectedCardContext);
  const [timelineMedia, setTimelineMedia] = useContext(TimelineMediaContext);
  const [snapTimes] = useContext(SnapTimesContext);
  const [, handlePause, handleResume, , isPlaying, setElapsedTime] =
    useContext(PlayContext);
  function Playhead() {
    const elapsedTime = useContext(TimeContext);

    const offset = Math.floor(5 + elapsedTime / 10);
    // why does defining ml within icon cause rendering bugs
    const boxStyle = { marginLeft: offset };
    const color =
      !isPlaying && snapTimes.has(elapsedTime) ? "#ECC94B" : "#E53E3E";
    return (
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
    );
  }

  useEffect(() => {
    function DeleteCard() {
      if (selectedCard) {
        setTimelineMedia(
          timelineMedia.filter((media) => media !== selectedCard)
        );
      }
    }

    function processKey(e: globalThis.KeyboardEvent) {
      if (e.repeat) return;
      switch (e.key) {
        case "Delete":
        case "Backspace":
          DeleteCard();
          break;
        case " ":
          isPlaying ? handlePause() : handleResume();
          break;
      }
    }
    document.addEventListener("keydown", processKey);
    return () => {
      document.removeEventListener("keydown", processKey);
    };
  }, [
    handlePause,
    handleResume,
    isPlaying,
    selectedCard,
    setTimelineMedia,
    timelineMedia,
  ]);

  function snapToEdge(n: number) {
    for (const snap of snapTimes) {
      if (Math.abs(n - snap) < 100) return snap;
    }
    return n;
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const time = (e.pageX - 13) * 10;
    handlePause();
    setElapsedTime(snapToEdge(time));
  }

  // function handleDrag(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  //   console.log(e.pageX);
  //   const time = (e.pageX - 13) * 10;
  //   handlePause();
  //   setElapsedTime(time);
  // }

  function RenderImageCards() {
    return (
      <>
        <Stack
          overflowY="auto"
          padding="26px 14px"
          height="100%"
          onClick={(e) => handleClick(e)}
        >
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
    <>
      <Playhead />
      <RenderImageCards />
    </>
  );
}
