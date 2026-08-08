export type EventTheme = { primary:string; secondary:string; accent:string; background:string; font:string; frameUrl?:string; logoUrl?:string; logoCorner?:'top-left'|'top-right'|'bottom-left'|'bottom-right' };
export type BoothEvent = { id:string; name:string; client:string; date:string; venue:string; welcome:string; format:'9:16'|'1:1'|'16:9'; duration:number; effects:string[]; theme:EventTheme; createdAt:string; driveFolderId?:string };
export type MediaItem = { id:string; eventId:string; kind:'photo'|'video'; url:string; createdAt:string; filename?:string; storedName?:string; mimeType?:string; status?:'processing'|'ready'|'error'; processingError?:string; guest?:string; driveFileId?:string };
export type UserRole='admin'|'operator';
export type AppUser={id:string;username:string;name:string;role:UserRole;passwordHash:string;active:boolean;createdAt:string};
export type PublicUser=Omit<AppUser,'passwordHash'>;
export type FrameAsset={id:string;name:string;category:string;url:string;format:'9:16'|'1:1'|'16:9';createdAt:string};
export type Session={id:string;userId:string;expiresAt:string};
