import { Heading, Image, Box, Icon } from "@chakra-ui/react";
import { BaseMedia, MediaTimeline, VideoMediaTimeline } from "./Media";
import { useCallback, useContext, useState } from "react";
import {
  SelectCardContext,
  SelectedCardContext,
} from "../context/SelectedCardContext";
import { FabricContext } from "../context/FabricContext";
import {
  MovedTrackContext,
  SnapTimesContext,
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import { PlayContext } from "../context/TimeContext";
import { IconDotsVertical } from "@tabler/icons-react";

export default function MediaCard({ img }: { img: BaseMedia }) {
  return (
    <Box width="140px" borderWidth={1} borderRadius="lg" overflow="hidden">
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
  const [rightHighlighted, setRightHighlighted] = useState(false);
  const [leftHighlighted, setLeftHighlighted] = useState(false);
  const rightColor = rightHighlighted ? "#ECC94B" : "white";
  const leftColor = leftHighlighted ? "#ECC94B" : "white";
  const outline = props.media === selectedCard ? "#ECC94B" : "#2D3748";
  const [snapTimes, refreshSnapTimes] = useContext(SnapTimesContext);
  const [offset, setOffset] = useState(props.media.start / 10);
  const [, setRender] = useState(0);
  const [hasHandledChange, setHasHandledChange] = useState(false);
  const [movedTrack, setMovedTrack] = useContext(MovedTrackContext);
  if (offset != props.media.start / 10) setOffset(props.media.start / 10); // weird workaround for mouse move rendering
  const handleTrackChangeRender = useCallback(() => {
    const handleMouseUp = () => {
      setHasHandledChange(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      console.log("moving");
      if (e.movementX != 0)
        document.removeEventListener("mousemove", handleMouseMove);
      setRender((render) => render + 1);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  }, []);
  if (!hasHandledChange && movedTrack == props.track) {
    handleTrackChangeRender();
  }

  function handleClick() {
    selectCard(props.media);
    if (canvas && props.media.fabricObject!.visible) {
      canvas.setActiveObject(props.media.fabricObject!);
      canvas.requestRenderAll();
    }
  }

  function snapToEdgeDiff(
    start: number,
    end: number,
    ignoreStart: number,
    ignoreEnd: number
  ) {
    function snapToEdge(n: number) {
      for (const snap of snapTimes) {
        if (snap == ignoreStart || snap == ignoreEnd) continue;
        if (Math.abs(n - snap) < 100) return snap;
      }
      return n;
    }
    let diff = start - snapToEdge(start);
    if (diff == 0) diff = end - snapToEdge(end);
    return diff;
  }

  const [timelineMedia, setTimelineMedia] = useContext(TimelineMediaContext);
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      let track = props.track;
      const diff = e.pageX - props.media.start / 10;
      let top = e.pageY - e.nativeEvent.offsetY;
      const spacing = 8;
      const ogStart = props.media.start;
      const ogEnd = props.media.end;
      let timelineMediaCopy = [...timelineMedia];
      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        refreshSnapTimes();
        setMovedTrack(-1);
      };
      function changeTrack(a: number, b: number) {
        const len = timelineMediaCopy.length;
        if (a < 0 || a >= len || b < 0 || b >= len) return;
        const newArray = [...timelineMediaCopy];
        const temp = newArray[a];
        newArray[a] = newArray[b];
        newArray[b] = temp;
        setTimelineMedia(newArray);
        timelineMediaCopy = newArray;
      }

      const handleMouseMove = (e: MouseEvent) => {
        let newStart = (e.pageX - diff) * 10;
        let highlighted = false;
        if (newStart <= 0) {
          newStart = 0;
          highlighted = true;
        } else setLeftHighlighted(false);
        const newEnd = newStart + props.media.end - props.media.start;
        const snapDiff = snapToEdgeDiff(newStart, newEnd, ogStart, ogEnd);
        props.media.start = newStart - snapDiff;
        props.media.end = newEnd - snapDiff;
        if (top - e.pageY > props.height / 2 + spacing) {
          changeTrack(track, track - 1);
          track -= 1;
          top -= spacing + props.height;
          setMovedTrack(track);
        } else if (
          e.pageY - (top + props.height) >
          props.height / 2 + spacing
        ) {
          changeTrack(track, track + 1);
          track += 1;
          top += spacing + props.height;
          setMovedTrack(track);
        } else {
          setLeftHighlighted(highlighted);
          setRender((render) => render + 1);
        }
        // weird, should only be used to rerender component but breaks otherwise?????
      };

      if (isPlaying) return;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, { once: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPlaying, timelineMedia]
  );

  const handleDragRight = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      const diff = e.pageX - props.media.end / 10;
      const ogEnd = props.media.end;
      const handleMouseUp = () => {
        document.body.style.cursor = "default";
        setRightHighlighted(false);
        document.removeEventListener("mousemove", handleMouseMove);
        refreshSnapTimes();
      };

      const handleMouseMove = (e: MouseEvent) => {
        let newEnd = (e.pageX - diff) * 10;
        let highlighted = false;
        if (newEnd <= props.media.start + 100) {
          newEnd = props.media.start + 100;
          highlighted = true;
        }
        if (props.media instanceof VideoMediaTimeline) {
          const maxEnd =
            props.media.start +
            props.media.media.duration * 1000 -
            props.media.offsetStart;
          if (newEnd >= maxEnd) {
            newEnd = maxEnd;
            highlighted = true;
          }
        }
        const snapDiff = snapToEdgeDiff(newEnd, newEnd, ogEnd, ogEnd);
        props.media.end = newEnd - snapDiff;
        setRightHighlighted(highlighted);
        setRender((render) => render + 1);
      };

      if (isPlaying) return;
      document.body.style.cursor = "e-resize";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, { once: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPlaying]
  );

  const handleDragLeft = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      const ogStart = props.media.start;
      const diff = e.pageX - props.media.start / 10;
      const handleMouseUp = () => {
        document.body.style.cursor = "default";
        setLeftHighlighted(false);
        document.removeEventListener("mousemove", handleMouseMove);
        refreshSnapTimes();
      };

      const handleMouseMove = (e: MouseEvent) => {
        let newStart = (e.pageX - diff) * 10;
        const lastStart = props.media.start;
        let highlighted = false;
        if (newStart <= 0) {
          newStart = 0;
          highlighted = true;
        } else if (newStart >= props.media.end - 100) {
          newStart = props.media.end - 100;
          highlighted = true;
        }
        if (props.media instanceof VideoMediaTimeline) {
          const minStart = props.media.start - props.media.offsetStart;
          if (newStart <= minStart) {
            newStart = minStart;
            highlighted = true;
          }
          const snapDiff = snapToEdgeDiff(newStart, newStart, ogStart, ogStart);
          props.media.offsetStart += newStart - lastStart - snapDiff;
        }
        const snapDiff = snapToEdgeDiff(newStart, newStart, ogStart, ogStart);
        if (snapDiff != 0) highlighted = true;
        props.media.start = newStart - snapDiff;
        setLeftHighlighted(highlighted);
        setRender((render) => render + 1);
      };

      if (isPlaying) return;
      document.body.style.cursor = "e-resize";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, { once: true });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isPlaying]
  );

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
        color={rightColor}
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
        color={leftColor}
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
        id={props.track.toString()}
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
