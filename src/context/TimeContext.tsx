import { createContext, useCallback, useRef, useState } from "react";
import { useTimer, Timer } from "react-use-precision-timer";

type PlayContext = [
  () => void,
  () => void,
  () => void,
  () => void,
  boolean,
  (t: number) => void
];
type NumberStateContext = [number, (n: number) => void];

// This is the context that components in need of canvas-access will use:
export const TimeContext = createContext<number>(0);

export const PlayContext = createContext<PlayContext>([
  () => {},
  () => {},
  () => {},
  () => {},
  false,
  () => {},
]);

export const TimeRatioContext = createContext<NumberStateContext>([
  0,
  () => {},
]);

export const MaxTimeContext = createContext<NumberStateContext>([0, () => {}]);

export const TimeContextProvider = (props: {
  children: JSX.Element;
}): JSX.Element => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxTime, setMaxTime] = useState<number>(180 * 1000);
  const [msToPixelRatio, setMsToPixelRatio] = useState(50);

  const timerRef = useRef<Timer | null>(null);
  const callback = useCallback(() => {
    if (timerRef.current) {
      if (timerRef.current.getElapsedRunningTime() > maxTime) handleReset();
      else setElapsedTime(timerRef.current.getElapsedRunningTime());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const timer = useTimer({ delay: 10 }, callback);
  timerRef.current = timer;

  const handleStart = () => {
    timer.start();
    setIsPlaying(true);
  };

  const handlePause = () => {
    timer.pause();
    setIsPlaying(false);
  };

  const handleResume = () => {
    timer.start(Date.now() - elapsedTime);
    setIsPlaying(true);
  };

  const handleReset = () => {
    timer.stop();
    setIsPlaying(false);
    setElapsedTime(0);
  };

  const handleSetTime = (n: number) => {
    if (n < 0) setElapsedTime(0);
    else if (n > maxTime) setElapsedTime(maxTime);
    else setElapsedTime(n);
  };

  return (
    <TimeContext.Provider value={elapsedTime}>
      <PlayContext.Provider
        value={[
          handleStart,
          handlePause,
          handleResume,
          handleReset,
          isPlaying,
          handleSetTime,
        ]}
      >
        <MaxTimeContext.Provider value={[maxTime, setMaxTime]}>
          <TimeRatioContext.Provider
            value={[msToPixelRatio, setMsToPixelRatio]}
          >
            {props.children}
          </TimeRatioContext.Provider>
        </MaxTimeContext.Provider>
      </PlayContext.Provider>
    </TimeContext.Provider>
  );
};
