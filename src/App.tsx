import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Library from "./components/Library";
import Timeline from "./components/Timeline";
import Player from "./components/Player";
import { FabricContextProvider } from "./context/FabricContext";
import { SelectedCardContextProvider } from "./context/SelectedCardContext";
import { TimelineMediaContextProvider } from "./context/TimelineMediaContext";
import { TimeContextProvider } from "./context/TimeContext";
import Timecode from "./components/Timecode";
import Inspector from "./components/Inspector";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        color: "#EDF2F7",
      }}
    >
      <SelectedCardContextProvider>
        <TimelineMediaContextProvider>
          <FabricContextProvider>
            <TimeContextProvider>
              <Allotment
                defaultSizes={[2, 1]}
                vertical={true}
              >
                <Allotment.Pane minSize={300}>
                  <Allotment
                    defaultSizes={[2, 5, 2]}
                  >
                    <Allotment.Pane minSize={250}>
                      <Library />
                    </Allotment.Pane>
                    <Allotment.Pane minSize={300}>
                      <Player />
                      <Timecode />
                    </Allotment.Pane>
                    <Allotment.Pane minSize={350}>
                      <Inspector />
                    </Allotment.Pane>
                  </Allotment>
                </Allotment.Pane>
                <Allotment.Pane minSize={300}>
                  <Timeline />
                </Allotment.Pane>
              </Allotment>
            </TimeContextProvider>
          </FabricContextProvider>
        </TimelineMediaContextProvider>
      </SelectedCardContextProvider>
    </div>
  );
}

export default App;
