import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";
import EventImg from "../../assets/event.jpg";
import ConfirmRSVP from "../RSVP/ConfirmRSVP";
import "../../styles/Event/EventDetails.css";

interface Event {
  Id: string;
  Title: string;
  Description: string;
  Location: string;
  Date: string;
  Time: string;
  IsPublic: boolean;
  CreatorId: string;
}

const formatTimeToHHMM = (timeString: string): string => {
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
};

const EventDetails: React.FC = () => {
  const { Title } = useParams<{ Title: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [showRSVPModal, setShowRSVPModal] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/v1/events/${Title}`
        );
        setEvent(response.data);
      } catch (error) {}
    };

    fetchEvent();
  }, [Title]);

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="eventdetails-container mt-5">
        <img src={EventImg} alt={event.Title} className="eventdetails-img" />
        <h2 className="eventdetails-h2">{event.Title}</h2>
        <p className="eventdetails-p">
          <strong>Description:</strong> {event.Description}
        </p>
        <p className="eventdetails-p">
          <strong>Location:</strong> {event.Location}
        </p>
        <p className="eventdetails-p">
          <strong>Date:</strong> {new Date(event.Date).toLocaleDateString()}
        </p>
        <p className="eventdetails-p">
          <strong>Time:</strong> {formatTimeToHHMM(event.Time)}
        </p>
        <p className="eventdetails-p">
          <strong>Is Public:</strong> {event.IsPublic ? "Yes" : "No"}
        </p>

        <div className="d-flex align-items-center justify-content-center">
          <Button
            variant="outline-danger"
            onClick={() => setShowRSVPModal(true)}
          >
            Confirm your presence
          </Button>
          <span className="mx-2">|</span>
          <Button variant="outline-primary" onClick={() => navigate("/")}>
            See all attendees
          </Button>
        </div>

        <Button
          variant="outline-secondary"
          className="eventdetails-btn"
          onClick={() => navigate("/")}
        >
          Back to Event List
        </Button>
      </div>

      {event && (
        <ConfirmRSVP
          show={showRSVPModal}
          onHide={() => setShowRSVPModal(false)}
          eventId={event.Id}
        />
      )}
    </div>
  );
};

export default EventDetails;
