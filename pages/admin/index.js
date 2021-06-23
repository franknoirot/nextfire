import AuthCheck from "../../components/AuthCheck"
import { firestore, auth, serverTimestamp } from "../../lib/firebase"
import { useCollection } from 'react-firebase-hooks/firestore'
import PostFeed from "../../components/PostFeed"
import { useState, useContext } from "react"
import { useRouter } from 'next/router'
import { UserContext } from "../../lib/context"
import kebabCase from "lodash.kebabcase"
import styles from '../../styles/Admin.module.css'
import toast from "react-hot-toast"


export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  )
}

function PostList () {
  const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts')
  const query = ref.orderBy('createdAt')
  const [querySnapshot] = useCollection(query)

  const posts = querySnapshot?.docs.map(doc => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState('')

  // sanitize slug
  const slug = encodeURI(kebabCase(title))

  // validate slug length
  const isValid = title.length > 3 && title.length < 100

  // create a new post in firestore
  const createPost = async e => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug)

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    }

    // commit the post to firestore
    await ref.set(data)

    toast.success('Post created!')

    // navigate to edit the new post
    router.push(`/admin/${slug}`)
  }

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="My Awesome Article"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  )
}