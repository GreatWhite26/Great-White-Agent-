export default function handler(req,res){
  if(req.method!=="GET")return res.status(405).json({error:"Method not allowed"});
  const url=process.env.SUPABASE_URL||"";
  const anon=process.env.SUPABASE_ANON_KEY||"";
  if(!url||!anon)return res.status(503).json({error:"Auth service not configured"});
  res.setHeader("Cache-Control","no-store");
  return res.status(200).json({supabaseUrl:url,supabaseAnonKey:anon});
}