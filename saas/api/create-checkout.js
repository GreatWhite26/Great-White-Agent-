import Stripe from "stripe";
import {need,PLAN_PRICE_IDS,APP_URL} from "../lib/env.js";
import {requireUser} from "../lib/supabase.js";
const stripe=new Stripe(need("STRIPE_SECRET_KEY"));
export default async function handler(req,res){
  try{
    if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
    const user=await requireUser(req);
    const plan=String(req.body?.plan||"").toLowerCase();
    const price=PLAN_PRICE_IDS[plan];
    if(!price)return res.status(400).json({error:"Invalid plan"});
    const session=await stripe.checkout.sessions.create({
      mode:"subscription",
      line_items:[{price,quantity:1}],
      customer_email:user.email,
      client_reference_id:user.id,
      metadata:{user_id:user.id,plan},
      subscription_data:{metadata:{user_id:user.id,plan}},
      success_url:APP_URL+"/app/?checkout=success",
      cancel_url:APP_URL+"/?checkout=cancelled",
      allow_promotion_codes:true
    });
    return res.status(200).json({url:session.url});
  }catch(e){return res.status(e.status||500).json({error:e.status?e.message:"Checkout failed"});}
}