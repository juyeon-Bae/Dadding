export interface Post {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  tags: Array<string>;
  commentCount: number;
  likeCount: number;
  likedBy: string;
  createdAt: Date;
  updatedAt: Date | null;
}
