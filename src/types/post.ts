import { z } from 'zod'

const PostSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    authorEmail: z.string().email(),
    createdAt: z.date(),
    updatedAt: z.date(),
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

//for API response
const PostDTO = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
    authorEmail: z.string().email(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

type Post = z.infer<typeof PostSchema>

type CreatePostPayload = z.infer<typeof CreatePostSchema>
type UpdatePostPayload = z.infer<typeof UpdatePostSchema>

type PostDtoType = z.infer<typeof PostDTO>

export { PostSchema, CreatePostSchema, UpdatePostSchema, PostDTO }

export type { Post, CreatePostPayload, UpdatePostPayload, PostDtoType }
