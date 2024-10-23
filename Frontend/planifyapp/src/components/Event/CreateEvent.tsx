import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import '../../styles/Event/CreateEvent.css';
import AuthenticationNavbar from '../Navbar/AuthenticationNavbar';

const CreateEvent: React.FC = () => {
  const [Title, setTitle] = useState<string>('');
  const [Description, setDescription] = useState<string>('');
  const [Location, setLocation] = useState<string>('');
  const [Date, setDate] = useState<string>('');
  const [Time, setTime] = useState<string>('');
  const [IsPublic, setIsPublic] = useState<boolean>(false);
  const navigate = useNavigate();

  const showSuccess = () => {
    toast.success('Event registration completed successfully!', {
      position: 'bottom-right',
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };

  const showError = () => {
    toast.error('Event registration was not completed!', {
      position: 'bottom-right',
      autoClose: 5000,
      closeOnClick: true,
      draggable: true,
    });
  };
    
  const getLocalStorageItem = (key: string): string | null => {
    return localStorage.getItem(key);
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
      
    const userToken = getLocalStorageItem('userToken');
    const CreatorId = getLocalStorageItem('Id');

    if (userToken) {
      const newEvent = {
        Title,
        Description,
        Location,
        Date,
        Time,
        IsPublic,
        CreatorId,
      };

      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `bearer ${userToken}`,
        };
              
        await axios.post('http://localhost:3005/v1/events', newEvent, {
          headers: headers,
        });
        console.log('Novo evento sendo enviado:', newEvent);
        showSuccess(); 

        setTitle('');  
        setDescription('');   
        setLocation('');
        setDate('');
        setTime('');
        setIsPublic(false);
        navigate('/');
      } catch (error) {
        console.error('Erro ao enviar evento', error);
        showError();
      }  
    } else {
      showError();
    }
  };

  return (
    <>
      <AuthenticationNavbar /><br /><br />
      <div className="createevent-container">
        <div className="createevent-grid">
          <div className="createevent-card-container col-sm-9 col-md-7 col-lg-5">
            <div className="createevent-card1 col-sm-9 col-md-7 col-lg-5">
              <div className="createevent-card createevent-card-signin my-5">
                <div className="createevent-card-body">
                  <h5 className="createevent-card-title text-center">Create an event</h5>
                  <br />
                  <form className="createevent-form-signin" onSubmit={registerUser}>
                    <div className="createevent-inputs">
                      <div className="createevent-form-label-group">
                        <input
                          type="text"
                          id="Name"
                          name="Name"
                          className="form-control"
                          placeholder="Name"
                          required
                          value={Title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      <div className="createevent-form-label-group">
                        <textarea
                          id="Description"
                          name="Description"
                          className="form-control"
                          placeholder="Description"
                          required
                          value={Description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={5}
                        />
                      </div>
                      <div className="createevent-form-label-group">
                        <input
                          type="text"
                          id="Location"
                          name="Location"
                          className="form-control"
                          placeholder="Location"
                          required
                          value={Location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <div className="createevent-form-label-group">
                        <input
                          type="date"
                          id="Date"
                          name="Date"
                          className="form-control"
                          placeholder="Date"
                          required
                          value={Date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                      <div className="createevent-form-label-group">
                        <input
                          type="time"
                          id="Time"
                          name="Time"
                          className="form-control"
                          placeholder="Time"
                          required
                          value={Time}
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </div>
                      <div className="createevent-form-label-group">
                        <label>Is Public?</label>
                        <input
                          type="checkbox"
                          id="IsPublic"
                          name="IsPublic"
                          className="form-check-input ms-2"
                          checked={IsPublic}
                          onChange={(e) => setIsPublic(e.target.checked)} 
                        />
                      </div>
                      <br />
                      <Button
                        variant='light'
                        id="createevent-users"
                        className="createevent-btn"
                        type="submit"
                      >
                        Create Event
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEvent;
