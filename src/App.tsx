import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Library from "./components/Library";
import Timeline from "./components/Timeline";
import { MediaTimeline } from "./components/Media";
import { useState } from "react";
import Player from "./components/Player";
import { FabricContextProvider } from "./context/FabricContext";
import { SelectedCardContextProvider } from "./context/SelectedCardContext";
import { TimelineMediaContextProvider } from "./context/TimelineMediaContext";

function App() {
  const [playerKey, setPlayerKey] = useState(0);

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <SelectedCardContextProvider>
        <TimelineMediaContextProvider>
          <FabricContextProvider>
            <Allotment defaultSizes={[2, 1]} vertical={true}>
              <Allotment.Pane minSize={300}>
                <Allotment
                  defaultSizes={[2, 5, 2]}
                  onDragEnd={() => setPlayerKey(playerKey + 1)} // force rerender for player scaling
                >
                  <Allotment.Pane minSize={100}>
                    <Library />
                  </Allotment.Pane>
                  <Allotment.Pane minSize={300}>
                    <Player key={playerKey} />
                  </Allotment.Pane>
                  <Allotment.Pane minSize={100}>
                    <div />
                  </Allotment.Pane>
                </Allotment>
              </Allotment.Pane>
              <Allotment.Pane minSize={300}>
                <Timeline />
              </Allotment.Pane>
            </Allotment>
          </FabricContextProvider>
        </TimelineMediaContextProvider>
      </SelectedCardContextProvider>
    </div>
  );
}

export default App;
