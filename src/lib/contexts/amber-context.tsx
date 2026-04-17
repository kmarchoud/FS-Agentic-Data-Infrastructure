"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type AmberSlotOwner = "impact-card" | "slide-over" | null;

interface AmberContextValue {
  amberOwner: AmberSlotOwner;
  claimAmber: (owner: AmberSlotOwner) => void;
  releaseAmber: () => void;
}

const AmberContext = createContext<AmberContextValue>({
  amberOwner: "impact-card",
  claimAmber: () => {},
  releaseAmber: () => {},
});

export function AmberProvider({ children }: { children: ReactNode }) {
  const [amberOwner, setAmberOwner] = useState<AmberSlotOwner>("impact-card");
  return (
    <AmberContext.Provider
      value={{
        amberOwner,
        claimAmber: setAmberOwner,
        releaseAmber: () => setAmberOwner("impact-card"),
      }}
    >
      {children}
    </AmberContext.Provider>
  );
}

export function useAmber() {
  return useContext(AmberContext);
}
