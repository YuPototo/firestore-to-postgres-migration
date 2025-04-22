import { NextResponse, NextRequest } from 'next/server'
import verifyRequest from '@/server/verifyToken'
import postService from '@/server/services/post.service'
import { CreatePostPayload, UpdatePostDTO } from '@/types/post'
import { z } from 'zod'

/**
 * GET api/v0/posts/:id
 *
 * Get a post by id
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params
    const data = await postService.getPostById(id)

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
    const requestBody = await req.json()

    const updatePostPayload = UpdatePostDTO.safeParse(requestBody)

    if (!updatePostPayload.success) {
        console.error(updatePostPayload.error)
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        )
    }

    const { id } = await params

    await postService.updatePost(id, updatePostPayload.data)

    return NextResponse.json({ message: 'Post updated' })
}
