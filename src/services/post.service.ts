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
} from 'firebase/firestore'
import { CreatePostPayload } from '@/types/post'

const postsCollection = collection(db, 'posts')

const createPost = async (payload: CreatePostPayload) => {
    // todo: add zod validation

    const postRef = await addDoc(postsCollection, {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })
    return postRef.id
}

const getPost = async (id: string) => {
    const postRef = doc(postsCollection, id)
    const postDoc = await getDoc(postRef)

    if (postDoc.exists()) {
        // todo: add zod validation
        return postDoc.data()
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
    const posts = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))

    return {
        posts,
        lastDoc: postsSnapshot.docs[postsSnapshot.docs.length - 1],
        hasMore: postsSnapshot.docs.length === pageSize,
    }
}

const postService = {
    createPost,
    getPost,
    getPosts,
}

export default postService
