// MCC Master - Netlify Function
// Proxies requests to GAS API, with direct Anthropic support when API key is set

const GAS_API = process.env.GAS_API_URL || 'https://script.google.com/macros/s/AKfycbwiWFvnhP4nEHzHnNXIJoap33t-Es_RAJLWYn3RJwRcKGzQJG5kI3eB-Wk139V0sfhHT6/exec';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

// Functions that can be handled directly with Anthropic API
const AI_FUNCTIONS = new Set([
  'analyzeQuizResults',
  'submitDiagnosis',
  'debriefPatientBot',
  'generateCaseDebrief',
  'askDrData',
  'startPatientBotCase',
  'sendPatientBotMessage'
]);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

async function callAnthropic(systemPrompt, messages, model = 'claude-haiku-4-5-20251001', maxTokens = 2048) {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages
    })
  });
  const json = await resp.json();
  if (json.error) throw new Error(json.error.message);
  return json.content[0].text;
}

// Direct AI implementations (used when ANTHROPIC_API_KEY is set)
async function handleAnalyzeQuizResults(args) {
  const [quizDetails] = args;
  const specScores = {};
  const wrongTopics = [];
  for (const d of quizDetails) {
    const spec = d.specialty || 'General';
    if (!specScores[spec]) specScores[spec] = { correct: 0, total: 0 };
    specScores[spec].total++;
    if (d.isCorrect) specScores[spec].correct++;
    else wrongTopics.push(spec + ': ' + (d.question || '').substring(0, 100));
  }

  const totalCorrect = quizDetails.filter(d => d.isCorrect).length;
  const totalQ = quizDetails.length;
  const pct = Math.round((totalCorrect / totalQ) * 100);

  let prompt = `A medical student just completed a practice quiz for MCCQE Part I.\n\nScore: ${totalCorrect}/${totalQ} (${pct}%)\n\nSpecialty breakdown:\n`;
  for (const spec in specScores) {
    const s = specScores[spec];
    prompt += `- ${spec}: ${s.correct}/${s.total} (${Math.round((s.correct / s.total) * 100)}%)\n`;
  }
  if (wrongTopics.length > 0) {
    prompt += '\nQuestions they got wrong:\n';
    for (let i = 0; i < Math.min(wrongTopics.length, 10); i++) {
      prompt += '- ' + wrongTopics[i] + '\n';
    }
  }
  prompt += '\nGive a brief, encouraging 3-4 sentence study recommendation. Be specific about which topics to review. Do NOT use bullet points. Do NOT list every specialty. Focus on the 1-2 weakest areas and give a concrete study tip. Keep it under 80 words.';

  const recommendation = await callAnthropic('', [{ role: 'user', content: prompt }], 'claude-haiku-4-5-20251001', 200);
  return { recommendation, weakAreas: [] };
}

async function handleSubmitDiagnosis(args) {
  const [caseId, userDiagnosis, correctDiagnosis, history] = args;
  // Try to get case data from the client-sent context
  const isCheatMode = false; // No server-side cache in Netlify

  const checkPrompt = 'You are a medical exam grader. The student submitted a diagnosis for a clinical case.\n\n' +
    'Correct diagnosis: ' + correctDiagnosis + '\n' +
    'Student answer: ' + userDiagnosis + '\n' +
    '\nEvaluate how close the student\'s answer is to the correct diagnosis. Consider:\n' +
    '- Accept reasonable variations, abbreviations, and synonyms.\n' +
    '- Score 80-100 if essentially correct.\n' +
    '- Score 40-79 if partially correct.\n' +
    '- Score 0-39 if wrong.\n\n' +
    'IMPORTANT: Your feedback should NOT reveal the correct diagnosis.\n' +
    'Respond with ONLY a JSON object:\n' +
    '{"score": <0-100>, "correct": true/false, "feedback": "<brief feedback WITHOUT revealing the answer>"}';

  const response = await callAnthropic('You are a medical exam grading assistant. Respond only with valid JSON.', [{ role: 'user', content: checkPrompt }]);
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      const score = result.score || 0;
      const isCorrect = score >= 80 || result.correct === true;
      return { correct: isCorrect, score, feedback: result.feedback, cheatMode: false };
    }
  } catch (e) {}
  // Fallback
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isCorrect = norm(correctDiagnosis).includes(norm(userDiagnosis)) || norm(userDiagnosis).includes(norm(correctDiagnosis));
  return { correct: isCorrect, score: isCorrect ? 100 : 0, feedback: isCorrect ? 'Correct!' : "That's not the diagnosis for this presentation." };
}

async function handleDebriefPatientBot(args) {
  const [caseId, history] = args;
  let transcript = '';
  if (history && history.length > 0) {
    for (const h of history) {
      if (h.role === 'user') transcript += 'STUDENT: ' + h.content + '\n';
      else if (h.role === 'assistant') transcript += 'PATIENT: ' + h.content + '\n';
      else if (h.role === 'system') transcript += '[CONSEQUENCE: ' + h.content + ']\n';
      else if (h.role === 'results') transcript += '[TEST RESULTS: ' + JSON.stringify(h.content) + ']\n';
    }
  }

  // Try to get diagnosis from history context
  let diagnosis = 'Unknown';
  // Look for diagnosis in the first assistant message (it usually contains the case JSON)
  if (history && history.length > 0) {
    for (const h of history) {
      if (h.diagnosis) { diagnosis = h.diagnosis; break; }
    }
  }

  const prompt = 'You are a clinical teaching debrief assistant. A medical student just finished a simulated patient encounter.\n\n' +
    'CORRECT DIAGNOSIS: ' + diagnosis + '\n\n' +
    'TRANSCRIPT:\n' + transcript + '\n\n' +
    'Provide a debrief. Respond with ONLY a JSON object:\n' +
    '{"diagnosis": "' + diagnosis + '", "score": <1-10>, "feedback": "<2-4 sentences>", "callouts": "<anything funny or dangerous>"}';

  try {
    const response = await callAnthropic(prompt, [{ role: 'user', content: 'Generate the debrief.' }], 'claude-haiku-4-5-20251001');
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
  } catch (e) {}
  return { diagnosis, score: 0, feedback: 'Could not generate debrief.', callouts: '' };
}

async function handleGenerateCaseDebrief(args) {
  const [caseId, history] = args;
  let transcript = '';
  let diagnosis = 'unknown';
  if (history && history.length > 0) {
    for (const h of history) {
      if (h.role === 'user') transcript += 'STUDENT: ' + h.content + '\n';
      else if (h.role === 'assistant') transcript += 'PATIENT: ' + h.content + '\n';
      else if (h.role === 'system') transcript += '[CONSEQUENCE: ' + h.content + ']\n';
      else if (h.role === 'results') transcript += '[TEST RESULTS: ' + JSON.stringify(h.content) + ']\n';
      if (h.diagnosis) diagnosis = h.diagnosis;
    }
  }

  const prompt = 'You are an MCCQE Part I examiner scoring a clinical encounter.\n\n' +
    'CORRECT DIAGNOSIS: ' + diagnosis + '\n\n' +
    'Score each domain 0-10:\n' +
    '1. History 2. Physical Exam 3. Investigations 4. Diagnosis 5. Management 6. Communication 7. Patient Safety\n\n' +
    'GRADE BOUNDARIES:\n- A: avg 8.0-10.0\n- B: avg 6.5-7.9\n- C: avg 5.0-6.4\n- D: avg 3.5-4.9\n- F: avg 0-3.4\n\n' +
    'TRANSCRIPT:\n' + transcript + '\n\n' +
    'Be HARSH but fair. Return ONLY JSON:\n' +
    '{"scores": {"history": N, "exam": N, "investigations": N, "diagnosis": N, "management": N, "communication": N, "safety": N}, ' +
    '"overall": N, "grade": "A/B/C/D/F", "strengths": ["..."], "improvements": ["..."], "missed": ["..."], "examTip": "..."}';

  try {
    const response = await callAnthropic(prompt, [{ role: 'user', content: 'Score this encounter.' }], 'claude-sonnet-4-20250514');
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      if (result.scores) {
        const s = result.scores;
        const avg = ((s.history||0)+(s.exam||0)+(s.investigations||0)+(s.diagnosis||0)+(s.management||0)+(s.communication||0)+(s.safety||0)) / 7;
        result.overall = Math.round(avg * 10) / 10;
        if (avg >= 8.0) result.grade = 'A';
        else if (avg >= 6.5) result.grade = 'B';
        else if (avg >= 5.0) result.grade = 'C';
        else if (avg >= 3.5) result.grade = 'D';
        else result.grade = 'F';
      }
      return result;
    }
  } catch (e) {}
  return { scores: { history:0,exam:0,investigations:0,diagnosis:0,management:0,communication:0,safety:0 }, overall:0, grade:'F', strengths:[], improvements:['Could not generate scorecard.'], missed:[] };
}

// Direct Anthropic handler map
const AI_HANDLERS = {
  analyzeQuizResults: handleAnalyzeQuizResults,
  submitDiagnosis: handleSubmitDiagnosis,
  debriefPatientBot: handleDebriefPatientBot,
  generateCaseDebrief: handleGenerateCaseDebrief,
};

// Proxy to GAS API
async function proxyToGAS(fn, args) {
  const resp = await fetch(GAS_API, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ fn, args })
  });
  if (!resp.ok) throw new Error('GAS API error: ' + resp.status);
  const data = await resp.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

export default async (req, context) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: CORS_HEADERS
    });
  }

  try {
    const body = await req.json();
    const { fn, args = [] } = body;

    if (!fn) {
      return new Response(JSON.stringify({ error: 'Missing function name' }), {
        status: 400, headers: CORS_HEADERS
      });
    }

    let result;

    // Use direct Anthropic if API key is set and function has a handler
    if (ANTHROPIC_API_KEY && AI_HANDLERS[fn]) {
      try {
        result = await AI_HANDLERS[fn](args);
      } catch (e) {
        // Fall back to GAS on error
        console.error(`Direct AI failed for ${fn}, falling back to GAS:`, e.message);
        result = await proxyToGAS(fn, args);
      }
    } else {
      // Proxy everything else to GAS
      result = await proxyToGAS(fn, args);
    }

    return new Response(JSON.stringify({ result }), {
      status: 200, headers: CORS_HEADERS
    });
  } catch (e) {
    console.error('API error:', e);
    return new Response(JSON.stringify({ error: e.message || 'Internal error' }), {
      status: 500, headers: CORS_HEADERS
    });
  }
};

export const config = {
  path: "/.netlify/functions/api"
};
