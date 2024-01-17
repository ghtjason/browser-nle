import { useContext, useState } from "react";
import { SelectedCardContext } from "../context/SelectedCardContext";
import {
  Box,
  Center,
  Text,
  IconButton,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  HStack,
  NumberInputField,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputStepper,
} from "@chakra-ui/react";
import { IconSection, IconVolume } from "@tabler/icons-react";
import { FabricContext } from "../context/FabricContext";

interface TopBarProps {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}
function TopBar({ tab, setTab }: TopBarProps) {
  const selectedCard = useContext(SelectedCardContext);
  return (
    <Box borderBottom="2px" display="flex" borderColor="#4A5568">
      <IconButton
        aria-label="properties"
        icon={<IconSection />}
        onClick={() => setTab("gen")}
        variant="none"
        color={tab == "gen" ? "#bee3f8" : "#EDF2F7"}
        transitionDuration="0ms"
      />
      <IconButton
        aria-label="audio"
        icon={<IconVolume />}
        onClick={() => setTab("vol")}
        variant="none"
        color={tab == "vol" ? "#bee3f8" : "#EDF2F7"}
        transitionDuration="0ms"
      />
      <Center marginLeft="auto" mr={2}>
        <Text fontSize="sm" as="samp">
          {selectedCard?.media.name}
        </Text>
      </Center>
    </Box>
  );
}

function TransformProperties() {
  const selectedCard = useContext(SelectedCardContext);
  const [canvas] = useContext(FabricContext);
  const [x, setX] = useState(selectedCard!.x);
  const [y, setY] = useState(selectedCard!.y);
  const [scaleX, setScaleX] = useState(selectedCard!.scaleX);
  const [scaleY, setScaleY] = useState(selectedCard!.scaleY);
  const [angle, setAngle] = useState(selectedCard!.angle);
  const [flipX, setFlipX] = useState(selectedCard!.flipX);
  const [flipY, setFlipY] = useState(selectedCard!.flipY);
  const realScaleX = flipX ? -scaleX : scaleX;
  const realScaleY = flipY ? -scaleY : scaleY;

  function modifiedHandler(e: fabric.IEvent<MouseEvent>) {
    const fabricObject = e.target!;
    setX(fabricObject.left!);
    setY(fabricObject.top!);
    setScaleX(fabricObject.scaleX!);
    setScaleY(fabricObject.scaleY!);
    setAngle(fabricObject.angle!);
    setFlipX(fabricObject.flipX!);
    setFlipY(fabricObject.flipY!);
  }
  canvas!.on("object:modified", (e) => {
    modifiedHandler(e);
  });

  return (
    <AccordionItem>
      <AccordionButton>
        <Text flex="1" textAlign="left" fontSize="sm">
          Transform
        </Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Box ml={3}>
          <HStack>
            <Text fontSize="sm" width="100%">
              Scale X
            </Text>
            <Slider aria-label="slider-ex-1" defaultValue={30}>
              <SliderTrack>{/* <SliderFilledTrack /> */}</SliderTrack>
              <SliderThumb />
            </Slider>
            <NumberInput
              size="xs"
              maxW="100px"
              value={0}
              onChange={() => {}}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
}
function GeneralProperties() {
  return (
    <Accordion defaultIndex={[0, 1]} allowMultiple>
      <TransformProperties />

    
    </Accordion>
  );
}

function Properties({ tab }: { tab: string }) {
  switch (tab) {
    case "gen":
      return <GeneralProperties />;
  }
}
export default function Inspector() {
  const selectedCard = useContext(SelectedCardContext);
  const [tab, setTab] = useState("gen");

  if (!selectedCard)
    return (
      <Center height="100%" width="100%">
        <Text fontSize="lg" color="#4A5568" fontWeight="medium">
          No media selected.
        </Text>
      </Center>
    );
  return (
    <Box mt={2} ml={3} mr={3}>
      <TopBar tab={tab} setTab={setTab} />
      <Properties tab={tab} />
    </Box>
  );
}
