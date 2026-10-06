import {requireUser,admin} from "../lib/supabase.js";
export default async function handler(req,res){
  try{
    if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
    const user=await requireUser(req);const sb=admin();
    const {data}=await sb.from("subscriptions").select("plan,status,current_period_end").eq("user_id",user.id).maybeSingle();
    return res.status(200).json({user:{id:user.id,email:user.email},subscription:data||null});
  }catch(e){return res.status(e.status||500).json({error:e.status?e.message:"Request failed"});}
}