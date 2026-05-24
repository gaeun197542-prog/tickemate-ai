'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const STEPS = [
  { key: 'input',   label: '입력',    icon: '📋' },
  { key: 'collect', label: '정보수집', icon: '🔍' },
  { key: 'predict', label: '예측',    icon: '🧠' },
  { key: 'execute', label: '실행',    icon: '⚡' },
  { key: 'fallback',label: 'Fallback',icon: '🔄' },
  { key: 'done',    label: '완료',    icon: '✅' },
]

type LogEntry = { step: string; message: string; time: string; type?: 'normal' | 'warn' | 'success' }

const TIMELINE: Array<{ stepIdx: number; delay: number; msg: string; type?: LogEntry['type'] }> = [
  { stepIdx: 0, delay: 0,    msg: '사용자 설정 확인 완료 — BTS World Tour, VIP 2석' },
  { stepIdx: 1, delay: 900,  msg: '티켓링크 공연 정보 수집 중...' },
  { stepIdx: 1, delay: 1800, msg: '잔여 VIP석 확인 → 42석 남음' },
  { stepIdx: 1, delay: 2600, msg: '환율 조회 USD→KRW: 1,347.5원' },
  { stepIdx: 2, delay: 3500, msg: '최적 예매 타이밍 계산 중...' },
  { stepIdx: 2, delay: 4400, msg: 'Visa US 카드 승인 가능성: 91.2%' },
  { stepIdx: 2, delay: 5100, msg: '예매 경로 확정 → 직접 결제 루트' },
  { stepIdx: 3, delay: 6000, msg: '자동 폼 입력 시작...' },
  { stepIdx: 3, delay: 6900, msg: 'Visa US 결제 요청 전송 중...' },
  { stepIdx: 3, delay: 7600, msg: '결제 응답 대기...', type: 'warn' },
  { stepIdx: 3, delay: 8200, msg: 'Visa US 승인 거절 — 해외결제 차단', type: 'warn' },
  { stepIdx: 4, delay: 8500, msg: 'Fallback: Mastercard KR 전환 중... (0.3초)', type: 'warn' },
  { stepIdx: 4, delay: 9200, msg: 'Mastercard KR 결제 재시도...' },
  { stepIdx: 4, delay: 10000,msg: 'Mastercard KR 승인 완료', type: 'success' },
  { stepIdx: 5, delay: 10700,msg: '예매 확정 — 좌석번호 VIP A-12, A-13', type: 'success' },
  { stepIdx: 5, delay: 11400,msg: '정산 리포트 생성 완료', type: 'success' },
]

const typeColor: Record<string, string> = {
  normal:  'text-slate-300',
  warn:    'text-amber-400',
  success: 'text-emerald-400',
}

export default function AgentPage() {
  const router = useRouter()
  const [logs, setLogs]           = useState<LogEntry[]>([])
  const [activeStep, setActiveStep] = useState(0)
  const [showReport, setShowReport] = useState(false)
  const [done, setDone]           = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    TIMELINE.forEach(({ stepIdx, delay, msg, type }) => {
      timers.push(
        setTimeout(() => {
          setActiveStep(stepIdx)
          setLogs((prev) => [
            ...prev,
            { step: STEPS[stepIdx].label, message: msg, time: new Date().toLocaleTimeString('ko-KR', { hour12: false }), type: type ?? 'normal' },
          ])
        }, delay)
      )
    })

    timers.push(setTimeout(() => { setDone(true); setActiveStep(5) }, 11600))
    timers.push(setTimeout(() => setShowReport(true), 12200))

    return () => timers.forEach(clearTimeout)
  }, [])

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

      <div className="flex-1 px-4 py-8 sm:px-10 max-w-3xl mx-auto w-full">
        {/* Step progress */}
        <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => {
              const isActive  = i === activeStep
              const isDone    = i < activeStep || (done && i === activeStep)

              return (
                <div key={s.key} className="flex items-center gap-0">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition-all duration-300
                      ${isDone
                        ? 'bg-sky-500 border-sky-500 text-white'
                        : isActive
                          ? 'bg-sky-500/20 border-sky-500 text-sky-300 animate-pulse'
                          : 'bg-white/5 border-white/10 text-slate-600'
                      }`}>
                      {isDone ? '✓' : s.icon}
                    </div>
                    <span className={`text-[10px] font-medium whitespace-nowrap
                      ${isDone ? 'text-sky-400' : isActive ? 'text-sky-300' : 'text-slate-600'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px w-8 sm:w-12 mb-5 mx-0.5 transition-all duration-500
                      ${i < activeStep ? 'bg-sky-500' : 'bg-white/10'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Log terminal */}
        <div className="rounded-2xl border border-white/8 bg-[#0a1428] overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-slate-500 font-mono">ticketmate-agent — realtime log</span>
            {!done && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-sky-400">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                실행 중
              </span>
            )}
            {done && (
              <span className="ml-auto text-xs text-emerald-400 font-medium">완료</span>
            )}
          </div>
          <div className="p-4 font-mono text-xs min-h-[260px] max-h-[320px] overflow-y-auto space-y-2">
            {logs.length === 0 && (
              <div className="text-slate-700 animate-pulse">AI 에이전트 초기화 중...</div>
            )}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 leading-relaxed">
                <span className="text-slate-600 shrink-0">{log.time}</span>
                <span className="text-sky-600 shrink-0 w-14">[{log.step}]</span>
                <span className={typeColor[log.type ?? 'normal']}>{log.message}</span>
              </div>
            ))}
            {!done && logs.length > 0 && (
              <div className="text-slate-700 animate-pulse">▌</div>
            )}
          </div>
        </div>

        {/* Settlement report */}
        {showReport && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xl">🎉</span>
              <h2 className="text-white font-bold text-lg">예매 완료 — 정산 리포트</h2>
            </div>

            <div className="space-y-0 divide-y divide-white/5">
              {[
                { label: '공연', value: 'BTS World Tour — Permission to Dance' },
                { label: '좌석', value: 'VIP A-12, A-13' },
                { label: '인원', value: '2명' },
                { label: '결제 카드', value: 'Mastercard KR (Fallback)' },
                { label: 'Fallback 전환 시간', value: '0.3초', highlight: true },
                { label: '총 결제금액', value: '₩440,000' },
                { label: '처리 단계', value: `${STEPS.length}단계 완료` },
                { label: '승인 성공률', value: '98.5%', highlight: true },
                { label: '최종 상태', value: '예매 성공', success: true },
              ].map(({ label, value, highlight, success }) => (
                <div key={label} className="flex justify-between items-center py-3">
                  <span className="text-slate-500 text-sm">{label}</span>
                  <span className={`text-sm font-semibold
                    ${success ? 'text-emerald-400' : highlight ? 'text-sky-300' : 'text-white'}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/booking"
                className="flex-1 text-center py-3 rounded-xl border border-white/10 text-sm text-slate-400
                  hover:border-white/20 hover:text-white transition-all"
              >
                새 예매
              </Link>
              <button
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white
                  bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500
                  shadow-lg shadow-sky-500/20 transition-all"
                onClick={() => alert('티켓이 이메일로 발송되었습니다!')}
              >
                티켓 확인 →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
