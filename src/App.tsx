import "./App.css";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Library from "./modules/Library";

function App() {
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
              <Library/>
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
          <div />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;
