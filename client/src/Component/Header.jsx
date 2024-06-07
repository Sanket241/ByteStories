import React from 'react'
import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import {FaMoon} from 'react-icons/fa'

const Header = () => {
  const path = useLocation().pathname;
  return (
    <>
      <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dARK:TEXT-WHITE' >
          <span className='text-gray-500' >Byte</span>
          <span className='text-gray-700'>Stories</span>
        </Link>
        <form className=''>
          <TextInput
            type='text'
            placeholder='Search...'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
          />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill><AiOutlineSearch /></Button>
        <div className='flex gap-2 md:order-2'>
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill>
            <FaMoon />
          </Button>
        <Link to='/'>
          <Button  gradientDuoTone="purpleToBlue" pill>
            Sign In
          </Button>
        </Link>
        <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path==='/'}>
            <Link to='/'>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path==='/about'}>
            <Link to='/about'>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path==='/projects'}>
            <Link to='/projects'>Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

    </>
  )
}

export default Header