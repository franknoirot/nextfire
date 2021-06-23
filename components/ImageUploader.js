import { useState } from 'react'
import { auth, storage, STATE_CHANGED } from '../lib/firebase'
import Loader from './Loader'

export default function ImageUploader() {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState('0')
    const [downloadURL, setDownloadURL] = useState(null)
    const [copied, setCopied] = useState(false)

    const uploadFile = async (e) => {
        setCopied(false)
        const file = Array.from(e.target.files)[0]
        const extension = file.type.split('/')[1]

        // firestore storage bucket reference
        const ref = storage.ref(`uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`)
        setUploading(true)

        // begin firestore upload
        const task = ref.put(file)

        // listen to upload progress
        task.on(STATE_CHANGED, snapshot => {
            const pct = (snapshot.bytesTransferred / snapshot.totalBytes * 100).toFixed(0)
            setProgress(pct)
        })

        // get the URL after upload completes. Note: not a native promise
        task.then(_ => ref.getDownloadURL()) // but getDownloadURL() returns a Promise
            .then(downloadURL => {
                setDownloadURL(downloadURL)
                setUploading(false)
            })
    }

    const handleCopy = e => {
        document.execCommand('copy')
        setCopied(true)
    }

    return (
        <div className="box">
            <Loader show={uploading} />

            {uploading && <h3>{progress}%</h3>}

            {!uploading && (
                <label className="btn">
                    📸 Upload Image
                    <input type="file" onChange={uploadFile} accept="image/png, image/gif, image/jpeg"/>
                </label>
            )}

            {downloadURL && (
                <>
                    <code className="code-snippet" onClick={handleCopy}>{`![alt text](${downloadURL})`}</code>
                    <br/>
                    <span>📋 {!copied ? ' Click to copy' : ' Code copied!'}</span>
                </>
            )}
        </div>
    )
}