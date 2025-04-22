import { NextResponse, NextRequest } from 'next/server'
import verifyRequest from '@/server/verifyToken'
import postService from '@/server/services/post.service'
import { CreatePostPayload, UpdatePostDTO } from '@/types/post'
import { z } from 'zod'

const CreatePostDTO = z.object({
    title: z.string(),
    content: z.string(),
})

/**
 * GET api/v0/posts
 *
 * Get all posts
 */
export async function GET(req: NextRequest) {
    const pageSize = 10
    const lastPostId = req.nextUrl.searchParams.get('lastPostId') ?? undefined
    const authorId = req.nextUrl.searchParams.get('authorId') ?? undefined

    const data = await postService.getPosts(pageSize, lastPostId, authorId)

    return NextResponse.json(data)
}

/**
 * POST api/v0/posts
 *
 * Create a new post
 */
export async function POST(req: NextRequest) {
    let decoded
    try {
        decoded = await verifyRequest(req)
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await req.json()

    const post = CreatePostDTO.safeParse(requestBody)

    if (!post.success) {
        console.error(post.error)
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        )
    }

    const userEmail = decoded.email

    if (!userEmail) {
        return NextResponse.json(
            { error: 'User has no email' },
            { status: 500 }
        )
    }

    const postPayload: CreatePostPayload = {
        ...post.data,
        authorId: decoded.uid,
        authorEmail: userEmail,
    }

    const data = await postService.createPost(postPayload)

    return NextResponse.json(data)
}

/**
 * PUT api/v0/posts/:id
 *
 * Update a post
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params

    const requestBody = await req.json()

    const updatePostPayload = UpdatePostDTO.safeParse(requestBody)

    if (!updatePostPayload.success) {
        console.error(updatePostPayload.error)
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        )
    }

    const data = await postService.updatePost(id, updatePostPayload.data)

    return NextResponse.json(data)
}
