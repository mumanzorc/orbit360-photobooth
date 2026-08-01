'use client';
import { useMemo,useState } from 'react';

const FRAMES=[
  ['Sin marco',''],['Gala','/frames/gala.svg'],['Matrimonio','/frames/matrimonio.svg'],
  ['Bautizo','/frames/bautizo.svg'],['San Valentín','/frames/san-valentin.svg'],
  ['Cumpleaños','/frames/cumpleanos.svg'],['Otros eventos','/frames/otros-eventos.svg']
];
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const asDataUrl=(file:File)=>new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(file)});

export default function EventForm({onClose,onSaved}:{onClose:()=>void;onSaved:()=>void}){
  const [saving,setSaving]=useState(false),[frame,setFrame]=useState(''),[frameUrl,setFrameUrl]=useState(''),[frameFile,setFrameFile]=useState<File|null>(null),[logoUrl,setLogoUrl]=useState(''),[logoFile,setLogoFile]=useState<File|null>(null);
  const preview=useMemo(()=>frameFile?URL.createObjectURL(frameFile):frameUrl||frame,[frameFile,frameUrl,frame]);
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setSaving(true);const f=new FormData(e.currentTarget);const body:any=Object.fromEntries(f);body.frameUrl=frameFile?await asDataUrl(frameFile):frameUrl||frame;body.logoUrl=logoFile?await asDataUrl(logoFile):logoUrl;await fetch('/api/events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});onSaved();}
  return <div className="modal"><form className="panel eventPanel" onSubmit={submit}><div className="panelHead"><div><span className="eyebrow">NUEVA EXPERIENCIA</span><h2>Configura tu evento</h2></div><button type="button" className="close" onClick={onClose}>×</button></div><div className="formGrid">
    <label>Nombre<input name="name" required placeholder="Gala Nova 2026"/></label><label>Cliente<input name="client" placeholder="Marca o anfitrión"/></label>
    <label>Fecha<input type="date" name="date" required defaultValue={today()}/></label><label>Lugar<input name="venue" placeholder="Santiago"/></label>
    <label>Formato<select name="format"><option>9:16</option><option>1:1</option><option>16:9</option></select></label><label>Duración de video (seg.)<input type="number" name="duration" defaultValue="8" min="3" max="120"/></label>
    <label className="wide">Mensaje de bienvenida<input name="welcome" defaultValue="¡Haz que este momento gire!"/></label>
    <label>Color principal<input type="color" name="primary" defaultValue="#8b5cf6"/></label><label>Color acento<input type="color" name="accent" defaultValue="#f43f5e"/></label><label>Fondo<input type="color" name="background" defaultValue="#080a12"/></label>
    <fieldset className="wide assetField"><legend>Marco de la captura</legend><label>Plantilla predeterminada<select value={frame} onChange={e=>{setFrame(e.target.value);setFrameUrl('');setFrameFile(null)}}>{FRAMES.map(([label,url])=><option key={label} value={url}>{label}</option>)}</select></label><label>URL personalizada<input value={frameUrl} onChange={e=>{setFrameUrl(e.target.value);setFrameFile(null)}} placeholder="https://.../marco.png"/></label><label>Cargar archivo<input type="file" accept="image/png,image/webp,image/svg+xml" onChange={e=>setFrameFile(e.target.files?.[0]||null)}/></label>{preview&&<img className="assetPreview" src={preview} alt="Vista previa del marco"/>}<p>Recomendado: PNG, WebP o SVG transparente. Vertical 1080×1920 px, cuadrado 1080×1080 px u horizontal 1920×1080 px. Máximo sugerido: 5 MB. Mantén transparente el centro y reserva 80 px de margen seguro.</p></fieldset>
    <fieldset className="wide assetField"><legend>Logo del evento o empresa</legend><label>URL del logo<input value={logoUrl} onChange={e=>{setLogoUrl(e.target.value);setLogoFile(null)}} placeholder="https://.../logo.png"/></label><label>Cargar logo<input type="file" accept="image/png,image/webp,image/svg+xml,image/jpeg" onChange={e=>setLogoFile(e.target.files?.[0]||null)}/></label><label>Ubicación<select name="logoCorner" defaultValue="top-right"><option value="top-right">Superior derecha</option><option value="top-left">Superior izquierda</option><option value="bottom-right">Inferior derecha</option><option value="bottom-left">Inferior izquierda</option></select></label><p>Recomendado: PNG, WebP o SVG con fondo transparente, entre 400 y 1000 px de ancho y máximo 2 MB.</p></fieldset>
  </div><div className="panelActions"><button type="button" onClick={onClose}>Cancelar</button><button className="primary" disabled={saving}>{saving?'Creando…':'Crear evento'}</button></div></form></div>
}
