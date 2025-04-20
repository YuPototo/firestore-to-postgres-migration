import { Comment as CommentType } from '@/types/comment'
import { formatDistanceToNow } from 'date-fns'

interface CommentProps {
    comment: CommentType
}

export const Comment = ({ comment }: CommentProps) => {
    return (
        <div className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                        {comment.authorEmail}
                    </span>
                    <span className="text-sm text-gray-500">
                        {formatDistanceToNow(comment.createdAt, {
                            addSuffix: true,
                        })}
                    </span>
                </div>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
            </p>
        </div>
    )
}
