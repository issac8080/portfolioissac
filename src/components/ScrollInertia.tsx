"use client";

import { useEffect, useRef, type RefObject } from "react";

const SMOOTHING = 0.08;
const MAX_VELOCITY = 24;

export default function ScrollInertia({
  children,
  scrollContainerRef,
}: {
  children: React.ReactNode;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}) {
  const scrollY = useRef(0);
  const targetY = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const wrapper = scrollContainerRef.current;
    if (!wrapper) return;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      velocity.current += e.deltaY * 0.5;
      velocity.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity.current));
    };

    const tick = () => {
      const maxScroll = Math.max(0, wrapper.scrollHeight - window.innerHeight);

      targetY.current += velocity.current;
      targetY.current = Math.max(0, Math.min(maxScroll, targetY.current));

      scrollY.current += (targetY.current - scrollY.current) * SMOOTHING;
      wrapper.scrollTop = scrollY.current;

      velocity.current *= 0.92;
      if (Math.abs(velocity.current) < 0.5) velocity.current = 0;

      rafId.current = requestAnimationFrame(tick);
    };

    wrapper.addEventListener("wheel", onWheel, { passive: false });

    scrollY.current = wrapper.scrollTop;
    targetY.current = wrapper.scrollTop;
    rafId.current = requestAnimationFrame(tick);

    return () => {
      wrapper.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(rafId.current);
    };
  }, [scrollContainerRef]);

  return (
    <div
      ref={scrollContainerRef as React.RefObject<HTMLDivElement>}
      className="h-screen overflow-x-hidden overflow-y-auto scroll-inertia-container"
      style={{ scrollBehavior: "auto" }}
    >
      {children}
    </div>
  );
}
