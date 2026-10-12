import jwt from "jsonwebtoken"; import { cookies } from "next/headers"; import { prisma } from "./prisma";
const secret=()=>process.env.JWT_SECRET || "development-only-change-me";
export const createToken=(user)=>jwt.sign({id:user.id,role:user.role},secret(),{expiresIn:"7d"});
export const verifyToken=(token)=>{try{return jwt.verify(token,secret())}catch{return null}};
export async function getCurrentUser(){const token=(await cookies()).get("zentrix_token")?.value;const payload=token&&verifyToken(token);if(!payload)return null;return prisma.user.findFirst({where:{id:payload.id,status:"ACTIVE"},select:{id:true,name:true,email:true,mobile:true,role:true,status:true,createdAt:true}})}
export async function requireAuth(){const user=await getCurrentUser();if(!user){const e=new Error("Authentication required");e.status=401;throw e}return user}
export async function requireAdmin(){const user=await requireAuth();if(user.role!=="ADMIN"){const e=new Error("Admin access required");e.status=403;throw e}return user}
export const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7};
