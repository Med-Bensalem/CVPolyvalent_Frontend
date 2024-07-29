import React, { useState, useEffect } from 'react';

const SuccessAlert = ({ message }) => {
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        let timer;
        if (showAlert) {
            // Masquer la notification après 3 secondes (3000 millisecondes)
            timer = setTimeout(() => {
                setShowAlert(true);
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [showAlert]);

    return (
        <>
            {showAlert && (
                <div
                    className="alert alert-success d-flex align-items-center"
                    style={{
                        position: 'fixed',
                        top: '10px',
                        right: '10px',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    <div>
                        {message}
                    </div>
                </div>
            )}
        </>
    );
};

export default SuccessAlert;
