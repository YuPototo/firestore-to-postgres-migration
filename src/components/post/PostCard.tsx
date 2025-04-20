import Link from 'next/link'
import { Post } from '@/types/post'

interface PostCardProps {
    post: Post
}

const PostCard = ({ post }: PostCardProps) => {
    const truncateContent = (content: string, maxWords: number = 100) => {
        const words = content.split(' ')
        if (words.length <= maxWords) return content
        return words.slice(0, maxWords).join(' ') + '...'
    }

    const formatDate = (date: Date) => {
        // return date.toLocaleDateString('en-US', {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric',
        // })
        return date
    }

    return (
        <Link href={`/post/${post.id}`}>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                </h2>
                <p className="text-gray-600 mb-4">
                    {truncateContent(post.content)}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {post.authorEmail}</span>
                    {/* <span>{formatDate(post.createdAt)}</span> */}
                </div>
            </div>
        </Link>
    )
}

export default PostCard
