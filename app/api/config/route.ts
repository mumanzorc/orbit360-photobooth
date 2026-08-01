import { NextResponse } from 'next/server';
export async function GET(req:Request){const detected=new URL(req.url).origin;return NextResponse.json({appUrl:(process.env.APP_URL||detected).replace(/\/$/,'')});}
