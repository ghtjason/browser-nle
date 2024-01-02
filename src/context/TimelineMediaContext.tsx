import { createContext, useState } from "react";
import { MediaTimeline } from "../components/Media";

type TlMediaContext = [MediaTimeline[], (media: MediaTimeline[]) => void];

export const TimelineMediaContext = createContext<TlMediaContext>([
  [],
  () => {},
]);

export const TimelineMediaContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [timelineMedia, setTimelineMedia] = useState<MediaTimeline[]>([]);

  return (
    <TimelineMediaContext.Provider value={[timelineMedia, setTimelineMedia]}>
      {props.children}
    </TimelineMediaContext.Provider>
  );
};
