import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../Firebase';
import { useDispatch } from 'react-redux';
import { signinSuccess } from '../redux/userSlice/userSlice';
import { useNavigate } from 'react-router-dom';
import React from 'react'

const Oauth = () => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    

    const submit = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFormGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFormGoogle.user.displayName,
                    email: resultsFormGoogle.user.email,
                    googlePhotoUrl: resultsFormGoogle.user.photoURL,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(signinSuccess(data))
                navigate('/')
            }

        } catch (error) {
            console.log(error.message)

        }
    }
    return (
        <>
            <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={submit} >
                <AiFillGoogleCircle className='w-6h-6 mr-2' />
                Sign in with Google
            </Button>
        </>
    )
}

export default Oauth