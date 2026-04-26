"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!headingRef.current) return;

    gsap.fromTo(
      headingRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="contact-section" id="contact">
      <h2 ref={headingRef} className="contact-heading">
        LET&apos;S
        <br />
        TALK
      </h2>

      <p className="contact-subtext">Have a project in mind?</p>

      <a
        href="mailto:omprakashsahu2067@gmail.com"
        className="contact-email"
      >
        omprakashsahu2067@gmail.com
      </a>

      <div className="contact-socials">
        <a
          href="https://github.com/omprakash-sahu-code"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/omprakash-sahu-96113a368"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/dreamer._.om"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://linktr.ee/omprakashsahu2067"
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Linktree
        </a>
      </div>

      <footer className="contact-footer">
        <div className="footer-status">
          <span className="status-dot"></span>
          Available for new projects
        </div>
        <button
          onClick={scrollToTop}
          className="footer-back-top"
          aria-label="Scroll to top"
        >
          Back to top
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </footer>
    </section>
  );
}
