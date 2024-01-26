import { Box, Icon } from "@chakra-ui/react";
import { ImageMediaTimeline, MediaTimeline, VideoMediaTimeline } from "./Media";
import { useContext, useEffect, useRef, useState } from "react";
import {
  SelectCardContext,
  SelectedCardContext,
} from "../context/SelectedCardContext";
import { FabricContext } from "../context/FabricContext";
import {
  SnapTimesContext,
  TimelineMediaContext,
} from "../context/TimelineMediaContext";
import { IconDotsVertical } from "@tabler/icons-react";
import { TimeRatioContext } from "../context/TimeContext";

const InsideCard = ({
  thumbnail,
  media,
  ratio,
  offsetStart,
}: {
  thumbnail: string;
  media: MediaTimeline;
  ratio: number;
  offsetStart: number;
}) => {
  if (media instanceof VideoMediaTimeline && media.media.audioWaveform) {
    return (
      <>
        <Box
          backgroundImage={`url(${thumbnail})`}
          backgroundSize="auto 100%"
          backgroundRepeat="repeat-x"
          height="70%"
          width="100%"
          draggable={false}
          userSelect="none"
        />
        <Box
          backgroundImage={`url(${media.media.audioWaveform})`}
          backgroundSize="100% 70%"
          backgroundRepeat="no-repeat"
          height="30%"
          width={`${(media.media.duration * 1000) / ratio}px`}
          draggable={false}
          userSelect="none"
          backgroundColor="#2a4365"
          style={{
            backgroundPosition: `left -${offsetStart / ratio}px center`,
            imageRendering: "pixelated",
          }}
        />
      </>
    );
  } else {
    return (
      <Box
        backgroundImage={`url(${thumbnail})`}
        backgroundSize="auto 100%"
        backgroundRepeat="repeat-x"
        height="100%"
        width="100%"
        draggable={false}
        userSelect="none"
      />
    );
  }
};

interface IProps {
  media: MediaTimeline;
  height: number;
  track: number;
}

export default function TimelineMediaCard(props: IProps) {
  const [ratio] = useContext(TimeRatioContext);
  const selectCard = useContext(SelectCardContext);
  const selectedCard = useContext(SelectedCardContext);
  const [canvas] = useContext(FabricContext);
  // const [, , , , isPlaying] = useContext(PlayContext);
  const [rightHighlighted, setRightHighlighted] = useState(false);
  const [leftHighlighted, setLeftHighlighted] = useState(false);
  const rightColor = rightHighlighted ? "#ECC94B" : "white";
  const leftColor = leftHighlighted ? "#ECC94B" : "white";
  const outline = props.media === selectedCard ? "#ECC94B" : "#171923";
  const [snapTimes, refreshSnapTimes] = useContext(SnapTimesContext);

  const [start, setStart] = useState(props.media.start);
  const [end, setEnd] = useState(props.media.end);
  const [offsetStart, setOffsetStart] = useState(0);
  const [timelineMedia, setTimelineMedia] = useContext(TimelineMediaContext);
  const offset = start / ratio;
  const duration = end - start;
  const width = duration / ratio;

  // update media object props based on state
  useEffect(() => {
    props.media.start = start;
    props.media.end = end;
  }, [start, end, props.media]);
  useEffect(() => {
    if (!(props.media instanceof VideoMediaTimeline)) return;
    props.media.offsetStart = offsetStart;
  }, [offsetStart, props.media]);

  // fabricjs z indexes depending on timeline order
  useEffect(() => {
    props.media.fabricObject?.moveTo(timelineMedia.length - props.track - 1);
  }, [
    props.media.fabricObject,
    props.media.media.name,
    props.track,
    timelineMedia.length,
  ]);

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
    function snapToEdge(n: number, ignore: number) {
      for (const snap of snapTimes) {
        if (snap == ignore) continue;
        if (Math.abs(n - snap) < 10 * ratio) return snap;
      }
      return n;
    }
    let diff = start - snapToEdge(start, ignoreStart);
    if (diff == 0) diff = end - snapToEdge(end, ignoreEnd);
    return diff;
  }

  const cardTop = useRef(0);
  // props.track not properly updating inside (because event listener?); workaround
  const track = useRef(props.track);
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const diff = e.pageX - start / ratio;
    cardTop.current = e.pageY - e.nativeEvent.offsetY;
    const spacing = 8;
    const ogStart = start;
    const ogEnd = end;
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      setLeftHighlighted(false);
      setRightHighlighted(false);
      refreshSnapTimes();
      handleClick();
    };
    function canChangeTrack(a: number, b: number) {
      const len = timelineMedia.length;
      return !(a < 0 || a >= len || b < 0 || b >= len);
    }
    function changeTrack(a: number, b: number) {
      if (!canChangeTrack(a, b)) return;
      setTimelineMedia((timelineMedia) => {
        const newArray = [...timelineMedia];
        const temp = newArray[a];
        newArray[a] = newArray[b];
        newArray[b] = temp;
        return newArray;
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      let newStart = (e.pageX - diff) * ratio;
      if (newStart <= 0) {
        newStart = 0;
        setLeftHighlighted(true);
      } else setLeftHighlighted(false);
      const newEnd = newStart + end - start;
      const snapDiff = snapToEdgeDiff(newStart, newEnd, ogStart, ogEnd);
      setStart(newStart - snapDiff);
      setEnd(newEnd - snapDiff);

      if (cardTop.current - e.pageY > props.height / 2 + spacing) {
        changeTrack(track.current, track.current - 1);
        track.current -= 1;
        cardTop.current -= spacing + props.height;
      } else if (
        e.pageY - (cardTop.current + props.height) >
        props.height / 2 + spacing
      ) {
        changeTrack(track.current, track.current + 1);
        track.current += 1;
        cardTop.current += spacing + props.height;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  const handleDragRight = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const diff = e.pageX - end / ratio;
    const ogEnd = end;
    const handleMouseUp = () => {
      document.body.style.cursor = "default";
      setRightHighlighted(false);
      document.removeEventListener("mousemove", handleMouseMove);
      refreshSnapTimes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      let newEnd = (e.pageX - diff) * ratio;
      let highlighted = false;
      if (newEnd <= start + 100) {
        newEnd = start + 100;
        highlighted = true;
      }
      if (props.media instanceof VideoMediaTimeline) {
        const maxEnd = start + props.media.media.duration * 1000 - offsetStart;
        if (newEnd >= maxEnd) {
          newEnd = maxEnd;
          highlighted = true;
        }
      }
      const snapDiff = snapToEdgeDiff(newEnd, newEnd, ogEnd, ogEnd);
      setEnd(newEnd - snapDiff);
      setRightHighlighted(highlighted);
    };

    document.body.style.cursor = "e-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  const handleDragLeft = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const ogStart = start;
    const diff = e.pageX - start / ratio;
    const handleMouseUp = () => {
      document.body.style.cursor = "default";
      setLeftHighlighted(false);
      document.removeEventListener("mousemove", handleMouseMove);
      refreshSnapTimes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      let newStart = (e.pageX - diff) * ratio;
      let highlighted = false;
      if (newStart <= 0) {
        newStart = 0;
        highlighted = true;
      } else if (newStart >= end - 100) {
        newStart = end - 100;
        highlighted = true;
      }
      if (props.media instanceof VideoMediaTimeline) {
        const minStart = start - offsetStart;
        if (newStart <= minStart) {
          newStart = minStart;
          highlighted = true;
        }
        const snapDiff = snapToEdgeDiff(newStart, newStart, ogStart, ogStart);
        setOffsetStart(offsetStart + newStart - start - snapDiff);
      }
      const snapDiff = snapToEdgeDiff(newStart, newStart, ogStart, ogStart);
      if (snapDiff != 0) highlighted = true;
      setStart(newStart - snapDiff);
      setLeftHighlighted(highlighted);
    };

    document.body.style.cursor = "e-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, { once: true });
  };

  const thumbnail =
    props.media instanceof ImageMediaTimeline
      ? props.media.media.objectURL
      : props.media.media.thumbnailURL;
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
        <InsideCard thumbnail={thumbnail} media={props.media} ratio={ratio} offsetStart={offsetStart}/>
      </Box>
    </div>
  );
}
