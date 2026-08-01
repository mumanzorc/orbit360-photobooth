import { notFound } from 'next/navigation';import Gallery from '@/components/Gallery';import { getEvent } from '@/lib/store';
export const dynamic='force-dynamic';export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const event=await getEvent(id);if(!event)notFound();return <Gallery event={event} project/>}
