"use client";

import { useEffect, useRef } from "react";

let revealObserver;

export default function ScrollReveal({ as: Element = "div", className = "", children, direction = "up", variant, delay = 0, ...elementProps }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;

    if (!("IntersectionObserver" in window)) {
      element.classList.add("is-visible");
      return undefined;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    }

    revealObserver.observe(element);
    return () => revealObserver?.unobserve(element);
  }, []);

  return <Element {...elementProps} ref={elementRef} className={`scroll-reveal reveal-${variant || direction} ${className}`} style={{ "--reveal-delay": `${delay}ms` }}>{children}</Element>;
}
