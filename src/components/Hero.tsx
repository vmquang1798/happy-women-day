import React from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  senderBadge: string;
  recipientName: string;
  onOpenLetterClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  senderBadge,
  recipientName,
  onOpenLetterClick,
}) => {
  return (
    <header
      id="top"
      className="relative min-h-screen min-h-[100svh] grid place-items-center text-center px-5 pt-20 pb-16 overflow-hidden"
      style={{
        background: `
          radial-gradient(1200px 600px at 50% -10%, #ffe1e6 0%, transparent 60%),
          radial-gradient(700px 500px at 100% 100%, var(--gold-soft) 0%, transparent 60%),
          radial-gradient(600px 500px at 0% 90%, #fbd3dc 0%, transparent 60%),
          var(--bg)
        `,
      }}
    >
      {/* Swaying decorative roses */}
      <div
        className="flower f1 absolute w-[220px] -left-[60px] top-[12%] -rotate-[18deg] opacity-90 pointer-events-none hidden sm:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 260" className="w-full h-auto animate-[sway_7s_ease-in-out_infinite] origin-[50%_90%]">
          <use href="#rose" />
        </svg>
      </div>

      <div
        className="flower f2 absolute w-[260px] -right-[80px] bottom-[6%] rotate-[24deg] opacity-90 pointer-events-none"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 260"
          className="w-full h-auto animate-[sway_7s_ease-in-out_infinite] origin-[50%_90%]"
          style={{ animationDelay: '-3s' }}
        >
          <use href="#rose" />
        </svg>
      </div>

      <div
        className="flower f3 absolute w-[110px] right-[12%] top-[10%] rotate-[8deg] opacity-70 pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 260" className="w-full h-auto animate-[sway_7s_ease-in-out_infinite] origin-[50%_90%]">
          <use href="#rose" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 border border-[var(--line)] text-xs sm:text-[13px] font-medium text-[var(--rose-deep)] backdrop-blur-md shadow-sm">
          <i className="w-2 h-2 rounded-full bg-[var(--rose)] shadow-[0_0_0_4px_rgba(194,55,91,0.15)] inline-block" />
          <span>{senderBadge || 'Vũ Mạnh Quang kính chúc'}</span>
        </div>

        {/* Big Date 20/10 */}
        <div className="font-['Montserrat',sans-serif] font-extrabold text-[clamp(90px,22vw,220px)] leading-[0.9] my-6 tracking-tight bg-gradient-to-br from-[var(--rose-deep)] via-[var(--rose)] to-[var(--gold)] bg-clip-text text-transparent select-none">
          20<span className="font-light text-[var(--gold)] px-[0.04em]">/</span>10
        </div>

        {/* Calligraphic Heading */}
        <h1 className="font-['Dancing_Script',cursive] font-bold text-[clamp(32px,5.8vw,56px)] leading-[1.2] text-[var(--rose-deep)] m-0 drop-shadow-sm">
          Chúc mừng ngày Phụ nữ Việt Nam
        </h1>

        {/* Recipient */}
        <p className="mt-5 text-[var(--ink-soft)] font-medium text-[clamp(17px,2.4vw,22px)] leading-relaxed min-h-[1.5em] max-w-xl">
          {recipientName ? (
            <>
              Kính gửi <b className="font-['Dancing_Script',cursive] font-bold text-[1.45em] text-[var(--rose)]">{recipientName}</b>
            </>
          ) : (
            'Kính gửi bà, mẹ, vợ yêu, các cô, các thím và các em trong gia đình'
          )}
        </p>

        {/* CTA Button to Letter */}
        <a
          href="#letter"
          onClick={(e) => {
            e.preventDefault();
            onOpenLetterClick();
          }}
          className="mt-8 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-[15px] bg-gradient-to-br from-[var(--rose)] to-[var(--rose-deep)] shadow-[0_14px_30px_-12px_rgba(142,31,63,0.6)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-12px_rgba(142,31,63,0.7)] transition-all cursor-pointer"
        >
          <span>Mở thư chúc mừng gia đình</span>
          <ArrowDown className="w-4 h-4 stroke-[2.4]" />
        </a>
      </div>

      {/* Dripping scroll hint */}
      <div className="scroll-hint-bar absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] text-[var(--ink-soft)] tracking-[0.2em] uppercase select-none pointer-events-none">
        Cuộn xuống
      </div>
    </header>
  );
};
