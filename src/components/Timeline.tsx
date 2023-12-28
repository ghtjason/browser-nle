import { MediaTimeline } from "./Media";
import { TimelineMediaCard } from "./MediaCards";
import { Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface IProps {
  timelineMedia: MediaTimeline[];
  setTimelineMedia: Dispatch<SetStateAction<MediaTimeline[]>>;
}

export default function Timeline(props: IProps) {
  const [selectedCard, setSelectedCard] = useState<MediaTimeline>();
  useEffect(() => {
    function DeleteCard() {
      if (selectedCard) {
        selectedCard.isSelected = false;
        props.setTimelineMedia(
          props.timelineMedia.filter((media) => media !== selectedCard)
        );
      }
    }

    function processKey(e: globalThis.KeyboardEvent) {
      if (e.repeat) return;
      console.log("key");
      if (e.key === "Delete" || e.key === "Backspace") DeleteCard();
    }
    document.addEventListener("keydown", processKey);
    return () => {
      document.removeEventListener("keydown", processKey);
    };
  }, [props, selectedCard]);

  function SelectCard(media: MediaTimeline) {
    if (selectedCard) selectedCard.isSelected = false;
    media.isSelected = true;
    setSelectedCard(media);
  }

  function RenderImageCards() {
    return (
      <Stack overflow="auto" maxHeight="100%" padding="10px 10px" tabIndex={-1}>
        {props.timelineMedia.map((media) => (
          <TimelineMediaCard
            media={media}
            selectCard={SelectCard}
            height={75}
          />
        ))}
      </Stack>
    );
  }

  return <RenderImageCards />;
}
