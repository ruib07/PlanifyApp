import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

interface ConfirmRSVPProps {
  show: boolean;
  onHide: () => void;
  eventId: string;
}

const ConfirmRSVP: React.FC<ConfirmRSVPProps> = ({ show, onHide, eventId }) => {
  const [loading, setLoading] = useState(false);

  const showSuccess = () => {
    toast.success("Presence confirmed successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error("Presence was not successfull!", {
      position: "bottom-right",
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const handleRSVP = async () => {
    setLoading(true);
    const userId = localStorage.getItem("Id");
    const userToken = localStorage.getItem("userToken");

    if (!userId || !userToken) {
      alert("User not authenticated!");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:3005/v1/rsvps/rsvp",
        { UserId: userId, EventId: eventId, Status: "confirmed" },
        {
          headers: {
            Authorization: `bearer ${userToken}`,
          },
        }
      );
      showSuccess();
    } catch (error) {
      showError();
    } finally {
      setLoading(false);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm your presence</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to confirm your presence?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="pconsultation-btn"
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="pconsultation-btn"
          onClick={handleRSVP}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Yes"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmRSVP;
