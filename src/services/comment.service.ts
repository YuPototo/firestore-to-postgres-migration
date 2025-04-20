import { db } from '@/lib/firebase/client'
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore'
import { CreateCommentPayload, Comment, CommentSchema } from '@/types/comment'

const commentsCollection = collection(db, 'comments')

const createComment = async (
    payload: CreateCommentPayload
): Promise<string> => {
    const commentRef = await addDoc(commentsCollection, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    return commentRef.id
}

const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
    const q = query(
        commentsCollection,
        where('postId', '==', postId),
        orderBy('createdAt', 'desc')
    )

    const commentsSnapshot = await getDocs(q)
    const comments = commentsSnapshot.docs.map((doc) => {
        const comment = CommentSchema.safeParse({
            id: doc.id,
            ...doc.data(),
        })

        if (comment.success) {
            return comment.data
        } else {
            console.error(comment.error)
            return null
        }
    })

    return comments.filter((comment): comment is Comment => comment !== null)
}

const updateComment = async (id: string, content: string) => {
    const commentRef = doc(commentsCollection, id)
    await updateDoc(commentRef, {
        content,
        updatedAt: serverTimestamp(),
    })
}

const deleteComment = async (id: string) => {
    const commentRef = doc(commentsCollection, id)
    await deleteDoc(commentRef)
}

const commentService = {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
}

export default commentService
