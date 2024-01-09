import { createContext, useState } from "react";
import { MediaTimeline } from "../components/Media";

type MovedTrackContext = [number, (n: number) => void];
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
        <MovedTrackContext.Provider value={[movedTrack, setMovedTrack]}>
          {props.children}
        </MovedTrackContext.Provider>
      </SnapTimesContext.Provider>
    </TimelineMediaContext.Provider>
  );
};
