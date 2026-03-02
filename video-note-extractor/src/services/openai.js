import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // OK for learning, use a backend in production
});

// Helper to stream responses and update state live
async function streamPrompt(prompt, onChunk) {
  const stream = await client.chat.completions.create({
    model: 'gpt-4o-mini',   // cheap and fast, swap to gpt-4o for better quality
    max_tokens: 3000,
    stream: true,
    messages: [{ role: 'user', content: prompt }],
  });

  let full = '';
  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    full += text;
    onChunk(full);  // update state on every chunk → live typing effect
  }
  return full;
}

export async function generateNotes(transcript, onChunk) {
  return streamPrompt(`
    You are an expert note-taker. Analyze this video transcript and create organized notes.
    Use ## for sections, ### for sub-sections, and bullet points for details.
    
    TRANSCRIPT:
    ${transcript}
  `, onChunk);
}

export async function generateTimestamps(segments, onChunk) {
  const text = segments.map(s => `[${s.start}s] ${s.text}`).join('\n');
  return streamPrompt(`
    From this transcript with timestamps, identify the 10 most important moments.
    Format each as: [MM:SS] - What happens here
    Sort chronologically.
    
    TRANSCRIPT:
    ${text}
  `, onChunk);
}

export async function generateActions(transcript, onChunk) {
  return streamPrompt(`
    Extract all action items, tasks, and next steps from this transcript.
    Format as a checklist using ☐ for each item.
    Group them under headings like: ## Immediate Actions, ## To Learn, ## Resources
    
    TRANSCRIPT:
    ${transcript}
  `, onChunk);
}

export async function askQuestion(transcript, question, onChunk) {
  return streamPrompt(`
    Answer this question about the video based only on the transcript below.
    Reference timestamps when possible using [MM:SS] format.
    
    QUESTION: ${question}
    
    TRANSCRIPT:
    ${transcript}
  `, onChunk);
}