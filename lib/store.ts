import { promises as fs } from 'fs';
import path from 'path';
import type { BoothEvent, MediaItem } from './types';
const root = process.env.DATA_DIR || path.join(process.cwd(),'data');
const dbFile = path.join(root,'store.json');
type DB={events:BoothEvent[];media:MediaItem[]};
const empty:DB={events:[],media:[]};
async function read():Promise<DB>{ await fs.mkdir(root,{recursive:true}); try{return JSON.parse(await fs.readFile(dbFile,'utf8'));}catch{return empty;} }
async function write(db:DB){await fs.mkdir(root,{recursive:true});await fs.writeFile(dbFile,JSON.stringify(db,null,2));}
export async function listEvents(){return (await read()).events;}
export async function getEvent(id:string){return (await read()).events.find(e=>e.id===id);}
export async function createEvent(event:BoothEvent){const db=await read();db.events.unshift(event);await write(db);return event;}
export async function updateEvent(id:string, patch:Partial<BoothEvent>){const db=await read();const i=db.events.findIndex(e=>e.id===id);if(i<0)return null;db.events[i]={...db.events[i],...patch};await write(db);return db.events[i];}
export async function listMedia(eventId:string){return (await read()).media.filter(m=>m.eventId===eventId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export async function getMedia(id:string){return (await read()).media.find(m=>m.id===id);}
export async function addMedia(item:MediaItem){const db=await read();db.media.unshift(item);await write(db);return item;}
export async function updateMedia(id:string,patch:Partial<MediaItem>){const db=await read();const index=db.media.findIndex(m=>m.id===id);if(index<0)return null;db.media[index]={...db.media[index],...patch};await write(db);return db.media[index];}
