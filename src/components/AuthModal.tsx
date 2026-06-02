"use client";

export default function AuthModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}>
      <div className="bg-[#151B2B] rounded-lg pt-6 px-8 pb-8 max-w-sm w-full mx-4 border border-[#1A2040]"
        onClick={(e: any) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button className="text-gray-500 hover:text-gray-300 text-lg leading-none" onClick={onClose}>✕</button>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <h3 className="text-[#E8E4DA] text-lg font-semibold">Sign in to continue</h3>
          <p className="text-[#E4BDBA] text-sm">Please log in or create an account to access this feature.</p>
          <div className="flex w-full gap-3 pt-2">
            <button className="flex-1 bg-[#4A7AFF] text-white py-3 rounded-lg font-medium text-sm hover:bg-[#3A6AEF]"
              onClick={() => alert("Log in")}>Log in</button>
            <button className="flex-1 bg-transparent text-[#FFB3AE] py-3 rounded-lg font-medium text-sm border border-[#FFB3AE]/40 hover:bg-[#FFB3AE]/10"
              onClick={() => alert("Sign up")}>Sign up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
