
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
import ExhibtionPage from './pages/ExhibitionPage.jsx';
import Exhibition from './pages/Exhibition.jsx';
import ExhibitionStall from './pages/ExhibitionStall.jsx';
import VisitPage from './pages/VisitPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import UploadDetailsPage from './pages/UploadDetailsPage.jsx';
import StallDetailsPage from './pages/UserStallDetailsPage.jsx';
import CartPage from './pages/Cart.jsx';
import ARView from './pages/AR-mode.jsx';

axios.defaults.baseURL =  import.meta.env.VITE_API_BASE_URL;
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
        <Route path='/account/visit' element={<VisitPage />}/>
        <Route path='/account/create/new' element={<CreateFormPage />}/>
        <Route path="/account/create/new/:exbTitle" element={<UserExhibitionPage />} />
        <Route path="/account/create/:id" element={<CreateFormPage />} />
        <Route path="/account/create/new/:exbTitle/:stall" element={<UserExbStallPage />} />
        <Route path="/account/create/:exbTitle/:stallId" element={<StallDetailsPage />} />
        <Route path="/exhibition/:exbId" element={<ExhibtionPage />} />
        <Route path="/exhibitions/:exbId/:exbTitle" element={<Exhibition />} />
        <Route path="/exhibitions/:exbId/:exbTitle/:stallId" element={<ExhibitionStall />} />
        <Route path="/pricing/:imgId" element={<PricingPage />} />
        <Route path="/uploadDetails/:stallId/:imgId" element={<UploadDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/ar-view/:stallId" element={<ARView />} />



      </Route>
    </Routes>
    </UserContextProvider>
  )
  } 
export default App
