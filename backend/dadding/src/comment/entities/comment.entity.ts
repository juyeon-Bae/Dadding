export class Comment {
  id?: string;
  comments: string;
}
export interface CommentData {
  id: string;
  userUid: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
}
