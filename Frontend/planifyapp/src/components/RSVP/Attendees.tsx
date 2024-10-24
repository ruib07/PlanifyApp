import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Image, Spinner } from "react-bootstrap";
import Navbar from "../Navbar/Navbar";

interface Attendee {
  Name: string;
  ProfilePicture: string | null;
}

const Attendees: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendees = async () => {
      const userToken = localStorage.getItem("userToken");
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: `bearer ${userToken}`,
        };

        const response = await axios.get(
          `http://localhost:3005/v1/rsvps/attendees?eventId=${eventId}`,
          {
            headers: headers,
          }
        );
        setAttendees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendees:", error);
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  const defaultProfilePicture = "https://pngimg.com/d/anonymous_mask_PNG28.png";

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <div className="attendees-container">
        <h2 className="text-center mt-5" style={{ color: "#FFF" }}>
          Attendees for Event
        </h2>
        <br />

        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
          </div>
        ) : attendees.length === 0 ? (
          <p className="text-center mt-5">No attendees found for this event.</p>
        ) : (
          <div className="attendees-list">
            {attendees.map((attendee, index) => (
              <Card key={index} className="mb-3">
                <Card.Body className="d-flex align-items-center">
                  <Image
                    src={attendee.ProfilePicture || defaultProfilePicture}
                    roundedCircle
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "10px",
                    }}
                    alt={attendee.Name}
                  />
                  <Card.Title>{attendee.Name}</Card.Title>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back to Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Attendees;
