"use client";

import { useState, useRef, useEffect, type TouchEvent, type MouseEvent } from "react";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import AuthModal from "@/components/AuthModal";
import Footer from "@/components/Footer";
import { SkeletonLandingPage } from "@/components/Skeleton";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [currentFeatured, setCurrentFeatured] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const mouseDownX = useRef<number | null>(null);
  const minSwipe = 50;

  function handleSwipe(dist: number) {
    if (dist > minSwipe && currentFeatured < 2) {
      setCurrentFeatured(currentFeatured + 1);
    } else if (dist < -minSwipe && currentFeatured > 0) {
      setCurrentFeatured(currentFeatured - 1);
    }
  }

  function onTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function onTouchMove(e: TouchEvent<HTMLDivElement>) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function onTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    handleSwipe(touchStartX.current - touchEndX.current);
  }

  function onMouseDown(e: MouseEvent<HTMLDivElement>) {
    mouseDownX.current = e.clientX;
  }

  function onMouseUp(e: MouseEvent<HTMLDivElement>) {
    if (mouseDownX.current === null) return;
    handleSwipe(mouseDownX.current - e.clientX);
    mouseDownX.current = null;
  }

  function onMouseLeave() {
    mouseDownX.current = null;
  }

  function goToNext() {
    setCurrentFeatured(currentFeatured === 2 ? 0 : currentFeatured + 1);
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    const interval = setInterval(goToNext, 5000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [currentFeatured]);

  function requireAuth() {
    setShowModal(true);
  }

  const events = [
    {
      title: "Nepal Tourism Festival 2024",
      desc: "Experience the vibrant culture, breathtaking landscapes, and mystical\ntraditions of the Himalayas. A week-long celebration featuring local artisans\nand guides.",
      btn1: "Book Now",
      btn2: "Event Details",
      img: "/img/nepaltourism2024.jpg",
    },
    {
      title: "Sabin Rai & The Pharaoh ft. Daju Vai Kutumba",
      desc: "An electrifying night of Nepali music with the legendary Sabin Rai, The\nPharaoh Purna Rai, and Daju Vai Kutumba. Presented with help of Ticket\nSanjal. Don't miss this epic concert experience!",
      btn1: "Get Tickets",
      btn2: "Event Details",
      img: "/img/Tastethe.png",
    },
    {
      title: "Stand Up Comedy Night ft. Aayush Shrestha & Babin Karki",
      desc: "Get ready for a night of non-stop laughter as Nepal's finest comedians\nAayush Shrestha and Babin Karki take the stage. A hilarious evening of\nstand-up comedy presented with help of Ticket Sanjal!",
      btn1: "Get Tickets",
      btn2: "Event Details",
      img: "/img/standupcomedy.png",
    },
  ];

  const liveCards = [
    { img: "/img/Tastethe.png", title: "Kathmandu Jazz & Blues Night", price: "Rs. 1,200", desc: "MUSIC \u2022 LIVE JAZZ \u2022 Nepal's finest jazz\nartists performing at The Moksh Bar", btn: "Book Now", date: "LIVE NOW" },
    { img: "/img/standupcomedy.png", title: "Comedy Night ft. Aayush & Babin", price: "Rs. 800", desc: "COMEDY \u2022 STAND-UP \u2022 Non-stop laughter\nwith Nepal's top comedians live!", btn: "Get Ticket", date: "LIVE NOW" },
    { img: "/img/nepaltourism2024.jpg", title: "Nepal Heritage Expo 2024", price: "Rs. 500", desc: "CULTURE \u2022 ART \u2022 TRADITION \u2022 Experience\nNepal's rich heritage under one roof", btn: "Join Now", date: "LIVE NOW" },
  ];

  const upcomingCards = [
    { img: "/img/Tastethe.png", title: "Pokhara Lake Side Music Fest", price: "Rs. 1,500", desc: "MUSIC \u2022 OUTDOOR \u2022 Weekend concert\nseries by the serene Phewa Lake in Pokhara", btn: "Reserve Spot", date: "NOV 5 \u2022 4:00 PM" },
    { img: "/img/nepaltourism2024.jpg", title: "Himalayan Food & Culture Fest", price: "Rs. 1,000", desc: "FOOD \u2022 CULTURE \u2022 Authentic Nepali cuisine,\ntraditional dances & local artisan stalls", btn: "Get Tickets", date: "NOV 12 \u2022 10:00 AM" },
    { img: "/img/standupcomedy.png", title: "Laugh Nepal: Comedy Special", price: "Rs. 600", desc: "COMEDY \u2022 LIVE SHOW \u2022 An evening of\nhilarious stand-up with Nepal's funniest", btn: "Join Guestlist", date: "NOV 19 \u2022 7:00 PM" },
  ];

  if (loading) return <SkeletonLandingPage />;

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="self-stretch bg-[#0A0E1A] border border-solid border-black flex flex-col min-h-screen"
        style={{ boxShadow: "0px 4px 4px #00000040" }}>
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <section className="self-stretch bg-[#00000000] pb-10">
            <div className="flex flex-col items-center self-stretch max-w-[1278px] pt-16 pb-8 px-6 mx-auto">
              <h1 className="text-[#DDE2F8] text-6xl text-center w-[400px] whitespace-pre-line">
                {"Find Your Next\n"}
                <span className="bg-gradient-to-r from-[#FF4B4B] to-[#FFB3AE] bg-clip-text text-transparent">Experience</span>
              </h1>
            </div>
            <div className="relative max-w-[1150px] mx-auto overflow-hidden rounded-2xl select-none cursor-grab active:cursor-grabbing"
              style={{ background: "linear-gradient(180deg, #0D1322, #0D132266, #0D132200)" }}
              onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}>
              <div className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentFeatured * 100}%)` }}>
                {events.map((event, i) => (
                  <div key={i} className="min-w-full flex justify-between items-start relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.img})` }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D1322]/95 via-[#0D1322]/70 to-[#0D1322]/30" />
                    <div className="flex flex-col shrink-0 items-start py-16 mt-[200px] gap-4 relative z-10">
                      <div className="flex items-center bg-[#FF4B4BE3] py-1 px-4 ml-16 gap-2 rounded-[9999px]">
                        <div className="bg-white w-2 h-2 rounded-[9999px]" />
                        <span className="text-white text-xs font-bold">FEATURED EVENT</span>
                      </div>
                      <div className="flex flex-col items-start pt-2 pr-[332px] mx-16">
                        <span className="text-white text-base">{event.title}</span>
                      </div>
                      <p className="text-[#E4BDBA] text-base w-[539px] ml-16 whitespace-pre-line">{event.desc}</p>
                      <div className="flex items-start pt-4 ml-16">
                        <button className="flex flex-col shrink-0 items-start bg-[#FF4B4B] text-left py-4 px-10 mr-[17px] rounded-xl border-0 hover:bg-[#E03B3B]"
                          style={{ boxShadow: "0px 0px 20px #FF4B4B33" }} onClick={requireAuth}>
                          <span className="text-white text-lg font-bold">{event.btn1}</span>
                        </button>
                        <button className="flex flex-col shrink-0 items-start bg-[#FFFFFF1A] text-left py-[17px] px-10 mr-[173px] rounded-xl border border-solid border-[#FFFFFF33] hover:bg-[#FFFFFF26]"
                          onClick={requireAuth}>
                          <span className="text-white text-lg font-bold">{event.btn2}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-8 right-16 flex items-center gap-3">
                {events.map((_, i) => (
                  <button key={i} onClick={() => setCurrentFeatured(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentFeatured ? "bg-[#FF4B4B] scale-110" : "bg-[#FFFFFF4D] hover:bg-[#FFFFFF80]"}`}
                    aria-label={`Slide ${i + 1}`} />
                ))}
              </div>
            </div>
            <section className="flex flex-col self-stretch max-w-[1278px] pt-20 px-16 mx-auto gap-8">
              <div className="flex flex-col self-stretch gap-2">
                <h2 className="text-white text-base">Happening Now</h2>
                <p className="text-[#E4BDBA] text-base">Don&apos;t miss out on these live experiences</p>
              </div>
              <div className="flex items-center self-stretch gap-[33px]">
                {liveCards.map((card, i) => (
                  <EventCard key={i} {...card} onAction={requireAuth} />
                ))}
              </div>
            </section>
            <section className="flex flex-col self-stretch max-w-[1278px] pt-20 px-16 mx-auto gap-8">
              <div className="flex flex-col self-stretch gap-2">
                <h2 className="text-white text-base">Upcoming Near You</h2>
                <p className="text-[#E4BDBA] text-base">Recommended based on your location: Kathmandu, Nepal</p>
              </div>
              <div className="flex items-center self-stretch gap-[33px]">
                {upcomingCards.map((card, i) => (
                  <EventCard key={i} {...card} onAction={requireAuth} />
                ))}
              </div>
              <div className="flex flex-col items-center self-stretch pt-4">
                <button className="flex flex-col items-start bg-[#2F3445] text-left py-[17px] px-12 rounded-xl border border-solid border-[#2F3445] hover:bg-[#3A4155]"
                  onClick={requireAuth}>
                  <span className="text-[#DDE2F8] text-base font-bold">Explore More Events</span>
                </button>
              </div>
            </section>
          </section>
          <Footer />
        </div>
      </div>
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
