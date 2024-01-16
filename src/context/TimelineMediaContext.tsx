import { createContext, useState } from "react";
import { MediaTimeline } from "../components/Media";

type MovedTrackContext = [number, (n: number) => void];
type TlMediaContext = [MediaTimeline[], (media: MediaTimeline[]) => void];
type SnapTimesContext = [number[], () => void];

export const TimelineMediaContext = createContext<TlMediaContext>([
  [],
  () => {},
]);

export const SnapTimesContext = createContext<SnapTimesContext>([[], () => {}]);

export const MovedTrackContext = createContext<MovedTrackContext>([
  0,
  () => {},
]);

export const AppendContext = createContext<(t: MediaTimeline) => void>(
  () => {}
);

export const TimelineMediaContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [timelineMedia, setTimelineMedia] = useState<MediaTimeline[]>([]);

  const [movedTrack, setMovedTrack] = useState(-1);
  // array instead of Set because snapTimes is also used to track media start/end changes
  const [snapTimes, setSnapTimes] = useState<number[]>([]);
  function refreshSnapTimes() {
    const newSnaps = [];
    function arraysEqual(a: number[], b: number[]) {
      if (a === b) return true;
      if (a == null || b == null) return false;
      if (a.length !== b.length) return false;
      return a.every((val, idx) => val === b[idx]);
    }

    for (const i of timelineMedia) {
      newSnaps.push(i.start);
      newSnaps.push(i.end);
    }
    if (!arraysEqual(snapTimes, newSnaps)) setSnapTimes(newSnaps);
  }
  return (
    <TimelineMediaContext.Provider value={[timelineMedia, setTimelineMedia]}>
      <SnapTimesContext.Provider value={[snapTimes, refreshSnapTimes]}>
        <MovedTrackContext.Provider value={[movedTrack, setMovedTrack]}>
          {props.children}
        </MovedTrackContext.Provider>
      </SnapTimesContext.Provider>
    </TimelineMediaContext.Provider>
  );
};
