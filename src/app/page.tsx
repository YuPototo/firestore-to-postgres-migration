'use client'

import { useEffect, useState } from 'react'
import PostCard from '@/components/post/PostCard'
import postService from '@/services/post.service'
import { Post } from '@/types/post'
import { QueryDocumentSnapshot } from 'firebase/firestore'

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | undefined>(
        undefined
    )
    const [pageHistory, setPageHistory] = useState<{
        [key: number]: QueryDocumentSnapshot | undefined
    }>({})

    const fetchPosts = async (
        page: number,
        direction: 'next' | 'prev' = 'next'
    ) => {
        try {
            setLoading(true)
            const cursor =
                direction === 'next' ? lastDoc : pageHistory[page - 1]

            const {
                posts: newPosts,
                hasMore: newHasMore,
                lastDoc: newLastDoc,
            } = await postService.getPosts(10, cursor)

            setPosts(newPosts as Post[])
            setHasMore(newHasMore)
            setLastDoc(newLastDoc)

            // Update page history
            setPageHistory((prev) => ({
                ...prev,
                [page]: newLastDoc,
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
    }, [])

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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Recent Posts
                </h1>
                <div className="flex flex-col gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>

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
        </div>
    )
}
