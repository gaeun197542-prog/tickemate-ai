import Anthropic from '@anthropic-ai/sdk'

interface UserInput {
  concert: string
  platform: string
  nationality: string
  timezone: string
  ticketingTime: string
  concertDate: string
  weverseNname: string
  nolName: string
  yes24Name: string
  cards: string[]
  passportExpiry: string
  experience: string
  language: string
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response('Missing ANTHROPIC_API_KEY in environment', { status: 500 })
  }

  const { userInput } = (await request.json()) as { userInput: UserInput }

  const client = new Anthropic({ apiKey })

  const prompt = `You are TickeMate AI, a K-POP concert ticketing strategy advisor for international fans.

Write a personalized ticketing strategy report in ${userInput.language}, formatted in Markdown using "##" section headings and "-" bullet lists.

## Fan Details
- Concert: ${userInput.concert}
- Platform: ${userInput.platform}
- Concert date: ${userInput.concertDate || 'not specified'}
- Ticketing opens: ${userInput.ticketingTime} KST
- Fan's timezone: ${userInput.timezone}
- Nationality: ${userInput.nationality}
- Passport expiry: ${userInput.passportExpiry || 'not specified'}
- Ticketing experience: ${userInput.experience}
- Account names — Weverse: "${userInput.weverseNname}", NOL/Interpark: "${userInput.nolName}", Yes24: "${userInput.yes24Name}"
- Payment cards available: ${userInput.cards.length ? userInput.cards.join(', ') : 'none specified'}

Cover the following sections:
## Account Check
Flag any mismatches between the account names above and explain why exact name matching matters.

## Timing Strategy
Convert the ticketing open time to the fan's local timezone and give a preparation timeline.

## Payment Strategy
Recommend the best card(s) from the list for this platform, with a fallback order if a card is declined.

## Risk Check
Flag passport expiry issues (international travel typically needs 6+ months validity) and any other risks for this fan's situation.

## Action Checklist
A short, ordered checklist of what to do before, during, and after the ticketing window.

Keep it concise, practical, and encouraging.`

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: 'claude-opus-4-8',
          max_tokens: 4096,
          thinking: { type: 'adaptive' },
          messages: [{ role: 'user', content: prompt }],
        })

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }

        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
