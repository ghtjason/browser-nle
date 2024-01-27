import { SelectCardContext, SelectedCardContext } from "../context/SelectedCardContext";
import {
  SnapTimesContext,
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import TimelineMediaCard from "./TimelineMediaCard";
import { Stack } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import Playhead from "./Playhead";
import { FabricContext } from "../context/FabricContext";

function RenderImageCards() {
  const [timelineMedia] = useContext(TimelineMediaContext);
  return (
    <>
      <Stack padding="26px 14px" height="100%">
        {timelineMedia.map((media, index) => (
          <TimelineMediaCard
            key={media.key}
            media={media}
            height={75}
            track={index}
          />
        ))}
      </Stack>
    </>
  );
}

export default function Timeline() {
  const selectCard = useContext(SelectCardContext);
  const [, setTimelineMedia] = useContext(TimelineMediaContext);
  const [, refreshSnapTimes] = useContext(SnapTimesContext);
  const [canvas] = useContext(FabricContext);
  const selectedCard = useContext(SelectedCardContext)
  useEffect(() => {
    refreshSnapTimes();
  });
  useEffect(() => {
    function DeleteCard() {
      if (canvas && selectedCard?.fabricObject) {
        setTimelineMedia((timelineMedia) =>
          timelineMedia.filter(
            (media) => media !== selectedCard
          )
        );
        canvas.remove(selectedCard.fabricObject);
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
  }, [canvas, selectCard, selectedCard, setTimelineMedia]);

  return (
    <div>
      <Playhead />
      <RenderImageCards />
    </div>
  );
}
