import Generation from '../models/Generation.js';
import User from '../models/User.js';
export async function usageReport(req,res,next){try{
  const [users,total,byType,topUsers]=await Promise.all([
    User.countDocuments(),Generation.countDocuments(),
    Generation.aggregate([{$group:{_id:'$type',count:{$sum:1}}},{$project:{_id:0,type:'$_id',count:1}}]),
    Generation.aggregate([{$group:{_id:'$user',generations:{$sum:1}}},{$sort:{generations:-1}},{$limit:10},{$lookup:{from:'users',localField:'_id',foreignField:'_id',as:'user'}},{$unwind:'$user'},{$project:{_id:0,name:'$user.name',email:'$user.email',generations:1}}])
  ]);
  res.json({totalUsers:users,totalGenerations:total,byType,topUsers});
}catch(e){next(e);}}
