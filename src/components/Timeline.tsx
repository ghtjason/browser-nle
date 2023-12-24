import { ImageMediaTimeline } from "./Media";
import { TimelineMediaCard } from "./MediaCards";
import { Stack } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  timelineImages: ImageMediaTimeline[]; 
  setTimelineImages: Dispatch<SetStateAction<ImageMediaTimeline[]>>;
}

export default function Timeline(props: IProps) {
  function RenderImageCards() {
    {
      <Stack>
        {props.timelineImages.map((image) => (
          <TimelineMediaCard img={image} />
        ))}
      </Stack>;
    }
  }

  return RenderImageCards;
}
