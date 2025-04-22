import { NextResponse, NextRequest } from 'next/server'
import verifyRequest from '@/server/verifyToken'
import postService from '@/server/services/post.service'
import { UpdatePostDTO } from '@/types/post'

/**
 * GET api/v0/posts/:id
 *
 * Get a post by id
 */
export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyRequest(req)
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

/**
 * DELETE api/v0/posts/:id
 *
 * Delete a post
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await verifyRequest(req)
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await postService.deletePost(id)
    return NextResponse.json({ message: 'Post deleted' })
}
