export async function askAI(prompt){
  if(process.env.AI_MOCK==='true'){
    if(prompt.includes('INTERVIEW_QUESTIONS')) return {questions:[
      'Tell me about yourself and why you are interested in this role.',
      'Describe a challenge you faced and how you solved it.',
      'Which skills make you a strong candidate for this position?',
      'How do you approach learning an unfamiliar tool or process?',
      'What would you like to achieve in your first 90 days?'
    ]};
    return {summary:'Motivated candidate with a foundation in the listed education and skills, eager to contribute, learn and grow in the target role.',
      bullets:['Applied relevant skills through academic and practical learning.','Demonstrated communication, problem-solving and a willingness to learn.','Built foundational knowledge aligned with the target role.']};
  }
  if(!process.env.AI_API_KEY) throw new Error('AI_API_KEY is missing. Add a key or set AI_MOCK=true for local testing.');
  const response=await fetch(process.env.AI_API_URL||'https://api.openai.com/v1/chat/completions',{
    method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.AI_API_KEY}`},
    body:JSON.stringify({model:process.env.AI_MODEL||'gpt-4o-mini',temperature:0.6,response_format:{type:'json_object'},messages:[
      {role:'system',content:'You are a professional career coach. Return only valid JSON. Do not invent qualifications or work experience.'},
      {role:'user',content:prompt}
    ]})
  });
  const data=await response.json();
  if(!response.ok) throw new Error(data.error?.message||'AI provider request failed');
  try{return JSON.parse(data.choices[0].message.content);}catch{throw new Error('AI returned invalid JSON. Please retry.');}
}
