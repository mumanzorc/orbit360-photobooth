import { google } from 'googleapis';
import { Readable } from 'stream';
function driveClient(){
  if(process.env.GOOGLE_DRIVE_ENABLED!=='true'||!process.env.GOOGLE_SERVICE_ACCOUNT_JSON)return null;
  const credentials=JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const auth=new google.auth.GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/drive.file']});
  return google.drive({version:'v3',auth});
}
export async function ensureEventFolder(name:string){const drive=driveClient();if(!drive)return undefined;const parent=process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID;const q=["mimeType='application/vnd.google-apps.folder'",`name='${name.replaceAll("'","\\'")}'`,'trashed=false',parent?`'${parent}' in parents`:null].filter(Boolean).join(' and ');const found=await drive.files.list({q,fields:'files(id,name)',pageSize:1});if(found.data.files?.[0]?.id)return found.data.files[0].id;const made=await drive.files.create({requestBody:{name,mimeType:'application/vnd.google-apps.folder',parents:parent?[parent]:undefined},fields:'id'});return made.data.id||undefined;}
export async function uploadToDrive(folderId:string,name:string,mimeType:string,buffer:Buffer){const drive=driveClient();if(!drive)return undefined;const out=await drive.files.create({requestBody:{name,parents:[folderId]},media:{mimeType,body:Readable.from(buffer)},fields:'id'});return out.data.id||undefined;}
