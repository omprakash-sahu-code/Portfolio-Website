"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;

    if (!section || !heading || !content) return;

    const tl = gsap.timeline({
      delay: 0.5,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      heading,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    ).fromTo(
      content,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
      "-=0.6"
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!contentRef.current) return;
    const rect = contentRef.current.getBoundingClientRect();
    // Offset by 120px to account for the mask layer's negative offset (-120px buffer zone)
    const x = e.clientX - rect.left + 120;
    const y = e.clientY - rect.top + 120;
    
    // Update CSS variables for cursor position
    contentRef.current.style.setProperty("--mask-x", `${x}px`);
    contentRef.current.style.setProperty("--mask-y", `${y}px`);
  };

  const handleMouseEnter = () => {
    if (!contentRef.current) return;
    // Animate the mask size growing
    gsap.to(contentRef.current, {
      "--mask-size": "120px", // Size of the hover circle
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!contentRef.current) return;
    // Animate the mask size shrinking
    gsap.to(contentRef.current, {
      "--mask-size": "0px",
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <section ref={sectionRef} className="about-section" id="about">
      <div className="about-header">
        <h2 ref={headingRef} className="about-title">
          <span className="lime">ABOUT</span> <span className="white">ME</span>
        </h2>
      </div>

      <div 
        ref={contentRef} 
        className="about-content"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Base layer: White text on black background */}
        <p className="about-description">
          <span className="quote">&quot;</span>
          I’m a first-year CSE (AI & ML) student focused on problem-solving and building real-world projects — combining strong fundamentals in DSA with a growing interest in crafting clean, intuitive web experiences.
          <span className="quote">&quot;</span>
        </p>

        {/* Mask layer: Black text on lime background that reveals on hover */}
        <div className="about-mask-layer" aria-hidden="true">
          <p className="about-description masked-text">
            <span className="quote">&quot;</span>
            I’m a first-year CSE (AI & ML) student focused on problem-solving and building real-world projects — combining strong fundamentals in DSA with a growing interest in crafting clean, intuitive web experiences.
            <span className="quote">&quot;</span>
          </p>
        </div>
      </div>
    </section>
  );
}
