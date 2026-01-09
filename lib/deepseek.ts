// DeepSeek API client for summarizing text
// Note: This is kept for backward compatibility but the new cognitive-engine.ts is preferred
export async function summarizeText(text: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
    console.error('DeepSeek API key is not configured');
    return null;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: 'Summarize the following thought in 2-3 concise sentences, capturing the key themes and insights.' 
          },
          { role: 'user', content: text }
        ],
        temperature: 0.5,
        max_tokens: 250,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('DeepSeek API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Error summarizing text:', error);
    return null;
  }
}