"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated } from "@/services/authService";

export default function EditProfilePage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [firstName, setFirstName] = useState("Users");
  const [lastName, setLastName] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [email, setEmail] = useState("user.s@example.com");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) router.push("/auth/login");
    else setCheckedAuth(true);
  }, [router]);

  function handleSave() { alert("Profile updated successfully!"); }
  function Input({ label, type, val, set, placeholder }: any) {
    return <div className="mb-4">
      <label className="text-gray-400 text-xs mb-1.5 block">{label}</label>
      <input type={type} value={val} onChange={(e) => set(e.target.value)} placeholder={placeholder}
        className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500" />
    </div>;
  }

  if (!checkedAuth) return null;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />
      <div className="max-w-[1500px] mx-auto px-8 py-10">
        <div className="text-sm mb-1">
          <span className="text-blue-400">Edit profile</span>
        </div>
        <h1 className="text-white text-4xl font-bold mb-1">Edit your <span className="text-blue-500">profile</span></h1>
        <p className="text-gray-400 text-sm mb-8">Update your personal information and keep your account up to date</p>

        <div className="flex gap-6 mb-6">
          <div className="w-96 bg-[#151B2B] rounded-xl border border-gray-700 p-9 flex flex-col items-center justify-center">
            <div className="flex items-center gap-7">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-violet-600 rounded-[48px] flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{firstName.charAt(0).toUpperCase()}</span>
                </div>
                <div className="w-7 h-7 bg-blue-500 rounded-2xl border-2 border-[#0A0E1A] absolute bottom-0 right-0 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">{firstName}</h2>
                <p className="text-gray-500 text-xs mb-2.5">Member since May 2025</p>
                <button onClick={() => fileInputRef.current?.click()}
                  className="h-8 px-6 bg-blue-500/10 rounded-lg border border-blue-500/30 text-blue-400 text-xs font-medium">Upload photo</button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif" className="hidden" />
                <p className="text-gray-500 text-xs mt-3">JPG, PNG or GIF · Max 5MB</p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-9">
            <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-6">Personal information</h2>
            <div className="flex gap-6 mb-4">
              <Input label="First name" type="text" val={firstName} set={setFirstName} />
              <Input label="Last name" type="text" val={lastName} set={setLastName} placeholder="Enter your last name" />
            </div>
            <Input label="Organizer's name" type="text" val={organizerName} set={setOrganizerName} placeholder="Enter your organizer/company name" />
            <Input label="Email address" type="email" val={email} set={setEmail} />
          </div>
        </div>

        <div className="bg-[#151B2B] rounded-xl border border-gray-700 p-9 mb-6">
          <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-6">Change password</h2>
          <div className="flex gap-6">
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1.5 block">New password</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500" />
              <div className="flex gap-1 mt-2">
                <div className="flex-1 h-[3px] bg-white/10 rounded-full" />
                <div className="flex-1 h-[3px] bg-white/10 rounded-full" />
                <div className="flex-1 h-[3px] bg-white/10 rounded-full" />
                <div className="flex-1 h-[3px] bg-white/10 rounded-full" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-gray-400 text-xs mb-1.5 block">Confirm new password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#151B2B] rounded-xl border border-gray-700 px-9 py-6 flex justify-between items-center">
          <p className="text-gray-400 text-xs">Changes are saved securely</p>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/dashboard")}
              className="h-12 px-6 rounded-xl border border-gray-700 text-gray-400 text-sm">Cancel</button>
            <button onClick={handleSave}
              className="h-12 px-10 bg-blue-500 rounded-xl text-white text-base font-medium">Save changes</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
