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
// import Dashboard from './Pages/Dashboard'
import Footer from './Component/Footer'
import Error from './Pages/Error'
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/privacy-policy" element={<PrivacyandPolicy />} />
          <Route path="/terms" element={<TermsandCondition />} />
          <Route path="/*" element={<Error />} />

        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App