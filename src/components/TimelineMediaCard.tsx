import { Box, Icon } from "@chakra-ui/react";
import { ImageMediaTimeline, MediaTimeline, VideoMediaTimeline } from "./Media";
import { memo, useContext, useEffect, useRef, useState } from "react";
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
import {
  PlayContext,
  TimeContext,
  TimeRatioContext,
} from "../context/TimeContext";

// handles element visibility and video time on fabric canvas
const HandleCanvas = memo(({ i }: { i: MediaTimeline }) => {
  const [, , , , isPlaying] = useContext(PlayContext);
  const elapsedTime = useContext(TimeContext);
  const [canvas] = useContext(FabricContext);
  if (!i.fabricObject) return;
  if (isPlaying) {
    if (elapsedTime >= i.end || elapsedTime < i.start) {
      i.fabricObject.visible = false;
      if (i instanceof VideoMediaTimeline) {
        i.element.pause();
        const startTime = i.offsetStart / 1000;
        if (i.element.currentTime != startTime && elapsedTime < i.end)
          i.element.currentTime = startTime;
      }
    } else {
      i.fabricObject.visible = true;
      if (i instanceof VideoMediaTimeline && i.element.paused) {
        i.element.play(); // assume time has been seeked to correct location
      }
    }
  } else {
    if (elapsedTime >= i.end || elapsedTime < i.start) {
      let changedVisibility = false;
      if (i.fabricObject.visible) {
        i.fabricObject.visible = false;
        changedVisibility = true;
      }
      if (i instanceof VideoMediaTimeline) {
        i.element.onseeked = () => {
          canvas?.renderAll();
        };
        i.element.pause();
        if (i.element.currentTime != 0) i.element.currentTime = 0;
      } else if (changedVisibility) canvas?.requestRenderAll();
    } else {
      if (i instanceof VideoMediaTimeline) {
        i.element.onseeked = () => {
          i.fabricObject!.visible = true;
          if (canvas && canvas.getContext()) canvas.renderAll();
        };
        i.element.pause();
        i.element.currentTime = (elapsedTime - i.start + i.offsetStart) / 1000;
      } else {
        i.fabricObject.visible = true;
        canvas?.requestRenderAll();
      }
    }
  }
  return false;
});

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

const TimelineMediaCard = memo((props: IProps) => {
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

  const [topOffset, setTopOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  const [zIndex, setZIndex] = useState(1);

  const maxOffset = 30;
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

  function easeBackInPlace(val: number) {
    function reduceVal(n: number) {
      return n * 0.5;
    }
    if (val > 0.5) {
      setTopOffset((topOffset) => Math.max(0, reduceVal(topOffset)));
      setBottomOffset((bottomOffset) => Math.max(0, reduceVal(bottomOffset)));
      setTimeout(() => {
        easeBackInPlace(reduceVal(val));
      }, 0);
    } else setZIndex(1);
  }

  const cardMid = useRef(0);
  // props.track and tlmedia not properly updating inside
  const track = useRef(props.track);
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const diff = e.pageX - start / ratio;
    cardMid.current = e.pageY;
    track.current = props.track;
    const spacing = 8;
    const ogStart = start;
    const ogEnd = end;
    setZIndex(2);
    const handleMouseUp = (e: MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      setLeftHighlighted(false);
      setRightHighlighted(false);
      easeBackInPlace(
        Math.abs(
          ((cardMid.current - e.pageY) / (spacing + props.height)) * maxOffset
        )
      );
      refreshSnapTimes();
      handleClick();
    };
    function canChangeTrack(a: number, b: number) {
      const len = timelineMedia.length;
      return !(a < 0 || a >= len || b < 0 || b >= len);
    }
    function changeTrack(a: number, b: number) {
      if (!canChangeTrack(a, b)) return;
      setTopOffset(0);
      setBottomOffset(0);
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
      const distFromMid = cardMid.current - e.pageY;
      const maxDistance = spacing + props.height;
      const canGoUp = canChangeTrack(track.current, track.current - 1);
      const canGoDown = canChangeTrack(track.current, track.current + 1);
      if (canGoUp)
        setTopOffset(Math.max(0, (distFromMid / maxDistance) * maxOffset));
      if (canGoDown)
        setBottomOffset(Math.max(0, (-distFromMid / maxDistance) * maxOffset));
      if (distFromMid > maxDistance && canGoUp) {
        changeTrack(track.current, track.current - 1);
        track.current -= 1;
        cardMid.current -= spacing + props.height;
      } else if (-distFromMid > maxDistance && canGoDown) {
        changeTrack(track.current, track.current + 1);
        track.current += 1;
        cardMid.current += spacing + props.height;
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

  const buttonTopOffset = (topOffset != 0 ? -topOffset : bottomOffset) * 0.8;
  return (
    <>
      <div
        style={{
          marginLeft: offset,
          width: width,
          position: "relative",
          zIndex: zIndex,
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
          top={`${buttonTopOffset}px`}
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
          top={`${buttonTopOffset}px`}
        />
        <div
          style={{
            marginBottom: -bottomOffset + "px",
            paddingTop: bottomOffset + "px",
            marginTop: -topOffset + "px",
            paddingBottom: topOffset + "px",
          }}
        >
          <Box
            height={props.height}
            borderRadius="lg"
            overflow="hidden"
            borderColor={outline}
            borderWidth="3px"
            onClick={handleClick}
            pointerEvents="auto"
            onMouseDown={handleMouseDown}
            id={props.track.toString()}
          >
            <InsideCard
              thumbnail={thumbnail}
              media={props.media}
              ratio={ratio}
              offsetStart={offsetStart}
            />
          </Box>
        </div>
      </div>
      <HandleCanvas i={props.media} />
    </>
  );
});

export default TimelineMediaCard;
