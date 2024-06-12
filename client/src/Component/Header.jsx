import React from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice';

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

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
          <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
            {
              theme === 'light' ? <FaSun /> : <FaMoon />
            }
          
          </Button>
          {
            currentUser ? (
              <Dropdown arrowIcon={false}
                inline
                label={
                  <Avatar altr='user' img={currentUser.profilePicture} rounded />
                }
              >
                <Dropdown.Header>
                  <span className='block text-sm'>{currentUser.username}</span>
                  <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                </Dropdown.Header>
                <NavLink to='/dashboard?tab=profile'>
                  <Dropdown.Item>Profile</Dropdown.Item>
                </NavLink>
                <Dropdown.Divider />
              </Dropdown>
            ) : (
              <NavLink to='/signin'>
                <Button gradientDuoTone="purpleToBlue" pill>
                  Sign In
                </Button>
              </NavLink>
            )
          }

          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === '/'}>
            <Link to='/'>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/about'}>
            <Link to='/about'>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/projects'}>
            <Link to='/projects'>Projects</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar >

    </>
  )
}

export default Header