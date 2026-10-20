import React, { useState, useEffect, useRef } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { WISH_CATEGORIES, getPersonalizedWish } from '../data/wishes';

interface AiWishesSectionProps {
  recipientName: string;
  senderName: string;
  onCopySuccess: (text: string) => void;
}

export const AiWishesSection: React.FC<AiWishesSectionProps> = ({
  recipientName,
  senderName,
  onCopySuccess,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [fullWish, setFullWish] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const typingIdRef = useRef<number>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  const startGeneration = (category = activeCategory) => {
    const id = ++typingIdRef.current;
    setIsGenerating(true);
    setDisplayedText('');

    const targetWish = getPersonalizedWish(category, recipientName);
    setFullWish(targetWish);

    const steps = [
      'Đang đong đếm tình yêu thương…',
      'Đang chọn từ ngữ kính trọng và ấm áp nhất…',
      'Đang gửi gắm ngàn lời chúc bình an và sức khỏe…',
    ];

    let stepIndex = 0;
    setStatusText(steps[0]);

    const statusInterval = setInterval(() => {
      if (id !== typingIdRef.current) {
        clearInterval(statusInterval);
        return;
      }
      stepIndex++;
      if (stepIndex < steps.length) {
        setStatusText(steps[stepIndex]);
      } else {
        clearInterval(statusInterval);
        setIsGenerating(false);

        // Start typing characters
        let charIndex = 0;
        const typeNext = () => {
          if (id !== typingIdRef.current) return;
          charIndex++;
          setDisplayedText(targetWish.slice(0, charIndex));

          if (charIndex < targetWish.length) {
            const ch = targetWish[charIndex - 1];
            const delay = ch === ',' || ch === '.' || ch === ':' || ch === '\n' ? 120 : 20;
            setTimeout(typeNext, delay);
          }
        };
        typeNext();
      }
    }, 380);
  };

  // Intersection observer to auto-start generation when visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          startGeneration(activeCategory);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    startGeneration(catId);
  };

  const handleCopy = () => {
    if (!fullWish) return;
    const attribution = senderName ? ` (${senderName} kính chúc 20/10)` : ' (Vũ Mạnh Quang kính chúc 20/10)';
    const textToCopy = `${fullWish}${attribution}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      onCopySuccess('Đã sao chép lời chúc gia đình thành công!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentCategoryObj = WISH_CATEGORIES.find((c) => c.id === activeCategory) || WISH_CATEGORIES[0];
  const targetRecipientLabel = recipientName || 'bà, mẹ, vợ yêu, cô, thím, các em';

  return (
    <section ref={sectionRef} id="ai" className="relative py-24 px-5 bg-[var(--bg-2)] overflow-hidden">
      <div className="max-w-[1040px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.25fr] gap-10 lg:gap-14 items-center">
        {/* Left Column: Description & Category Chips */}
        <div>
          <div className="text-[12px] font-semibold tracking-[0.24em] uppercase text-[var(--rose)] mb-3">
            Tấm lòng từ Vũ Mạnh Quang
          </div>
          <h2 className="font-['Montserrat',sans-serif] font-extrabold text-[clamp(28px,4.5vw,44px)] leading-[1.15] text-[var(--rose-deep)] mb-4">
            Lời chúc gửi trọn yêu thương
          </h2>
          <p className="text-[var(--ink-soft)] text-base sm:text-lg leading-relaxed mb-6">
            Chọn một chủ đề yêu thương, những câu chúc chân thành nhất sẽ được gửi gắm tới bà, mẹ, vợ yêu, các cô, các thím và các em trong gia đình.
          </p>

          {/* Chips */}
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Chủ đề lời chúc">
            {WISH_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  aria-pressed={isSelected}
                  className={`px-4 py-2 rounded-full border text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--rose)] text-white border-[var(--rose)] shadow-sm'
                      : 'bg-white text-[var(--rose-deep)] border-[var(--line)] hover:bg-[var(--rose)]/10 hover:border-[var(--rose)]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sleek Terminal Console */}
        <div className="rounded-2xl bg-[#2a1219] text-[#fbe9ec] shadow-[var(--shadow)] border border-white/10 overflow-hidden font-sans">
          {/* Mac Console Title Bar */}
          <div className="flex items-center gap-2 px-4 py-3.5 bg-white/[0.04] border-b border-white/[0.08] text-xs text-[#d9a9b4] select-none">
            <i className="w-2.5 h-2.5 rounded-full bg-[#e05a7a] inline-block" />
            <i className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] inline-block" />
            <i className="w-2.5 h-2.5 rounded-full bg-[#8fc6a0] inline-block" />
            <span className="ml-2 font-mono tracking-wide text-white/80">vu-manh-quang / loi-chuc-gia-dinh-2010</span>
          </div>

          {/* Console Body */}
          <div className="p-6 sm:p-7 min-h-[300px] flex flex-col justify-between">
            <div>
              {/* Code command */}
              <div className="font-mono text-xs sm:text-[13px] text-[#c88b99] leading-relaxed break-all">
                &gt; generate(
                <span className="text-[#ffd0dc]">dịp</span>=
                <span className="text-[var(--gold-soft)] font-medium">"20/10"</span>,{' '}
                <span className="text-[#ffd0dc]">gửi</span>=
                <span className="text-[var(--gold-soft)] font-medium">"{targetRecipientLabel}"</span>,{' '}
                <span className="text-[#ffd0dc]">chủ đề</span>=
                <span className="text-[var(--gold-soft)] font-medium">"{currentCategoryObj.shortLabel}"</span>
                )
              </div>

              {/* Status Indicator */}
              <div
                className={`mt-3.5 flex items-center gap-2.5 text-xs sm:text-[13px] text-[#d9a9b4] transition-opacity ${
                  isGenerating ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e05a7a] animate-[bounce_1.2s_infinite]" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#e05a7a] animate-[bounce_1.2s_infinite]"
                    style={{ animationDelay: '0.15s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#e05a7a] animate-[bounce_1.2s_infinite]"
                    style={{ animationDelay: '0.3s' }}
                  />
                </span>
                <span>{statusText}</span>
              </div>

              {/* Typed Wish Output */}
              <div className="mt-4 flex-1 font-medium text-[clamp(16px,2vw,19px)] leading-relaxed text-[#fff3f5] whitespace-pre-line min-h-[100px]">
                {displayedText}
                <span className="inline-block w-0.5 h-[1.15em] bg-[var(--gold)] align-[-2px] ml-1 animate-[blink_1s_steps(1)_infinite]" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => startGeneration(activeCategory)}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs sm:text-[14px] font-semibold bg-gradient-to-r from-[var(--rose)] to-[var(--rose-deep)] shadow-md hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Lời chúc khác</span>
              </button>

              <button
                onClick={handleCopy}
                disabled={!fullWish || isGenerating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[#fbe9ec] text-xs sm:text-[14px] font-semibold bg-white/10 border border-white/20 hover:bg-white/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
