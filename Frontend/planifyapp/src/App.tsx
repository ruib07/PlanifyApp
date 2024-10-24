/* eslint-disable no-lone-blocks */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { ToastContainer } from "react-toastify";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import RecoverPasswordEmail from "./components/RecoverPassword/RecoverPasswordEmail";
import ChangePassword from "./components/RecoverPassword/ChangePassword";
import UserProfile from "./components/UserProfile";
import CreateEvent from "./components/Event/CreateEvent";
import EventDetails from "./components/Event/EventDetails";
import Attendees from "./components/RSVP/Attendees";
import ScrollToTop from "./components/ScrollToTop";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <ToastContainer />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Authentication/Registration" element={<Register />} />
          <Route path="/Authentication/Login" element={<Login />} />
          <Route
            path="/RecoverPassword/EmailConfirmation"
            element={<RecoverPasswordEmail />}
          />
          <Route
            path="/RecoverPassword/ChangePassword"
            element={<ChangePassword />}
          />
          <Route path="/UserProfile/:Id" element={<UserProfile />} />
          <Route path="/Event/Create" element={<CreateEvent />} />
          <Route path="/Event/Details/:Title" element={<EventDetails />} />
          <Route path="/Events/:eventId/Attendees" element={<Attendees />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
