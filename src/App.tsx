import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RoseDefs } from './components/RoseDefs';
import { Cover } from './components/Cover';
import { Hero } from './components/Hero';
import { EnvelopeSection } from './components/EnvelopeSection';
import { AiWishesSection } from './components/AiWishesSection';
import { Toolbar } from './components/Toolbar';
import { Footer } from './components/Footer';
import { PersonalizeModal } from './components/PersonalizeModal';
import { musicBox } from './utils/audio';
import { initPetalsCanvas, initFxCanvas, ParticleFx } from './utils/particles';
import { LETTER_PRESETS, LetterPreset } from './data/wishes';

export default function App() {
  // Query parameters: ?to=... and ?from=...
  const [recipientName, setRecipientName] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('to') || '').trim().slice(0, 40);
  });

  const [senderName, setSenderName] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return (params.get('from') || 'Vũ Mạnh Quang').trim().slice(0, 50);
  });

  const [currentPreset, setCurrentPreset] = useState<LetterPreset>(LETTER_PRESETS[0]);
  const [isCoverOpen, setIsCoverOpen] = useState<boolean>(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isAutoScroll, setIsAutoScroll] = useState<boolean>(false);
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const petalsCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fxRef = useRef<ParticleFx | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Auto-scroll state
  const autoScrollRef = useRef({
    on: false,
    raf: 0,
    last: 0,
    pos: 0,
    held: false,
    pausedUntil: 0,
    SPEED: 38, // px per second
  });

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  // Initialize petals and fireworks canvas
  useEffect(() => {
    let cleanPetals: (() => void) | undefined;
    if (petalsCanvasRef.current) {
      cleanPetals = initPetalsCanvas(petalsCanvasRef.current);
    }
    if (fxCanvasRef.current) {
      fxRef.current = initFxCanvas(fxCanvasRef.current);
    }

    return () => {
      if (cleanPetals) cleanPetals();
      musicBox.pause();
    };
  }, []);

  // Update document title if recipient is set
  useEffect(() => {
    if (recipientName) {
      document.title = `Gửi ${recipientName} · Vũ Mạnh Quang kính chúc 20/10`;
    } else {
      document.title = 'Chúc mừng 20/10 · Vũ Mạnh Quang kính chúc gia đình';
    }
  }, [recipientName]);

  // Click anywhere on screen (outside interactive elements) to spray heart glitter
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, .envelope, textarea, [role="button"]')) {
        return;
      }
      if (fxRef.current) {
        fxRef.current.spray(e.clientX, e.clientY, 8);
      }
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Auto-scroll loop
  const autoStep = useCallback((now: number) => {
    const auto = autoScrollRef.current;
    if (!auto.on) return;

    const dt = auto.last ? Math.min((now - auto.last) / 1000, 0.1) : 0.016;
    auto.last = now;

    // Detect external manual scroll
    if (Math.abs(window.scrollY - auto.pos) > 2) {
      auto.pos = window.scrollY;
      auto.pausedUntil = performance.now() + 150;
    }

    if (!auto.held && performance.now() >= auto.pausedUntil) {
      auto.pos += auto.SPEED * dt;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (auto.pos >= maxScroll) {
        window.scrollTo({ top: maxScroll, behavior: 'instant' as ScrollBehavior });
        auto.on = false;
        setIsAutoScroll(false);
        return;
      }

      window.scrollTo({ top: auto.pos, behavior: 'instant' as ScrollBehavior });

      // Auto-open envelope when it enters middle of screen
      const envEl = document.getElementById('envelope');
      if (envEl && !envEl.classList.contains('open')) {
        const r = envEl.getBoundingClientRect();
        if (r.top + r.height / 2 < window.innerHeight * 0.58) {
          handleOpenEnvelope();
        }
      }
    } else {
      auto.pos = window.scrollY;
    }

    auto.raf = requestAnimationFrame(autoStep);
  }, []);

  const toggleAutoScroll = useCallback(() => {
    const auto = autoScrollRef.current;
    auto.on = !auto.on;
    setIsAutoScroll(auto.on);
    cancelAnimationFrame(auto.raf);

    if (auto.on) {
      auto.pos = window.scrollY;
      auto.last = 0;
      auto.pausedUntil = 0;
      auto.raf = requestAnimationFrame(autoStep);
      showToast('Đang tự cuộn trang');
    } else {
      showToast('Đã tắt tự cuộn');
    }
  }, [autoStep, showToast]);

  // Touch and wheel pause for auto-scroll
  useEffect(() => {
    const press = () => {
      autoScrollRef.current.held = true;
      autoScrollRef.current.pos = window.scrollY;
    };
    const release = () => {
      autoScrollRef.current.held = false;
      autoScrollRef.current.pos = window.scrollY;
    };
    const nudge = () => {
      autoScrollRef.current.pausedUntil = performance.now() + 250;
      autoScrollRef.current.pos = window.scrollY;
    };

    window.addEventListener('mousedown', press, { passive: true });
    window.addEventListener('touchstart', press, { passive: true });
    window.addEventListener('mouseup', release, { passive: true });
    window.addEventListener('touchend', release, { passive: true });
    window.addEventListener('touchcancel', release, { passive: true });
    window.addEventListener('wheel', nudge, { passive: true });
    window.addEventListener('keydown', nudge, { passive: true });

    return () => {
      window.removeEventListener('mousedown', press);
      window.removeEventListener('touchstart', press);
      window.removeEventListener('mouseup', release);
      window.removeEventListener('touchend', release);
      window.removeEventListener('touchcancel', release);
      window.removeEventListener('wheel', nudge);
      window.removeEventListener('keydown', nudge);
    };
  }, []);

  // Music toggle
  const toggleMusic = useCallback(async () => {
    if (isPlayingMusic) {
      musicBox.pause();
      setIsPlayingMusic(false);
    } else {
      await musicBox.play();
      setIsPlayingMusic(true);
    }
  }, [isPlayingMusic]);

  // Open Cover handler
  const handleOpenCover = useCallback(async () => {
    if (isCoverOpen) return;
    setIsCoverOpen(true);

    // Play music box
    try {
      await musicBox.play();
      setIsPlayingMusic(true);
    } catch {
      // Ignored if browser blocks
    }

    // Launch initial opening fireworks
    if (fxRef.current) {
      const [W, H] = fxRef.current.getSize();
      fxRef.current.explode(W / 2, H * 0.4, fxRef.current.palettes[0], 1.3);

      setTimeout(() => {
        fxRef.current?.rocket(W * 0.2, H, W * 0.25, H * 0.25);
      }, 250);

      setTimeout(() => {
        fxRef.current?.rocket(W * 0.8, H, W * 0.75, H * 0.22);
      }, 450);

      fxRef.current.balloons(12);
    }

    // Optionally auto-scroll after a short delay
    setTimeout(() => {
      const auto = autoScrollRef.current;
      auto.on = true;
      setIsAutoScroll(true);
      auto.pos = window.scrollY;
      auto.last = 0;
      auto.raf = requestAnimationFrame(autoStep);
    }, 2400);
  }, [isCoverOpen, autoStep]);

  // Open Envelope handler
  const handleOpenEnvelope = useCallback(
    (coords?: { x: number; y: number }) => {
      if (isEnvelopeOpen) return;
      setIsEnvelopeOpen(true);
      musicBox.playChime();

      if (fxRef.current) {
        const x = coords?.x ?? window.innerWidth / 2;
        const y = coords?.y ?? window.innerHeight / 2;
        fxRef.current.explode(x, y, fxRef.current.palettes[1], 1.1);
        fxRef.current.spray(x, y, 14);
      }

      // Smooth scroll to letter
      setTimeout(() => {
        const letterEl = document.getElementById('letterBody');
        if (letterEl) {
          letterEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 700);
    },
    [isEnvelopeOpen]
  );

  // Shoot Hearts button launcher
  const handleShootHearts = useCallback((light = false) => {
    if (!fxRef.current) return;
    const [W, H] = fxRef.current.getSize();
    const btnEl = document.getElementById('tHeart');
    const r = btnEl?.getBoundingClientRect();
    const x0 = r ? r.left + r.width / 2 : W / 2;
    const y0 = r ? r.top : H - 50;

    const n = light ? 2 : Math.min(3 + Math.floor(Math.random() * 3), 7);
    const scale = light ? 1 : 1.25;

    for (let i = 0; i < n; i++) {
      const tx = W * (0.12 + 0.76 * ((i + Math.random() * 0.8) / n));
      const ty = H * (0.14 + Math.random() * 0.3);
      setTimeout(() => {
        fxRef.current?.rocket(x0 + (Math.random() - 0.5) * 20, y0, tx, ty, undefined, scale);
      }, i * 110);
    }

    fxRef.current.spray(x0, y0, light ? 3 : 6);
  }, []);

  const effectiveSenderBadge = senderName || currentPreset.badge;

  return (
    <div className="relative min-h-screen font-sans selection:bg-[var(--rose)] selection:text-white">
      {/* SVG Rose Definitions */}
      <RoseDefs />

      {/* Falling Petals Background Canvas */}
      <canvas
        ref={petalsCanvasRef}
        id="petals"
        className="fixed inset-0 w-full h-full pointer-events-none z-[5]"
        aria-hidden="true"
      />

      {/* Fireworks & Hearts Effects Canvas */}
      <canvas
        ref={fxCanvasRef}
        id="fx"
        className="fixed inset-0 w-full h-full pointer-events-none z-[35]"
        aria-hidden="true"
      />

      {/* Cover Tap-to-open screen */}
      <Cover
        isCoverOpen={isCoverOpen}
        onOpen={handleOpenCover}
        recipientName={recipientName}
        senderBadge={effectiveSenderBadge}
      />

      {/* Floating Toolbar & Vinyl Disc (visible after cover is opened) */}
      {isCoverOpen && (
        <Toolbar
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={toggleMusic}
          isAutoScroll={isAutoScroll}
          onToggleAutoScroll={toggleAutoScroll}
          onShootHearts={handleShootHearts}
          onOpenPersonalize={() => setIsPersonalizeOpen(true)}
          toast={showToast}
        />
      )}

      {/* Hero Section */}
      <Hero
        senderBadge={effectiveSenderBadge}
        recipientName={recipientName}
        onOpenLetterClick={() => {
          const letterEl = document.getElementById('letter');
          letterEl?.scrollIntoView({ behavior: 'smooth' });
          if (!isEnvelopeOpen) {
            setTimeout(handleOpenEnvelope, 600);
          }
        }}
      />

      {/* 3D Envelope & Stationery Letter */}
      <EnvelopeSection
        isEnvelopeOpen={isEnvelopeOpen}
        onOpenEnvelope={handleOpenEnvelope}
        preset={currentPreset}
        recipientName={recipientName}
        senderName={senderName || currentPreset.signature1}
      />

      {/* AI Wishes Generator Console */}
      <AiWishesSection
        recipientName={recipientName}
        senderName={senderName || currentPreset.signature1}
        onCopySuccess={showToast}
      />

      {/* Footer */}
      <Footer senderBadge={effectiveSenderBadge} />

      {/* Personalize & Share Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        recipientName={recipientName}
        setRecipientName={setRecipientName}
        senderName={senderName}
        setSenderName={setSenderName}
        currentPreset={currentPreset}
        setCurrentPreset={setCurrentPreset}
        toast={showToast}
      />

      {/* Floating Toast Notification */}
      <div
        className={`fixed left-1/2 bottom-20 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-white text-sm font-medium bg-[var(--ink)] shadow-xl transition-all duration-300 pointer-events-none ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {toastMessage}
      </div>
    </div>
  );
}
