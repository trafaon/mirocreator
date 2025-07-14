import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface ClaudeRequest {
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

interface ClaudeResponse {
  content: Array<{
    text: string;
    type: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get the Claude API key from environment variables
    const claudeApiKey = Deno.env.get('CLAUDE_API_KEY')
    if (!claudeApiKey) {
      return new Response(
        JSON.stringify({ error: 'Claude API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const { prompt, max_tokens = 4000, temperature = 0.7 }: ClaudeRequest = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Make request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens,
        temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text()
      console.error('Claude API Error:', errorData)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get response from Claude API',
          details: claudeResponse.status === 429 ? 'Rate limit exceeded' : 'API error'
        }),
        { 
          status: claudeResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const claudeData: ClaudeResponse = await claudeResponse.json()
    
    // Extract the text content from Claude's response
    const responseText = claudeData.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('')

    return new Response(
      JSON.stringify({ 
        response: responseText,
        usage: {
          prompt_tokens: prompt.length,
          completion_tokens: responseText.length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Edge Function Error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})