import {NextResponse} from 'next/server';import {cookies} from 'next/headers';import {COOKIE} from '@/lib/auth';import {removeSession} from '@/lib/store';
export async function POST(){const jar=await cookies(),id=jar.get(COOKIE)?.value;if(id)await removeSession(id);const res=NextResponse.json({ok:true});res.cookies.set(COOKIE,'',{path:'/',maxAge:0});return res}
