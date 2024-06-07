import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
const Signup = () => {
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
            <form className='flex flex-col gap-4'>
              <div>
                <Label value="Your Username" />
                <TextInput type="text" placeholder='Username' id="username" />
              </div>
              <div >
                <Label value="Your Email" />
                <TextInput type="text" placeholder='Email' id="email" />
              </div>
              <div >
                <Label value="Your Password" />
                <TextInput type="text" placeholder='Password' id="passsword" />
              </div>
              <Button>Sign up with Google</Button>
              <Button>SignUp</Button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup