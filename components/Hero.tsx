"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

interface HeroProps {
  startAnimation?: boolean;
}

export default function Hero({ startAnimation = true }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const nameFirstRef = useRef<HTMLSpanElement>(null);
  const nameLastRef = useRef<HTMLSpanElement>(null);
  const titleDevRef = useRef<HTMLDivElement>(null);
  const titleDesRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleStatusMouseMove = (e: React.MouseEvent) => {
    if (!popupRef.current) return;
    const x = e.clientX;
    const y = e.clientY;
    
    gsap.to(popupRef.current, {
      x: x,
      y: y - 40, // offset slightly above cursor
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleStatusMouseEnter = () => {
    if (!popupRef.current) return;
    gsap.to(popupRef.current, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.5)"
    });
  };

  const handleStatusMouseLeave = () => {
    if (!popupRef.current) return;
    gsap.to(popupRef.current, {
      autoAlpha: 0,
      scale: 0.8,
      duration: 0.2,
      ease: "power2.in"
    });
  };

  // Set initial states once on mount
  useEffect(() => {
    gsap.set(
      [
        greetingRef.current,
        statusRef.current,
        socialsRef.current,
        ctaRef.current,
        sidebarRef.current,
      ],
      {
        opacity: 0,
        y: 30,
      }
    );

    gsap.set(portraitRef.current, {
      opacity: 0,
      scale: 0.95,
    });

    gsap.set(watermarkRef.current, {
      opacity: 0,
    });
    
    gsap.set([nameFirstRef.current, nameLastRef.current], {
      y: "110%", opacity: 0
    });
    
    gsap.set([titleDevRef.current, titleDesRef.current], {
      x: 60, opacity: 0
    });
  }, []);

  useEffect(() => {
    // Only run the animation once startAnimation is true
    if (!startAnimation) return;

    const tl = gsap.timeline({ delay: 0.1 });

    // Stagger animation timeline
    tl
      // Watermark fade in
      .to(watermarkRef.current, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      })
      // Greeting
      .to(
        greetingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        0.2
      )
      // Name — first line
      .fromTo(
        nameFirstRef.current,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1, ease: "power4.out" },
        0.4
      )
      // Name — second line
      .fromTo(
        nameLastRef.current,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1, ease: "power4.out" },
        0.55
      )
      // Portrait fade in
      .to(
        portraitRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
        },
        0.5
      )
      // Developer title
      .fromTo(
        titleDevRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        0.6
      )
      // Designer title
      .fromTo(
        titleDesRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        0.75
      )
      // Status
      .to(
        statusRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.9
      )
      // Socials
      .to(
        socialsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        0.95
      )
      // CTA
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        1.0
      )
      // Sidebar
      .to(
        sidebarRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        },
        1.1
      );
  }, [startAnimation]);



  return (
    <section ref={heroRef} className="hero" id="hero">
      {/* Logo */}
      <div className="hero-logo">
        <Image
          src="/images/logo.png"
          alt="OP Logo"
          width={72}
          height={72}
          quality={100}
          priority
        />
      </div>

      {/* Left Content */}
      <div className="hero-left">
        <div className="hero-left-content">
          <div ref={greetingRef} className="hero-greeting">
            <span className="wave">👋</span>
            <span>Hi, my name is</span>
          </div>
          <h1 className="hero-name">
            <span className="line hero-name-first">
              <span ref={nameFirstRef}>
                <span className="lime">Om</span>prakash
              </span>
            </span>
            <span className="line hero-name-last">
              <span ref={nameLastRef}>Sahu</span>
            </span>
          </h1>
        </div>
      </div>

      {/* Right Content */}
      <div className="hero-right">
        <div className="hero-title-group">
          <div ref={titleDevRef} className="hero-title-developer">
            <span className="hero-section-num-inline">01</span>
            <span className="white">DEVELOP</span>
            <span className="lime">ER</span>
          </div>
          <div ref={titleDesRef} className="hero-title-designer">
            <span className="hero-section-num-inline">02</span>
            & DESIGNER
          </div>
        </div>
      </div>

      {/* Portrait (Center) */}
      <div ref={portraitRef} className="hero-portrait-container">
        <div className="hero-portrait-wrapper portrait-hover-group">
          {/* Layer 1 — B&W base, always visible */}
          <Image
            src="/images/hero-portrait.png"
            alt="Omprakash Sahu — Developer & Designer"
            width={480}
            height={640}
            priority
            className="portrait-base"
          />
          {/* Layer 2 — Color, fades in on hover */}
          <Image
            src="/images/hero-portrait-color.png"
            alt=""
            width={480}
            height={640}
            aria-hidden="true"
            className="portrait-color"
          />
        </div>
      </div>

      {/* Background Watermark */}
      <div ref={watermarkRef} className="hero-watermark">
        DEVELOP
      </div>

      {/* Bottom Bar */}
      <div className="hero-bottom">
        {/* Status */}
        <div 
          ref={statusRef} 
          className="hero-status"
          onMouseMove={handleStatusMouseMove}
          onMouseEnter={handleStatusMouseEnter}
          onMouseLeave={handleStatusMouseLeave}
        >
          <span className="hero-status-label">Current Status</span>
          <span className="hero-status-value">
            <span className="status-dot"></span>
            Available for <strong>Projects</strong>
          </span>
        </div>
        <div ref={popupRef} className="status-popup">I&apos;m available</div>

        {/* Socials */}
        <div ref={socialsRef} className="hero-socials">
          <div className="social-line"></div>
          <a href="https://github.com/omprakash-sahu-code" target="_blank" rel="noopener noreferrer" className="social-link">GITHUB</a>
          <a href="https://linkedin.com/in/omprakash-sahu-96113a368" target="_blank" rel="noopener noreferrer" className="social-link">LINKEDIN</a>
          <a href="https://www.instagram.com/dreamer._.om" target="_blank" rel="noopener noreferrer" className="social-link">INSTAGRAM</a>
          <div className="social-line"></div>
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="hero-cta">
          <div className="hero-cta-text">
            <div className="hero-cta-label">Get In Touch</div>
            <div className="hero-cta-title">LET&apos;S TALK</div>
          </div>
          <a
            href="https://linktr.ee/omprakashsahu2067"
            target="_blank" 
            rel="noopener noreferrer"
            className="hero-cta-button"
            aria-label="Let's Talk"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>

      {/* Vertical Sidebar */}
      <div ref={sidebarRef} className="hero-sidebar">
        BUILD <span className="lime">&bull;</span> DESIGN <span className="lime">&bull;</span> DEPLOY
      </div>
    </section>
  );
}
