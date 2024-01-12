import { SelectedCardContext } from "../context/SelectedCardContext";
import {
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import { TimelineMediaCard } from "./MediaCards";
import { Stack } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import Playhead from "./Playhead";

export default function Timeline() {
  const selectedCard = useContext(SelectedCardContext);
  const [timelineMedia, setTimelineMedia] = useContext(TimelineMediaContext);
  // refreshSnapTimes();
  console.log('rerendered')
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
      }
    }
    document.addEventListener("keydown", processKey);
    return () => {
      document.removeEventListener("keydown", processKey);
    };
  }, [selectedCard, setTimelineMedia, timelineMedia]);

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
