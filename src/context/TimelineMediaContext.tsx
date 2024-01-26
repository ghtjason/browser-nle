import { createContext, useState } from "react";
import { MediaTimeline } from "../components/Media";

type TlMediaContext = [MediaTimeline[], React.Dispatch<React.SetStateAction<MediaTimeline[]>>];
type SnapTimesContext = [number[], () => void];

export const TimelineMediaContext = createContext<TlMediaContext>([
  [],
  () => {},
]);

export const SnapTimesContext = createContext<SnapTimesContext>([[], () => {}]);


export const AppendContext = createContext<(t: MediaTimeline) => void>(
  () => {}
);

export const TimelineMediaContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [timelineMedia, setTimelineMedia] = useState<MediaTimeline[]>([]);

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
          {props.children}
      </SnapTimesContext.Provider>
    </TimelineMediaContext.Provider>
  );
};
