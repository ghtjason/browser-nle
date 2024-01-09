import { IconTriangleInverted } from "@tabler/icons-react";
import { SelectedCardContext } from "../context/SelectedCardContext";
import { PlayContext, TimeContext } from "../context/TimeContext";
import {
  SnapTimesContext,
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import { TimelineMediaCard } from "./MediaCards";
import { Icon, Stack } from "@chakra-ui/react";
import { useCallback, useContext, useEffect } from "react";

export default function Timeline() {
  const selectedCard = useContext(SelectedCardContext);
  const [timelineMedia, setTimelineMedia] = useContext(TimelineMediaContext);
  const [snapTimes] = useContext(SnapTimesContext);
  const [, handlePause, handleResume, , isPlaying, setElapsedTime] =
    useContext(PlayContext);
  // refreshSnapTimes();
  function Playhead() {
    const elapsedTime = useContext(TimeContext);

    const offset = Math.floor(5 + elapsedTime / 10);
    // why does defining ml within icon cause rendering bugs
    const boxStyle = { marginLeft: offset };

    const color =
      !isPlaying && snapTimes.has(elapsedTime) ? "#ECC94B" : "#E53E3E";

    function snapToEdge(n: number) {
      for (const snap of snapTimes) {
        if (Math.abs(n - snap) < 100) return snap;
      }
      return n;
    }

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const time = (e.pageX - 13) * 10;
        setElapsedTime(snapToEdge(time));
        handlePause();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (isPlaying) {
          handleClick(e);
          return;
        }
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp, { once: true });
        handlePause();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [isPlaying]
    );

    const handleMouseUp = useCallback(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      const time = (e.pageX - 13) * 10;
      setElapsedTime(snapToEdge(time));
    }, []);
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


  function RenderImageCards() {
    return (
      <>
        <Stack overflowY="auto" padding="26px 14px" height="100%">
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
