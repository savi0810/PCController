import { useState } from "react";

import { ConnectionScreen } from "@/screens/ConnectionScreen";
import { MainScreen } from "@/screens/MainScreen";

export default function Index() {
  const [connected, setConnected] = useState(false);
  const [lost, setLost] = useState(false);

  return connected ? (
    <MainScreen
      onDisconnect={(wasLost) => {
        setLost(wasLost);
        setConnected(false);
      }}
    />
  ) : (
    <ConnectionScreen lost={lost} onConnected={() => setConnected(true)} />
  );
}
