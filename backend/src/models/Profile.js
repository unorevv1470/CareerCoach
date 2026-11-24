import mongoose from 'mongoose';
const profileSchema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,unique:true},
  education:{type:[String],default:[],validate:v=>v.length<=15},
  skills:{type:[String],default:[],validate:v=>v.length<=50},
  experience:{type:[String],default:[],validate:v=>v.length<=30},
  targetRole:{type:String,trim:true,maxlength:100,default:''},
  updatedAt:{type:Date,default:Date.now}
},{timestamps:true});
export default mongoose.model('Profile',profileSchema);
