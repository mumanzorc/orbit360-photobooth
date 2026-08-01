import { notFound } from 'next/navigation';import Booth from '@/components/Booth';import { getEvent } from '@/lib/store';
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const event=await getEvent(id);if(!event)notFound();return <Booth event={event}/>}
