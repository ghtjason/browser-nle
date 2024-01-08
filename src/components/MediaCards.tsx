import { Heading, Image, Box } from "@chakra-ui/react";
import { BaseMedia, MediaTimeline, VideoMediaTimeline } from "./Media";
import { useCallback, useContext, useState } from "react";
import {
  SelectCardContext,
  SelectedCardContext,
} from "../context/SelectedCardContext";
import { FabricContext } from "../context/FabricContext";
import { NumberSize, Resizable } from "re-resizable";
import { Direction } from "re-resizable/lib/resizer";
import { SnapTimesContext } from "../context/TimelineMediaContext";

export default function MediaCard({ img }: { img: BaseMedia }) {
  return (
    <Box width="175px" borderWidth={1} borderRadius="lg" overflow="hidden">
      <Image src={img.thumbnailURL} alt={img.name} />
      <Heading size="xs" isTruncated={true} padding="6px">
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
  const selectCard = useContext(SelectCardContext);
  const selectedCard = useContext(SelectedCardContext);
  const [canvas] = useContext(FabricContext);
  const duration = props.media.end - props.media.start;
  const width = duration / 10;
  // const offset = props.media.start / 10;
  const outline = props.media === selectedCard ? "#ECC94B" : "#2D3748";
  const [, refreshSnapTimes] = useContext(SnapTimesContext);
  const [offset, setOffset] = useState(props.media.start / 10);
  if (offset != props.media.start / 10) setOffset(props.media.start / 10); // weird workaround for mouse move rendering

  function handleClick() {
    selectCard(props.media);
    if (canvas && props.media.fabricObject!.visible) {
      canvas.setActiveObject(props.media.fabricObject!);
      canvas.requestRenderAll();
    }
  }

  const enableDirs = {
    top: false,
    right: true,
    bottom: false,
    left: true,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  const defaultSize = {
    width: width,
    height: props.height,
  };

  function handleResizeStop(direction: Direction, delta: NumberSize) {
    if (direction == "right") {
      if (props.media instanceof VideoMediaTimeline) {
        const maxExtendEnd =
          props.media.media.duration * 1000 -
          props.media.offsetStart -
          duration; // should always be positive
        props.media.end += Math.min(maxExtendEnd, delta.width * 10);
      } else props.media.end += delta.width * 10;
    } else if (direction == "left") {
      if (props.media instanceof VideoMediaTimeline) {
        const maxExtendStart = props.media.offsetStart;
        props.media.start -= Math.min(maxExtendStart, delta.width * 10);
        props.media.offsetStart -= Math.min(maxExtendStart, delta.width * 10);
      } else props.media.start -= Math.min(props.media.start, delta.width * 10);
    }
    refreshSnapTimes();
  }

  // function handleResize(
  //   event: MouseEvent | TouchEvent,
  //   direction: Direction,
  //   refToElement: HTMLElement,
  //   delta: NumberSize
  // ) {
  //   console.log(delta)
  // }

  const handleMouseDown = useCallback(() => {
    window.addEventListener("mousemove", handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", handleMouseMove);
    refreshSnapTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    const delta = Math.max(-props.media.start, e.movementX * 10);
    props.media.start += delta;
    props.media.end += delta;
    setOffset(offset + delta); // weird, apparently only used to rerender component?????
  };

  return (
    <Box
      minWidth="100%"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Resizable
        enable={enableDirs}
        defaultSize={defaultSize}
        onResizeStop={(_e, dir, _ref, d) => handleResizeStop(dir, d)}
        style={{
          marginLeft: props.media.start / 10,
        }}
      >
        <div>
          <Box
            width={width}
            height={props.height}
            borderRadius="lg"
            overflow="hidden"
            borderColor={outline}
            borderWidth="3px"
            onClick={handleClick}
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
        </div>
      </Resizable>
    </Box>
  );
}
