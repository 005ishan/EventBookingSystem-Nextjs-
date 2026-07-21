"use client";

interface EventCardProps {
  img: string;
  title: string;
  price: string;
  desc: string;
  btn: string;
  onAction: () => void;
  date: string;
  organizer?: string;
  soldOut?: boolean;
  trending?: boolean;
}

export default function EventCard({ img, title, price, desc, btn, onAction, date, organizer, soldOut, trending }: EventCardProps) {
  return (
    <div className={`flex-1 rounded-3xl ${soldOut ? "bg-[#1E2332] opacity-70" : "bg-[#242A3A] hover:bg-[#2A3042]"}`}
      style={{ boxShadow: "0px 8px 10px #0000001A" }}>
      <div
        className="flex flex-col items-start self-stretch bg-cover bg-center pt-[214px] pl-4 rounded-t-3xl relative"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute top-3 left-3 flex gap-2">
          {trending && (
            <span className="bg-[#FF4B4B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
              Trending
            </span>
          )}
          {soldOut && (
            <span className="bg-[rgba(0,0,0,0.65)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
              Sold Out
            </span>
          )}
        </div>
        <div className="flex items-center bg-[#191F2FE3] py-[5px] px-[13px] mb-4 rounded-lg border border-solid border-[#FFFFFF1A] mt-8">
          <span className="text-white text-xs font-bold">{date}</span>
        </div>
      </div>
      <div className="flex flex-col self-stretch p-6 gap-4">
        <div className="flex justify-between items-center self-stretch">
          <div className="flex flex-col">
            <span className={`text-base ${soldOut ? "text-[#E4BDBA]/50" : "text-white"}`}>{title}</span>
            {organizer && (
              <span className="text-[#E4BDBA]/60 text-xs mt-1">by {organizer}</span>
            )}
          </div>
          <span className="text-[#FF4B4B] text-base font-bold shrink-0 ml-4">{price}</span>
        </div>
        <p className={`text-sm whitespace-pre-line ${soldOut ? "text-[#E4BDBA]/40" : "text-[#E4BDBA]"}`}>{desc}</p>
        {soldOut ? (
          <div className="flex flex-col items-center self-stretch py-[13px] rounded-xl bg-[rgba(255,255,255,0.04)] border border-solid border-[rgba(255,255,255,0.08)]">
            <span className="text-[#E4BDBA]/35 text-base font-bold">Sold Out</span>
          </div>
        ) : (
          <button
            className="flex flex-col items-center self-stretch bg-transparent text-left py-[13px] rounded-xl border border-solid border-[#FFB3AE] hover:bg-[#FFB3AE] hover:text-[#0A0E1A]"
            onClick={onAction}
          >
            <span className="text-[#FFB3AE] text-base font-bold hover:text-[#0A0E1A]">{btn}</span>
          </button>
        )}
      </div>
    </div>
  );
}
