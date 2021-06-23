import Link from 'next/link'
import Image from 'next/image'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

export default function Navbar() {
    const { user, username } = useContext(UserContext)

    return <nav className="navbar">
        <ul>
            <li>
                <Link href="/">
                    <button className="btn-logo">FEED</button>
                </Link>
            </li>

            {/* signed in */}
            {username && (
                <>
                    <li className="push-left">
                        <Link href="/admin">
                            <button className="btn-blue">Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <Image
                                src={user?.photoURL}
                                alt="user profile avatar"
                            />
                        </Link>
                    </li>
                </>
            )}

            {/* not signed in */}
            {!username && (
                <li>
                    <Link href="/enter">
                        <button className="btn-blue">Log in</button>
                    </Link>
                </li>
            )}
        </ul>
    </nav>

}