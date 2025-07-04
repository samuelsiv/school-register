"use client";

import {TransitionRouter} from "next-transition-router";
import {animate} from "motion";
import {useRef} from "react";

export function Providers({children}: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null!);
  return (
    <TransitionRouter
      auto={true}
      leave={(next) => {
        animate(
          wrapperRef.current,
          {opacity: [1, 0.1]},
          {duration: 0.2, onComplete: next}
        )
      }}
      enter={(next) => {
        animate(
          wrapperRef.current,
          {opacity: [0.1, 1]},
          {duration: 0.2, onComplete: next}
        )
      }}
    >
      <div ref={wrapperRef}>{children}</div>
    </TransitionRouter>
  );
}