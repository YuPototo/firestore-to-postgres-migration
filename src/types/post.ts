type Post = {
    id: string
    title: string
    content: string
    authorId: string
    authorEmail: string
    createdAt: Date
    updatedAt: Date
}

type CreatePostPayload = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>

export type { Post, CreatePostPayload }
