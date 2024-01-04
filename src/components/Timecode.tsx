import { useContext } from "react";
import { PlayContext, TimeContext } from "../context/TimeContext";
import { Center, IconButton, Text } from "@chakra-ui/react";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";

export default function Timecode() {
  const elapsedTime = useContext(TimeContext);
  const [, handlePause, handleResume, , isPlaying] = useContext(PlayContext);
  function msToTimecode(ms: number) {
    const min = Math.floor(ms / (60 * 1000)).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const sec = Math.floor((ms / 1000) % 60).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const milli = Math.floor((ms % 1000) / 10).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const timecode = min + ":" + sec + "." + milli;
    return timecode;
  }
  function handleClick() {
    isPlaying ? handlePause() : handleResume();
  }
  const icon = isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />;
  return (
    <Center height="40px" width="100%" position="absolute" bottom="0">
      <Text as="samp" fontSize="xl">
        {msToTimecode(elapsedTime)}
      </Text>
      <IconButton
        aria-label="play"
        icon={icon}
        onClick={handleClick}
        variant="none"
        height="10px"
        fontSize="10px"
        ml={3}
      />
    </Center>
  );
}
