import 'server-only'

import admin, { db } from '@/server/firebaseAdmin'
import { CreatePostPayload, PostDTO, UpdatePostPayload } from '@/types/post'

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
    lastPostId?: string,
    authorId?: string
) => {
    let query = postsCollection.orderBy('createdAt', 'desc').limit(pageSize + 1)

    if (authorId) {
        query = query.where('authorId', '==', authorId)
    }

    if (lastPostId) {
        console.log('lastPostId', lastPostId)
        const lastDoc = await postsCollection.doc(lastPostId).get()

        if (lastDoc.exists) {
            query = query.startAfter(lastDoc)
        }
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
        lastPostId: postsSnapshot.docs[postsSnapshot.docs.length - 2]?.id,
        hasMore: postsSnapshot.docs.length === pageSize + 1,
        totalCount,
    }
}

const getPostById = async (id: string) => {
    const postRef = postsCollection.doc(id)
    const postDoc = await postRef.get()

    if (!postDoc.exists) {
        throw new Error('Post not found')
    }

    const post = PostDTO.safeParse({
        ...postDoc.data(),
        id: postDoc.id,
        createdAt: postDoc.data()?.createdAt.toDate().toISOString(),
        updatedAt: postDoc.data()?.updatedAt.toDate().toISOString(),
    })

    if (!post.success) {
        throw new Error('Post validation failed')
    }

    return post.data
}

const updatePost = async (id: string, payload: UpdatePostPayload) => {
    const postRef = postsCollection.doc(id)
    await postRef.update({
        ...payload,
        updatedAt: new Date(),
    })
}

const deletePost = async (id: string) => {
    return await db.runTransaction(async (transaction) => {
        const postRef = postsCollection.doc(id)
        const postDoc = await transaction.get(postRef)
        const counterDoc = await transaction.get(postsCounterRef)

        if (!postDoc.exists) {
            throw new Error('Post not found')
        }

        // Delete the post
        transaction.delete(postRef)

        // Update the counter
        if (counterDoc.exists) {
            transaction.update(postsCounterRef, {
                count: admin.firestore.FieldValue.increment(-1),
            })
        }
    })
}

const postService = {
    createPost,
    getPosts,
    getTotalPostsCount,
    updatePost,
    getPostById,
    deletePost,
}

export default postService
