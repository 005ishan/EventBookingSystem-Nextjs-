"use client";

interface SkeletonBase {
  className?: string;
}

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[rgba(255,255,255,0.06)] rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.06)] to-transparent" />
    </div>
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string } & SkeletonBase) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className={`h-3 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" } & SkeletonBase) {
  const sizeClasses = { sm: "w-8 h-8", md: "w-16 h-16", lg: "w-24 h-24" };
  return <Shimmer className={`${sizeClasses[size]} rounded-full ${className}`} />;
}

export function SkeletonRect({ width = "full", height = "h-10", className = "" }: { width?: string; height?: string } & SkeletonBase) {
  return <Shimmer className={`${height} ${width !== "full" ? width : "w-full"} ${className}`} />;
}

export function SkeletonEventCard() {
  return (
    <div className="w-[312px] h-[335px] bg-[#0D1223] overflow-hidden rounded-[14px] outline outline-1 outline-offset-[-1px] outline-[rgba(255,255,255,0.08)] flex flex-col shrink-0">
      <Shimmer className="self-stretch h-[155px] rounded-none" />
      <div className="self-stretch pt-4 pb-[18px] px-[18px] flex flex-col gap-[6px] flex-1">
        <div className="flex items-center gap-3">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-3 w-12" />
          <Shimmer className="h-3 w-20" />
        </div>
        <div className="flex-1 flex flex-col justify-center gap-2">
          <Shimmer className="h-5 w-4/5" />
          <Shimmer className="h-3 w-2/3" />
        </div>
        <Shimmer className="h-8 w-full" />
        <div className="self-stretch pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shimmer className="w-[22px] h-[22px] rounded-full" />
            <Shimmer className="h-3 w-12" />
          </div>
          <Shimmer className="w-20 h-7 rounded-[7px]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonEventCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-wrap gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonEventCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="flex gap-6 mb-6">
      <div className="w-96 bg-[#151B2B] rounded-xl border border-gray-700 p-9 flex flex-col items-center justify-center">
        <div className="flex items-center gap-7">
          <Shimmer className="w-24 h-24 rounded-[48px]" />
          <div className="flex flex-col gap-2">
            <Shimmer className="h-5 w-32" />
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-9">
        <Shimmer className="h-3 w-28 mb-6" />
        <div className="flex gap-6 mb-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-11 w-full" />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <Shimmer className="h-3 w-16" />
            <Shimmer className="h-11 w-full" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mb-4">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-11 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonPageShell() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Navbar skeleton */}
      <div className="bg-[#050811] border-b border-[#1A2040] px-12 py-[27px] flex items-center justify-between">
        <Shimmer className="h-6 w-48" />
        <div className="flex gap-2">
          <Shimmer className="h-8 w-20 rounded-lg" />
          <Shimmer className="h-8 w-20 rounded-lg" />
          <Shimmer className="h-8 w-20 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Shimmer className="w-8 h-8 rounded-full" />
          <Shimmer className="h-4 w-20" />
        </div>
      </div>
      {/* Content area */}
      <div className="max-w-[1500px] mx-auto px-8 py-10">
        <Shimmer className="h-3 w-24 mb-2" />
        <Shimmer className="h-10 w-72 mb-2" />
        <Shimmer className="h-4 w-56 mb-8" />
        <div className="flex gap-6">
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <Shimmer className="h-4 w-28 mb-5" />
            <Shimmer className="h-11 w-full mb-4" />
            <Shimmer className="h-24 w-full mb-4" />
            <Shimmer className="h-11 w-full mb-4" />
            <Shimmer className="h-11 w-full" />
          </div>
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <Shimmer className="h-4 w-24 mb-5" />
            <Shimmer className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonAuthenticatedPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Authenticated navbar skeleton */}
      <div className="bg-[#050811] border-b border-[#1A2040] px-12 py-[27px] flex items-center justify-between">
        <Shimmer className="h-6 w-48" />
        <div className="flex gap-2">
          <Shimmer className="h-8 w-16 rounded-lg" />
          <Shimmer className="h-8 w-16 rounded-lg" />
          <Shimmer className="h-8 w-16 rounded-lg" />
          <Shimmer className="h-8 w-16 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Shimmer className="w-8 h-8 rounded-full" />
          <Shimmer className="h-4 w-20" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="max-w-[1500px] mx-auto px-8 py-10">
        <Shimmer className="h-3 w-24 mb-2" />
        <Shimmer className="h-10 w-72 mb-2" />
        <Shimmer className="h-4 w-56 mb-8" />
        <div className="flex gap-6">
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <Shimmer className="h-4 w-28 mb-5" />
            <Shimmer className="h-11 w-full mb-4" />
            <Shimmer className="h-24 w-full mb-4" />
            <Shimmer className="h-11 w-full mb-4" />
            <Shimmer className="h-11 w-full" />
          </div>
          <div className="flex-1 bg-[#151B2B] rounded-xl border border-gray-700 p-6">
            <Shimmer className="h-4 w-24 mb-5" />
            <Shimmer className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonPublicPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      {/* Public navbar skeleton */}
      <div className="bg-[#050811] border-b border-[#1A2040] px-12 py-[27px] flex items-center justify-between">
        <Shimmer className="h-6 w-48" />
        <div className="flex gap-2">
          <Shimmer className="h-8 w-16 rounded-lg" />
          <Shimmer className="h-8 w-16 rounded-lg" />
          <Shimmer className="h-8 w-16 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-9 w-20 rounded-lg" />
          <Shimmer className="h-9 w-24 rounded-lg" />
        </div>
      </div>
      {/* Content */}
      <div className="max-w-[1150px] mx-auto px-6 py-20">
        <div className="flex flex-col items-center gap-6">
          <Shimmer className="h-6 w-28 rounded-full" />
          <Shimmer className="h-16 w-[600px]" />
          <Shimmer className="h-5 w-[400px]" />
        </div>
        <div className="grid grid-cols-4 gap-6 mt-16">
          <Shimmer className="h-32 rounded-2xl" />
          <Shimmer className="h-32 rounded-2xl" />
          <Shimmer className="h-32 rounded-2xl" />
          <Shimmer className="h-32 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <div className="bg-[#050811] border-b border-[#1A2040] px-12 py-[27px] flex items-center justify-between">
        <Shimmer className="h-6 w-48" />
        <div className="flex gap-2">
          <Shimmer className="h-8 w-16 rounded-lg" />
          <Shimmer className="h-8 w-16 rounded-lg" />
          <Shimmer className="h-8 w-16 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-9 w-20 rounded-lg" />
          <Shimmer className="h-9 w-24 rounded-lg" />
        </div>
      </div>
      <div className="max-w-[1150px] mx-auto px-6 pt-20">
        <Shimmer className="h-16 w-[400px] mx-auto mb-12" />
        <Shimmer className="h-[400px] w-full rounded-2xl mb-12" />
        <Shimmer className="h-5 w-40 mb-6" />
        <div className="flex gap-6">
          <Shimmer className="flex-1 h-[380px] rounded-3xl" />
          <Shimmer className="flex-1 h-[380px] rounded-3xl" />
          <Shimmer className="flex-1 h-[380px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonAuthPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center px-4">
      <div className="w-[575px] bg-[#10152A] rounded-2xl px-[52px] pt-12 pb-10 border border-white/10 shadow-2xl">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Shimmer className="h-6 w-48" />
          <Shimmer className="h-8 w-32 mt-4" />
          <Shimmer className="h-4 w-44" />
        </div>
        <Shimmer className="h-11 w-full mb-4" />
        <Shimmer className="h-11 w-full mb-6" />
        <Shimmer className="h-12 w-full rounded-[11px] mb-6" />
        <div className="flex items-center gap-3 mb-5">
          <Shimmer className="flex-1 h-[0.5px]" />
          <Shimmer className="h-3 w-24" />
          <Shimmer className="flex-1 h-[0.5px]" />
        </div>
        <div className="flex gap-3 mb-7">
          <Shimmer className="flex-1 h-11 rounded-[10px]" />
          <Shimmer className="flex-1 h-11 rounded-[10px]" />
        </div>
      </div>
    </div>
  );
}

export default function Skeleton({ variant = "text", ...props }: any) {
  switch (variant) {
    case "event-card":
      return <SkeletonEventCard />;
    case "event-grid":
      return <SkeletonEventCardGrid {...props} />;
    case "profile":
      return <SkeletonProfile />;
    case "avatar":
      return <SkeletonAvatar {...props} />;
    case "rect":
      return <SkeletonRect {...props} />;
    case "page":
      return <SkeletonPageShell />;
    case "auth":
      return <SkeletonAuthPage />;
    default:
      return <SkeletonText {...props} />;
  }
}
