export class Message {
  id?: string;
  messages: string;
}
export interface MessageData {
  id: string;
  userUid: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
}
