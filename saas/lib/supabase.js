import {createClient} from "@supabase/supabase-js";
import {need} from "./env.js";
export function admin(){return createClient(need("SUPABASE_URL"),need("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false,autoRefreshToken:false}})}
export async function requireUser(req){
  const h=req.headers.authorization||"";
  if(!h.startsWith("Bearer "))throw Object.assign(new Error("Unauthorized"),{status:401});
  const token=h.slice(7);
  const sb=admin();
  const {data,error}=await sb.auth.getUser(token);
  if(error||!data?.user)throw Object.assign(new Error("Unauthorized"),{status:401});
  return data.user;
}