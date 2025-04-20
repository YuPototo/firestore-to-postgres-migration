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
    limit,
    startAfter,
    QueryDocumentSnapshot,
    updateDoc,
    increment,
    runTransaction,
} from 'firebase/firestore'
import {
    CreatePostPayload,
    UpdatePostPayload,
    Post,
    PostSchema,
} from '@/types/post'

const postsCollection = collection(db, 'posts')
const postsCounterRef = doc(db, 'counters', 'posts')

const getTotalPostsCount = async (): Promise<number> => {
    const counterDoc = await getDoc(postsCounterRef)
    return counterDoc.exists() ? counterDoc.data().count : 0
}

const createPost = async (payload: CreatePostPayload): Promise<string> => {
    return await runTransaction(db, async (transaction) => {
        const postRef = await addDoc(postsCollection, {
            ...payload,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })

        // Update the counter
        const counterDoc = await getDoc(postsCounterRef)
        if (counterDoc.exists()) {
            transaction.update(postsCounterRef, { count: increment(1) })
        } else {
            transaction.set(postsCounterRef, { count: 1 })
        }

        return postRef.id
    })
}

const getPost = async (id: string): Promise<Post | null> => {
    const postRef = doc(postsCollection, id)
    const postDoc = await getDoc(postRef)

    if (postDoc.exists()) {
        const post = PostSchema.safeParse({
            id: postDoc.id,
            ...postDoc.data(),
        })

        if (post.success) {
            return post.data
        } else {
            console.error(post.error)
            return null
        }
    }

    return null
}

const getPosts = async (
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot
) => {
    let q = query(
        postsCollection,
        orderBy('createdAt', 'desc'),
        limit(pageSize + 1)
    )

    if (lastDoc) {
        q = query(q, startAfter(lastDoc))
    }

    const [postsSnapshot, totalCount] = await Promise.all([
        getDocs(q),
        getTotalPostsCount(),
    ])

    const posts = postsSnapshot.docs.map((doc) => {
        const post = PostSchema.safeParse({
            id: doc.id,
            ...doc.data(),
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

const updatePost = async (id: string, payload: UpdatePostPayload) => {
    const postRef = doc(postsCollection, id)
    await updateDoc(postRef, {
        ...payload,
        updatedAt: serverTimestamp(),
    })
}

const deletePost = async (id: string) => {
    return await runTransaction(db, async (transaction) => {
        const postRef = doc(postsCollection, id)
        const postDoc = await getDoc(postRef)
        const counterDoc = await getDoc(postsCounterRef)

        if (!postDoc.exists()) {
            throw new Error('Post not found')
        }

        // Delete the post
        transaction.delete(postRef)

        // Update the counter
        if (counterDoc.exists()) {
            transaction.update(postsCounterRef, { count: increment(-1) })
        }
    })
}

const postService = {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost,
}

export default postService
