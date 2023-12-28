import { Heading, Image, Box } from "@chakra-ui/react";
import { ImageMedia, MediaTimeline } from "./Media";

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
  selectCard: (arg0: MediaTimeline) => void
  height: number;
}

export function TimelineMediaCard(props: IProps) {
  const duration = props.media.end - props.media.start;
  const width = duration / 10;
  const offset = props.media.start / 10;
  const color = ((props.media.isSelected) ? '#ECC94B' : '#2D3748')

  return (
    <Box
      width={width}
      height={props.height}
      borderRadius="lg"
      overflow="hidden"
      marginLeft={offset}
      borderColor={color}
      borderWidth="3px"
      onClick={() => props.selectCard(props.media)}
    >
      <Image src={props.media.media.thumbnailURL} alt={props.media.media.name} minHeight='100%' minWidth='100%'/>
    </Box>
  );
}
