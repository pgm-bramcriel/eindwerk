import React, {useState, useEffect} from 'react'
import BaseTitle from '../components/baseTitle/BaseTitle'
import MainButton from '../components/mainButton/MainButton'
import BaseLayout from '../layouts/BaseLayout'
import Image from 'next/image';
import { CreateContainer, CreateContent, Progress } from './styles/create'
import { useAuth } from '../context/AuthContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { addDoc, collection } from 'firebase/firestore';

const Create = () => {
  const image = require("../public/images/create-image.png");
  const {user} = useAuth();
  const [file, setFile] = useState();
  const [songName, setSongName] = useState('');
  const [songCover, setSongCover] = useState();
  const [fileProgress, setFileProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [songUrl, setSongUrl] = useState();
  const [coverUrl, setCoverUrl] = useState();

  const songsDocRef = collection(db, 'songs');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (file && songCover) {
      handleFileUpload();
    }
  }

  const handleFileUpload = () => {
    const storageRef = ref(storage, `/songs/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setFileProgress(progress);
    }, (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then(url => setSongUrl(url))
      .then(() => {
        handleCoverUpload();
      })
    }
    )
  }

  const handleCoverUpload = () => {
    const coverStorageRef = ref(storage, `/covers/${songCover.name}`);
    const coverUploadTask = uploadBytesResumable(coverStorageRef, songCover);

    coverUploadTask.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setImageProgress(progress);
    }, (err) => console.log(err),
    () => {
      getDownloadURL(coverUploadTask.snapshot.ref)
      .then(url => setCoverUrl(url))
    }
    )
  }

  useEffect(() => {
    if (songUrl && coverUrl && songName) {
      addDoc(songsDocRef, {
        artistName: user.displayName,
        filePath: songUrl,
        image: coverUrl,
        name: songName,
        userId: user.uuid
      })
    } 
  }, [songUrl, coverUrl])

  const handleFile = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
  }

  const handleSongCover = (e) => {
    e.preventDefault();
    setSongCover(e.target.files[0]);
  }

  return (
    <>
      {user &&
        <BaseLayout>
          <CreateContainer>
            <BaseTitle title={'sound'} subtitle={'create'}/>
            <CreateContent>
              <form onSubmit={handleSubmit}>
                <label>Song name</label>
                <input
                  onChange={(e) => setSongName(e.target.value)}
                  type='text'
                  placeholder='songname'
                />
                <label>Song file (.mp3)</label>
                <input
                  onChange={handleFile}
                  type='file'
                  placeholder='examplefile.mp3'
                  accept='.mp3'
                />
                <label>Song cover</label>
                <input
                  onChange={handleSongCover}
                  type='file'
                  placeholder='examplefile.mp3'
                  accept='.jpg, .png, .jpeg'
                />
                <MainButton>Upload!</MainButton>
                {
                  fileProgress > 0 &&
                  <Progress value={fileProgress} max={100}/>
                }
                {
                  fileProgress === 100 &&
                  <p>File uploaded!</p>
                }
                {
                  imageProgress > 0 &&
                  <Progress value={imageProgress} max={100}/>
                }
                {
                  imageProgress === 100 &&
                  <p>Image uploaded!</p>
                }
              </form>
              <section>
                <Image
                  alt="image"
                  src={image}
                  objectFit={'cover'}
                />
              </section>
            </CreateContent>
          </CreateContainer>
        </BaseLayout>
      }
      {user === null &&
        <BaseLayout>
          <h3>Sign up to upload a song.</h3>
        </BaseLayout>
      }
    </>
  )
}

export default Create