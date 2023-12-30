import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Library from "./components/Library";
import Timeline from "./components/Timeline";
import { MediaTimeline } from "./components/Media";
import { useState } from "react";
import Player from "./components/Player";
import { FabricContextProvider } from "./context/FabricContext";

function App() {
  const [timelineMedia, setTimelineMedia] = useState<MediaTimeline[]>([]);
  const [selectedCard, setSelectedCard] = useState<MediaTimeline>();
  const [playerKey, setPlayerKey] = useState(0);
  console.log(playerKey);
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Allotment defaultSizes={[2, 1]} vertical={true}>
        <Allotment.Pane minSize={300}>
          <Allotment
            defaultSizes={[1, 1, 1]}
            onDragEnd={() => setPlayerKey(playerKey + 1)}
          >
            <Allotment.Pane minSize={100}>
              <Library
                timelineMedia={timelineMedia}
                setTimelineMedia={setTimelineMedia}
              />
            </Allotment.Pane>
            <Allotment.Pane minSize={400}>
              <FabricContextProvider>
                <Player
                  selectedCard={selectedCard}
                  setSelectedCard={setSelectedCard}
                  key={playerKey}
                  timelineMedia={timelineMedia}
                />
              </FabricContextProvider>
            </Allotment.Pane>
            <Allotment.Pane minSize={100}>
              <div />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane minSize={300}>
          <Timeline
            timelineMedia={timelineMedia}
            setTimelineMedia={setTimelineMedia}
            selectedCard={selectedCard}
            setSelectedCard={setSelectedCard}
          />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;
