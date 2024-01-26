import { createContext, useState } from "react";
import { MediaTimeline } from "../components/Media";

export const SelectedCardContext = createContext<MediaTimeline | null>(null);

export const SelectCardContext = createContext<
  React.Dispatch<React.SetStateAction<MediaTimeline | null>>
>(() => {});

export const SelectedCardContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [selectedCard, setSelectedCard] = useState<MediaTimeline | null>(null);

  return (
    <SelectedCardContext.Provider value={selectedCard}>
      <SelectCardContext.Provider value={setSelectedCard}>
        {props.children}
      </SelectCardContext.Provider>
    </SelectedCardContext.Provider>
  );
};
