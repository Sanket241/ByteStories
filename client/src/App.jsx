import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import Project from './Pages/Projects'
import About from './Pages/About'
import Header from './Component/Header'
import PrivacyandPolicy from './Pages/PrivacyandPolicy'
import TermsandCondition from './Pages/TermsandCondition'
import Footer from './Component/Footer'
import Error from './Pages/Error'
import PrivateRoute from './Component/PrivateRoute'
import Dashboards from './Pages/Dashboards'
import AdminPrivateRoute from './Component/AdminPrivateRoute'
import CreatePost from './Pages/CreatePost'
import Updatepost from './Pages/Updatepost'
import Postpage from './Pages/Postpage'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsandCondition />} />
          <Route path="/privacy-policy" element={<PrivacyandPolicy />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/post/:postSlug" element={<Postpage />} />

          <Route element={<PrivateRoute />} >
          <Route path="/dashboard" element={<Dashboards />} />
          
          </Route>

          <Route element={<AdminPrivateRoute />} >
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<Updatepost />} />
          
          </Route>

          <Route path="/*" element={<Error />} />

        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App