import React, { useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { LETTER_PRESETS, LetterPreset } from '../data/wishes';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  senderName: string;
  setSenderName: (name: string) => void;
  currentPreset: LetterPreset;
  setCurrentPreset: (preset: LetterPreset) => void;
  toast: (msg: string) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  setRecipientName,
  senderName,
  setSenderName,
  currentPreset,
  setCurrentPreset,
  toast,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    if (recipientName.trim()) {
      url.searchParams.set('to', recipientName.trim());
    } else {
      url.searchParams.delete('to');
    }
    if (senderName.trim()) {
      url.searchParams.set('from', senderName.trim());
    } else {
      url.searchParams.delete('from');
    }

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      toast('Đã sao chép liên kết thiệp cá nhân hóa!');
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/45 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[var(--paper)] rounded-2xl border border-[var(--line)] shadow-2xl p-6 sm:p-7 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[var(--ink-soft)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 text-[var(--rose)] mb-2">
          <Sparkles className="w-5 h-5 text-[var(--gold)]" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Cá nhân hóa thiệp 20/10
          </span>
        </div>
        <h3 className="font-['Montserrat',sans-serif] font-bold text-2xl text-[var(--rose-deep)] mb-1">
          Tạo thiệp gửi gia đình
        </h3>
        <p className="text-sm text-[var(--ink-soft)] mb-5">
          Nhập tên để trang thiệp hiển thị riêng biệt và tạo đường link đặc biệt gửi tặng bà, mẹ, cô, thím và các em ngay!
        </p>

        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--rose-deep)] uppercase tracking-wider mb-1.5">
              Gửi tới (Tên người nhận)
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="VD: Bà và Mẹ, Mẹ kính yêu, Cô Lan, Thím Mai, Em gái..."
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--rose)] text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--rose-deep)] uppercase tracking-wider mb-1.5">
              Người gửi (Chữ ký / Lời chúc từ)
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="VD: Vũ Mạnh Quang, Con trai Quang, Cháu Quang..."
              maxLength={50}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-white text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--rose)] text-sm transition-all"
            />
          </div>

          {/* Letter Presets */}
          <div>
            <label className="block text-xs font-semibold text-[var(--rose-deep)] uppercase tracking-wider mb-2">
              Chọn mẫu thư gia đình
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {LETTER_PRESETS.map((preset) => {
                const active = currentPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setCurrentPreset(preset);
                      if (!senderName) setSenderName(preset.signature1);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      active
                        ? 'bg-[var(--rose)] text-white border-[var(--rose)] shadow-sm'
                        : 'bg-white text-[var(--ink-soft)] border-[var(--line)] hover:border-[var(--rose)]'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 pt-4 border-t border-[var(--line)] flex flex-wrap gap-3 items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold bg-gradient-to-r from-[var(--rose)] to-[var(--rose-deep)] shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
            <span>{copiedLink ? 'Đã sao chép link' : 'Sao chép link gửi'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-[var(--rose-deep)] bg-white border border-[var(--line)] hover:bg-black/5 transition-colors cursor-pointer"
          >
            Xong & Xem thiệp
          </button>
        </div>
      </div>
    </div>
  );
};
