'use client';
import AppSideBar from '../sidebar';
import styles from '../../Styles/ground.module.css';
import { UilPen } from '@iconscout/react-unicons';
import groundImg from '../../assets/ground.jpg';
import Image from 'next/image';
import { UilExclamationTriangle } from '@iconscout/react-unicons'
import 'bootstrap/dist/css/bootstrap.min.css';
import { React, useEffect, useState } from 'react';
import Modal from '../Modal';
import store from '@/Global/store';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';



const ground = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  // const csvData = useSelector((state) => state.csv.csvData);

  const modalAction = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(()=>{
    const savedTransformedData = localStorage.getItem('transformedData');
const transformedData = savedTransformedData ? JSON.parse(savedTransformedData) : [];


  },[])
  return (
    <Provider store={store}>
    <div className='d-flex'>
      <AppSideBar />
      <div className='container-fluid'>
        <div className='row'>
          <main role='main' className={` ${styles.mainContent}`}>
            <div className={styles.heading}>
              <p>Formation overview</p>
              <div className='d-flex justify-content-left align-items-center'>
                <input
                  type='text'
                  value='Team Name'
                  className={`form-control ${styles.teamInput}`}
                />
                {/* <UilPen size='18px' color='#fff' /> */}
              </div>
            </div>
            <div className={`col-md-12 ${styles.overview_content}`}>
              <div className={`col-md-9 d-flex ${styles.imgContainer}`}>
                <Image
                  src={groundImg}
                  alt='ground'
                  style={{
                    width: '890px',
                    height: '470px',
                    borderRadius: '5px',
                  }}
                />
                {/* <div className={`${styles.circle}`}>
                    1
                 <span>Andrew messi</span> </div>
                <div className={`${styles.circle}`}>2</div>
                <div className={`${styles.circle}`}>3</div>
                <div className={`${styles.circle}`}>4</div>
                <div className={`${styles.circle}`}>5</div>
                <div className={`${styles.circle}`}>6</div>
                <div className={`${styles.circle}`}>15</div>
                <div className={`${styles.circle}`}>16</div>
                <div className={`${styles.circle}`}>30</div>
                <div className={`${styles.circle}`}>19</div> */}
              </div>
              <div className={`col-md-3 ${styles.playerInfo}`}></div>
            </div>
          </main>
        </div>
      </div>
      {false && (
        <>
          {
            <Modal onClose={modalAction} size={'sm'} icon={false}>
              <div className={styles.ground_modal_container}>
                <div className={styles.modal_icon} >

                <UilExclamationTriangle/>
                <h6 className={styles.import_head}>Not enought starters</h6>
                </div>
                <p>
                  Your team doesn't have enough starters for one or more of the
                  positions in the 4-3-3 formation
                </p>
              </div>
            </Modal>
          }
        </>
      )}
    </div>
    </Provider>
  );
};

export default ground;
