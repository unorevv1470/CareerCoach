import Profile from '../models/Profile.js';
export async function getProfile(req,res,next){try{const profile=await Profile.findOne({user:req.user._id});res.json({profile});}catch(e){next(e);}}
export async function saveProfile(req,res,next){try{
  const {education=[],skills=[],experience=[],targetRole=''}=req.body;
  for(const field of [education,skills,experience]) if(!Array.isArray(field)||field.some(x=>typeof x!=='string')) return res.status(400).json({message:'Education, skills and experience must be arrays of strings'});
  const profile=await Profile.findOneAndUpdate({user:req.user._id},{education,skills,experience,targetRole,updatedAt:new Date()},{new:true,upsert:true,runValidators:true,setDefaultsOnInsert:true});
  res.json({message:'Profile saved successfully',profile});
}catch(e){next(e);}}
