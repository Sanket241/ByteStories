import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { signinSuccess, signinStart, signinFailure } from '../redux/userSlice/userSlice'
import {useDispatch, useSelector} from 'react-redux'
import Oauth from '../Component/Oauth'

const Signin = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const {loading, error:errorMessage} = useSelector((state) => state.user)
  const [user, setUser] = useState({
    email: "",
    password: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value

    })
  }
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!user.email || !user.password) {
        return dispatch(signinFailure('Please fill all the fields'));
        }
      dispatch(signinStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(signinFailure(data.message))
      }
      
      if(res.ok ){
        dispatch(signinSuccess(data));
        navigate('/')
      }
      } catch (error) {
       dispatch(signinFailure(error.message))
    }


  }
  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1">
            <NavLink to='/' className='font-bold dark:text-white text-4xl' >
              <span className='text-gray-500' >Byte</span>
              <span className='text-gray-700'>Stories</span>
            </NavLink>
            <p className='text-sm mt-5'>
              You can sign up with your email and password or with Google.
            </p>
          </div>
          <div className="flex-1">
            <form className='flex flex-col gap-4' onSubmit={handleSubmit} >
              <div >
                <Label value="Your Email" />
                <TextInput type="email" placeholder='name@company.com' id="email" name="email" value={user.email} onChange={handleChange} />
              </div>
              <div >
                <Label value="Your Password" />
                <TextInput type="text" placeholder='Password' id="password" name="password" value={user.password} onChange={handleChange} />
              </div>
              <Button type="submit" disabled={loading} >
                {
                  loading ? (
                    <>
                      <Spinner size='sm' />
                      <span className='pl-3'>Loading...</span>
                    </>

                  ) : 'Sign in'
                }
              </Button>
              <Oauth />
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Don't Have an account?</span>
              <NavLink to='/signup' className='text-blue-500'>Sign Up</NavLink>
            </div>
            {
              errorMessage && (
                <Alert className='mt-5' color='failure'>{errorMessage}</Alert>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Signin