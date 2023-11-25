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

import ronaldo from '../../assets/ronaldo.png'
import Link from 'next/link';



const ground = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [data , setData] = useState([]);

  const [playerData , setPlayerData] = useState(null);

  

  const modalAction = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(()=>{


debugger
    const savedTransformedData = sessionStorage.getItem('transformedData');

    if(savedTransformedData){
      const transformedData = savedTransformedData ? JSON.parse(savedTransformedData) : [];
      setData(transformedData);
      setModalOpen(false);
      setPlayerData(transformedData[0]);
    }
    else{
      setModalOpen(true);
    }




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
               { data.slice(0, 10).map((player)=>(
                 <div className={`${styles.circle}`} 
                 style={{cursor:'pointer'}}
                 onClick={()=>{
                  setPlayerData(player)}}>
                 {player['Jersey Number']}
              <span>{player['Player Name']}</span> </div>

               ))}
              </div>
              {playerData && <div className={`col-md-3 ${styles.playerInfo}`}>
                  <div className={`col-md-9 ${styles.player_data}`}>
                        <div className={styles.player_pic}>
                          <div className={styles.image}>
                            <img src={playerData['Player Image']} alt={playerData['Player Name']} style={{
                              width:'200px',
                              height:'200px',
                              position: 'relative',
                              display:'block',
                              opacity : '0.8'
                            }}/>
                          </div>
                          <div className={styles.player_title}>
                            <h4>{playerData['Player Name']}</h4>
                            <h6>{playerData.Position}</h6>
                          </div>
                        </div>

                        <div className={styles.bio}>
                          <div className={styles.info}>
                            <span className={styles.text1}>Height</span>
                            <span className={styles.text2}>{playerData.Height}m</span>
                          </div>
                          <div className={styles.info}>
                            <span className={styles.text1}>Weight</span>
                            <span className={styles.text2}>{playerData.Weight}Kg</span>
                          </div>
                          <div className={styles.info}>
                            <span className={styles.text1}>Nationality</span>
                            <span className={styles.text2}><img
                          src={playerData['Flag Image']}
                          className={styles.nation_img}
                          alt=''
                        />{' '}{playerData.Nationality}</span>
                          </div>
                        </div>
                  </div>
                  <div className={`col-md-3 mt-3 p-0`}>

                    <div className={styles.pro_info}>
                      <div className={styles.next_info}>
                        <h2>{playerData.Appearances}</h2>
                        <span>Appearances</span>
                      </div>
                      <div className={styles.next_info}>
                        <h2>{playerData['Minutes Played']}</h2>
                        <span>Minutes Played</span>
                      </div>
                    </div>
                    <div className={`${styles.pro_info}`} style={{ gap:'70px'}}>
                      <div className={styles.next_info}>
                      <h2>{playerData.Position === 'Goalkeeper' ? playerData['Clean Sheets']  : playerData['Goals ']}</h2>
                        <span>{playerData.Position === 'Goalkeeper' ?  'Clean Sheats' : 'Goals'}</span>
                      </div>
                      <div className={styles.next_info}>
                      <h2>{playerData.Position === 'Goalkeeper' ? playerData.Saves : playerData.Assists}</h2>
                        <span>{playerData.Position === 'Goalkeeper' ? 'Saves' : 'Assists'}</span>
                      </div>
                    </div>
                    
                    
                  </div>
              </div>}
            </div>
          </main>
        </div>
      </div>
      {isModalOpen && (
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

                <div>
                  <Link href={'/'}>
                  <button className={styles.modal_btn}>Go Back</button>
                  </Link>
                </div>
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
