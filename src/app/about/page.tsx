"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/services/authService";

export default function AboutPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);
  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="self-stretch bg-[#0A0E1A] border border-solid border-black flex flex-col min-h-screen"
        style={{ boxShadow: "0px 4px 4px #00000040" }}>
        {loggedIn ? <AuthenticatedNavbar /> : <Navbar />}

        <div className="flex-1 overflow-y-auto">
          {/* Hero section */}
          <section className="self-stretch pb-10">
            <div className="flex flex-col items-center self-stretch max-w-[1150px] pt-20 pb-14 px-6 mx-auto gap-6">
              {/* Our story badge */}
              <div className="flex items-center bg-[#4A7AFF]/10 py-1 px-5 gap-2 rounded-full border border-[#4A7AFF]/30">
                <span className="text-[#4A7AFF] text-xs font-medium tracking-wide">Our story</span>
              </div>

              {/* Heading */}
              <div className="flex flex-col items-center max-w-[700px] pt-2">
                <h1 className="text-center text-[#E8E4DA] text-5xl md:text-6xl font-bold leading-[1.1]">
                  Built for people who{" "}
                  <span className="bg-gradient-to-r from-[#4A7AFF] to-[#bcb6fc] bg-clip-text text-transparent">
                    love
                  </span>
                  <br />
                  great events
                </h1>
              </div>

              {/* Description */}
              <div className="max-w-[540px] text-center">
                <p className="text-[#E4BDBA] text-base leading-7">
                  EBS is a modern event management platform helping organizers create,
                  manage, and grow extraordinary experiences — from intimate
                  workshops to global summits.
                </p>
              </div>
            </div>

            {/* Stats section */}
            <div className="max-w-[1150px] mx-auto px-6">
              <div className="grid grid-cols-4 bg-[#151B2B] rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex flex-col items-center py-8 px-5 border-r border-white/5">
                  <h3 className="text-[#E8E4DA] text-4xl font-bold">
                    12<span className="text-[#4A7AFF]">K+</span>
                  </h3>
                  <p className="text-[#E4BDBA]/50 text-xs mt-1 text-center tracking-tight">Active users worldwide</p>
                </div>
                <div className="flex flex-col items-center py-8 px-5 border-r border-white/5">
                  <h3 className="text-[#E8E4DA] text-4xl font-bold">
                    4.9<span className="text-[#4A7AFF]">★</span>
                  </h3>
                  <p className="text-[#E4BDBA]/50 text-xs mt-1 text-center tracking-tight">Average user rating</p>
                </div>
                <div className="flex flex-col items-center py-8 px-5 border-r border-white/5">
                  <h3 className="text-[#E8E4DA] text-4xl font-bold">
                    31<span className="text-[#4A7AFF]">+</span>
                  </h3>
                  <p className="text-[#E4BDBA]/50 text-xs mt-1 text-center tracking-tight">Countries reached</p>
                </div>
                <div className="flex flex-col items-center py-8 px-5">
                  <h3 className="text-[#E8E4DA] text-4xl font-bold">
                    150<span className="text-[#4A7AFF]">+</span>
                  </h3>
                  <p className="text-[#E4BDBA]/50 text-xs mt-1 text-center tracking-tight">Events hosted monthly</p>
                </div>
              </div>
            </div>

            {/* Mission section */}
            <div className="max-w-[1150px] mx-auto px-6 pt-20 pb-10">
              <div className="bg-[#151B2B] rounded-2xl border border-[#4A7AFF]/20 p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="flex-1">
                    <h2 className="text-[#E8E4DA] text-3xl font-bold mb-4">
                      What drives <span className="text-[#4A7AFF]">EBS</span>
                    </h2>
                    <p className="text-[#E4BDBA] text-sm leading-7 mb-4">
                      We believe every event has the power to inspire, connect, and transform.
                      Our platform is built to remove the friction from event management so
                      organizers can focus on what matters — creating unforgettable experiences.
                    </p>
                    <p className="text-[#E4BDBA] text-sm leading-7">
                      From ticketing to attendee engagement, EBS provides the tools you need
                      to bring your vision to life. We&apos;re not just a platform; we&apos;re your
                      partner in creating moments that matter.
                    </p>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-[#4A7AFF]/20 to-[#bcb6fc]/10 rounded-xl p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl mb-3"><img src="/img/target.jpg" alt="" /></div>
                      <p className="text-[#E4BDBA] text-sm italic">
                        &ldquo;Making great events accessible to everyone&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team section - student made feel */}
            <div className="max-w-[1150px] mx-auto px-6 pt-10 pb-10">
              <h2 className="text-center text-[#E8E4DA] text-3xl font-bold mb-8">
                Meet our <span className="text-[#4A7AFF]">team</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: "Amit Khayargoli", role: "Founder & CEO", img: "/img/amit.png" },
                  { name: "Aryan Nakumi", role: "Lead Developer", img: "/img/nakarmi.jpg" },
                  { name: "Asrim Suwal", role: "Event Director", img: "/img/asrim.jpg" },
                ].map((member, i) => (
                  <div key={i} className="bg-[#151B2B] rounded-2xl border border-white/10 p-6 text-center hover:border-[#4A7AFF]/30 transition-all group">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#4A7AFF]/30 group-hover:border-[#4A7AFF]/60 transition-all">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-[#E8E4DA] text-lg font-semibold">{member.name}</h3>
                    <p className="text-[#E4BDBA]/60 text-sm mt-1">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA section */}
          <div className="max-w-[1150px] mx-auto px-6 pb-16">
            <div className="bg-[#151B2B] rounded-2xl border border-[#4A7AFF]/20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-[#E8E4DA] text-3xl font-bold">
                  Ready to <span className="text-[#4A7AFF]">join</span> EBS?
                </h2>
                <p className="text-[#E4BDBA]/50 text-sm leading-6 max-w-[400px]">
                  Whether you&apos;re an organizer or an attendee, EBS has everything
                  you need to make your next event unforgettable.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <button className="bg-[#4A7AFF] text-white text-sm font-medium py-3 px-6 rounded-[10px] hover:bg-[#3A6AEF] transition-all">
                  Get started free
                </button>
                <button className="border border-white/20 text-[#E4BDBA]/70 text-sm font-normal py-3 px-5 rounded-[10px] hover:bg-white/5 transition-all">
                  Browse events
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
