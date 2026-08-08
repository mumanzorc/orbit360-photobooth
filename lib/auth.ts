import {cookies} from 'next/headers';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual} from 'crypto';
import {getSession,getUser,getUserByUsername,listUsers,saveSession,saveUser} from './store';
import type {AppUser,PublicUser} from './types';
export const COOKIE='orbit_session';
export function hashPassword(password:string,salt=randomBytes(16).toString('hex')){return `${salt}:${scryptSync(password,salt,64).toString('hex')}`;}
export function verifyPassword(password:string,stored:string){const [salt,key]=stored.split(':');if(!salt||!key)return false;const a=Buffer.from(key,'hex'),b=scryptSync(password,salt,64);return a.length===b.length&&timingSafeEqual(a,b);}
export const publicUser=(u:AppUser):PublicUser=>{const {passwordHash,...safe}=u;return safe};
export async function ensureAdmin(){if((await listUsers()).length)return;await saveUser({id:randomUUID(),username:process.env.ADMIN_USER||'admin',name:'Administrador',role:'admin',passwordHash:hashPassword(process.env.ADMIN_PASSWORD||'admin360'),active:true,createdAt:new Date().toISOString()});}
export async function login(username:string,password:string){await ensureAdmin();const user=await getUserByUsername(username);if(!user||!user.active||!verifyPassword(password,user.passwordHash))return null;const session={id:randomBytes(32).toString('hex'),userId:user.id,expiresAt:new Date(Date.now()+1000*60*60*24*7).toISOString()};await saveSession(session);return {session,user:publicUser(user)};}
export async function currentUser(){const id=(await cookies()).get(COOKIE)?.value;if(!id)return null;const session=await getSession(id);if(!session)return null;const user=await getUser(session.userId);return user?.active?publicUser(user):null;}
