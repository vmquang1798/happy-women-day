import React from 'react';
import { Music } from 'lucide-react';

interface CoverProps {
  isCoverOpen: boolean;
  onOpen: () => void;
  recipientName: string;
  senderBadge: string;
}

export const Cover: React.FC<CoverProps> = ({
  isCoverOpen,
  onOpen,
  recipientName,
  senderBadge,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Mở thiệp chúc mừng 20/10"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`fixed inset-0 z-50 grid place-items-center text-center p-6 cursor-pointer select-none transition-all duration-800 ${
        isCoverOpen ? 'opacity-0 pointer-events-none invisible' : 'opacity-100'
      }`}
      style={{
        background: `
          radial-gradient(800px 500px at 50% 0%, #ffe1e6 0%, transparent 65%),
          radial-gradient(600px 400px at 50% 100%, var(--gold-soft) 0%, transparent 65%),
          var(--bg)
        `,
      }}
    >
      <div className="max-w-md w-full px-4 flex flex-col items-center">
        {/* Animated Rose */}
        <div className="w-28 sm:w-32 mx-auto mb-2 pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 200 260" className="w-full h-auto animate-[sway_5s_ease-in-out_infinite] origin-[50%_90%]">
            <use href="#rose" />
          </svg>
        </div>

        {/* Sender Eyebrow */}
        <div className="text-[12px] font-semibold tracking-[0.24em] uppercase text-[var(--rose)] mb-3">
          {senderBadge || 'Vũ Mạnh Quang kính chúc'}
        </div>

        {/* Cover Title */}
        <h1 className="font-['Dancing_Script',cursive] font-bold text-[clamp(44px,10vw,72px)] leading-[1.1] text-[var(--rose-deep)] m-0 drop-shadow-sm">
          Thiệp 20/10
        </h1>

        {/* Recipient Line */}
        <p className="mt-3 text-[var(--ink-soft)] text-base sm:text-lg min-h-[1.6em] max-w-sm">
          {recipientName ? (
            <>
              Kính gửi <b className="font-['Dancing_Script',cursive] text-[1.45em] text-[var(--rose)] font-bold">{recipientName}</b>
            </>
          ) : (
            'Kính gửi bà, mẹ, vợ yêu, các cô, các thím và các em trong gia đình'
          )}
        </p>

        {/* Tap to open button */}
        <div className="mt-8 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-[15px] bg-gradient-to-r from-[var(--rose)] to-[var(--rose-deep)] shadow-lg animate-[pulse-ring_1.8s_infinite] transition-transform active:scale-95">
          <Music className="w-4 h-4 fill-white" />
          <span>Chạm để mở thiệp</span>
        </div>

        {/* Hint */}
        <p className="mt-4 text-xs sm:text-sm text-[var(--ink-soft)] opacity-85">
          Bật âm thanh để nghe tiếng nhạc du dương nhé ✨
        </p>
      </div>
    </div>
  );
};
