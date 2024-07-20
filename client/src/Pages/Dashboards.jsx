import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardSidebar from '../Component/DashboardSidebar';
import DashboardProfile from '../Component/DashboardProfile';
import DashPost from '../Component/DashPost';
import Dashusers from '../Component/Dashusers';
const Dashboards = () => {

  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className="mid:w-56">
        {/* Sildebar  */}
        <DashboardSidebar />
      </div>
      {/* profile */}
      {
        tab === 'profile' && <DashboardProfile />
      }
      {/* post */}
      {tab === 'posts' && <DashPost />}
      {tab === 'users' && <Dashusers />}
    </div>
  )
}

export default Dashboards