import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY in environment' }, { status: 500 })
  }

  const body = await request.json()
  const { performance, seatType, count } = body as {
    performance: string
    seatType: string
    count: number
  }

  const prompt = `You are a K-POP ticket reservation assistant for international fans. Generate a short performance report for the selected concert. Include:
1) A brief overview of the performance,
2) Why this performance is a good match for foreign K-POP fans,
3) A short travel or ticket recommendation.

Performance: ${performance}
Seat type: ${seatType}
Ticket count: ${count}

Return the response in Korean with clear headings and concise bullet-style sentences.`

  const response = await fetch('https://api.anthropic.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-3.5-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that writes short concert reports for foreign K-POP fans.' },
        { role: 'user', content: prompt },
      ],
      max_tokens_to_sample: 300,
      temperature: 0.2,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return NextResponse.json({ error: 'Claude API error', details: errorText }, { status: response.status })
  }

  const data = await response.json()
  const completion = data?.completion || data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''
  return NextResponse.json({ report: completion })
}
