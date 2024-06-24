
import { Routes, Route } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage.jsx';
import LoginPage from './pages/Login.jsx';
import Layout from './Layout.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import axios from 'axios';
import { UserContextProvider } from './UserContext.jsx';
import ProfilePage from './pages/AccountPage.jsx';
import CreatePage from './pages/CreateExPage.jsx';
import CreateFormPage from './pages/CreateFormPage.jsx';
import UserExhibitionPage from './pages/UserExhibitionPage.jsx';
import UserExbStallPage from './pages/UserExbStallPage.jsx';

axios.defaults.baseURL = 'http://localhost:4000' 
axios.defaults.withCredentials= true ;


function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />}/>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/register' element={<RegisterPage />}/>
        <Route path='/account' element={<ProfilePage />}/>
        <Route path='/account/create' element={<CreatePage />}/>
        <Route path='/account/create/new' element={<CreateFormPage />}/>
        <Route path="/account/create/new/:exbTitle" element={<UserExhibitionPage />} />
        <Route path="/account/create/new/:exbTitle/:stall" element={<UserExbStallPage />} />



      </Route>
    </Routes>
    </UserContextProvider>
  )
  } 
export default App
