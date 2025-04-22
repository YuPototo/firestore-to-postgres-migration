'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import Link from 'next/link'
import { Post, PostSchema } from '@/types/post'

export default function EditPostPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const [post, setPost] = useState<Post | null>(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postId = params.id as string

                const postResponse = await fetch(`/api/v0/posts/${postId}`)
                const postData = await postResponse.json()

                const post = PostSchema.safeParse({
                    ...postData,
                    createdAt: new Date(postData.createdAt),
                    updatedAt: new Date(postData.updatedAt),
                })

                if (post.success) {
                    setPost(post.data)
                    setTitle(post.data.title)
                    setContent(post.data.content)
                } else {
                    setError('Post validation failed')
                }
            } catch (err) {
                console.error(err)
                setError('Failed to fetch post')
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        if (!user || !post) {
            setError('You must be logged in to edit a post')
            setIsSubmitting(false)
            return
        }

        if (user.uid !== post.authorId) {
            setError('You can only edit your own posts')
            setIsSubmitting(false)
            return
        }

        try {
            const token = await user.getIdToken()
            const response = await fetch(`/api/v0/posts/${post.id}`, {
                method: 'PUT',
                body: JSON.stringify({ title, content }),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json()

            if (data.error) {
                setError(data.error)
                setIsSubmitting(false)
                return
            }

            router.push(`/post/${post.id}`)
        } catch (err) {
            console.error(err)
            setError('Failed to update post. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Post not found</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link
                        href={`/post/${post.id}`}
                        className="text-indigo-600 hover:text-indigo-500"
                    >
                        ← Back to post
                    </Link>
                </div>

                <div className="bg-white shadow rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Edit Post
                    </h1>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black px-3 py-2"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={10}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black px-3 py-2"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Post'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
