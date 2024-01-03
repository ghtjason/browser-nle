import { Heading, Image, Box } from "@chakra-ui/react";
import { ImageMedia, MediaTimeline } from "./Media";
import { useContext } from "react";
import { SelectCardContext, SelectedCardContext } from "../context/SelectedCardContext";
import { FabricContext } from "../context/FabricContext";

export default function MediaCard({ img }: { img: ImageMedia }) {
  return (
    <Box width="175px" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image src={img.thumbnailURL} alt="Dan Abramov" />
      <Heading size="xs" noOfLines={1} padding={2}>
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
    if (canvas) {
      console.log('selecting')
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
