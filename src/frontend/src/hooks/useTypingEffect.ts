import { useEffect, useState } from "react";

export function useTypingEffect(
  text: string,
  speed = 50,
  startDelay = 0,
): { displayText: string; isDone: boolean } {
  const [displayText, setDisplayText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsDone(false);

    let index = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          setIsDone(true);
          clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayText, isDone };
}
