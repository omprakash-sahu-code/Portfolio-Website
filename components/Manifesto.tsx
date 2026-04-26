"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    number: "01",
    category: "PRINCIPLE",
    heading: "BUILD WITH PURPOSE",
    image: "/Manifesto slides/01.jpg",
  },
  {
    number: "02",
    category: "PHILOSOPHY",
    heading: "SIMPLICITY OVER COMPLEXITY",
    image: "/Manifesto slides/02.jpeg",
  },
  {
    number: "03",
    category: "DISCIPLINE",
    heading: "CONSISTENCY BEATS MOTIVATION",
    image: "/Manifesto slides/03.png",
  },
  {
    number: "04",
    category: "GROWTH",
    heading: "LEARN → BUILD → IMPROVE",
    image: "/Manifesto slides/04.jpeg",
  },
];

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // Calculate the total scrollable distance
      const totalScrollWidth = trackRef.current!.scrollWidth - window.innerWidth;

      // Header reveal
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Horizontal scroll — pinned section with a small intro buffer
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${totalScrollWidth + window.innerHeight * 1.5}`, // Extended end for buffer
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Add a small pause (vertical scroll) before horizontal movement starts
      tl.to({}, { duration: 0.2 });

      tl.to(trackRef.current, {
        x: () => -totalScrollWidth,
        ease: "none",
        duration: 1,
      });
    }, sectionRef);

    // Refresh ScrollTrigger when everything is loaded
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="manifesto-section"
      id="manifesto"
    >
      <div ref={headerRef} className="manifesto-header">
        <h2 className="manifesto-title"><span className="lime">The</span> Manifesto</h2>
      </div>

      <div
        ref={trackRef}
        className="manifesto-track"
        style={{ overflow: "hidden" }}
      >
        {cards.map((card) => (
          <div key={card.number} className="manifesto-card">
            <div className="manifesto-content-wrapper">
              <div className="manifesto-card-label">
                {card.number} / {card.category}
              </div>
              <h3 className="manifesto-card-heading">{card.heading}</h3>
            </div>

            <div className="manifesto-image-container">
              <img
                src={card.image}
                alt={card.heading}
                className="manifesto-bg-image"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
