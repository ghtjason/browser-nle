import "./App.css";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

function App() {
  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <Allotment defaultSizes={[2, 1]} vertical={true}>
        <Allotment.Pane minSize={400}>
          <Allotment defaultSizes={[1, 1, 1]}>
            <Allotment.Pane minSize={100}>
              <div />
            </Allotment.Pane>
            <Allotment.Pane minSize={100}>
              <div />
            </Allotment.Pane>
            <Allotment.Pane minSize={100}>
              <div />
            </Allotment.Pane>
          </Allotment>
        </Allotment.Pane>
        <Allotment.Pane minSize={400}>
          <div />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default App;
