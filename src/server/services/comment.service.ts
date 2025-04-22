import 'server-only'
import { db } from '@/server/firebaseAdmin'
import {
    CreateCommentPayload,
    CommentDTO,
    CommentDtoType,
} from '@/types/comment'

const commentsCollection = db.collection('comments')

const createComment = async (
    payload: CreateCommentPayload
): Promise<string> => {
    const commentRef = await commentsCollection.add({
        ...payload,
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    return commentRef.id
}

const getCommentsByPostId = async (
    postId: string
): Promise<CommentDtoType[]> => {
    const commentsSnapshot = await commentsCollection
        .where('postId', '==', postId)
        .orderBy('createdAt', 'desc')
        .get()

    const comments = commentsSnapshot.docs.map((doc) => {
        const comment = CommentDTO.safeParse({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString(),
        })

        if (comment.success) {
            return comment.data
        } else {
            console.error(comment.error)
            return null
        }
    })

    return comments.filter((comment) => comment !== null)
}

const deleteComment = async (id: string) => {
    const commentRef = commentsCollection.doc(id)
    await commentRef.delete()
}

const commentService = {
    createComment,
    getCommentsByPostId,
    deleteComment,
}

export default commentService
