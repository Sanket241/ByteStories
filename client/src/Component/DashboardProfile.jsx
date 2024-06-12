import React from 'react'
import { useSelector } from 'react-redux'
import { Alert, Button, Modal, ModalBody, TextInput } from 'flowbite-react';
const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user)
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
    <h1 className='my-2 text-center font-semibold text-3xl'>Profile</h1>
      <form >
        <div className="w-32 h-32 self-center overflow-hidden cursor-pointer shadow-md rounded-full">
        <img src={currentUser.profilePicture} alt="profile" className='rounded-full w-full object-cover border-8 border-[lightgray] ' />
        
      </div>
      <TextInput type='text' id='username' name='username' placeholder='Username' defaultValue={currentUser.username}   />
      <TextInput type='email' id='email' name='email' placeholder='Email' defaultValue={currentUser.email}  />
      <TextInput type='password' id='password' name='password' placeholder='Password'  />
      <Button  >Submit</Button>
      </form>
      <div className='text-red-500 flex justify-between'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashboardProfile