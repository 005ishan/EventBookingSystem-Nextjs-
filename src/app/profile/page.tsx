"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { isAuthenticated, getUser } from "@/services/authService";
import { getProfile, updateProfile, changePassword, uploadProfilePicture, removeProfilePicture } from "@/services/profileService";
import { SkeletonProfile } from "@/components/Skeleton";

export default function EditProfilePage() {
  const router = useRouter();
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setMessage(null);
    try {
      const data = await uploadProfilePicture(file);
      setProfilePicture(data.profilePicture);
      setMessage({ type: "success", text: data.message || "Profile picture updated!" });

      const currentUser = getUser() || { name: "", email: "", profilePicture: "" };
      localStorage.setItem(
        "user",
        JSON.stringify({ ...currentUser, profilePicture: data.profilePicture })
      );
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to upload photo.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemovePhoto() {
    setUploadingPhoto(true);
    setMessage(null);
    try {
      const data = await removeProfilePicture();
      setProfilePicture("");
      setMessage({ type: "success", text: data.message || "Profile picture removed" });

      const currentUser = getUser() || { name: "", email: "", profilePicture: "" };
      const { profilePicture: _, ...rest } = currentUser;
      localStorage.setItem("user", JSON.stringify(rest));
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to remove photo.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setUploadingPhoto(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setCheckedAuth(true);

    Promise.all([
      getProfile(),
      new Promise((r) => setTimeout(r, 1500)),
    ])
      .then(([data]) => {
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setOrganizerName(data.organizerName || "");
        setEmail(data.email || "");
        setCreatedAt(data.createdAt || null);
        setProfilePicture(data.profilePicture || "");
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setMessage({ type: "error", text: "Failed to load profile. Please try again." });
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const data = await updateProfile({ firstName, lastName, organizerName });
      setMessage({ type: "success", text: data.message || "Profile updated successfully!" });

      if (data.user) {
        const fullName = `${data.user.firstName} ${data.user.lastName}`.trim();
        const existing = getUser() || { name: "", email: "", profilePicture: "" };
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: fullName,
            email: data.user.email,
            profilePicture: data.user.profilePicture || profilePicture,
          })
        );
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to update profile. Please try again.";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordChange() {
    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      const data = await changePassword(currentPassword, newPassword);
      setPasswordMessage({ type: "success", text: data.message || "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to change password. Please try again.";
      setPasswordMessage({ type: "error", text: errorMsg });
    } finally {
      setPasswordSaving(false);
    }
  }

  function Input({ label, type, val, set, placeholder }: any) {
    return (
      <div className="mb-4">
        <label className="text-gray-400 text-xs mb-1.5 block">{label}</label>
        <input
          type={type}
          value={val}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500"
        />
      </div>
    );
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  if (!checkedAuth) return null;

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <AuthenticatedNavbar />
      <div className="max-w-[1500px] mx-auto px-8 py-10">
        <div className="text-sm mb-1">
          <span className="text-blue-400">Edit profile</span>
        </div>
        <h1 className="text-white text-4xl font-bold mb-1">
          Edit your <span className="text-blue-500">profile</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Update your personal information and keep your account up to date
        </p>

        {loading ? (
          <SkeletonProfile />
        ) : (
          <>
            <div className="flex gap-6 mb-6">
              <div className="w-96 bg-[#151B2B] rounded-xl border border-gray-700 p-9 flex flex-col items-center justify-center">
                <div className="flex items-center gap-7">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-[48px] flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"}${profilePicture}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">
                            {(firstName || getUser()?.name || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="w-7 h-7 bg-blue-500 rounded-2xl border-2 border-[#0A0E1A] absolute bottom-0 right-0 flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 013.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">
                      {firstName || getUser()?.name || "User"}
                    </h2>
                    <p className="text-gray-500 text-xs mb-2.5">
                      Member since {createdAt ? formatDate(createdAt) : "..."}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="h-8 px-6 bg-blue-500/10 rounded-lg border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingPhoto ? "Uploading..." : profilePicture ? "Change photo" : "Upload photo"}
                      </button>
                      {profilePicture && (
                        <button
                          onClick={handleRemovePhoto}
                          disabled={uploadingPhoto}
                          className="h-8 px-4 bg-red-500/10 rounded-lg border border-red-500/30 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <p className="text-gray-500 text-xs mt-3">JPG, PNG or GIF · Max 5MB</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-9">
                <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-6">
                  Personal information
                </h2>
                <div className="flex gap-6 mb-4">
                  <Input label="First name" type="text" val={firstName} set={setFirstName} />
                  <Input label="Last name" type="text" val={lastName} set={setLastName} placeholder="Enter your last name" />
                </div>
                <Input label="Organizer's name" type="text" val={organizerName} set={setOrganizerName} placeholder="Enter your organizer/company name" />
                <div className="mb-4">
                  <label className="text-gray-400 text-xs mb-1.5 block">Email address</label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-gray-400 text-sm outline-none cursor-not-allowed"
                  />
                  <p className="text-gray-500 text-xs mt-1">Email cannot be changed here</p>
                </div>
              </div>
            </div>

            {message && (
              <div
                className={`mb-6 px-6 py-3 rounded-xl border text-sm flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {message.type === "success" ? (
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message.text}
              </div>
            )}

            <div className="bg-[#151B2B] rounded-xl border border-gray-700 p-9 mb-6">
              <h2 className="text-gray-400 text-xs uppercase tracking-wider mb-6">Change password</h2>
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1.5 block">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1.5 block">New password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1.5 block">Confirm new password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full h-11 px-4 bg-white/5 rounded-xl border border-gray-700 text-white text-sm outline-none focus:border-blue-500 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`mt-4 px-4 py-2.5 rounded-xl border text-sm flex items-center gap-2 ${
                    passwordMessage.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {passwordMessage.type === "success" ? (
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {passwordMessage.text}
                </div>
              )}

              <button
                onClick={handlePasswordChange}
                disabled={passwordSaving}
                className="mt-4 h-11 px-6 bg-blue-500/10 rounded-xl border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordSaving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>

            <div className="bg-[#151B2B] rounded-xl border border-gray-700 px-9 py-6 flex justify-between items-center">
              <p className="text-gray-400 text-xs">Changes are saved securely</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="h-12 px-6 rounded-xl border border-gray-700 text-gray-400 text-sm hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-12 px-10 bg-blue-500 rounded-xl text-white text-base font-medium hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
