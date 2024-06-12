import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashboardSidebar from '../Component/DashboardSidebar';
import DashboardProfile from '../Component/DashboardProfile';
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
        <DashboardSidebar />
      </div>
      {
        tab === 'profile' && <DashboardProfile />
      }
    </div>
  )
}

export default Dashboards