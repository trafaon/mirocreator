const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ClaudeApiResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
  };
  error?: string;
  message?: string;
  details?: string;
}

export class ClaudeApiError extends Error {
  constructor(message: string, public status?: number, public details?: string) {
    super(message);
    this.name = 'ClaudeApiError';
  }
}

export const callClaudeApi = async (
  prompt: string, 
  options: {
    max_tokens?: number;
    temperature?: number;
  } = {}
): Promise<string> => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new ClaudeApiError('Supabase configuration is missing');
  }

  const apiUrl = `${SUPABASE_URL}/functions/v1/claude-chat`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        max_tokens: options.max_tokens || 4000,
        temperature: options.temperature || 0.7
      })
    });

    const data: ClaudeApiResponse = await response.json();

    if (!response.ok) {
      throw new ClaudeApiError(
        data.error || 'Failed to get response from Claude API',
        response.status,
        data.details
      );
    }

    if (data.error) {
      throw new ClaudeApiError(data.error, undefined, data.details);
    }

    return data.response;
  } catch (error) {
    if (error instanceof ClaudeApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ClaudeApiError(
      `Network error: ${error.message}`,
      undefined,
      'Check your internet connection and try again'
    );
  }
};