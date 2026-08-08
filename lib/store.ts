import { promises as fs } from 'fs';
import path from 'path';
import type { AppUser, BoothEvent, FrameAsset, MediaItem, Session } from './types';
const root = process.env.DATA_DIR || path.join(process.cwd(),'data');
const dbFile = path.join(root,'store.json');
type DB={events:BoothEvent[];media:MediaItem[];users:AppUser[];frames:FrameAsset[];sessions:Session[]};
const empty=():DB=>({events:[],media:[],users:[],frames:[],sessions:[]});
async function read():Promise<DB>{ await fs.mkdir(root,{recursive:true}); try{const db=JSON.parse(await fs.readFile(dbFile,'utf8'));return {...empty(),...db};}catch{return empty();} }
async function write(db:DB){await fs.mkdir(root,{recursive:true});await fs.writeFile(dbFile,JSON.stringify(db,null,2));}
export async function listEvents(){return (await read()).events;}
export async function getEvent(id:string){return (await read()).events.find(e=>e.id===id);}
export async function createEvent(event:BoothEvent){const db=await read();db.events.unshift(event);await write(db);return event;}
export async function updateEvent(id:string, patch:Partial<BoothEvent>){const db=await read();const i=db.events.findIndex(e=>e.id===id);if(i<0)return null;db.events[i]={...db.events[i],...patch};await write(db);return db.events[i];}
export async function listMedia(eventId:string){return (await read()).media.filter(m=>m.eventId===eventId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export async function getMedia(id:string){return (await read()).media.find(m=>m.id===id);}
export async function addMedia(item:MediaItem){const db=await read();db.media.unshift(item);await write(db);return item;}
export async function updateMedia(id:string,patch:Partial<MediaItem>){const db=await read();const index=db.media.findIndex(m=>m.id===id);if(index<0)return null;db.media[index]={...db.media[index],...patch};await write(db);return db.media[index];}
export async function deleteEvent(id:string){const db=await read();const before=db.events.length;db.events=db.events.filter(e=>e.id!==id);db.media=db.media.filter(m=>m.eventId!==id);await write(db);return before!==db.events.length;}
export async function deleteMedia(ids:string[]){const db=await read();const removed=db.media.filter(m=>ids.includes(m.id));db.media=db.media.filter(m=>!ids.includes(m.id));await write(db);return removed;}
export async function listUsers(){return (await read()).users;}
export async function getUser(id:string){return (await read()).users.find(u=>u.id===id);}
export async function getUserByUsername(username:string){return (await read()).users.find(u=>u.username.toLowerCase()===username.toLowerCase());}
export async function saveUser(user:AppUser){const db=await read();const i=db.users.findIndex(u=>u.id===user.id);if(i<0)db.users.push(user);else db.users[i]=user;await write(db);return user;}
export async function removeUser(id:string){const db=await read();db.users=db.users.filter(u=>u.id!==id);db.sessions=db.sessions.filter(s=>s.userId!==id);await write(db);}
export async function listFrames(){return (await read()).frames;}
export async function saveFrame(frame:FrameAsset){const db=await read();const i=db.frames.findIndex(f=>f.id===frame.id);if(i<0)db.frames.unshift(frame);else db.frames[i]=frame;await write(db);return frame;}
export async function removeFrame(id:string){const db=await read();db.frames=db.frames.filter(f=>f.id!==id);await write(db);}
export async function saveSession(session:Session){const db=await read();db.sessions=db.sessions.filter(s=>s.expiresAt>new Date().toISOString()&&s.id!==session.id);db.sessions.push(session);await write(db);}
export async function getSession(id:string){return (await read()).sessions.find(s=>s.id===id&&s.expiresAt>new Date().toISOString());}
export async function removeSession(id:string){const db=await read();db.sessions=db.sessions.filter(s=>s.id!==id);await write(db);}
