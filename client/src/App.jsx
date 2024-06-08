import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Signup from './Pages/Signup'
import Signin from './Pages/Signin'
import Project from './Pages/Projects'
import About from './Pages/About'
import Error from './Pages/Error'
import Header from './Component/Header'
import Footer from './Component/Footer'
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
          <Route path="/*" element={<Error />} />

        </Routes>
        <Footer />
      </BrowserRouter>

    </>
  )
}

export default App