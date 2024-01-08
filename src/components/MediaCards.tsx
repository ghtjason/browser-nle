import { Heading, Image, Box, Icon } from "@chakra-ui/react";
import { BaseMedia, MediaTimeline, VideoMediaTimeline } from "./Media";
import { useCallback, useContext, useState } from "react";
import {
  SelectCardContext,
  SelectedCardContext,
} from "../context/SelectedCardContext";
import { FabricContext } from "../context/FabricContext";
import { SnapTimesContext } from "../context/TimelineMediaContext";
import { PlayContext } from "../context/TimeContext";
import { IconDotsVertical } from "@tabler/icons-react";

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
  const [, , , , isPlaying] = useContext(PlayContext);
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

  const handleMouseDown = useCallback(() => {
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      refreshSnapTimes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const delta = Math.max(-props.media.start, e.movementX * 10);
      props.media.start += delta;
      props.media.end += delta;
      setOffset(offset + delta / 10);
      // weird, should only be used to rerender component but breaks otherwise?????
    };

    if (isPlaying) return;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  }, [isPlaying, offset, props.media, refreshSnapTimes]);

  const handleDragRight = useCallback(() => {
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "default";
      refreshSnapTimes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      let delta = e.movementX * 10;
      if (props.media instanceof VideoMediaTimeline) {
        const maxDelta =
          props.media.media.duration * 1000 -
          props.media.offsetStart -
          (props.media.end - props.media.start);
        delta = Math.min(maxDelta, delta);
        props.media.end += delta;
      } else props.media.end += delta;
      if (props.media.end < props.media.start + 100) {
        // min 100ms duration
        props.media.end = props.media.start + 100;
        setOffset(100);
      } else setOffset(offset + delta / 10);
      // weird, should only be used to rerender component but breaks otherwise?????
    };

    if (isPlaying) return;
    document.body.style.cursor = "e-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleDragLeft = useCallback(() => {
    const handleMouseUp = () => {
      document.body.style.cursor = "default";
      document.removeEventListener("mousemove", handleMouseMove);
      refreshSnapTimes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      let delta = Math.max(-props.media.start, e.movementX * 10); // max extension to 0
      const maxDelta = props.media.end - props.media.start - 100;
      delta = Math.min(delta, maxDelta);
      if (props.media instanceof VideoMediaTimeline) {
        const minDelta = -props.media.offsetStart;
        delta = Math.max(minDelta, delta);
        props.media.offsetStart += delta;
        props.media.start += delta;
      }
      else props.media.start += delta;
      setOffset(offset + delta);
      // weird, should only be used to rerender component but breaks otherwise?????
    };

    if (isPlaying) return;
    document.body.style.cursor = "e-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div
      style={{
        marginLeft: offset,
        width: width,
        position: "relative",
        // cursor: moveCursor,
      }}
    >
      <Icon
        as={IconDotsVertical}
        position="absolute"
        height="100%"
        right="-14px"
        aria-label={"extend"}
        paddingRight="2px"
        onMouseDown={handleDragRight}
        cursor="e-resize"
      />
      <Icon
        as={IconDotsVertical}
        position="absolute"
        height="100%"
        left="-14px"
        aria-label={"extend"}
        paddingLeft="2px"
        onMouseDown={handleDragLeft}
        cursor="w-resize"
      />

      <Box
        height={props.height}
        borderRadius="lg"
        overflow="hidden"
        borderColor={outline}
        borderWidth="3px"
        onClick={handleClick}
        pointerEvents="auto"
        zIndex={1}
        onMouseDown={handleMouseDown}
      >
        <Image
          src={props.media.media.thumbnailURL}
          alt={props.media.media.name}
          minHeight="100%"
          minWidth="100%"
          draggable={false}
          userSelect="none"
        />
      </Box>
    </div>
  );
}
