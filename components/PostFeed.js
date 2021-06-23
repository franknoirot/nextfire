import Link from 'next/link'

export default function PostFeed({ posts, admin }) {
    return posts ? posts.map(post => <PostItem post={post} key={post.slug} admin={admin} />) : null
}

function PostItem({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length
    const timeToRead = (wordCount / 100 + 1).toFixed(0)

    return (
        <div className="card">
            <Link href={`/${post.username}`}>
                <a>
                    <strong>By @{post.username}</strong>
                </a>
            </Link>

            <Link href={`/${post.username}/${post.slug}`}>
                <h2>
                    <a>{post.title}</a>
                </h2>
            </Link>

            <footer>
                <span>
                    {wordCount} words. {timeToRead} min to read
                </span>
                <span className="push-left">❤️ {post.heartCount || 0} Heart{!(post.heartCount === 1) ? 's' : ''}</span>
            </footer>
        </div>
    )
}