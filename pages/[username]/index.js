import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'
import { getUserWithUsername, postToJSON } from '../../lib/firebase'
import Metatags from '../../components/Metatags'

export async function getServerSideProps({ query }) {
  const { username } = query

  const userDoc = await getUserWithUsername(username)

  // short circuit to 404 behavior if user doesn't exists
  if (!userDoc) {
    return {
      notFound: true,
    }
  }

  let user = null
  let posts = null

  if (userDoc) {
    user = userDoc.data()
    const postsQuery = userDoc.ref
      .collection('posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)
    
    posts = (await postsQuery.get()).docs.map(postToJSON)
  }

  return {
    props: { user, posts } // passed to the page component as props
  }
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <Metatags title={`Posts by ${user.displayName}`} image={user.photoURL} />
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}