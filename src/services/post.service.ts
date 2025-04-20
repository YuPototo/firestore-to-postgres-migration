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
} from 'firebase/firestore'
import {
    CreatePostPayload,
    UpdatePostPayload,
    Post,
    PostSchema,
} from '@/types/post'

const postsCollection = collection(db, 'posts')

const createPost = async (payload: CreatePostPayload) => {
    const postRef = await addDoc(postsCollection, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
    return postRef.id
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
        limit(pageSize)
    )

    if (lastDoc) {
        q = query(q, startAfter(lastDoc))
    }

    const postsSnapshot = await getDocs(q)
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
        posts: posts.filter((post) => post !== null),
        lastDoc: postsSnapshot.docs[postsSnapshot.docs.length - 1],
        hasMore: postsSnapshot.docs.length === pageSize,
    }
}

const updatePost = async (id: string, payload: UpdatePostPayload) => {
    const postRef = doc(postsCollection, id)
    await updateDoc(postRef, {
        ...payload,
        updatedAt: serverTimestamp(),
    })
}

const postService = {
    createPost,
    getPost,
    getPosts,
    updatePost,
}

export default postService
