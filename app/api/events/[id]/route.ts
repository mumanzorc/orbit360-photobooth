import { NextResponse } from 'next/server';import { getEvent,updateEvent } from '@/lib/store';
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const event=await getEvent(id);return event?NextResponse.json(event):NextResponse.json({error:'Evento no encontrado'},{status:404});}
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){const {id}=await params;const event=await updateEvent(id,await req.json());return event?NextResponse.json(event):NextResponse.json({error:'Evento no encontrado'},{status:404});}
