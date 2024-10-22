import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
{/* import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import RecoverPasswordEmail from './components/RecoverPassword/RecoverPasswordEmail';
import ChangePassword from './components/RecoverPassword/ChangePassword';
import UserProfile from './components/UserProfile';
import CreateEvent from './components/Event/CreateEvent';
import EventDetails from './components/Event/EventDetails';
import ConfirmRSVP from './components/RSVP/ConfirmRSVP';
import GetRSVPAttendees from './components/RSVP/GetRSVPAttendees'; */}

const App: React.FC = () => {
  return (
    <Router>
      <div className='container'>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Home />} />
          {/*<Route path='/Authentication/Registration' element={<Register />} />
          <Route path='/Authentication/Login' element={<Login />} />
          <Route path='/RecoverPassword/SendEmail' element={<RecoverPasswordEmail />} />
          <Route path='/RecoverPassword/ChangePassword' element={<ChangePassword />} />
          <Route path='/UserProfile/:Id' element={<UserProfile />} />
          <Route path='/Event/Create' element={<CreateEvent />} />
          <Route path='/Event/:Title' element={<EventDetails />} />
          <Route path='/RSVP/Confirm' element={<ConfirmRSVP />} />
          <Route path='/RSVP/Attendees' element={<GetRSVPAttendees />} />*/}
          <Route path='*' element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};
 
export default App;
