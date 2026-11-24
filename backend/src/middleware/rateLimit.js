import Generation from '../models/Generation.js';
// Per-user daily quota; stored generations are the source of truth across restarts.
export async function generationLimit(req,res,next){
  try{
    const limit=Number(process.env.USER_DAILY_LIMIT||10);
    const start=new Date(); start.setHours(0,0,0,0);
    const used=await Generation.countDocuments({user:req.user._id,createdAt:{$gte:start}});
    res.setHeader('X-RateLimit-Limit',String(limit));
    res.setHeader('X-RateLimit-Remaining',String(Math.max(0,limit-used)));
    if(used>=limit) return res.status(429).json({message:`Daily generation limit of ${limit} reached. Try again tomorrow.`,limit,used});
    next();
  }catch(error){next(error);}
}
