import { createContext, useState } from "react";
import { MediaTimeline } from "../components/Media";

type TlMediaContext = [MediaTimeline[], (media: MediaTimeline[]) => void, Set<number>];

export const TimelineMediaContext = createContext<TlMediaContext>([
  [],
  () => {},
  new Set(),
]);

export const TimelineMediaContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [timelineMedia, setTimelineMedia] = useState<MediaTimeline[]>([]);
  const snapTimes = new Set<number>();
  for (const i of timelineMedia) {
    snapTimes.add(i.start);
    snapTimes.add(i.end);
  }
  return (
    <TimelineMediaContext.Provider value={[timelineMedia, setTimelineMedia, snapTimes]}>
      {props.children}
    </TimelineMediaContext.Provider>
  );
};
