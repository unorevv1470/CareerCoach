import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const tokenFor=id=>jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'7d'});
export async function register(req,res,next){try{
  const {name,email,password}=req.body;
  if(!name||!email||!password) return res.status(400).json({message:'Name, email and password are required'});
  if(password.length<8) return res.status(400).json({message:'Password must be at least 8 characters'});
  if(await User.findOne({email})) return res.status(409).json({message:'Email is already registered'});
  const user=await User.create({name,email,password:await bcrypt.hash(password,12)});
  res.status(201).json({message:'Registration successful',token:tokenFor(user._id),user:{id:user._id,name:user.name,email:user.email,role:user.role}});
}catch(e){next(e);}}
export async function login(req,res,next){try{
  const {email,password}=req.body; const user=await User.findOne({email}).select('+password');
  if(!user||!await bcrypt.compare(password||'',user.password)) return res.status(401).json({message:'Invalid email or password'});
  res.json({message:'Login successful',token:tokenFor(user._id),user:{id:user._id,name:user.name,email:user.email,role:user.role}});
}catch(e){next(e);}}
export function me(req,res){res.json({user:{id:req.user._id,name:req.user.name,email:req.user.email,role:req.user.role}});}
