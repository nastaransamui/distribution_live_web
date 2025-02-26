import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";

interface CountdownProps {
  expireAt: Date;
}

const CountdownTimer: React.FC<CountdownProps> = ({ expireAt }) => {
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const theme = useTheme();
  useEffect(() => {
    // Convert expireAt to a timestamp
    const expireTime = new Date(expireAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const timeLeft = expireTime - now;

      setRemainingTime(timeLeft > 0 ? timeLeft : 0);
    };

    updateTimer(); // Initial calculation

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expireAt]);

  // Convert remaining time to minutes & seconds format
  const minutes = Math.floor(remainingTime / 60000); // Convert ms to minutes
  const seconds = Math.floor((remainingTime % 60000) / 1000); // Convert remainder to seconds

  return (
    <div style={{ color: theme.palette.secondary.main, marginTop: 5 }}>
      {remainingTime > 0 ? (
        `Expires in: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      ) : (
        "Expired"
      )}
    </div>
  );
};

export default CountdownTimer;