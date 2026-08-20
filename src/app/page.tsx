"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsCounter } from "@/components/landing/StatsCounter";
import { ProfileSection } from "@/components/landing/ProfileSection";
import { CashTransparencyWidget } from "@/components/landing/CashTransparencyWidget";
import { ArticlesSection } from "@/components/landing/ArticlesSection";
import { UMKMShowcase } from "@/components/landing/UMKMShowcase";
import { StructureSection } from "@/components/landing/StructureSection";
import { EmergencyBar } from "@/components/common/EmergencyBar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 overflow-x-hidden w-full max-w-full">
      <Navbar />
      <main className="flex-1 overflow-x-hidden w-full max-w-full">
        <HeroSection />
        <StatsCounter />
        <ProfileSection />
        <CashTransparencyWidget />
        <ArticlesSection />
        <UMKMShowcase />
        <StructureSection />
        <EmergencyBar />
      </main>
      <Footer />
    </div>
  );
}
