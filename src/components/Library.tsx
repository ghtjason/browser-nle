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
import { useRef } from "react";
import { ImageMedia } from "./Media";
import { useState } from "react";
import MediaCard from "./MediaCard";

export default function Library() {
  const [images, setImages] = useState<ImageMedia[]>([]);

  function FileUploader() {
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    return (
      <>
        <input
          type="file"
          ref={hiddenFileInput}
          style={{ display: "none" }} // Make the file input element invisible
          accept="image/*"
          onChange={async (e) => {
            if (!e.target.files) return;
            console.log("waiting");
            new ImageMedia(e.target.files[0], addToImages);
            console.log(`done: ${JSON.stringify(images)}`);
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

  function addToImages(img: ImageMedia) {
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
            <TabPanel>
              <Wrap spacing='15px'>
                {images.map((image) => (
                  // todo: make sure image name is unique
                  <WrapItem key={image.name}>
                    <MediaCard img={image}/>
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
