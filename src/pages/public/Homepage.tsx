import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  Type,
  FileText,
  Download,
  ChevronRight,
  Play,
  Star,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  X,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function CountUp({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(easeOut * to));
      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [to, duration]);

  return <span>{count}</span>;
}

const features = [
  {
    icon: Type,
    title: "Auto Captions",
    desc: "Stylish animated subtitles generated from your audio. Multiple fonts, colors, and positions.",
  },
  {
    icon: FileText,
    title: "Metadata Generation",
    desc: "Auto-generated titles, descriptions, and hashtags optimized for each platform and audience.",
  },
  {
    icon: Download,
    title: "One-Click Export",
    desc: "Download all clips in a ZIP, or publish directly to YouTube, TikTok, and Instagram.",
  },
];

const howItWorksSteps = [
  {
    id: 1,
    title: "Upload Your Video",
    desc: "Drag and drop your raw podcast, webinar, or tutorial file, or paste a YouTube URL.",
    image: "/images/step1_real.png",
  },
  {
    id: 2,
    title: "Processing",
    desc: "The platform processes the audio and video to generate high-quality clips based on your chosen duration and timestamps.",
    image: "/images/step2_real.png",
  },
  {
    id: 3,
    title: "Automatic Captions",
    desc: "Clips are generated with dynamic captions and auto-reformatting for vertical screens.",
    image: "/images/step3_real.png",
  },
  {
    id: 4,
    title: "Review & Publish",
    desc: "Preview your shorts, tweak captions if needed, and publish directly to TikTok, Reels, and Shorts in one click.",
    image: "/images/step3_real.png",
  },
];

const stats = [
  { value: 1, suffix: " Podcast", label: "Input" },
  { value: 25, suffix: " Shorts", label: "Generated" },
  { value: 5, suffix: " Platforms", label: "Published" },
  { value: 10, suffix: " Minutes", label: "Total Time" },
];

const testimonials = [
  {
    name: "Marcus T.",
    role: "Podcast Host",
    avatar: "MT",
    text: "ReelCut turned my 2-hour podcast into 30 clips in under 15 minutes. My YouTube Shorts channel went from 0 to 8k subs in a month.",
    stars: 5,
  },
  {
    name: "Priya K.",
    role: "Content Creator",
    avatar: "PK",
    text: "The AI captions are insane. They look better than anything I've seen on TikTok. I canceled my editor subscription.",
    stars: 5,
  },
  {
    name: "James O.",
    role: "Marketing Agency",
    avatar: "JO",
    text: "We run 12 client channels. The Agency plan paid for itself in the first week. Incredible ROI.",
    stars: 5,
  },
];

const faqs = [
  {
    q: "How many clips can I generate?",
    a: "Depends on your plan. Starter gets 100 clips/month, Creator gets 500, and Agency gets unlimited.",
  },
  {
    q: "Do I own the clips?",
    a: "Yes. 100% of the generated content is yours. We don't claim any rights.",
  },
  // {
  //   q: "Can I upload to YouTube automatically?",
  //   a: "Yes — connect your YouTube account in the Channels section and publish with one click or schedule.",
  // },
  {
    q: "Which languages are supported?",
    a: "We currently support 25+ languages for transcription and captioning. More added regularly.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: 19,
    features: [
      "10 uploads/month",
      "100 clips",
      "AI captions",
      "Download all clips",
    ],
  },
  {
    name: "Creator",
    price: 49,
    features: [
      "50 uploads/month",
      "500 clips",
      "YouTube publishing",
      "Priority processing",
      "Custom captions",
    ],
    popular: true,
  },
  {
    name: "Agency",
    price: 149,
    features: [
      "Unlimited uploads",
      "Unlimited clips",
      "Multiple channels",
      "Team members",
      "API access",
      "Dedicated support",
    ],
  },
];

const sliderImages = [
  "/images/hero-center.png",
  "/images/hero-right.png",
  "/images/hero-left.png",
];

export function Homepage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const [billing, setBilling] = useState("monthly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleDragEnd = (e: any, info: any) => {
    if (info.offset.x < -50) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    } else if (info.offset.x > 50) {
      setDirection(-1);
      setCurrentIndex(
        (prev) => (prev - 1 + sliderImages.length) % sliderImages.length,
      );
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const centerImg = sliderImages[currentIndex];
  const rightImg = sliderImages[(currentIndex + 1) % sliderImages.length];
  const leftImg =
    sliderImages[
      (currentIndex - 1 + sliderImages.length) % sliderImages.length
    ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[98vh] flex items-center overflow-hidden bg-[#1a1c23]">
        {/* Background Split */}
        <div className="absolute inset-0 flex pointer-events-none">
          {/* Left Dark Side */}
          <div className="w-[65%] h-full relative overflow-hidden bg-[#15171e]">
            {/* Concentric Circles radiating from top-left */}
            <div
              className="absolute inset-0 opacity-[0.15]"
              style={{
                backgroundImage:
                  "repeating-radial-gradient(circle at 10% 10%, transparent, transparent 80px, #ffffff 80px, #ffffff 81px)",
              }}
            />
            {/* Small dark circle at bottom center */}
            <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-[#0a0b0e] rounded-full blur-[2px]" />
          </div>

          {/* Right Red Side */}
          <div className="w-[35%] h-full bg-[#EF5350] relative overflow-hidden">
            {/* Dots pattern */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/80" />
              ))}
            </div>
            {/* Bottom right white circle cut */}
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white rounded-full" />
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 pt-20 pb-12 lg:py-0">
          {/* Left Text */}
          <div className="w-full lg:w-[30%] pl-0 lg:pl-10 xl:pl-12 flex flex-col items-start text-left">
            <motion.h1
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl sm:text-7xl xl:text-[5rem] font-bebas uppercase leading-[0.95] tracking-tight mb-8"
            >
              <span className="text-[#EF5350] block drop-shadow-md">
                TURN ONE LONG VIDEO
              </span>
              <span className="text-white block drop-shadow-md">
                INTO DOZENS OF CLIPS.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-300 text-base max-w-sm mb-10 leading-relaxed"
            >
              Turn one long video into dozens of social-ready clips in minutes.
            </motion.p>

            {/* Transformation Visual */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase mb-12 bg-black/20 p-4 rounded-xl border border-white/5"
            >
              <span className="text-[#9E9E9E]">58 Min Podcast</span>
              <ArrowRight size={14} className="text-[#EF5350]" />
              <span className="text-[#EF5350]">25 Shorts</span>
              <ArrowRight size={14} className="text-[#EF5350]" />
              <span className="text-white">Ready To Publish</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-start gap-6"
            >
              <Link
                to="/register"
                className="bg-[#EF5350] hover:bg-[#C62828] text-[#111] px-7 pt-4 pb-8 font-semibold text-xs xl:text-sm italic tracking-widest transition-colors flex flex-col items-center min-w-[160px] relative group shadow-lg"
              >
                START FREE
                <div className="absolute top-[38px] flex flex-col items-center -space-y-2 group-hover:translate-y-1 transition-transform">
                  <ChevronDown size={16} className="text-[#111]" />
                  <ChevronDown size={16} className="text-[#111]/70" />
                  <ChevronDown size={16} className="text-[#111]/40" />
                </div>
              </Link>
              <button className="text-white hover:text-[#EF5350] font-semibold px-5 pt-4 text-xs xl:text-sm italic tracking-widest transition-colors flex flex-col items-center min-w-[160px] relative group h-full">
                WATCH DEMO
                <div className="absolute top-[38px] flex flex-col items-center -space-y-2 group-hover:translate-y-1 transition-transform">
                  <ChevronDown size={16} className="text-current" />
                  <ChevronDown size={16} className="text-current opacity-70" />
                  <ChevronDown size={16} className="text-current opacity-40" />
                </div>
              </button>
            </motion.div>
          </div>

          {/* Right Images (Slider Simulation) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:w-[70%] relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
          >
            {/* Left Background Image */}
            <div className="absolute left-[5%] lg:left-[10%] w-[25%] h-[60%] overflow-hidden shadow-2xl bg-gray-900">
              <div className="w-full h-full bg-[#C62828] opacity-50 mix-blend-multiply absolute inset-0 z-10 pointer-events-none" />
              <AnimatePresence custom={direction}>
                <motion.img
                  key={leftImg}
                  src={leftImg}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  alt="Podcast setup"
                />
              </AnimatePresence>
            </div>

            {/* Right Background Image */}
            <div className="absolute right-[5%] lg:right-[-5%] w-[25%] h-[60%] overflow-hidden shadow-2xl bg-gray-900">
              <AnimatePresence custom={direction}>
                <motion.img
                  key={rightImg}
                  src={rightImg}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  alt="Viral mobile video"
                />
              </AnimatePresence>
            </div>

            {/* Center Main Image */}
            <div className="absolute left-[20%] lg:left-[25%] right-[20%] lg:right-[10%] h-[75%] bg-gray-900 shadow-2xl z-20 overflow-hidden border border-white/10">
              <AnimatePresence custom={direction}>
                <motion.img
                  key={centerImg}
                  src={centerImg}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  alt="Podcast creator"
                />
              </AnimatePresence>

              {/* Top Right Text inside Image */}
              <div className="absolute top-6 right-6 font-bold text-lg italic tracking-widest text-[#1A1A1A] text-right leading-tight bg-white/70 backdrop-blur-sm p-2 pointer-events-none z-30">
                <span className="text-[#EF5350]">S</span>HORT
                <br />
                FORGE
              </div>

              {/* Bottom Left Controls inside Image */}
              <div className="absolute bottom-0 left-0 bg-[#EF5350] flex items-center px-6 py-4 gap-6 text-white shadow-lg z-30">
                <button
                  onClick={() => {
                    setDirection(-1);
                    setCurrentIndex(
                      (prev) =>
                        (prev - 1 + sliderImages.length) % sliderImages.length,
                    );
                  }}
                  className="hover:opacity-70 transition-opacity p-2"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="w-px h-5 bg-white/40" />
                <button
                  onClick={() => {
                    setDirection(1);
                    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
                  }}
                  className="hover:opacity-70 transition-opacity p-2"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-24 px-4 bg-[#111216] border-y border-white/10 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="mb-10">
            <h2 className="text-4xl sm:text-5xl font-bebas text-white leading-none mb-4">
              Watch a 58-minute podcast become 25 shorts
            </h2>
            <p className="text-gray-400">See ReelCut in action.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full aspect-video bg-gray-900 border border-white/10 rounded-2xl shadow-2xl relative flex items-center justify-center overflow-hidden group cursor-pointer"
          >
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 group-hover:bg-black/20 transition-colors">
              <div className="w-20 h-20 rounded-full bg-[#EF5350] flex items-center justify-center text-white shadow-[0_0_40px_rgba(239,83,80,0.4)] group-hover:scale-110 transition-transform">
                <Play size={32} fill="currentColor" className="ml-2" />
              </div>
            </div>

            {/* Fake video timeline */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
              <div className="h-full w-1/3 bg-[#EF5350]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-[#FFF5F5] border-y border-[#FFCDD2] relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left: Scroll Tabs */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div {...fadeUp} className="mb-16">
              <p className="text-sm text-[#EF5350] font-bold tracking-widest uppercase mb-4">
                Workflow
              </p>
              <h2 className="text-4xl sm:text-5xl font-bebas text-[#1A1A1A] leading-none mb-6">
                How It Works
              </h2>
              <p className="text-[#616161]">
                From full-length video to viral clips in four simple steps.
              </p>
            </motion.div>

            <div className="relative border-l-2 border-[#FFCDD2]/50 ml-4 pl-8 pb-4 space-y-12">
              {howItWorksSteps.map((step, i) => (
                <div
                  key={step.id}
                  className="relative cursor-pointer group"
                  onClick={() => setActiveStep(i)}
                >
                  {/* Timeline Node */}
                  <div
                    className={`absolute -left-[43px] top-0 w-5 h-5 rounded-full border-4 transition-colors ${activeStep === i ? "border-[#EF5350] bg-white" : "border-[#FFCDD2] bg-[#FFF5F5] group-hover:border-[#EF9090]"}`}
                  />

                  {/* Step Content */}
                  <h3
                    className={`text-xl font-bold mb-3 transition-colors ${activeStep === i ? "text-[#1A1A1A]" : "text-[#9E9E9E] group-hover:text-[#616161]"}`}
                  >
                    0{step.id} — {step.title}
                  </h3>

                  <AnimatePresence>
                    {activeStep === i && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#616161] leading-relaxed overflow-hidden"
                      >
                        {step.desc}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sticky Visual Panel */}
          <div className="w-full lg:w-1/2 relative">
            <div className="sticky top-32 w-full aspect-square rounded-2xl bg-[#FFFFFF] shadow-2xl border border-[#FFCDD2] overflow-hidden flex items-center justify-center p-8">
              {/* Concentric Circle Motif */}
              <div
                className="absolute -top-32 -right-32 w-96 h-96 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 20px)",
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full bg-[#FFF5F5] rounded-xl border border-[#FFCDD2]/50 flex items-center justify-center flex-col gap-6 relative z-10"
                >
                  {/* Browser Mockup Wrapper */}
                  <div className="w-full h-full p-4 md:p-6 lg:p-8 flex items-center justify-center bg-gradient-to-br from-[#FFF5F5] to-[#FFEBEE]">
                    <div className="w-full h-full relative overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#FFCDD2]/50 bg-white flex flex-col transition-transform duration-500 hover:scale-[1.02]">
                      {/* Browser Top Bar */}
                      <div className="h-8 bg-[#F8F9FA] border-b border-[#FFCDD2]/50 flex items-center px-4 gap-2 w-full flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] shadow-sm" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] shadow-sm" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] shadow-sm" />
                      </div>

                      {/* Screenshot Content */}
                      <div className="relative flex-1 w-full overflow-hidden bg-[#FAFAFA]">
                        <img
                          src={howItWorksSteps[activeStep].image}
                          alt={howItWorksSteps[activeStep].title}
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-[#FFEBEE]">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bebas text-[#1A1A1A] leading-none mb-4">
              Everything you need to <br />
              <span className="text-[#EF5350]">go viral</span>
            </h2>
            <p className="text-[#616161] max-w-xl mx-auto">
              One platform handles the entire workflow from long-form content to
              polished short clips.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative bg-[#FFFFFF] border border-[#FFCDD2] p-6 transition-all cursor-default overflow-hidden"
              >
                {/* Subtle red glow on hover */}
                <div className="absolute -bottom-4 left-0 right-0 h-8 bg-[#EF5350]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-10 h-10 bg-[#EF5350]/15 flex items-center justify-center mb-4 transition-colors relative z-10">
                  <f.icon size={20} className="text-[#EF5350]" />
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-2 relative z-10">
                  {f.title}
                </h3>
                <p className="text-sm text-[#9E9E9E] leading-relaxed line-clamp-2 relative z-10">
                  {f.desc}
                </p>

                {/* Thin hover border */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#EF9090]/50 transition-colors pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results stats */}
      <section className="py-20 px-4 bg-[#FFF5F5] border-y border-[#FFCDD2] relative overflow-hidden">
        {/* Spiral Motif */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -left-32 w-[600px] h-[600px] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 24px)",
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bebas text-[#1A1A1A] leading-none mb-2">
              Real results, minimal effort
            </h2>
            <p className="text-[#616161] text-lg">
              From one input to everywhere, in minutes.
            </p>
          </motion.div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
            {stats.map((s, i) => (
              <React.Fragment key={s.label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex-1 text-center w-full md:w-auto"
                >
                  <p className="text-5xl font-bebas text-[#EF5350] mb-2 flex items-center justify-center">
                    <CountUp to={s.value} />
                    <span className="text-3xl ml-1">{s.suffix}</span>
                  </p>
                  <p className="text-sm text-[#616161] font-medium">
                    {s.label}
                  </p>
                </motion.div>
                {/* Divider */}
                {i < stats.length - 1 && (
                  <div className="hidden md:block w-px h-16 bg-[#FFCDD2]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-[#FFEBEE]">
        <div className="max-w-6xl mx-auto">
          {/* Pull Quote */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-20 bg-[#FFFFFF] p-8 md:p-12 border border-[#FFCDD2] rounded-2xl">
            <div className="w-full md:w-2/3 pl-6 border-l-4 border-[#EF5350]">
              <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A] italic leading-snug">
                "ReelCut turned my 2-hour podcast into 30 viral clips in under
                15 minutes. My YouTube Shorts channel went from 0 to 8k subs in
                a month."
              </p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col items-start md:items-end border-t md:border-t-0 md:border-l border-[#FFCDD2] pt-6 md:pt-0 md:pl-12">
              <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white font-bold mb-3">
                <Play size={20} fill="currentColor" />
              </div>
              <p className="font-bold text-[#1A1A1A] text-lg">Marcus T.</p>
              <p className="text-[#616161] text-sm">Top 1% Podcast Host</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`bg-[#FFFFFF] p-8 min-h-[240px] flex flex-col justify-between transition-all ${
                  i === 1
                    ? "border-2 border-[#EF5350]/40 shadow-lg scale-105 z-10"
                    : "border border-[#FFCDD2] hover:border-[#EF9090]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 mb-6">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className="fill-[#EF5350] text-[#EF5350]"
                      />
                    ))}
                  </div>
                  <p className="text-[13px] text-[#616161] italic leading-relaxed mb-8">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EF5350]/15 flex items-center justify-center text-sm font-bold text-[#EF5350]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A1A]">{t.name}</p>
                    <p className="text-xs text-[#9E9E9E]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24 px-4 bg-[#FFF5F5] border-y border-[#FFCDD2]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-bebas text-[#1A1A1A] mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-[#616161]">
              Start free, scale when you're ready.
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-16">
            <div className="flex items-center bg-[#FFFFFF] border border-[#FFCDD2] rounded-full p-1 shadow-sm">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billing === "monthly" ? "bg-[#EF5350] text-white" : "text-[#616161] hover:text-[#1A1A1A]"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annual")}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billing === "annual" ? "bg-[#EF5350] text-white" : "text-[#616161] hover:text-[#1A1A1A]"}`}
              >
                Annually
              </button>
            </div>
          </div>

          <div className="relative group">
            {/* Beta Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-[#1A1A1A] p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 border border-[#333333]">
                <h3 className="font-bebas text-3xl text-white mb-2">
                  Beta Phase
                </h3>
                <p className="text-[#9E9E9E] text-sm mb-6">
                  ReelCut is currently in a private beta phase. Join now to get
                  100% free access before we launch.
                </p>
                <Link
                  to="/register"
                  className="inline-block px-8 py-3 bg-[#EF5350] text-white font-semibold rounded hover:bg-[#C62828] transition-colors"
                >
                  Join Free Beta
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center blur-md select-none opacity-40">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative flex flex-col bg-[#FFFFFF] ${
                    plan.popular
                      ? "border-[1.5px] border-[#EF5350] md:-my-4 md:py-10 py-8 px-6 z-10"
                      : "border border-[#FFCDD2] py-8 px-6 z-0"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#EF5350] text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                      Most Popular
                    </div>
                  )}
                  <h3 className="font-bold text-xl text-[#1A1A1A] mb-2 text-center">
                    {plan.name}
                  </h3>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={billing}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-center items-end gap-1 mb-8"
                    >
                      <span className="text-5xl font-bebas text-[#1A1A1A] leading-none">
                        $
                        {billing === "monthly"
                          ? plan.price
                          : Math.floor(plan.price * 0.8)}
                      </span>
                      <span className="text-[#616161] text-sm mb-1">/mo</span>
                    </motion.div>
                  </AnimatePresence>

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-[#616161]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EF5350] mt-1.5 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`block text-center py-3 font-semibold transition-all ${
                      plan.popular
                        ? "bg-[#EF5350] text-white shadow-md"
                        : "border border-[#FFCDD2] text-[#616161] bg-transparent"
                    }`}
                  >
                    Get Started
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-[#FFEBEE]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">
          <div className="w-full md:w-1/3">
            <motion.div {...fadeUp} className="sticky top-32">
              <h2 className="text-4xl sm:text-5xl font-bebas text-[#1A1A1A] leading-none mb-6">
                Have questions? We've got answers.
              </h2>
              <p className="text-[#616161] leading-relaxed mb-8">
                Everything you need to know about the product and billing. Can't
                find the answer you're looking for?
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#EF5350] text-white font-semibold shadow-md hover:bg-[#C62828] transition-colors"
              >
                Contact support
              </Link>
            </motion.div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="space-y-0 border-t border-[#FFCDD2]">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-[#FFFFFF] border-b border-[#FFCDD2] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-6 px-6 text-left"
                  >
                    <h3
                      className={`font-semibold text-lg transition-colors ${activeFaq === i ? "text-[#EF5350]" : "text-[#1A1A1A]"}`}
                    >
                      {faq.q}
                    </h3>
                    <div className="text-[#EF5350] flex-shrink-0 ml-4">
                      {activeFaq === i ? (
                        <X size={20} />
                      ) : (
                        <Zap
                          size={20}
                          className="rotate-90 opacity-0 absolute"
                        />
                      )}{" "}
                      {/* using Zap placeholder or just +/- icons if they existed, wait I can use standard + and - or just an arrow. Since I don't have plus/minus imported from lucide-react, I will use ChevronRight/ChevronDown */}
                      {activeFaq === i ? (
                        <ChevronDown size={20} className="text-[#EF5350]" />
                      ) : (
                        <ChevronRight size={20} className="text-[#EF5350]" />
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 overflow-hidden"
                      >
                        <p className="text-[#616161] leading-relaxed pb-6">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            {faqs.length > 5 && (
              <button className="mt-8 text-[#EF5350] font-semibold hover:text-[#C62828] transition-colors flex items-center gap-2">
                Show more questions <ChevronDown size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-32 px-4 bg-[#FFFFFF] relative overflow-hidden">
        {/* Radial Background Tint */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#FFF0F0_0%,_#FFFFFF_100%)] pointer-events-none" />

        {/* Spiral Motif */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -right-64 w-[800px] h-[800px] opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at center, #1A1A1A, #1A1A1A 1px, transparent 1px, transparent 32px)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div {...fadeUp}>
            <h2 className="text-5xl sm:text-7xl font-bebas text-[#1A1A1A] mb-6 tracking-tight">
              Start creating in minutes
            </h2>
            <p className="text-[#616161] text-lg mb-12 max-w-2xl mx-auto">
              No credit card. No commitment. Just results. Join thousands of
              creators turning long videos into viral moments.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-10 py-4 bg-[#EF5350] text-white font-semibold hover:bg-[#C62828] transition-colors shadow-lg shadow-[#EF5350]/20"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>
              <button className="w-full sm:w-auto inline-flex justify-center items-center px-10 py-4 border-2 border-[#EF5350] text-[#EF5350] font-semibold hover:bg-[#FFF5F5] transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
