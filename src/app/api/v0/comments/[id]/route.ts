import { NextResponse, NextRequest } from 'next/server'
import verifyRequest from '@/server/verifyToken'
import commentService from '@/server/services/comment.service'

/**
 * DELETE api/v0/comments/:id
 *
 * Delete a comment
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    let decoded
    try {
        decoded = await verifyRequest(req)
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await commentService.deleteComment(id)
    return NextResponse.json({ message: 'Comment deleted' })
}
