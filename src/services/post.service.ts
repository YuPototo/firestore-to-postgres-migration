import { db } from '@/lib/firebase/client'
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    getDoc,
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

const postService = {
    createPost,
    getPost,
}

export default postService
