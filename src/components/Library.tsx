import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Wrap,
  WrapItem,
  Box,
  Heading,
} from "@chakra-ui/react";
import { IconButton, Icon, Image } from "@chakra-ui/react";
import {
  IconSquarePlus,
  IconFolder,
  IconSquareLetterT,
} from "@tabler/icons-react";
import { useContext, useRef } from "react";
import {
  BaseMedia,
  ImageMedia,
  ImageMediaTimeline,
  MediaTimeline,
  VideoMedia,
  VideoMediaTimeline,
} from "./Media";
import { fabric } from "fabric";
import { v4 as uuidv4 } from 'uuid';
import { useState } from "react";
import { FabricContext } from "../context/FabricContext";
import { SelectCardContext } from "../context/SelectedCardContext";
import { TimelineMediaContext } from "../context/TimelineMediaContext";

function MediaCard({ img }: { img: BaseMedia }) {
  const [, setTimelineMedia] = useContext(TimelineMediaContext);
  const selectCard = useContext(SelectCardContext);
  const [canvas] = useContext(FabricContext);

  function addMediaToTimeline() {
    let newTimelineMedia: MediaTimeline;
    const key = uuidv4();
    if (img instanceof ImageMedia) {
      newTimelineMedia = new ImageMediaTimeline(img, key);
      setTimelineMedia((timelineMedia) => [...timelineMedia, newTimelineMedia]);
    } else if (img instanceof VideoMedia) {
      newTimelineMedia = new VideoMediaTimeline(img, key);
      setTimelineMedia((timelineMedia) => [...timelineMedia, newTimelineMedia]);
    }
    function updateCanvas() {
      const container = document.getElementById("playerContainer");
      if (container && canvas) {
        const fabricImage = new fabric.Image(img.element, {
          top: 540,
          left: 960,
          originX: "center",
          originY: "center",
          angle: 0,
          scaleX: 1,
          scaleY: 1,
          centeredScaling: true,
          objectCaching: true,
        });
        fabricImage.on("selected", () => {
          selectCard(newTimelineMedia);
        });
        fabricImage.toObject = function () {
          return {
            media: newTimelineMedia,
          };
        };
        newTimelineMedia.fabricObject = fabricImage;
        canvas.add(fabricImage);
        canvas.requestRenderAll();
      }
    }
    updateCanvas();
  }

  return (
    <Box
      width="140px"
      borderWidth={1}
      borderRadius="lg"
      overflow="hidden"
      onClick={addMediaToTimeline}
    >
      <Image src={img.thumbnailURL} alt={img.name} />
      <Heading size="xs" isTruncated={true} padding="6px">
        {img.name}
      </Heading>
    </Box>
  );
}

export default function Library() {
  const [images, setImages] = useState<BaseMedia[]>([]);
  function FileUploader() {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    return (
      <>
        <input
          type="file"
          ref={hiddenFileInput}
          style={{ display: "none" }} // Make the file input element invisible
          accept="image/*, video/*"
          multiple={true}
          onChange={async (e) => {
            if (!e.target.files) return;
            Array.from(e.target.files).forEach((file) => {
              if (file.type.includes("image"))
                new ImageMedia(file, addToImages);
              else if (file.type.includes("video"))
                new VideoMedia(file, addToImages);
            });
          }}
        />
        <IconButton
          aria-label="Add file"
          icon={<IconSquarePlus />}
          color="#E2E8F0"
          mb={3}
          onClick={() => hiddenFileInput.current?.click()}
        />
      </>
    );
  }

  function addToImages(img: BaseMedia) {
    setImages((images) => [...images, img]);
  }

  function Sections() {
    return (
      <>
        <Tabs
          variant="soft-rounded"
          orientation="vertical"
          ml={3}
          height="100%"
        >
          <TabList aria-orientation="vertical">
            <Tab mt={5}>
              <Icon as={IconFolder} boxSize={"1.5em"} />
            </Tab>
            <Tab mt={3}>
              <Icon as={IconSquareLetterT} boxSize={"1.5em"} />
            </Tab>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <FileUploader />
            </div>
          </TabList>

          <TabPanels>
            <TabPanel overflowY="auto" maxHeight="100%">
              <Wrap spacing="15px">
                {images.map((image, index) => (
                  <WrapItem key={index}>
                    <MediaCard img={image} />
                  </WrapItem>
                ))}
              </Wrap>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </>
    );
  }
  return <Sections />;
}
