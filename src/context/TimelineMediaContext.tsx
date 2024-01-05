import { createContext, useState } from "react";
import { MediaTimeline } from "../components/Media";

type TlMediaContext = [MediaTimeline[], (media: MediaTimeline[]) => void];
type SnapTimesContext = [Set<number>, () => void];

export const TimelineMediaContext = createContext<TlMediaContext>([
  [],
  () => {},
]);

export const SnapTimesContext = createContext<SnapTimesContext>([
  new Set(),
  () => {},
]);

export const TimelineMediaContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [timelineMedia, setTimelineMedia] = useState<MediaTimeline[]>([]);
  const snapTimes = new Set<number>();
  function refreshSnapTimes() {
    snapTimes.clear();
    for (const i of timelineMedia) {
      snapTimes.add(i.start);
      snapTimes.add(i.end);
    }
  }
  refreshSnapTimes();
  return (
    <TimelineMediaContext.Provider value={[timelineMedia, setTimelineMedia]}>
      <SnapTimesContext.Provider value={[snapTimes, refreshSnapTimes]}>
        {props.children}
      </SnapTimesContext.Provider>
    </TimelineMediaContext.Provider>
  );
};
