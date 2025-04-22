import 'server-only'

import admin, { db } from '@/server/firebaseAdmin'
import { CreatePostPayload } from '@/types/post'

// Collection references
const postsCollection = db.collection('posts')
const postsCounterRef = db.collection('counters').doc('posts')

const createPost = async (payload: CreatePostPayload): Promise<string> => {
    return await db.runTransaction(async (transaction) => {
        // First, perform all reads
        const counterDoc = await transaction.get(postsCounterRef)

        // Then perform all writes
        const postRef = postsCollection.doc()
        transaction.create(postRef, {
            ...payload,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        // Update the counter
        if (counterDoc.exists) {
            transaction.update(postsCounterRef, {
                count: admin.firestore.FieldValue.increment(1),
            })
        } else {
            transaction.set(postsCounterRef, { count: 1 })
        }

        return postRef.id
    })
}

const postService = {
    createPost,
}

export default postService
