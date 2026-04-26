"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "p1",
    number: "01",
    name: "DealDost AI",
    description: "An AI-powered deal discovery platform that helps users find the best discounts and offers across multiple platforms in real time. Smart filtering and personalization to surface relevant deals.",
    link: "https://deal-dost-ai.vercel.app/",
    videoUrl: "/Deal-Dost AI/WhatsApp Video 2026-04-12 at 5.13.11 PM - Trim.mp4",
    screenshots: [
      "/Deal-Dost AI/Screenshot 2026-03-28 020832.png",
      "/Deal-Dost AI/Screenshot 2026-03-30 220819.png",
      "/Deal-Dost AI/Screenshot 2026-03-31 222620.png",
      "/Deal-Dost AI/Screenshot 2026-03-31 223311.png",
      "/Deal-Dost AI/Screenshot 2026-04-01 001138.png"
    ],
  },
  {
    id: "p2",
    number: "02",
    name: "RentMate",
    description: "A smart rental management platform designed to simplify the renting experience for both tenants and landlords. Streamlines rent tracking, expense management, and communication.",
    link: "#",
    videoUrl: "", 
    screenshots: [],
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const title = headerRef.current.querySelector(".projects-title");
    const subtitle = headerRef.current.querySelector(".projects-subtitle");

    if (title) {
      gsap.fromTo(
        title,
        { y: 100, skewY: 10, opacity: 0 },
        { y: 0, skewY: 0, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none reverse" } }
      );
    }
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none reverse" }, delay: 0.3 }
      );
    }
    
    if (!cardsRef.current) return;
    const glassCards = cardsRef.current.querySelectorAll(".project-glass-card");
    glassCards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.1,
        }
      );
    });
  }, []);

  const handleCardClick = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
    // Refresh ScrollTrigger after a short delay to account for CSS transition
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 600); // Matching the transition duration in CSS
  };

  return (
    <section ref={sectionRef} className="projects-section" id="projects">
      <div ref={headerRef} className="projects-header">
        <h2 className="projects-title"><span className="lime">MY</span> ARTWORKS</h2>
        <span className="projects-subtitle">Selected Projects</span>
      </div>

      <div ref={cardsRef} className="projects-stack">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            isExpanded={expandedId === project.id} 
            onClick={() => handleCardClick(project.id)} 
          />
        ))}
      </div>
    </section>
  );
}

// Sub-component for robust video playback and state
function ProjectCard({ project, index, isExpanded, onClick }: { project: any, index: number, isExpanded: boolean, onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset play state if card is collapsed
  useEffect(() => {
    if (!isExpanded) {
      setIsPlaying(false);
    }
  }, [isExpanded]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
  };

  return (
    <div 
      className={`project-card-wrapper ${isExpanded ? "expanded" : ""}`}
      style={{ 
        top: `calc(140px + ${index * 40}px)`,
        zIndex: index + 10 
      }} 
      onClick={onClick}
    >
      <div className="project-glass-card">
        <div className="pgc-left">
          <div className="pgc-header">
            <span className="project-number">{project.number}</span>
            <h3 className="project-name">{project.name}</h3>
          </div>
          <p className="project-description">{project.description}</p>
          
          <a
            href={project.link}
            className="project-cta"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Visit Site
            <svg className="project-cta-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
        
        <div className="pgc-right">
          <div className="project-video-wrapper">
            {project.videoUrl ? (
              isPlaying ? (
                <video 
                  ref={videoRef}
                  src={project.videoUrl} 
                  className="project-video" 
                  muted 
                  loop 
                  playsInline 
                  autoPlay
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="project-video-placeholder" onClick={isExpanded ? handlePlayClick : undefined}>
                  <div className="video-static-poster" style={{ backgroundImage: `url('${project.screenshots[0]}')` }}></div>
                  
                  {isExpanded ? (
                    <div className="video-play-btn">
                      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <circle cx="30" cy="30" r="30" fill="var(--lime)" fillOpacity="0.9" />
                        <path d="M40 30L25 38.6603V21.3397L40 30Z" fill="black" />
                      </svg>
                      <span>Play Video</span>
                    </div>
                  ) : (
                    <div className="project-video-overlay">
                      <span>Click to Expand</span>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="project-video-placeholder">
                <span className="pvp-text">Video Coming Soon</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="project-expandable-content">
        <div className="screenshot-carousel">
          <div className="screenshot-track">
            {/* Render screenshots twice for infinite loop */}
            {[...project.screenshots, ...project.screenshots].map((src, idx) => (
              <div key={idx} className="screenshot-item">
                <img src={src} alt={`${project.name} screenshot ${idx}`} />
              </div>
            ))}
            {project.screenshots.length === 0 && (
              <div className="screenshot-placeholder">Screenshots Coming Soon</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
