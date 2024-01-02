import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { IconButton, Icon } from "@chakra-ui/react";
import {
  IconSquarePlus,
  IconFolder,
  IconSquareLetterT,
} from "@tabler/icons-react";
import { useContext, useRef } from "react";
import { BaseMedia, ImageMedia, ImageMediaTimeline, VideoMedia } from "./Media";
import { useState } from "react";
import MediaCard from "./MediaCards";
import { TimelineMediaContext } from "../context/TimelineMediaContext";


export default function Library() {
  const [images, setImages] = useState<BaseMedia[]>([]);
  const [timelineMedia, setTimelineMedia] = useContext(TimelineMediaContext)
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
            Array.from(e.target.files).forEach(file => {
              if (file.type.includes('image')) new ImageMedia(file, addToImages);
              else if (file.type.includes('video')) new VideoMedia(file, addToImages);
            });
          }}
        />
        <IconButton
          aria-label="Add file"
          icon={<IconSquarePlus />}
          mb={3}
          onClick={() => hiddenFileInput.current?.click()}
        />
      </>
    );
  }

  function addToImages(img: BaseMedia) {
    setImages((images) => [...images, img]);
  }

  function addImageToTimeline(img: ImageMedia) {
    const timelineImage = new ImageMediaTimeline(img);
    setTimelineMedia([...timelineMedia, timelineImage]);
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
                    <div onClick={() => addImageToTimeline(image)}>
                      <MediaCard img={image} />
                    </div>
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
