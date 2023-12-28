import "./App.css";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Library from "./components/Library";
import Timeline from "./components/Timeline";
import { MediaTimeline } from "./components/Media";
import { useState } from "react";

function App() {
  const [timelineMedia, setTimelineMedia] = useState<MediaTimeline[]>([]);
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Allotment defaultSizes={[2, 1]} vertical={true}>
        <Allotment.Pane minSize={300}>
          <Allotment defaultSizes={[1, 1, 1]}>
            <Allotment.Pane minSize={100}>
              <Library timelineMedia={timelineMedia} setTimelineMedia={setTimelineMedia}/>
            </Allotment.Pane>
            <Allotment.Pane minSize={100}>
              <div />
            </Allotment.Pane>
            <Allotment.Pane minSize={100}>
              <div />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane minSize={300}>
          <Timeline timelineMedia={timelineMedia} setTimelineMedia={setTimelineMedia}/>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;
