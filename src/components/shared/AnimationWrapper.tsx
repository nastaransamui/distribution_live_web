// components/AnimationWrapper.tsx
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export interface AnimationWrapperProps {
  children: React.ReactElement;
  skipPaths?: string[];     // paths to skip animation (like '/doctors/search')
  fallbackMs?: number;      // reveal fallback in ms if animation never starts
  instanceId?: string;      // optional id to uniquely identify this wrapper instance
  persistPerPath?: boolean; // if true (default) store played flag per pathname in sessionStorage
}

export default function AnimationWrapper({
  children,
  skipPaths = ["/doctors/search"],
  fallbackMs = 900,
  instanceId,
  persistPerPath = true,
}: AnimationWrapperProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Safe children check (hooks must always run)
  const isValidElement = React.isValidElement(children);
  const childProps = isValidElement ? (children.props as { className?: string }) : {};
  const childClassName = childProps?.className ?? "";
  const isAnimateCssUsed = /\banimate__[-\w]+\b/.test(childClassName);

  // SSR: clone and add pre-animate if animate classes are present so server markup matches client intent
  const clonedChild = isValidElement && isAnimateCssUsed
    ? React.cloneElement(children as React.ReactElement<any>, {
      className: `${childClassName} pre-animate`.trim(),
    })
    : children;

  useEffect(() => {
    // only run client-side logic if animated
    if (!isValidElement || !isAnimateCssUsed) return;

    // helper: find the DOM node that actually has animation classes (first match)
    const findNode = (): HTMLElement | null => {
      if (!rootRef.current) return null;
      return (
        rootRef.current.querySelector<HTMLElement>(".pre-animate") ??
        rootRef.current.querySelector<HTMLElement>("[class*='animate__']") ??
        (rootRef.current.firstElementChild as HTMLElement | null)
      );
    };

    // compute a stable storage key (optional instanceId or childClassName + pathname)
    const path = router?.pathname ?? "unknown-path";
    const keyBase = instanceId ? instanceId : `${childClassName}:::${path}`;
    const storageKey = `anim_played::${keyBase}`;

    // If we should skip animation for this path, reveal immediately and mark as played
    if (skipPaths.some((p) => path.startsWith(p))) {
      const node = findNode();
      if (node && node.classList.contains("pre-animate")) node.classList.remove("pre-animate");
      if (persistPerPath) try { sessionStorage.setItem(storageKey, "1"); } catch { }
      return;
    }

    // If already played (sessionStorage), reveal and do not play again
    if (persistPerPath) {
      try {
        if (sessionStorage.getItem(storageKey) === "1") {
          const node = findNode();
          if (node && node.classList.contains("pre-animate")) node.classList.remove("pre-animate");
          return;
        }
      } catch (e) {
        // storage may fail in some environments — ignore
      }
    }

    // Normal play path: listen for animationstart/animationend, fallback reveal, and route-change disable
    let cleaned = false;
    const node = findNode();

    const removePreAnimateAndMark = () => {
      const n = findNode();
      if (n && n.classList.contains("pre-animate")) n.classList.remove("pre-animate");
      if (persistPerPath) try { sessionStorage.setItem(storageKey, "1"); } catch { }
      cleaned = true;
    };

    const onAnimStart = () => {
      removePreAnimateAndMark();
    };
    const onAnimEnd = () => {
      removePreAnimateAndMark();
    };

    // fallback in case animation doesn't fire
    const fallback = window.setTimeout(() => {
      removePreAnimateAndMark();
    }, fallbackMs);

    if (node) {
      node.addEventListener("animationstart", onAnimStart);
      node.addEventListener("animationend", onAnimEnd);
      node.addEventListener("transitionstart", onAnimStart);
      node.addEventListener("transitionend", onAnimEnd);
    }

    // When route change starts, immediately reveal and disable animations to avoid blink/replay on exit
    const onRouteStart = () => {
      const n = findNode();
      if (!n) return;
      if (n.classList.contains("pre-animate")) n.classList.remove("pre-animate");
      // make sure animation won't run during navigation
      n.classList.add("no-animate");
      // also mark as played so on return it won't re-run
      if (persistPerPath) try { sessionStorage.setItem(storageKey, "1"); } catch { }
      window.clearTimeout(fallback);
      cleaned = true;
    };

    router.events.on("routeChangeStart", onRouteStart);

    return () => {
      window.clearTimeout(fallback);
      const n = findNode();
      if (n) {
        n.removeEventListener("animationstart", onAnimStart);
        n.removeEventListener("animationend", onAnimEnd);
        n.removeEventListener("transitionstart", onAnimStart);
        n.removeEventListener("transitionend", onAnimEnd);
      }
      router.events.off("routeChangeStart", onRouteStart);
      cleaned = true;
    };
    // deps: these are fine; hook runs once per mount/update when pathname changes
  }, [isValidElement, isAnimateCssUsed, router.events, router.pathname, childClassName, instanceId, skipPaths, fallbackMs, persistPerPath]);

  return (
    <div ref={rootRef}>
      <style jsx>{`
        /* start hidden on SSR when animate classes are present */
        .pre-animate { opacity: 0 !important; }

        /* preserve final animation state */
        .animate__animated { animation-fill-mode: both; }

        /* when we want to prevent animation (on route start), stop it */
        .no-animate[class*="animate__"], .no-animate.animate__animated {
          animation: none !important;
        }
      `}</style>

      {clonedChild}
    </div>
  );
}
