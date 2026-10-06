export function need(name){const v=process.env[name];if(!v)throw new Error("Missing environment variable: "+name);return v;}
export const PLAN_PRICE_IDS={starter:process.env.STRIPE_PRICE_STARTER||"",pro:process.env.STRIPE_PRICE_PRO||"",agency:process.env.STRIPE_PRICE_AGENCY||""};
export const APP_URL=(process.env.APP_URL||"").replace(/\/$/,"");