import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = ({ message, trigger, type }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (trigger) {
      toast[type](message, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });

      setShowToast(true);
    }
  }, [message, trigger]);

  return (
    <div>
      {showToast && (
        <ToastContainer
        
          position='top-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'

        />
      )}
    </div>
  );
};

export default Toast;
