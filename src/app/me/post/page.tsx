'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Post, PostDtoType } from '@/types/post'
import PostCard from '@/components/post/PostCard'
import Link from 'next/link'

export default function MyPostsPage() {
    const { user } = useAuth()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [lastPostId, setLastPostId] = useState<string | undefined>(undefined)
    const [pageHistory, setPageHistory] = useState<{
        [key: number]: string | undefined
    }>({})

    const fetchPosts = async (
        page: number,
        direction: 'next' | 'prev' = 'next'
    ) => {
        if (!user) return

        try {
            setLoading(true)
            const cursor =
                direction === 'next' ? lastPostId : pageHistory[page - 1]

            const res = await fetch(
                `/api/v0/posts?authorId=${user.uid}&lastPostId=${cursor}`
            )
            const data = await res.json()

            const posts: Post[] = data.posts.map((post: PostDtoType) => ({
                ...post,
                createdAt: new Date(post.createdAt),
                updatedAt: new Date(post.updatedAt),
            }))

            setPosts(posts)
            setHasMore(data.hasMore)
            setLastPostId(data.lastPostId)

            // Update page history
            setPageHistory((prev) => ({
                ...prev,
                [page]: data.lastPostId,
            }))
        } catch (err) {
            console.error(err)
            setError('Failed to fetch posts')
        } finally {
            setLoading(false)
        }
    }

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1)
        fetchPosts(currentPage + 1, 'next')
    }

    const handlePrevPage = () => {
        setCurrentPage((prev) => prev - 1)
        fetchPosts(currentPage - 1, 'prev')
    }

    useEffect(() => {
        fetchPosts(1)
    }, [user])

    if (loading && posts.length === 0) {
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

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Posts
                    </h1>
                    <Link
                        href="/post/create"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Create New Post
                    </Link>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            You have no posts yet.
                        </p>
                        <Link
                            href="/post/create"
                            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700"
                        >
                            Create your first post
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6 flex flex-col gap-4">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                        <div className="mt-8 flex justify-center space-x-2">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-gray-700">
                                Page {currentPage}
                            </span>
                            <button
                                onClick={handleNextPage}
                                disabled={!hasMore}
                                className="px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
