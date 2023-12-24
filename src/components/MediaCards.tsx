import {
  Heading,
  Image,
  Box,
} from "@chakra-ui/react";
import { ImageMedia, ImageMediaTimeline } from "./Media";

export default function MediaCard({ img }: { img: ImageMedia }) {
  return (
    <Box width='175px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Image src={img.thumbnailURL} alt="Dan Abramov" />
        <Heading size="xs" noOfLines={1} padding={2}>
          {img.name}
        </Heading>
    </Box>
  );
}

export function TimelineMediaCard({ img }: { img: ImageMediaTimeline }) {
  const duration = img.end - img.start
  const width = duration / 10
  const offset = img.start / 10
  return (
    <Box width={width} borderWidth='1px' borderRadius='lg' overflow='hidden' marginLeft={offset}>
        <Image src={img.img.thumbnailURL} alt={img.img.name} />
    </Box>
  );
}