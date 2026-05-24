'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const performances = [
  { id: 'bts', label: 'BTS — Permission to Dance On Stage', venue: '서울올림픽주경기장' },
  { id: 'blackpink', label: 'BLACKPINK World Tour [BORN PINK]', venue: '고척스카이돔' },
  { id: 'newjeans', label: 'NewJeans Fan Meeting Bunnies Camp', venue: '잠실실내체육관' },
  { id: 'txt', label: 'TXT World Tour ACT : PROMISE', venue: '인스파이어 아레나' },
  { id: 'ive', label: 'IVE 1ST WORLD TOUR "SHOW WHAT I HAVE"', venue: '올림픽공원 KSPO돔' },
]

const cards = [
  { id: 'visa-us', label: 'Visa US', bank: 'Chase Sapphire', flag: '🇺🇸', last4: '4242' },
  { id: 'mc-kr', label: 'Mastercard KR', bank: 'KB국민카드', flag: '🇰🇷', last4: '8821' },
  { id: 'visa-jp', label: 'Visa JP', bank: 'Rakuten Card', flag: '🇯🇵', last4: '5566' },
]

const selectClass =
  'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all ' +
  'appearance-none cursor-pointer'

export default function BookingPage() {
  const router = useRouter()
  const [performance, setPerformance] = useState(performances[0].id)
  const [seats, setSeats] = useState(1)
  const [selectedCards, setSelectedCards] = useState<string[]>(['visa-us'])

  function toggleCard(id: string) {
    setSelectedCards((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  const selectedPerf = performances.find((p) => p.id === performance)!

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#0F1B35' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎫</span>
          <span className="text-lg font-bold text-sky-400 tracking-tight">TicketMate AI</span>
        </div>
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          ← 뒤로
        </button>
      </header>

      {/* Progress steps */}
      <div className="flex items-center justify-center gap-2 pt-8 pb-2 px-6">
        {['공연 설정', 'AI 분석', '예매 실행'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full
              ${i === 0 ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-600 border border-white/5'}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold
                ${i === 0 ? 'bg-sky-500 text-white' : 'bg-white/10 text-slate-500'}`}>{i + 1}</span>
              {s}
            </div>
            {i < 2 && <span className="text-slate-700 text-xs">—</span>}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-8 sm:px-10 max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-white mb-2">공연 설정</h1>
        <p className="text-slate-400 text-sm mb-8">예매할 공연과 좌석, 결제 카드를 선택하세요.</p>

        {/* 공연 선택 */}
        <section className="mb-6 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">공연 선택</h2>
          <div className="relative">
            <select
              className={selectClass}
              value={performance}
              onChange={(e) => setPerformance(e.target.value)}
            >
              {performances.map((p) => (
                <option key={p.id} value={p.id} style={{ background: '#162040' }}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          {selectedPerf && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span>📍</span>
              <span>{selectedPerf.venue}</span>
            </div>
          )}
        </section>

        {/* VIP 인원 */}
        <section className="mb-6 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">VIP석 인원</h2>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setSeats(n)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all duration-150
                  ${seats === n
                    ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/30'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-sky-500/30 hover:text-white'
                  }`}
              >
                {n}명
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-600">VIP석 · 인당 ₩220,000 기준</p>
        </section>

        {/* 해외 카드 선택 */}
        <section className="mb-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">해외 카드 선택</h2>
          <p className="text-xs text-slate-600 mb-4">최대 3종 · 결제 실패 시 순서대로 Fallback 시도</p>
          <div className="flex flex-col gap-3">
            {cards.map((card) => {
              const active = selectedCards.includes(card.id)
              const order = selectedCards.indexOf(card.id)
              return (
                <button
                  key={card.id}
                  onClick={() => toggleCard(card.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-150
                    ${active
                      ? 'border-sky-500/40 bg-sky-500/10 ring-1 ring-sky-500/20'
                      : 'border-white/8 bg-white/[0.02] hover:border-white/20'
                    }`}
                >
                  <span className="text-2xl">{card.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{card.label}</div>
                    <div className="text-xs text-slate-500">{card.bank} •••• {card.last4}</div>
                  </div>
                  {active && (
                    <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                      {order + 1}
                    </span>
                  )}
                  {!active && (
                    <span className="w-6 h-6 rounded-full border border-white/10 bg-white/5" />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <Link
          href="/agent"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-lg text-white
            bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500
            shadow-lg shadow-sky-500/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          AI 분석 시작 →
        </Link>

        <p className="text-center text-xs text-slate-700 mt-3">
          선택한 {selectedCards.length}개 카드로 자동 예매를 시작합니다
        </p>
      </div>
    </main>
  )
}
