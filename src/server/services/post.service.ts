import 'server-only'

import admin, { db } from '@/server/firebaseAdmin'
import { CreatePostPayload, PostDTO, PostSchema } from '@/types/post'

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

const getTotalPostsCount = async (): Promise<number> => {
    const counterDoc = await db.collection('counters').doc('posts').get()
    return counterDoc.exists ? counterDoc.data()?.count : 0
}

const getPosts = async (
    pageSize: number = 10,
    lastDocId?: string,
    authorId?: string
) => {
    let query = postsCollection.orderBy('createdAt', 'desc').limit(pageSize + 1)

    if (lastDocId) {
        const lastDoc = await postsCollection.doc(lastDocId).get()
        query = query.startAfter(lastDoc)
    }

    if (authorId) {
        query = query.where('authorId', '==', authorId)
    }

    const [postsSnapshot, totalCount] = await Promise.all([
        query.get(),
        getTotalPostsCount(),
    ])

    const posts = postsSnapshot.docs.map((doc) => {
        const post = PostDTO.safeParse({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate().toISOString(),
            updatedAt: doc.data().updatedAt.toDate().toISOString(),
        })

        if (post.success) {
            return post.data
        } else {
            console.error(post.error)
            return null
        }
    })

    return {
        posts: posts.slice(0, pageSize).filter((post) => post !== null),
        // -2 because we're adding 1 to the pageSize to check if there's more
        lastDoc: postsSnapshot.docs[postsSnapshot.docs.length - 2],
        hasMore: postsSnapshot.docs.length === pageSize + 1,
        totalCount,
    }
}

const postService = {
    createPost,
    getPosts,
    getTotalPostsCount,
}

export default postService
