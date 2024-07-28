import React, { useState, useEffect } from 'react'
import { Sidebar } from 'flowbite-react'
import { useSelector } from 'react-redux';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie, } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/userSlice/userSlice';
const DashboardSidebar = () => {
  const { currentUser } = useSelector((state) => state.user)

  const location = useLocation();
  const [tab, setTab] = useState('');
  const dispatch = useDispatch();

  const handlesignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST',
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div' >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin && (
            <Link to='/dashboard?tab=posts'>
              <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} labelColor='dark' as='div' >
                Post
              </Sidebar.Item>
            </Link>
          )}
           {currentUser.isAdmin && (
            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item active={tab === 'comments'} icon={HiOutlineUserGroup} labelColor='dark' as='div' >
                Comments
              </Sidebar.Item>
            </Link>
          )}
            {currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item active={tab === 'dash'} icon={HiOutlineUserGroup} labelColor='dark' as='div' >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
           {currentUser.isAdmin && (
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} labelColor='dark' as='div' >
                Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handlesignout} >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashboardSidebar