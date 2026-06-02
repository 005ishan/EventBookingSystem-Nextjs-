"use client";

export default function EventCard({ img, title, price, desc, btn, onAction, date }: any) {
  return (
    <div className="flex-1 bg-[#242A3A] rounded-3xl hover:bg-[#2A3042]" style={{ boxShadow: "0px 8px 10px #0000001A" }}>
      <div
        className="flex flex-col items-start self-stretch bg-cover bg-center pt-[214px] pl-4 rounded-t-3xl"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="flex items-center bg-[#191F2FE3] py-[5px] px-[13px] mb-4 rounded-lg border border-solid border-[#FFFFFF1A]">
          <span className="text-white text-xs font-bold">{date}</span>
        </div>
      </div>
      <div className="flex flex-col self-stretch p-6 gap-4">
        <div className="flex justify-between items-center self-stretch">
          <span className="text-white text-base">{title}</span>
          <span className="text-[#FF4B4B] text-base font-bold">{price}</span>
        </div>
        <p className="text-[#E4BDBA] text-sm whitespace-pre-line">{desc}</p>
        <button
          className="flex flex-col items-center self-stretch bg-transparent text-left py-[13px] rounded-xl border border-solid border-[#FFB3AE] hover:bg-[#FFB3AE] hover:text-[#0A0E1A]"
          onClick={onAction}
        >
          <span className="text-[#FFB3AE] text-base font-bold hover:text-[#0A0E1A]">{btn}</span>
        </button>
      </div>
    </div>
  );
}
