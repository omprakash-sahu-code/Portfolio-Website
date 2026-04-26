"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const chars = textRef.current.querySelectorAll(".loader-char");

    const tl = gsap.timeline({
      onComplete: onComplete,
    });

    // Initial state
    gsap.set(containerRef.current, { autoAlpha: 1 });
    gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(boxRef.current, { scale: 0, autoAlpha: 0 });
    gsap.set(chars, { y: 20, autoAlpha: 0 });
    gsap.set(logoRef.current, { autoAlpha: 0, y: 20 });

    tl.to(lineRef.current, {
      scaleX: 1,
      duration: 0.8,
      ease: "power3.inOut",
    })
      .to(
        boxRef.current,
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
        },
        "-=0.3"
      )
      .to(
        logoRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        chars,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
        },
        "-=0.2"
      )
      // Hold for a moment
      .to({}, { duration: 0.6 })
      // Fade out text
      .to(chars, {
        y: -20,
        autoAlpha: 0,
        duration: 0.3,
        stagger: 0.02,
        ease: "power2.in",
      })
      // Collapse box and line
      .to(boxRef.current, {
        scale: 0,
        autoAlpha: 0,
        duration: 0.4,
        ease: "power3.in",
      })
      .to(
        lineRef.current,
        {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.6,
          ease: "power3.inOut",
        },
        "-=0.2"
      )
      // Fade out the whole loader
      .to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.2"
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const text = "LOADING PORTFOLIO";

  return (
    <div ref={containerRef} className="loader-container">
      <div ref={logoRef} className="loader-logo">
        <Image
          src="/images/logo.png"
          alt="OP Logo"
          width={72}
          height={72}
          quality={100}
          priority
        />
      </div>

      <div ref={lineRef} className="loader-line"></div>

      <div ref={boxRef} className="loader-box">
        <div ref={textRef} className="loader-text">
          {text.split("").map((char, index) => (
            <span
              key={index}
              className="loader-char"
              style={{ display: char === " " ? "inline" : "inline-block" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
