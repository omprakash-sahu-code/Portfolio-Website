"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TransitionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current || !sectionRef.current) return;

    const words = textRef.current.querySelectorAll(".t-word");

    gsap.fromTo(
      words,
      { y: 80, opacity: 0, rotateX: 30 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="transition-section">
      <h2 ref={textRef} className="transition-text">
        <span className="t-word" style={{ display: "inline-block" }}>
          <span className="lime">BRING</span>
        </span>{" "}
        <span className="t-word" style={{ display: "inline-block" }}>
          YOUR
        </span>{" "}
        <span className="t-word" style={{ display: "inline-block" }}>
          IMAGINATION
        </span>
        <br />
        <span className="t-word" style={{ display: "inline-block" }}>
          TO
        </span>{" "}
        <span className="t-word" style={{ display: "inline-block" }}>
          REALITY
        </span>
      </h2>
    </section>
  );
}
