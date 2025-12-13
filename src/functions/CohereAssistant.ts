/*
  CohereAssistant
  - Wrapper for Cohere Chat Completions API
  - Basic sliding-window rate limiter
  - Error handling for HTTP and API errors
  - Uses Vite env variables: VITE_COHERE_API_KEY, VITE_COHERE_MAX_REQUESTS, VITE_COHERE_WINDOW_MS
*/

type CohereMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

type CohereOptions = {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

class RateLimiter {
  private timestamps: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  tryRemoveToken(): boolean {
    const now = Date.now();
    // remove entries out of window
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }
}

function getEnvVar(key: string, fallback?: string): string | undefined {
  // Vite exposes env through import.meta.env
  const val = (import.meta as any).env?.[key];
  if (val !== undefined) return val;
  return fallback;
}

const DEFAULTS = {
  MODEL: 'command-light',
  MAX_REQUESTS: 6,
  WINDOW_MS: 60_000,
  MAX_TOKENS: 256
}

const apiKey = getEnvVar('VITE_COHERE_API_KEY');
const maxRequests = Number(getEnvVar('VITE_COHERE_MAX_REQUESTS', `${DEFAULTS.MAX_REQUESTS}`));
const windowMs = Number(getEnvVar('VITE_COHERE_WINDOW_MS', `${DEFAULTS.WINDOW_MS}`));

const limiter = new RateLimiter(maxRequests, windowMs);

async function cohereChat(messages: CohereMessage[], opts?: CohereOptions) {
  if (!apiKey) throw new Error('Cohere API key not configured. Please set VITE_COHERE_API_KEY in .env');
  if (!limiter.tryRemoveToken()) throw new Error('Rate limit exceeded. Try again later.');

  const body = {
    model: opts?.model ?? DEFAULTS.MODEL,
    messages,
    max_tokens: opts?.max_tokens ?? DEFAULTS.MAX_TOKENS,
    temperature: opts?.temperature ?? 0.2
  };

  const response = await fetch('https://api.cohere.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  let json: any;
  try {
    json = await response.json();
  } catch (err) {
    throw new Error(`Respuesta inválida de Cohere: ${err}`);
  }

  if (!response.ok) {
    const errorMessage = json?.message || json?.detail || `HTTP ${response.status}`;
    throw new Error(`Cohere API error: ${errorMessage}`);
  }

  // The chat API returns at least one completion with message
  const assistantMessage = json?.choices?.[0]?.message?.content ?? json?.output ?? null;
  if (!assistantMessage) throw new Error('Cohere returned no content');
  return assistantMessage as string;
}

export default {
  async queryWeather(city: string, weatherData: any, userPrompt?: string) {
    // Compose a clear system prompt describing behavior
    const systemPrompt = `Eres un asistente experto en meteorología. Respondes preguntas sobre el clima usando los parámetros proporcionados (temperatura, sensibilidad, humedad, viento, etc.).
Proporciona una respuesta clara, concisa y orientada al usuario final. Si la respuesta requiere contexto, pregunta lo necesario.`;

    const dataPrompt = `Ciudad: ${city}\nDatos actuales: ${JSON.stringify(weatherData)}`;
    const userText = userPrompt ?? `Dame un resumen del clima actual y recomendaciones simples para ${city}.`;

    const messages: CohereMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${dataPrompt}\n\nConsulta: ${userText}` }
    ];

    try {
      const reply = await cohereChat(messages);
      return reply;
    } catch (err) {
      throw err;
    }
  },
  // Expose low-level method for flexibility
  rawChat: cohereChat
}

