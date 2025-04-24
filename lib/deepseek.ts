// DeepSeek API client for summarizing text
export async function summarizeText(text: string): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) {
    console.error('DeepSeek API key is not configured');
    return null;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        max_length: 250,
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
    return data.summary;
  } catch (error) {
    console.error('Error summarizing text:', error);
    return null;
  }
}