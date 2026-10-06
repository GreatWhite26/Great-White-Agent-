import Stripe from "stripe";
import {need} from "../lib/env.js";
import {admin} from "../lib/supabase.js";
const stripe=new Stripe(need("STRIPE_SECRET_KEY"));
export const config={api:{bodyParser:false}};
async function raw(req){const chunks=[];for await(const c of req)chunks.push(c);return Buffer.concat(chunks)}
export default async function handler(req,res){
  if(req.method!=="POST")return res.status(405).end();
  let event;
  try{event=stripe.webhooks.constructEvent(await raw(req),req.headers["stripe-signature"],need("STRIPE_WEBHOOK_SECRET"))}
  catch{return res.status(400).send("Invalid signature")}
  try{
    const sb=admin();
    const obj=event.data.object;
    if(event.type==="checkout.session.completed"&&obj.mode==="subscription"){
      const uid=obj.metadata?.user_id||obj.client_reference_id;
      if(uid)await sb.from("subscriptions").upsert({user_id:uid,stripe_customer_id:String(obj.customer||""),stripe_subscription_id:String(obj.subscription||""),plan:obj.metadata?.plan||"starter",status:"active",updated_at:new Date().toISOString()},{onConflict:"user_id"});
    }
    if(event.type.startsWith("customer.subscription.")){
      const sub=obj;
      const uid=sub.metadata?.user_id;
      if(uid)await sb.from("subscriptions").upsert({user_id:uid,stripe_customer_id:String(sub.customer||""),stripe_subscription_id:sub.id,plan:sub.metadata?.plan||"starter",status:sub.status,current_period_end:new Date((sub.current_period_end||0)*1000).toISOString(),updated_at:new Date().toISOString()},{onConflict:"user_id"});
    }
    return res.status(200).json({received:true});
  }catch{return res.status(500).json({error:"Webhook processing failed"});}
}