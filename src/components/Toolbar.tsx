import React, { useState, useRef } from 'react';
import { Heart, ArrowDown, Disc, Sparkles, Share2 } from 'lucide-react';

interface ToolbarProps {
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  isAutoScroll: boolean;
  onToggleAutoScroll: () => void;
  onShootHearts: (light?: boolean) => void;
  onOpenPersonalize: () => void;
  toast: (msg: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isPlayingMusic,
  onToggleMusic,
  isAutoScroll,
  onToggleAutoScroll,
  onShootHearts,
  onOpenPersonalize,
  toast,
}) => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [isAutoFire, setIsAutoFire] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);

  const holdTimerRef = useRef<number | null>(null);
  const autoFireIntervalRef = useRef<number | null>(null);
  const comboTimerRef = useRef<number | null>(null);
  const skipClickRef = useRef<boolean>(false);

  // Auto fire toggle
  const setAutoFireMode = (on: boolean) => {
    if (autoFireIntervalRef.current) {
      clearInterval(autoFireIntervalRef.current);
      autoFireIntervalRef.current = null;
    }

    setIsAutoFire(on);

    if (on) {
      autoFireIntervalRef.current = window.setInterval(() => {
        if (!document.hidden) {
          onShootHearts(true);
        }
      }, 1100);
      toast('Đang tự động bắn tim ✨ Chạm để dừng');
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isAutoFire || e.button > 0) return;
    skipClickRef.current = false;
    setIsHolding(true);

    holdTimerRef.current = window.setTimeout(() => {
      setIsHolding(false);
      skipClickRef.current = true;
      setAutoFireMode(true);
      onShootHearts(true);
    }, 2000);
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
  };

  const handleHeartClick = () => {
    if (skipClickRef.current) {
      skipClickRef.current = false;
      return;
    }

    if (isAutoFire) {
      setAutoFireMode(false);
      toast('Đã tắt tự động bắn tim');
      return;
    }

    // Increase combo
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = window.setTimeout(() => {
      setCombo(0);
    }, 1400);

    onShootHearts(false);
  };

  return (
    <>
      {/* Vinyl Disc Toggle Button (Fixed top right) */}
      <button
        onClick={onToggleMusic}
        aria-label="Bật/tắt nhạc du dương"
        title={isPlayingMusic ? 'Tạm dừng nhạc' : 'Phát nhạc du dương'}
        className={`disc-btn ${isPlayingMusic ? 'playing' : ''}`}
      >
        <Disc className="relative z-10 w-5 h-5 text-[var(--gold-soft)]" />
      </button>

      {/* Bottom Floating Toolbar */}
      <nav
        aria-label="Thanh công cụ chúc mừng"
        className="fixed left-0 right-0 bottom-4 z-40 flex justify-center items-center pointer-events-none px-4"
      >
        <div className="relative w-full max-w-md flex items-center justify-center">
          {/* Left: Personalize / Share modal button */}
          <button
            onClick={onOpenPersonalize}
            title="Cá nhân hóa & Tạo thiệp gửi bạn bè"
            aria-label="Cá nhân hóa thiệp"
            className="pointer-events-auto absolute left-2 sm:left-4 bottom-1 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[var(--line)] bg-white/90 backdrop-blur-md text-[var(--rose-deep)] shadow-[0_10px_24px_-10px_rgba(142,31,63,0.4)] hover:bg-white active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-[var(--gold)]" />
          </button>

          {/* Center: Heart Rocket Launcher Button ("Bắn tim") */}
          <button
            id="tHeart"
            onClick={handleHeartClick}
            onPointerDown={handlePointerDown}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={(e) => e.preventDefault()}
            title="Chạm để bắn tim · Giữ 2 giây để tự động bắn"
            className={`pointer-events-auto btn-heart-fill relative overflow-hidden select-none touch-manipulation px-6 sm:px-8 py-3.5 rounded-full text-white font-semibold text-sm sm:text-[15px] flex items-center gap-2.5 transition-all cursor-pointer shadow-lg active:scale-95 ${
              isHolding ? 'holding' : ''
            } ${
              isAutoFire
                ? 'bg-gradient-to-r from-[var(--gold)] to-[#a8742a]'
                : 'bg-gradient-to-r from-[var(--rose)] to-[var(--rose-deep)]'
            }`}
          >
            <Heart
              className={`w-5 h-5 fill-white ${
                isAutoFire ? 'animate-[beat_0.9s_ease-in-out_infinite]' : ''
              }`}
            />
            <span className="relative z-10">
              {isAutoFire ? 'Tự động bắn tim' : combo > 1 ? `Bắn tim (x${combo})` : 'Bắn tim'}
            </span>
          </button>

          {/* Right: Auto-scroll button ("Tự cuộn") */}
          <button
            id="tAuto"
            onClick={onToggleAutoScroll}
            title="Tự động cuộn trang"
            aria-pressed={isAutoScroll}
            aria-label="Tự động cuộn"
            className={`pointer-events-auto absolute right-2 sm:right-4 bottom-1 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[var(--line)] backdrop-blur-md shadow-[0_10px_24px_-10px_rgba(142,31,63,0.4)] active:scale-95 transition-all flex items-center justify-center cursor-pointer ${
              isAutoScroll
                ? 'bg-[var(--rose)] text-white border-transparent'
                : 'bg-white/90 text-[var(--rose-deep)] hover:bg-white'
            }`}
          >
            <ArrowDown
              className={`w-5 h-5 stroke-[2.2] ${isAutoScroll ? 'animate-[nudge-down_1.6s_ease-in-out_infinite]' : ''}`}
            />
          </button>
        </div>
      </nav>
    </>
  );
};
