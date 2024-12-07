import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useAuth } from './AuthContext.jsx'; 

function IdleMonitor() {
  const { LogoutUser } = useAuth(); 
  const [idleModal, setIdleModal] = useState(false);

  let idleTimeout = 1000 * 60 * 5;  
  let idleLogout = 1000 * 60 * 10; 
  let idleEvent;
  let idleLogoutEvent;

  const events = ['mousemove', 'click', 'keypress'];

  const sessionTimeout = () => {
    if (idleEvent) clearTimeout(idleEvent);
    if (idleLogoutEvent) clearTimeout(idleLogoutEvent);
  
    idleEvent = setTimeout(() => setIdleModal(true), idleTimeout);
    idleLogoutEvent = setTimeout(() => LogoutUser(), idleLogout);
  };
  
  const extendSession = () => {
    clearTimeout(idleEvent);
    setIdleModal(false);
    sessionTimeout(); 
  };

  useEffect(() => {
    for (let e of events) {
      window.addEventListener(e, sessionTimeout);
    }

    return () => {
      for (let e of events) {
        window.removeEventListener(e, sessionTimeout);
      }
    };
  }, []);

  return (
    <Modal isOpen={idleModal} toggle={() => setIdleModal(false)} className="idle-modal">
      <ModalHeader toggle={() => setIdleModal(false)} className="bg-warning text-dark">
        Session Expire Warning
      </ModalHeader>
      <ModalBody className="text-center">
        <p>Your session will expire in {idleLogout / 60 / 1000} minutes.</p>
        <p>Do you want to extend the session?</p>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={() => LogoutUser()}>Logout</Button>
        <Button color="primary" onClick={() => extendSession()}>Extend Session</Button>
      </ModalFooter>
    </Modal>
  );
}

export default IdleMonitor;
