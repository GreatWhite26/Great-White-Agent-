import {requireUser,admin} from "../lib/supabase.js";
const tips=[
"Price the full scope, not only the headline quantity.",
"Separate labor, material, equipment, travel, and subcontractor costs.",
"Write inclusions and exclusions before the proposal leaves your desk.",
"Adjust production for height, access, phasing, and schedule restrictions.",
"Document change-order work before proceeding.",
"Track actual labor hours so future estimates improve."
];
function hash(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
export default async function handler(req,res){
  try{
    if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
    const user=await requireUser(req);const sb=admin();
    const {data:sub}=await sb.from("subscriptions").select("plan,status").eq("user_id",user.id).maybeSingle();
    if(!sub||!["active","trialing"].includes(sub.status))return res.status(402).json({error:"Active subscription required"});
    const topic=String(req.body?.topic||"").trim().slice(0,120);
    const trade=String(req.body?.trade||"Contractor").trim().slice(0,80);
    const offer=String(req.body?.offer||"Contact us today").trim().slice(0,100);
    if(topic.length<3)return res.status(400).json({error:"Topic is too short"});
    const now=new Date();const hour=new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours()).toISOString();
    const {data:usage}=await sb.from("usage_hourly").select("count").eq("user_id",user.id).eq("bucket",hour).maybeSingle();
    const limits={starter:10,pro:30,agency:100};const lim=limits[sub.plan]||10;const count=usage?.count||0;
    if(count>=lim)return res.status(429).json({error:"Hourly generation limit reached"});
    await sb.from("usage_hourly").upsert({user_id:user.id,bucket:hour,count:count+1},{onConflict:"user_id,bucket"});
    const seed=hash(topic+trade+offer);
    const p=[tips[seed%tips.length],tips[(seed+2)%tips.length],tips[(seed+4)%tips.length]];
    return res.status(200).json({hook:"Before you post your next "+trade.toLowerCase()+" video, check this.",points:p,cta:offer,caption:"#contractor #construction #"+trade.toLowerCase().replace(/[^a-z0-9]+/g,"")});
  }catch(e){return res.status(e.status||500).json({error:e.status?e.message:"Generation failed"});}
}