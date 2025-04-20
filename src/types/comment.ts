import { z } from 'zod'
import { Timestamp } from 'firebase/firestore'

const CommentSchema = z.object({
    id: z.string(),
    postId: z.string(),
    content: z.string(),
    authorId: z.string(),
    authorEmail: z.string().email(),
    createdAt: z.instanceof(Timestamp).transform((ts) => ts.toDate()),
    updatedAt: z.instanceof(Timestamp).transform((ts) => ts.toDate()),
})

const CreateCommentSchema = CommentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
})

type Comment = z.infer<typeof CommentSchema>
type CreateCommentPayload = z.infer<typeof CreateCommentSchema>

export { CommentSchema, CreateCommentSchema }
export type { Comment, CreateCommentPayload }
