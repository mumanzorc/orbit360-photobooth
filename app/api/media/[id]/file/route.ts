import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getMedia } from '@/lib/store';
export const runtime='nodejs';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const item=await getMedia(id);if(!item)return NextResponse.json({error:'Archivo no encontrado'},{status:404});const fallback=item.url.startsWith('/media/')?item.url.replace('/media/',''):'';const relative=item.storedName?path.join(item.eventId,item.storedName):fallback;const filePath=path.join(process.env.MEDIA_DIR||path.join(process.cwd(),'public/media'),relative);try{const buffer=await fs.readFile(filePath);const download=new URL(req.url).searchParams.get('download')==='1';return new NextResponse(buffer,{headers:{'Content-Type':item.mimeType||(item.kind==='video'?'video/webm':'image/jpeg'),'Content-Length':String(buffer.length),'Cache-Control':'private, max-age=3600','Content-Disposition':`${download?'attachment':'inline'}; filename="${item.filename||path.basename(filePath)}"`}});}catch{return NextResponse.json({error:'El archivo físico no está disponible'},{status:404});}}
