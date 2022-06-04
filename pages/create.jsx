import React from 'react'
import BaseTitle from '../components/baseTitle/BaseTitle'
import MainButton from '../components/mainButton/MainButton'
import BaseLayout from '../layouts/BaseLayout'
import Image from 'next/image';
import { CreateContainer, CreateContent } from './styles/create'
import { useAuth } from '../context/AuthContext';

const Create = () => {
  const image = require("../public/images/undraw_Compose_music_re_wpiw.svg");
  const {user} = useAuth();
  return (
    <>
      {user &&
        <BaseLayout>
          <CreateContainer>
            <BaseTitle title={'sound'} subtitle={'create'}/>
            <CreateContent>
              <form>
                <label>Song name</label>
                <input
                  type='text'
                  placeholder='songname'
                />
                <label>Song file</label>
                <input
                  type='file'
                  placeholder='examplefile.mp3'
                />
                <label>Song cover</label>
                <input
                  type='file'
                  placeholder='examplefile.mp3'
                />
                <MainButton>Upload!</MainButton>
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