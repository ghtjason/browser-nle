import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Box
} from "@chakra-ui/react";
import { ImageMedia } from "./Media";

export default function MediaCard({ img }: { img: ImageMedia }) {
  return (
    <Box maxW='200px' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Image src={img.thumbnailURL} alt="Dan Abramov" />
        <Heading size="xs" noOfLines={1} padding={2}>
          {img.name}
        </Heading>
    </Box>
  );
}
