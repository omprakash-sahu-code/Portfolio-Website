"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatSetsApart from "@/components/WhatSetsApart";
import TransitionSection from "@/components/TransitionSection";
import Projects from "@/components/Projects";
import Manifesto from "@/components/Manifesto";
import Contact from "@/components/Contact";

// Dynamic imports for client-only components
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});
const SmoothScroll = dynamic(() => import("@/components/SmoothScroll"), {
  ssr: false,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      <SmoothScroll>
        <CustomCursor />
        <main>
          <Hero startAnimation={!isLoading} />
          <About />
          <WhatSetsApart />
          <TransitionSection />
          <Projects />
          <Manifesto />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}
