import { z } from 'zod'
import { Timestamp } from 'firebase/firestore'

const PostSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    authorEmail: z.string().email(),
    createdAt: z.instanceof(Timestamp).transform((ts) => ts.toDate()),
    updatedAt: z.instanceof(Timestamp).transform((ts) => ts.toDate()),
})

const CreatePostSchema = PostSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
})

const UpdatePostSchema = PostSchema.pick({
    title: true,
    content: true,
})

type Post = z.infer<typeof PostSchema>

type CreatePostPayload = z.infer<typeof CreatePostSchema>
type UpdatePostPayload = z.infer<typeof UpdatePostSchema>

export { PostSchema, CreatePostSchema, UpdatePostSchema }

export type { Post, CreatePostPayload, UpdatePostPayload }
