import { NextResponse, NextRequest } from 'next/server'
import verifyRequest from '@/server/verifyToken'
import { z } from 'zod'
import commentService from '@/server/services/comment.service'
import { CreateCommentPayload } from '@/types/comment'

const CreateCommentDTO = z.object({
    postId: z.string(),
    content: z.string(),
})

/**
 * GET api/v0/comments
 *
 * Get all comments
 */
export async function GET(req: NextRequest) {
    const postId = req.nextUrl.searchParams.get('postId') as string

    const data = await commentService.getCommentsByPostId(postId)

    return NextResponse.json(data)
}

/**
 * POST api/v0/comments
 *
 * Create a new comment
 */
export async function POST(req: NextRequest) {
    let decoded
    try {
        decoded = await verifyRequest(req)
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await req.json()

    const comment = CreateCommentDTO.safeParse(requestBody)

    if (!comment.success) {
        console.error(comment.error)
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

    const commentPayload: CreateCommentPayload = {
        ...comment.data,
        authorId: decoded.uid,
        authorEmail: userEmail,
    }

    const data = await commentService.createComment(commentPayload)

    return NextResponse.json(data)
}
