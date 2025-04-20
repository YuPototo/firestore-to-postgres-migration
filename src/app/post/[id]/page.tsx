'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import postService from '@/services/post.service'
import Link from 'next/link'
import { Post } from '@/types/post'

export default function ViewPostPage() {
    const params = useParams()
    const { user } = useAuth()
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postId = params.id as string
                const post = await postService.getPost(postId)

                setPost(post)
            } catch (err) {
                console.error(err)
                setError('Failed to fetch post')
            } finally {
                setLoading(false)
            }
        }
        fetchPost()
    }, [params.id])

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

    const formatDate = (timestamp: {
        seconds: number
        nanoseconds: number
    }) => {
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-indigo-600 hover:text-indigo-500"
                    >
                        ← Back to homepage
                    </Link>
                    {user && post && user.uid === post.authorId && (
                        <Link
                            href={`/post/${post.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Edit Post
                        </Link>
                    )}
                </div>

                <article className="bg-white shadow rounded-lg p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {post.title}
                        </h1>
                        <div className="text-sm text-gray-500">
                            <span>By {post.authorEmail}</span>
                            <span className="mx-2">•</span>
                            <span>
                                Posted on {post.createdAt.toLocaleDateString()}
                            </span>
                            {post.createdAt.getTime() !==
                                post.updatedAt.getTime() && (
                                <>
                                    <span className="mx-2">•</span>
                                    <span>
                                        Updated on{' '}
                                        {post.updatedAt.toLocaleDateString()}
                                    </span>
                                </>
                            )}
                        </div>
                    </header>

                    <div className="prose max-w-none">
                        <p className="whitespace-pre-wrap text-gray-700">
                            {post.content}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    )
}
