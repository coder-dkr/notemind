// KeraMind Cognitive Engine
// Handles concept extraction, bias detection, and contradiction detection

export interface ExtractedConcept {
  type: 'belief' | 'goal' | 'fear' | 'value' | 'assumption' | 'decision' | 'intention';
  content: string;
  confidence: number;
  importance: number;
}

export interface DetectedBias {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string;
}

export interface DetectedContradiction {
  concept1: string;
  concept2: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface CognitiveAnalysis {
  concepts: ExtractedConcept[];
  emotionalTone: string;
  biases: DetectedBias[];
  contradictions: DetectedContradiction[];
  suggestedReflections: string[];
  summary: string;
}

const COGNITIVE_ANALYSIS_PROMPT = `You are KeraMind's cognitive analysis engine. Analyze the user's thought and extract structured cognitive data.

Given the following thought, analyze it and return a JSON object with:

1. "concepts": Array of extracted concepts, each with:
   - "type": One of "belief", "goal", "fear", "value", "assumption", "decision", "intention"
   - "content": The concept in clear, concise form
   - "confidence": 0.0-1.0 how confident the concept is expressed
   - "importance": 1-10 how central this is to the thought

2. "emotionalTone": The overall emotional quality (e.g., "anxious", "hopeful", "uncertain", "confident", "frustrated", "curious")

3. "biases": Array of detected cognitive biases, each with:
   - "type": Name of the bias (e.g., "confirmation bias", "sunk cost fallacy", "availability heuristic")
   - "description": Brief explanation of how it appears
   - "severity": "low", "medium", or "high"
   - "evidence": Quote or paraphrase from the text

4. "contradictions": Array of internal contradictions, each with:
   - "concept1": First conflicting idea
   - "concept2": Second conflicting idea
   - "explanation": Why these conflict
   - "severity": "low", "medium", or "high"

5. "suggestedReflections": Array of 2-3 thoughtful questions to help the user think deeper

6. "summary": A 2-3 sentence summary of the thought's main themes

Be thorough but precise. Only extract concepts that are clearly present. Only flag biases with clear evidence.

Respond ONLY with valid JSON, no markdown or explanation.`;

export async function analyzeThought(thought: string): Promise<CognitiveAnalysis | null> {
  const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('DeepSeek API key is not configured');
    return null;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: COGNITIVE_ANALYSIS_PROMPT },
          { role: 'user', content: thought }
        ],
        temperature: 0.3,
        max_tokens: 2000,
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
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error('No content in response');
      return null;
    }

    // Parse the JSON response
    const analysis = JSON.parse(content) as CognitiveAnalysis;
    return analysis;
  } catch (error) {
    console.error('Error analyzing thought:', error);
    return null;
  }
}

// Detect contradictions between existing nodes and new thought
export async function detectCrossContradictions(
  existingConcepts: ExtractedConcept[],
  newThought: string
): Promise<DetectedContradiction[]> {
  const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
  
  if (!apiKey || existingConcepts.length === 0) {
    return [];
  }

  const existingConceptsText = existingConcepts
    .map(c => `[${c.type}] ${c.content}`)
    .join('\n');

  const prompt = `Given the user's existing beliefs and goals:
${existingConceptsText}

And their new thought:
"${newThought}"

Identify any contradictions between their existing concepts and this new thought.
Return a JSON array of contradictions, each with:
- "concept1": The existing concept
- "concept2": The conflicting part of the new thought
- "explanation": Why these conflict
- "severity": "low", "medium", or "high"

If there are no contradictions, return an empty array [].
Respond ONLY with valid JSON.`;

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return [];
    }

    return JSON.parse(content) as DetectedContradiction[];
  } catch (error) {
    console.error('Error detecting cross-contradictions:', error);
    return [];
  }
}

// Generate summary for a thought
export async function summarizeThought(thought: string): Promise<string | null> {
  const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('DeepSeek API key is not configured');
    return null;
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { 
            role: 'system', 
            content: 'Summarize the following thought in 2-3 concise sentences, capturing the key themes and emotions.' 
          },
          { role: 'user', content: thought }
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Error summarizing thought:', error);
    return null;
  }
}

// Get node color based on type
export function getNodeColor(type: ExtractedConcept['type']): string {
  const colors: Record<ExtractedConcept['type'], string> = {
    belief: '#8B5CF6', // Purple
    goal: '#10B981', // Green
    fear: '#EF4444', // Red
    value: '#F59E0B', // Amber
    assumption: '#6366F1', // Indigo
    decision: '#3B82F6', // Blue
    intention: '#EC4899', // Pink
  };
  return colors[type];
}

// Get edge color based on type
export function getEdgeColor(type: 'supports' | 'conflicts' | 'causes' | 'depends_on' | 'related_to'): string {
  const colors = {
    supports: '#10B981', // Green
    conflicts: '#EF4444', // Red
    causes: '#F59E0B', // Amber
    depends_on: '#6366F1', // Indigo
    related_to: '#9CA3AF', // Gray
  };
  return colors[type];
}
