import { SelectedCardContext } from "../context/SelectedCardContext";
import { memo, useContext, useEffect, useState } from "react";
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
  SliderThumb,
  SliderTrack,
  HStack,
  NumberInputField,
  NumberInput,
  VStack,
  StackDivider,
} from "@chakra-ui/react";
import { IconSection, IconVolume, IconArrowBackUp } from "@tabler/icons-react";
import { FabricContext } from "../context/FabricContext";

interface TopBarProps {
  tab: string;
  setTab: React.Dispatch<React.SetStateAction<string>>;
}
function TopBar({ tab, setTab }: TopBarProps) {
  const selectedCard = useContext(SelectedCardContext);
  return (
    <>
      <HStack width="100%" spacing={0}>
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
        {/* <Center marginLeft="auto" mr={2}> */}
        <Text
          fontSize="sm"
          as="samp"
          isTruncated={true}
          ml="auto"
          pl={2}
          mr={2}
        >
          {selectedCard?.media.name}
        </Text>
        {/* </Center> */}
      </HStack>
    </>
  );
}

interface CustomSliderFillProps {
  max: number;
  origin: number;
  value: number;
}
function CustomSliderFill({ max, origin, value }: CustomSliderFillProps) {
  return (
    <Box
      backgroundColor={"#90cdf4"}
      height="100%"
      width={`${(Math.abs(origin - value) / max) * 100}%`}
      position="absolute"
      left={`${(origin / max) * 100}%`}
      marginLeft={`${Math.min(0, (value - origin) / max) * 100}%`}
      borderRadius="sm"
    />
  );
}

interface SliderPropProps {
  name: string;
  min: number;
  max: number;
  origin: number;
  unit: string;
  value: number;
  onChange: (n: number) => void;
  handleReset?: (n: number) => void;
}
const SliderProp = memo(function SliderProp({
  name,
  min,
  max,
  origin,
  unit,
  value,
  onChange,
  handleReset = onChange,
}: SliderPropProps) {
  if (unit == "%") value *= 100;

  let offset = 0;
  if (name == "x") offset = 960;
  else if (name == "y") offset = 540;

  const [editValue, setEditValue] = useState(value);
  function handleEdit(e: React.ChangeEvent<HTMLInputElement>) {
    const n = e.currentTarget.value;
    if (isNaN(+n)) return;
    setEditValue(+n + offset);
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement, Element>) {
    // make value slightly different to force input div rerender
    setEditValue(value + 10e-8);
    const initial = value + 10e-8;
    function processKey(e2: globalThis.KeyboardEvent) {
      if (e2.repeat) return;
      switch (e2.key) {
        case "Escape":
          setEditValue(initial);
          onChange(initial);
          document.removeEventListener("keydown", processKey);
          break;
        case "Enter":
          e.target.blur();
          document.removeEventListener("keydown", processKey);
          break;
      }
    }
    document.addEventListener("keydown", processKey);
  }

  function handleBlur() {
    onChange(editValue);
  }

  return (
    <HStack pl={2} pr={2} width="100%">
      <Text fontSize="sm" minW="5em" w="5em" isTruncated={true}>
        {name}
      </Text>
      <Slider
        aria-label="scale-x"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        step={0.01}
        mr={2}
        ml="auto"
        maxW={300}
        minW={10}
      >
        <SliderTrack bg="#4A5568">
          <CustomSliderFill max={max} origin={origin} value={value} />
        </SliderTrack>
        <SliderThumb boxSize={2.5} />
      </Slider>
      <div key={value}>
        <NumberInput
          size="xs"
          defaultValue={(value - offset).toFixed(2)}
          padding={0}
          precision={2}
          minWidth="4em"
          width="4em"
        >
          <NumberInputField
            width="100%"
            padding={1}
            fontSize={14}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => handleEdit(e)}
            textAlign="right"
            borderRadius="md"
          />
        </NumberInput>
      </div>
      <Text color="gray.300" minW="1.2em" fontSize="sm">
        {unit}
      </Text>
      <IconButton
        color="#4A5568"
        ml={2}
        size="1.1em"
        aria-label="revert"
        icon={<IconArrowBackUp size="1.1em" />}
        onClick={() => {
          handleReset(origin);
        }}
        variant="none"
        transitionDuration="100ms"
        _hover={{ color: "#718096" }}
      />
    </HStack>
  );
});

function PropertyPanel({
  name,
  children,
}: {
  name: string;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <AccordionItem border="none">
      <AccordionButton height={6} mt={4}>
        <Text flex="1" textAlign="left" fontSize="sm" fontWeight="bold">
          {name}
        </Text>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Box
          borderRadius="md"
          // borderWidth={1}
          backgroundColor="#2D3748"
        >
          <VStack
            padding={2}
            divider={
              <StackDivider
                borderColor="gray.800"
                borderWidth={0}
                marginRight={10}
              />
            }
          >
            {children}
          </VStack>
        </Box>
      </AccordionPanel>
    </AccordionItem>
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

  function scalingHandler(e: fabric.IEvent<MouseEvent>) {
    const fabricObject = e.target!;
    setFlipX(fabricObject.flipX!);
    setFlipY(fabricObject.flipY!);
    setScaleX(fabricObject.scaleX!);
    setScaleY(fabricObject.scaleY!);
  }
  function movingHandler(e: fabric.IEvent<MouseEvent>) {
    const fabricObject = e.target!;
    setX(fabricObject.left!);
    setY(fabricObject.top!);
  }
  function rotationHandler(e: fabric.IEvent<MouseEvent>) {
    const fabricObject = e.target!;
    setAngle(fabricObject.angle!);
  }
  useEffect(() => {
    canvas!.on("object:scaling", (e) => {
      movingHandler(e); // for non-origin scaling
      scalingHandler(e);
    });
    canvas!.on("object:moving", (e) => {
      movingHandler(e);
    });
    canvas!.on("object:rotating", (e) => {
      rotationHandler(e);
    });
  }, [canvas]);

  function updateObjects() {
    if (!selectedCard || !selectedCard.fabricObject || !canvas) return;
    // todo: utilize fabricobject.set

    selectedCard.fabricObject.left = x;
    selectedCard.x = x;
    selectedCard.fabricObject.top = y;
    selectedCard.y = y;

    selectedCard.fabricObject.scaleX = scaleX;
    selectedCard.fabricObject.flipX = flipX;
    selectedCard.scaleX = scaleX;
    selectedCard.flipX = flipX;

    selectedCard.fabricObject.scaleY = scaleY;
    selectedCard.fabricObject.flipY = flipY;
    selectedCard.scaleY = scaleY;
    selectedCard.flipY = flipY;

    selectedCard.fabricObject.angle = angle;
    selectedCard.angle = angle;

    canvas.requestRenderAll();
  }

  updateObjects();

  return (
    <PropertyPanel name="Transform">
      <SliderProp
        name="x"
        min={0}
        max={1920}
        origin={960}
        unit="px"
        value={x}
        onChange={(n) => {
          setX(n);
        }}
      />
      <SliderProp
        name="y"
        min={0}
        max={1080}
        origin={540}
        unit="px"
        value={y}
        onChange={(n) => {
          setY(n);
        }}
      />
      <SliderProp
        name="Scale (All)"
        min={0.0001}
        max={400}
        origin={100}
        unit="%"
        value={Math.max(realScaleX, realScaleY)}
        onChange={(n) => {
          const scale = Math.max(realScaleX, realScaleY);
          const newScaleX = scale == 0 ? n : (n / scale) * scaleX;
          const newScaleY = scale == 0 ? n : (n / scale) * scaleY;
          setScaleX(Math.abs(newScaleX) / 100);
          setScaleY(Math.abs(newScaleY) / 100);
          setFlipX(newScaleX < 0);
          setFlipY(newScaleY < 0);
        }}
        handleReset={(n) => {
          setScaleX(n / 100);
          setScaleY(n / 100);
          setFlipX(false);
          setFlipY(false);
        }}
      />
      <SliderProp
        name="Scale X"
        min={0}
        max={400}
        origin={100}
        unit="%"
        value={realScaleX}
        onChange={(n) => {
          setScaleX(Math.abs(n) / 100);
          setFlipX(n < 0);
        }}
      />
      <SliderProp
        name="Scale Y"
        min={0}
        max={400}
        origin={100}
        unit="%"
        value={realScaleY}
        onChange={(n) => {
          setScaleY(Math.abs(n) / 100);
          setFlipY(n < 0);
        }}
      />
      <SliderProp
        name="Rotation"
        min={0}
        max={360}
        origin={0}
        unit="°"
        value={angle}
        onChange={(n) => {
          setAngle(n);
        }}
      />
    </PropertyPanel>
  );
}

// function CompositingProperties() {
//   const selectedCard = useContext(SelectedCardContext);
//   const [opacity, setOpacity] = useState(selectedCard?.fabricObject?.opacity)
//   return (
//   <PropertyPanel name="Compositing">

//   </PropertyPanel>
//   )
// }

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
      <VStack
        align="stretch"
        spacing={1}
        divider={<StackDivider borderColor="#4A5568" borderWidth="1px" />}
      >
        <TopBar tab={tab} setTab={setTab} />
        <Properties tab={tab} />
      </VStack>
    </Box>
  );
}
