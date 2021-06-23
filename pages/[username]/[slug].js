import styles from '../../styles/Post.module.css';
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase"
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Link from 'next/link'
import PostContent from '../../components/PostContent';
import AuthCheck from '../../components/AuthCheck'
import HeartButton from '../../components/HeartButton'

export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getUserWithUsername(username)

  let post, path

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug)
    post = postToJSON(await postRef.get())

    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 50,
  }
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup('posts').get()

  const paths = snapshot.docs.map(doc => {
    const { slug, username } = doc.data()
    return {
      params: { username, slug },
    }
  })

  return {
    paths,
    fallback: 'blocking',
  }
}

export default function PostPage(props) {
  const postRef = firestore.doc(props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={props.post}></PostContent>
      </section>
      
      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} ❤️</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href="/enter">
              <button>❤️ Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  )
}