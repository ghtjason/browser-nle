import { Heading, Image, Box } from "@chakra-ui/react";
import { BaseMedia, MediaTimeline } from "./Media";
import { useContext } from "react";
import { SelectCardContext, SelectedCardContext } from "../context/SelectedCardContext";
import { FabricContext } from "../context/FabricContext";

export default function MediaCard({ img }: { img: BaseMedia }) {
  return (
    <Box width="175px" borderWidth={1} borderRadius="lg" overflow="hidden">
      <Image src={img.thumbnailURL} alt={img.name} />
      <Heading size="xs" isTruncated={true} padding="6px" >
        {img.name}
      </Heading>
    </Box>
  );
}

interface IProps {
  media: MediaTimeline;
  height: number;
  track: number;
}


export function TimelineMediaCard(props: IProps) {
  const selectCard = useContext(SelectCardContext)
  const selectedCard = useContext(SelectedCardContext)
  const [canvas] = useContext(FabricContext);
  const duration = props.media.end - props.media.start;
  const width = duration / 10;
  const offset = props.media.start / 10;
  const outline = (props.media === selectedCard)  ? "#ECC94B" : "#2D3748";

  function handleClick(media: MediaTimeline) {
    selectCard(media)
    if (canvas && media.fabricObject!.visible) {
      canvas.setActiveObject(media.fabricObject!)
      canvas.renderAll()
    }
  }

  return (
    <Box
      width={width}
      height={props.height}
      borderRadius="lg"
      overflow="hidden"
      marginLeft={offset}
      borderColor={outline}
      borderWidth="3px"
      onClick={() => handleClick(props.media)}
      flexShrink="0"
      pointerEvents="auto"
      zIndex={1}
    >
      <Image
        src={props.media.media.thumbnailURL}
        alt={props.media.media.name}
        minHeight="100%"
        minWidth="100%"
        draggable={false}
      />
    </Box>
  );
}
