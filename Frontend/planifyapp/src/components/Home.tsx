import React, { useCallback, useEffect, useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Home.css';

interface Event {
    Title: string;
    Description: string;
    Location: string;
    Date: string;
    Time: string;
    IsPublic: boolean;
};

const Home: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);

    const getEvents = useCallback(async () => {
        try {
            const response = await axios.get<Event[]>('http://localhost:3005/v1/events');
            setEvents(response.data); 
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
        }
    }, []);

    useEffect(() => {
        getEvents();
    }, [getEvents]);

    return (
        <div className="container mt-5">
            <h1 className="text-center text-light mb-4">Eventos</h1>
            <div className="row">
                {events.map((event, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title">{event.Title}</h5>
                                <p className="card-text">{event.Description}</p>
                                <p className="card-text">
                                    <strong>Location:</strong> {event.Location}
                                </p>
                                <p className="card-text">
                                    <strong>Date:</strong> {event.Date}
                                </p>
                                <p className="card-text">
                                    <strong>Time:</strong> {event.Time}
                                </p>
                                <p className="card-text">
                                    <strong>Public:</strong> {event.IsPublic ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
