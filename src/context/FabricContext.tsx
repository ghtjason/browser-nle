import { createContext, useState } from "react";
import { fabric } from "fabric";

// Here are the things that can live in the fabric context.
type FabContext = [
  // The canvas
  fabric.Canvas | null,
  // The setter for the canvas
  (c: fabric.Canvas) => void
];

// This is the context that components in need of canvas-access will use:
export const FabricContext = createContext<FabContext>([null, () => {}]);

/**
 * This context provider will be rendered as a wrapper component and will give the
 * canvas context to all of its children.
 */
export const FabricContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const initCanvas = (c: fabric.Canvas): void => {
    setCanvas(c);
  };

  return (
    <FabricContext.Provider value={[canvas, initCanvas]}>
      {props.children}
    </FabricContext.Provider>
  );
};
