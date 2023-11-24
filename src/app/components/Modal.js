// Modal.js
import React from 'react';
import PropTypes from 'prop-types';
import { UilTimes } from '@iconscout/react-unicons'
import styles from '../Styles/modal.module.css';

const Modal = ({ children, onClose , size , icon }) => {
  

  return (
    <div className={styles.modal_overlay}>
      <div className={`${styles.modal_content}`} style={{ backgroundColor: '#2d2d2d', width : size=='md' ? '1000px' : '400px' }}>
        {icon && <button className={styles.close_button} onClick={onClose}>
          <UilTimes size="24" color="#fff" />
        </button>}
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
