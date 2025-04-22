import { z } from 'zod'

const CommentSchema = z.object({
    id: z.string(),
    postId: z.string(),
    content: z.string(),
    authorId: z.string(),
    authorEmail: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

//for API response
const CommentDTO = z.object({
    id: z.string(),
    postId: z.string(),
    content: z.string(),
    authorId: z.string(),
    authorEmail: z.string().email(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

const CreateCommentSchema = CommentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
})

type Comment = z.infer<typeof CommentSchema>
type CreateCommentPayload = z.infer<typeof CreateCommentSchema>
type CommentDtoType = z.infer<typeof CommentDTO>

export { CommentSchema, CreateCommentSchema, CommentDTO }
export type { Comment, CreateCommentPayload, CommentDtoType }
