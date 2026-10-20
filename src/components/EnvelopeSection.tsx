import React, { useRef } from 'react';
import { LetterPreset } from '../data/wishes';

interface EnvelopeSectionProps {
  isEnvelopeOpen: boolean;
  onOpenEnvelope: (coords?: { x: number; y: number }) => void;
  preset: LetterPreset;
  recipientName: string;
  senderName: string;
}

export const EnvelopeSection: React.FC<EnvelopeSectionProps> = ({
  isEnvelopeOpen,
  onOpenEnvelope,
  preset,
  recipientName,
  senderName,
}) => {
  const envRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const handleEnvelopeClick = (e: React.MouseEvent) => {
    if (isEnvelopeOpen) return;
    const rect = envRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : e.clientX;
    const y = rect ? rect.top + rect.height / 3 : e.clientY;
    onOpenEnvelope({ x, y });
  };

  const greetingText = recipientName
    ? `Kính gửi ${recipientName},`
    : preset.greeting;

  const introText = recipientName
    ? preset.intro.replace(/bà, mẹ, vợ yêu, các cô, các thím, cùng toàn thể các em/g, recipientName)
                  .replace(/bà, mẹ, các cô, các thím, cùng toàn thể các em/g, recipientName)
                  .replace(/bà, mẹ, các cô, các thím và các em/g, recipientName)
    : preset.intro;

  const closingText = recipientName
    ? preset.closing.replace(/bà, mẹ, các cô, các thím và các em/g, recipientName)
    : preset.closing;

  return (
    <section id="letter" className="relative py-24 px-5 bg-gradient-to-b from-[var(--bg)] to-[var(--bg-2)] overflow-hidden">
      <div className="max-w-[1040px] mx-auto text-center">
        {/* Section header */}
        <div className="text-[12px] font-semibold tracking-[0.24em] uppercase text-[var(--rose)] mb-3">
          Một lá thư chân tình
        </div>
        <h2 className="font-['Montserrat',sans-serif] font-extrabold text-[clamp(28px,5vw,46px)] leading-[1.15] text-[var(--rose-deep)] mb-4">
          Gửi những người phụ nữ yêu thương trong gia đình
        </h2>
        <p className="max-w-[660px] mx-auto text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed">
          Nhân ngày 20/10, con/cháu/chồng/anh xin gửi trọn tấm lòng biết ơn, sự kính trọng và thương yêu sâu sắc nhất tới bà, mẹ, vợ yêu, các cô, các thím và các em gái. Mời mọi người mở lá thư này nhé!
        </p>

        {/* 3D Folding Envelope */}
        <div
          ref={envRef}
          role="button"
          tabIndex={0}
          aria-label="Mở lá thư"
          onClick={handleEnvelopeClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleEnvelopeClick(e as unknown as React.MouseEvent);
            }
          }}
          className={`envelope ${isEnvelopeOpen ? 'open' : ''} select-none`}
        >
          <div className="env-back" />
          <div className="env-card leading-tight">
            Kính gửi
            <br />
            {recipientName ? recipientName : 'Bà, Mẹ, Vợ yêu, Cô, Thím & Các Em'}
          </div>
          <div className="env-front" />
          <div className="env-flap" />
          <div className="seal">20·10</div>
        </div>

        {/* Envelope Tip */}
        <p className="text-sm text-[var(--ink-soft)] mt-5 transition-opacity">
          {isEnvelopeOpen ? '✨ Thư đã mở, mời mọi người đọc bên dưới' : '✉️ Chạm vào phong bì để mở thư'}
        </p>
      </div>

      {/* Unfolded Letter Stationery Paper */}
      <div
        ref={letterRef}
        id="letterBody"
        className={`letter-wrapper ${isEnvelopeOpen ? 'show' : ''}`}
      >
        <div className="paper max-w-2xl mx-auto my-6">
          {/* Greeting */}
          <h3 className="font-['Dancing_Script',cursive] font-bold text-[clamp(25px,4.2vw,36px)] leading-snug text-[var(--rose-deep)] mb-5">
            {greetingText}
          </h3>

          {/* Intro */}
          <p className="text-[var(--ink)] leading-relaxed mb-4 text-base sm:text-[17px]">
            {introText}
          </p>

          {/* Highlight / Gratitude */}
          <p className="text-[var(--ink)] leading-relaxed mb-4 text-base sm:text-[17px]">
            {preset.highlight}
          </p>

          {/* Vietnamese Lục Bát Poem */}
          <div className="poem-box">
            {preset.poem.map((pair, index) => (
              <React.Fragment key={index}>
                <span className="block pl-4 sm:pl-7">{pair.l6}</span>
                <span className="block">{pair.l8}</span>
              </React.Fragment>
            ))}
          </div>

          {/* Closing */}
          <p className="text-[var(--ink)] leading-relaxed mb-6 text-base sm:text-[17px]">
            {closingText}
          </p>

          {/* Signature */}
          <div className="text-right mt-7 pt-4 border-t border-[var(--line)]">
            <div className="font-['Dancing_Script',cursive] font-bold text-2xl sm:text-3xl text-[var(--rose)]">
              {senderName || preset.signature1}
            </div>
            <div className="text-xs sm:text-[13px] text-[var(--ink-soft)] tracking-wider uppercase mt-1">
              {preset.signature2}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
