import { execFile } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import type { MediaItem } from './types';
import { updateMedia } from './store';
import { uploadToDrive } from './drive';
const run=promisify(execFile);
const mediaRoot=()=>process.env.MEDIA_DIR||path.join(process.cwd(),'public/media');
export async function processAndBackup(item:MediaItem,driveFolderId?:string){let current=item;try{if(item.kind==='video'&&item.mimeType!=='video/mp4'&&item.storedName){const input=path.join(mediaRoot(),item.eventId,item.storedName);const outputName=`${item.id}.mp4`,output=path.join(mediaRoot(),item.eventId,outputName);await run('ffmpeg',['-y','-i',input,'-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','-c:a','aac','-b:a','128k',output],{timeout:300_000,maxBuffer:2_000_000});current={...item,storedName:outputName,filename:(item.filename||`${item.id}.webm`).replace(/\.[^.]+$/,'.mp4'),mimeType:'video/mp4',status:'ready'};await updateMedia(item.id,current);await fs.unlink(input).catch(()=>undefined)}else{current={...item,status:'ready'};await updateMedia(item.id,{status:'ready'})}if(driveFolderId&&current.storedName){const buffer=await fs.readFile(path.join(mediaRoot(),current.eventId,current.storedName));const driveFileId=await uploadToDrive(driveFolderId,current.filename||current.storedName,current.mimeType||'application/octet-stream',buffer);if(driveFileId)await updateMedia(current.id,{driveFileId})}}catch(error){console.error('media-processing',error);await updateMedia(item.id,{status:'error',processingError:error instanceof Error?error.message:'No se pudo procesar el video'})}}
