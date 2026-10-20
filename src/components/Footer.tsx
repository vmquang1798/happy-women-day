import React from 'react';
import { Heart } from 'lucide-react';

interface FooterProps {
  senderBadge: string;
}

export const Footer: React.FC<FooterProps> = ({ senderBadge }) => {
  return (
    <footer className="py-12 px-5 text-center text-sm text-[var(--ink-soft)] bg-[var(--bg-2)] border-t border-[var(--line)]">
      <div className="font-['Montserrat',sans-serif] font-extrabold text-xl text-[var(--rose-deep)] tracking-wide mb-2">
        {senderBadge || 'Vũ Mạnh Quang'} <em className="not-italic text-[var(--gold)]">·</em> Gia Đình Yêu Thương
      </div>
      <p className="flex items-center justify-center gap-1.5 text-sm">
        <span>Kính chúc ngày Phụ nữ Việt Nam 20/10</span>
        <Heart className="w-3.5 h-3.5 fill-[var(--rose)] text-[var(--rose)] inline-block" />
        <span>2026</span>
      </p>
    </footer>
  );
};
