"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/services/authService";

export default function ContactPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Track if form was submitted
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  function handleChange(e: any, field: string) {
    setFormData({ ...formData, [field]: e.target.value });
  }

  // Handle form submit
  function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitted(true);
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div
        className="self-stretch bg-[#0A0E1A] border border-solid border-black flex flex-col min-h-screen"
        style={{ boxShadow: "0px 4px 4px #00000040" }}
      >
        {loggedIn ? <AuthenticatedNavbar /> : <Navbar />}

        <div className="flex-1 overflow-y-auto">
          {/* ========== HERO SECTION ========== */}
          <section className="self-stretch pb-10">
            <div className="flex flex-col items-center max-w-[1150px] pt-20 pb-14 px-6 mx-auto gap-6">
              {/* Badge */}
              <div className="flex items-center bg-[#4A7AFF]/10 py-1 px-5 gap-2 rounded-full border border-[#4A7AFF]/30">
                <span className="text-[#4A7AFF] text-xs font-medium tracking-wide">
                  Get in touch
                </span>
              </div>

              {/* Heading */}
              <div className="flex flex-col items-center max-w-[650px]">
                <h1 className="text-center text-[#E8E4DA] text-5xl md:text-6xl font-bold leading-[1.1]">
                  We&apos;d love to hear{" "}
                  <span className="bg-gradient-to-r from-[#4A7AFF] to-[#bcb6fc] bg-clip-text text-transparent">
                    from you
                  </span>
                </h1>
              </div>

              {/* Description */}
              <div className="max-w-[500px] text-center">
                <p className="text-[#E4BDBA] text-base leading-7">
                  Have a question, feedback, or want to partner with us?
                  Drop us a message and we&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </div>
          </section>

          {/* ========== CONTACT FORM (Centered) ========== */}
          <section className="max-w-[800px] mx-auto px-6 pt-5 pb-16">
            <div className="bg-[#151B2B] rounded-2xl border border-white/10 p-8">
              <h2 className="text-[#E8E4DA] text-2xl font-bold mb-6 text-center">
                Send us a message
              </h2>

              {/* Show success message */}
              {submitted && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl p-4 mb-6">
                  ✅ Thanks! Your message has been sent. We&apos;ll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#E8E4DA]/70 text-sm">Your Name</label>
                    <input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleChange(e, "name")}
                      required
                      className="bg-[#242A3A] text-[#E8E4DA] text-sm py-3 px-4 rounded-xl border border-[#2F344580] focus:outline-none focus:border-[#4A7AFF] placeholder:text-gray-500"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#E8E4DA]/70 text-sm">Your Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange(e, "email")}
                      required
                      className="bg-[#242A3A] text-[#E8E4DA] text-sm py-3 px-4 rounded-xl border border-[#2F344580] focus:outline-none focus:border-[#4A7AFF] placeholder:text-gray-500"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#E8E4DA]/70 text-sm">Subject</label>
                  <input
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={(e) => handleChange(e, "subject")}
                    required
                    className="bg-[#242A3A] text-[#E8E4DA] text-sm py-3 px-4 rounded-xl border border-[#2F344580] focus:outline-none focus:border-[#4A7AFF] placeholder:text-gray-500"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#E8E4DA]/70 text-sm">Message</label>
                  <textarea
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={(e) => handleChange(e, "message")}
                    required
                    rows={5}
                    className="bg-[#242A3A] text-[#E8E4DA] text-sm py-3 px-4 rounded-xl border border-[#2F344580] focus:outline-none focus:border-[#4A7AFF] placeholder:text-gray-500 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-[#4A7AFF] text-white text-sm font-medium py-3 px-8 rounded-[10px] hover:bg-[#3A6AEF] transition-all w-full"
                >
                  Send message →
                </button>
              </form>
            </div>
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}
