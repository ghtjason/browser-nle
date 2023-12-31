import { MediaTimeline } from "./Media";
import { TimelineMediaCard } from "./MediaCards";
import { Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";

interface IProps {
  timelineMedia: MediaTimeline[];
  setTimelineMedia: Dispatch<SetStateAction<MediaTimeline[]>>;
  selectedCard: MediaTimeline | undefined;
  selectCard: (arg0: MediaTimeline) => void;
}

export default function Timeline(props: IProps) {
  useEffect(() => {
    function DeleteCard() {
      if (props.selectedCard) {
        props.selectedCard.isSelected = false;
        props.setTimelineMedia(
          props.timelineMedia.filter((media) => media !== props.selectedCard)
        );
      }
    }

    function processKey(e: globalThis.KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === "Delete" || e.key === "Backspace") DeleteCard();
    }
    document.addEventListener("keydown", processKey);
    return () => {
      document.removeEventListener("keydown", processKey);
    };
  }, [props]);

  function RenderImageCards() {
    return (
      <Stack overflowY="auto" padding="10px 10px" height='100%'>
        {props.timelineMedia.map((media, index) => (
          <TimelineMediaCard
            media={media}
            selectCard={props.selectCard}
            height={75}
            track={index}
            key={index}
          />
        ))}
      </Stack>
    );
  }

  return <RenderImageCards />;
}
