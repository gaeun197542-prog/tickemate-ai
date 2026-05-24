import Link from 'next/link'

const features = [
  { icon: '⚡', title: '실시간 예매', desc: 'AI가 티켓 오픈 순간을 포착해 즉시 예매합니다' },
  { icon: '🌍', title: '해외 카드 지원', desc: 'Visa·Mastercard 등 해외 카드로 결제 완료' },
  { icon: '🔄', title: 'Fallback 시스템', desc: '결제 실패 시 0.3초 내 대체 카드로 자동 전환' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#0F1B35' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎫</span>
          <span className="text-lg font-bold text-sky-400 tracking-tight">TicketMate AI</span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full border border-sky-500/30 text-sky-400 bg-sky-500/10">
          Beta
        </span>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          AI 자동 예매 시스템 가동 중
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6 max-w-3xl">
          K-POP 콘서트 티켓,{' '}
          <span className="gradient-text">AI가 대신 잡아드립니다</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed">
          외국인 K-POP 팬을 위한 완전 자동 티켓 예매 서비스.<br />
          공연·좌석·카드만 설정하면 AI가 나머지를 처리합니다.
        </p>

        <Link
          href="/booking"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-lg text-white
            bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500
            shadow-lg shadow-sky-500/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          예매 시작하기 →
        </Link>

        <p className="mt-4 text-slate-600 text-sm">신용카드 정보는 암호화되어 안전하게 처리됩니다</p>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 sm:px-10">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 flex flex-col gap-3
                hover:border-sky-500/20 hover:bg-sky-500/5 transition-all duration-200"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8 text-slate-700 text-xs">
        © 2026 TicketMate AI — Powered by Claude AI
      </footer>
    </main>
  )
}
