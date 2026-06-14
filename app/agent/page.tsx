'use client';

// app/agent/page.tsx
import { useState } from 'react';
import Link from 'next/link';

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface UserInput {
  concert: string;
  platform: string;
  nationality: string;
  timezone: string;
  ticketingTime: string;
  concertDate: string;
  weverseNname: string;
  nolName: string;
  yes24Name: string;
  cards: string[];
  passportExpiry: string;
  experience: string;
  language: string;
}

type Step = 'form' | 'analyzing' | 'done';

// ── 상수 ──────────────────────────────────────────────────────────────────────
const CONCERTS = [
  'BTS — 2026 ARIRANG World Tour',
  'BLACKPINK World Tour',
  'NewJeans Fan Meeting',
  'TXT World Tour ACT : PROMISE',
  'IVE 1ST WORLD TOUR',
  'Other',
];

const PLATFORMS = ['NOL (Interpark)', 'Yes24', 'Melon Ticket', 'Ticketlink'];

const CARDS = [
  'Visa (US)',
  'Visa (JP)',
  'Visa (CN)',
  'Visa (EU)',
  'Mastercard (US)',
  'Mastercard (EU)',
  'UnionPay (CN)',
  'Amex',
  'KB국민카드 (KR)',
  'Kakao Pay (KR)',
];

const TIMEZONES = [
  { label: 'UTC-8 Los Angeles', value: 'America/Los_Angeles' },
  { label: 'UTC-5 New York', value: 'America/New_York' },
  { label: 'UTC+0 London', value: 'Europe/London' },
  { label: 'UTC+1 Paris', value: 'Europe/Paris' },
  { label: 'UTC+5:30 Mumbai', value: 'Asia/Kolkata' },
  { label: 'UTC+7 Bangkok', value: 'Asia/Bangkok' },
  { label: 'UTC+8 Beijing', value: 'Asia/Shanghai' },
  { label: 'UTC+8 Singapore', value: 'Asia/Singapore' },
  { label: 'UTC+9 Tokyo', value: 'Asia/Tokyo' },
  { label: 'UTC+9 Seoul', value: 'Asia/Seoul' },
];

const ANALYSIS_STEPS = [
  { id: 1, label: '입력 수집', icon: '📋' },
  { id: 2, label: '계정 점검', icon: '🔍' },
  { id: 3, label: '결제 분석', icon: '💳' },
  { id: 4, label: '전략 수립', icon: '🧠' },
  { id: 5, label: '리스크 평가', icon: '⚠️' },
  { id: 6, label: '리포트 완성', icon: '✅' },
];

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export default function AgentPage() {
  const [step, setStep] = useState<Step>('form');
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState(0);
  const [result, setResult] = useState('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const [form, setForm] = useState<UserInput>({
    concert: CONCERTS[0],
    platform: PLATFORMS[0],
    nationality: '',
    timezone: 'Asia/Seoul',
    ticketingTime: '20:00',
    concertDate: '',
    weverseNname: '',
    nolName: '',
    yes24Name: '',
    cards: [],
    passportExpiry: '',
    experience: 'first time',
    language: 'English',
  });

  // 카드 토글
  const toggleCard = (card: string) => {
    setSelectedCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  };

  // Agent 실행
  const runAgent = async () => {
    setStep('analyzing');
    setResult('');

    const userInput = { ...form, cards: selectedCards };

    // 단계별 타이밍 시뮬레이션
    const stepTimings = [300, 600, 900, 1200, 1500];
    stepTimings.forEach((delay, i) => {
      setTimeout(() => setCurrentAnalysisStep(i + 1), delay);
    });

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setResult(accumulated);
      }

      setCurrentAnalysisStep(6);
      setTimeout(() => setStep('done'), 500);
    } catch (err) {
      setResult('⚠️ Error generating strategy. Please check your API key and try again.');
      setStep('done');
    }
  };

  // ── 폼 화면 ────────────────────────────────────────────────────────────────
  if (step === 'form') {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* 헤더 */}
        <header className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
          <Link href="/" className="text-white/50 hover:text-white text-sm">
            ← Back
          </Link>
          <span className="text-lg font-semibold">🎫 TickeMate AI</span>
          <span className="ml-2 text-xs bg-purple-600 px-2 py-0.5 rounded-full">
            Strategy Advisor
          </span>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold mb-2">My Ticketing Setup</h1>
          <p className="text-white/50 text-sm mb-8">
            Fill in your details. AI will analyze your situation and create a
            personalized strategy.
          </p>

          <div className="space-y-8">
            {/* 공연 정보 */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                Concert Info
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Concert</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                    value={form.concert}
                    onChange={(e) => setForm({ ...form, concert: e.target.value })}
                  >
                    {CONCERTS.map((c) => (
                      <option key={c} value={c} className="bg-black">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">Platform</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.platform}
                      onChange={(e) => setForm({ ...form, platform: e.target.value })}
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p} value={p} className="bg-black">
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Concert Date
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.concertDate}
                      onChange={(e) => setForm({ ...form, concertDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Ticketing Open (KST)
                    </label>
                    <input
                      type="time"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.ticketingTime}
                      onChange={(e) =>
                        setForm({ ...form, ticketingTime: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      My Timezone
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.timezone}
                      onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value} className="bg-black">
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* 계정 이름 - 핵심 섹션 */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">
                Account Names
              </h2>
              <p className="text-xs text-amber-400 mb-4">
                ⚠️ Must match exactly across all platforms — including capitalization and
                spacing
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Weverse Name', key: 'weverseNname' },
                  { label: 'NOL / Interpark Name', key: 'nolName' },
                  { label: 'Yes24 Name', key: 'yes24Name' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="block text-sm text-white/70 mb-1">{label}</label>
                    <input
                      type="text"
                      placeholder="e.g. LEE GAEUN"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-purple-500"
                      value={form[key as keyof UserInput] as string}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 결제 카드 */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                My Cards (select all you have)
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {CARDS.map((card) => (
                  <button
                    key={card}
                    onClick={() => toggleCard(card)}
                    className={`px-3 py-2 rounded-lg text-sm text-left border transition-all ${
                      selectedCards.includes(card)
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                    }`}
                  >
                    {card}
                  </button>
                ))}
              </div>
            </section>

            {/* 기타 정보 */}
            <section>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                Additional Info
              </h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chinese, American"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Passport Expiry
                    </label>
                    <input
                      type="date"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.passportExpiry}
                      onChange={(e) =>
                        setForm({ ...form, passportExpiry: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Experience
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.experience}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    >
                      <option value="first time" className="bg-black">
                        First time
                      </option>
                      <option value="tried before, failed" className="bg-black">
                        Tried before, failed
                      </option>
                      <option value="occasional" className="bg-black">
                        Occasional
                      </option>
                      <option value="experienced" className="bg-black">
                        Experienced
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-1">
                      Report Language
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      value={form.language}
                      onChange={(e) => setForm({ ...form, language: e.target.value })}
                    >
                      {['English', 'Chinese', 'Japanese', 'Spanish', 'Korean'].map(
                        (l) => (
                          <option key={l} value={l} className="bg-black">
                            {l}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <button
              onClick={runAgent}
              disabled={!form.nationality}
              className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-base transition-all"
            >
              🧠 Generate My Strategy →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 분석 중 화면 ────────────────────────────────────────────────────────────
  if (step === 'analyzing') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <header className="border-b border-white/10 px-6 py-4">
          <span className="text-lg font-semibold">🎫 TickeMate AI</span>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* 진행 단계 */}
          <div className="flex items-center gap-2 mb-12">
            {ANALYSIS_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex flex-col items-center transition-all duration-500 ${
                    i < currentAnalysisStep
                      ? 'opacity-100'
                      : i === currentAnalysisStep
                        ? 'opacity-100 scale-110'
                        : 'opacity-30'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1 transition-all duration-500 ${
                      i < currentAnalysisStep
                        ? 'bg-purple-600'
                        : i === currentAnalysisStep
                          ? 'bg-purple-500 ring-2 ring-purple-300 ring-offset-2 ring-offset-black'
                          : 'bg-white/10'
                    }`}
                  >
                    {i < currentAnalysisStep ? '✓' : s.icon}
                  </div>
                  <span className="text-[10px] text-white/50 text-center w-14 leading-tight">
                    {s.label}
                  </span>
                </div>
                {i < ANALYSIS_STEPS.length - 1 && (
                  <div
                    className={`w-6 h-px mx-1 mb-5 transition-all duration-500 ${
                      i < currentAnalysisStep ? 'bg-purple-600' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* 실시간 스트리밍 결과 */}
          {result && (
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-xl p-6 max-h-96 overflow-y-auto">
              <pre className="text-sm text-white/80 whitespace-pre-wrap font-sans leading-relaxed">
                {result}
                <span className="inline-block w-2 h-4 bg-purple-400 animate-pulse ml-0.5 align-middle" />
              </pre>
            </div>
          )}

          {!result && (
            <p className="text-white/40 text-sm animate-pulse">
              AI analyzing your situation...
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── 완료 화면 ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold">🎫 TickeMate AI</span>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setStep('form');
              setResult('');
              setCurrentAnalysisStep(0);
            }}
            className="text-sm text-white/50 hover:text-white px-4 py-2 border border-white/10 rounded-lg"
          >
            ← New Analysis
          </button>
          <button
            onClick={() => {
              const blob = new Blob([result], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'tickemate-strategy.md';
              a.click();
            }}
            className="text-sm bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg"
          >
            ↓ Save Report
          </button>
        </div>
      </header>

      {/* 완료 배지 */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-sm">
            ✓
          </div>
          <div>
            <p className="font-semibold">Strategy Ready</p>
            <p className="text-xs text-white/40">Personalized for your situation</p>
          </div>
        </div>

        {/* 마크다운 렌더링 */}
        <div
          className="prose prose-invert prose-sm max-w-none bg-white/5 border border-white/10 rounded-xl p-6
                     [&>h2]:text-purple-400 [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3
                     [&>ul]:space-y-1 [&>ul>li]:text-white/80
                     [&>p]:text-white/70 [&>p]:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: markdownToHtml(result),
          }}
        />
      </div>
    </div>
  );
}

// ── 간단한 마크다운 → HTML 변환 ───────────────────────────────────────────────
function markdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/^(?!<[hul]).+$/gm, (m) => (m.trim() ? `<p>${m}</p>` : ''))
    .replace(/✅|⚠️|🔍|💳|⏰/g, (e) => `<span>${e}</span>`);
}
