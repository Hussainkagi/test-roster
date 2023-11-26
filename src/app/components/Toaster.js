import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../Styles/toaster.module.css';

import { UilCheckCircle } from '@iconscout/react-unicons'
const Toaster = ({ showMessage, message, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(showMessage);

    if (showMessage) {
      const timeoutId = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [showMessage, onClose]);

  return (
    <div className={`${styles.toaster} ${visible ? styles.show : ''}`}>
      <span>{message}</span>
      <UilCheckCircle size = '22px' color='green' className={styles.icon}/>
    </div>
  );
};

Toaster.propTypes = {
  showMessage: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Toaster;




