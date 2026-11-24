import Profile from '../models/Profile.js';
import Generation from '../models/Generation.js';
import {askAI} from '../services/aiService.js';
export async function createResume(req,res,next){try{
  const profile=await Profile.findOne({user:req.user._id});
  if(!profile) return res.status(400).json({message:'Please save your profile before generating a resume'});
  const prompt=`Create resume content as JSON with keys summary (string) and bullets (array of 3-6 concise strings). Use only these facts; do not invent details.\nName: ${req.user.name}\nEducation: ${profile.education.join('; ')}\nSkills: ${profile.skills.join(', ')}\nExperience: ${profile.experience.join('; ')}\nTarget role: ${profile.targetRole}`;
  const result=await askAI(prompt);
  if(typeof result.summary!=='string'||!Array.isArray(result.bullets)) throw new Error('AI response must contain summary and bullets');
  const saved=await Generation.create({user:req.user._id,type:'resume',role:profile.targetRole,inputSnapshot:profile.toObject(),result});
  res.status(201).json({message:'Resume content generated',generation:saved});
}catch(e){next(e);}}
export async function createInterview(req,res,next){try{
  const role=(req.body.role||'').trim();
  if(!role) return res.status(400).json({message:'Please provide a job role'});
  if(role.length>100) return res.status(400).json({message:'Role must be 100 characters or fewer'});
  const profile=await Profile.findOne({user:req.user._id});
  const prompt=`INTERVIEW_QUESTIONS Generate 5 role-specific interview questions as JSON: {"questions":[...]}. Role: ${role}. Candidate skills: ${(profile?.skills||[]).join(', ')}. Questions should be practical and clear.`;
  const result=await askAI(prompt);
  if(!Array.isArray(result.questions)) throw new Error('AI response must contain a questions array');
  const saved=await Generation.create({user:req.user._id,type:'interview',role,inputSnapshot:{skills:profile?.skills||[]},result});
  res.status(201).json({message:'Interview questions generated',generation:saved});
}catch(e){next(e);}}
export async function history(req,res,next){try{
  const page=Math.max(1,Number(req.query.page)||1),limit=Math.min(50,Math.max(1,Number(req.query.limit)||10));
  const [items,total]=await Promise.all([Generation.find({user:req.user._id}).sort({createdAt:-1}).skip((page-1)*limit).limit(limit),Generation.countDocuments({user:req.user._id})]);
  res.json({items,total,page,pages:Math.ceil(total/limit)});
}catch(e){next(e);}}
