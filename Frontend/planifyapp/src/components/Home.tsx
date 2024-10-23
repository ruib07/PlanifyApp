import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";
import Navbar from "./Navbar/Navbar";
import EventImg from "../assets/event.jpg";
import { Link } from "react-router-dom";

interface Event {
  Title: string;
  Description: string;
  Location: string;
  Date: string;
  Time: string;
  IsPublic: boolean;
}

const formatTimeToHHMM = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const formatDateToDDMMYYYY = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const getEvents = useCallback(async () => {
    try {
      const response = await axios.get<Event[]>(
        "http://localhost:3005/v1/events"
      );
      setEvents(response.data);
    } catch (error) {}
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const filteredEvents = events.filter((event) =>
    event.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="container mt-5">
        <h1 className="text-center text-light mb-4">Events</h1>
        <div className="filter mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="row justify-content-center">
          {filteredEvents.map((event, index) => (
            <div className="col-md-8" key={index}>
              <Link
                to={`/Event/Details/${encodeURIComponent(event.Title)}`}
                style={{ textDecoration: "none" }}
              >
                <div className="card mb-4 d-flex flex-row">
                  <img
                    src={EventImg}
                    alt={event.Title}
                    className="card-img-left"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{event.Title}</h5>
                    <p className="card-text">{event.Description}</p>
                    <p className="card-text">
                      <strong>Location:</strong> {event.Location}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong> {formatDateToDDMMYYYY(event.Date)}
                    </p>
                    <p className="card-text">
                      <strong>Time:</strong> {formatTimeToHHMM(event.Time)}
                    </p>
                    <p className="card-text">
                      <strong>Public:</strong> {event.IsPublic ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
