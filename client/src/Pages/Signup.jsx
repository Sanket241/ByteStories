import React, { useState } from 'react'
import { Button, Label, TextInput } from 'flowbite-react'
import { NavLink } from 'react-router-dom'
const Signup = () => {

  const [user, setUser] = useState({
    username: "",
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
  const handleSubmit=async(e)=>{
    try {
      e.preventDefault();
      const res = await fetch('http://localhost:8000/api/auth/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(user),
      })
      const data = await res.json()
      console.log(data)
    } catch (error) {
      
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
              <div>
                <Label value="Your Username" />
                <TextInput type="text" placeholder='Username' id="username" name="username" value={user.username} onChange={handleChange} />
              </div>
              <div >
                <Label value="Your Email" />
                <TextInput type="email" placeholder='name@company.com' id="email" name="email" value={user.email} onChange={handleChange} />
              </div>
              <div >
                <Label value="Your Password" />
                <TextInput type="text" placeholder='Password' id="passsword" name="password" value={user.password} onChange={handleChange} />
              </div>
              <Button>Sign up with Google</Button>
              <Button type="submit" >SignUp</Button>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>
              <NavLink to='/signin' className='text-blue-500'>Sign in</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup