import mongoose from 'mongoose';
const generationSchema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},
  type:{type:String,enum:['resume','interview'],required:true},
  role:{type:String,default:''},
  inputSnapshot:{type:mongoose.Schema.Types.Mixed,default:{}},
  result:{type:mongoose.Schema.Types.Mixed,required:true}
},{timestamps:true});
generationSchema.index({user:1,createdAt:-1});
export default mongoose.model('Generation',generationSchema);
