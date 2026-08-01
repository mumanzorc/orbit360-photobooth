import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getEvent } from '@/lib/store';
export const runtime='nodejs';
const livePath=(id:string)=>path.join(process.env.MEDIA_DIR||path.join(process.cwd(),'public/media'),id,'live.jpg');
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){try{const {id}=await params;if(!await getEvent(id))return NextResponse.json({error:'Evento no encontrado'},{status:404});const buffer=Buffer.from(await req.arrayBuffer());if(!buffer.length||buffer.length>2_000_000)return NextResponse.json({error:'Fotograma inválido'},{status:400});const target=livePath(id);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,buffer);return NextResponse.json({ok:true});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'No se pudo actualizar la señal en vivo'},{status:500});}}
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;try{const file=await fs.readFile(livePath(id));return new NextResponse(file,{headers:{'Content-Type':'image/jpeg','Cache-Control':'no-store, max-age=0'}});}catch{return NextResponse.json({error:'Esperando señal de la cabina'},{status:404});}}
