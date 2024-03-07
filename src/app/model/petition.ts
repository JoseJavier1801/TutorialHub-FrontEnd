import { client } from "./client";

// petition.model.ts
export interface Petition {
    id: number;
    message: string;
    state: string;
    date: Date;
    clientId: number;
    classId: number;
    expanded: boolean | undefined;
    photoBase64: string;
    name: string;
    photo: string;
   client:client
}
