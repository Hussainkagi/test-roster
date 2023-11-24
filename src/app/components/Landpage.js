// Dashboard.js
'use client';
import { React, useEffect, useState, useContext, useRef } from 'react';
import { UilPen, UilCheck } from '@iconscout/react-unicons';
import styles from '../Styles/landpage.module.css';
import Modal from './Modal';
import * as Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { setCsvData } from '@/Global/cvAction';

import { useSelector } from 'react-redux';


const LandPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('team name');
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [csvData1, setCsvDataPlayer] = useState([]);
 

  const csvData = useSelector((state) => state.csv.csvData);





  const modalAction = () => {
    setModalOpen(!isModalOpen);
  };


  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const data = await fetchCsv(file);
      const parsedData = Papa.parse(data);

      console.log(parsedData);

      const headers = parsedData.data[0];

      // Create an array of player objects
      const playerObjects = parsedData.data.slice(1).map((playerData) => {
        const playerObject = {};
        headers.forEach((header, index) => {
          playerObject[header] = playerData[index];
        });
        return playerObject;
      });

      setCsvDataPlayer(playerObjects);
      dispatch(setCsvData(playerObjects));
    }
  };
  const fetchCsv = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });
  };


  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://script.google.com/macros/s/AKfycbz-4FAjISF7SGwH8z5uBlJ7VZcE8igtasuVqf_Gi2lPr4e7w1PkIZMNmN8oi0a9yTgXzg/exec'
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  const handleTeaChange = (e) => {
    setTeamName(e.target.value);
    setIsChanging(true);
  };



  return (
    <div className='container-fluid'>
      <div className={`row`}>
        <main role='main' className={` ${styles.mainContent}`}>
          <div className={`row d-flex align-items-center ${styles.tabHead}`}>
            <div className={`col-md-8 ${styles.heading}`}>
              <p className={styles.teamName}>roster details</p>
              <div className='d-flex justify-content-left align-items-center'>
                <input
                  id='teamName'
                  type='text'
                  disabled={isNameChanged}
                  value={teamName}
                  onChange={handleTeaChange}
                  className={`form-control ${styles.teamInput}`}
                />
                <label htmlFor='teamName'>
                  {!isChanging
                    ? !isNameChanged && (
                        <UilPen
                          size='18px'
                          color='#fff'
                          className={styles.pencil}
                        />
                      )
                    : !isNameChanged && (
                        <UilCheck
                          size='23px'
                          color='#fff'
                          onClick={() => {
                            setIsNameChanged(true), setIsNameChanged(true);
                          }}
                        />
                      )}
                </label>
              </div>
            </div>
            <div className={`col-md-2 ${styles.search_box}`}>
              <div class={styles.inputBox_container}>
                <svg
                  class={styles.searchIcon}
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 48 48'
                  alt='search icon'
                >
                  <path d='M46.599 46.599a4.498 4.498 0 0 1-6.363 0l-7.941-7.941C29.028 40.749 25.167 42 21 42 9.402 42 0 32.598 0 21S9.402 0 21 0s21 9.402 21 21c0 4.167-1.251 8.028-3.342 11.295l7.941 7.941a4.498 4.498 0 0 1 0 6.363zM21 6C12.717 6 6 12.714 6 21s6.717 15 15 15c8.286 0 15-6.714 15-15S29.286 6 21 6z'></path>
                </svg>
                <input
                  class={styles.inputBox}
                  id='inputBox'
                  type='text'
                  placeholder='Search For Products'
                />
              </div>
            </div>

            <div
              className={`col-md-2 d-flex align-items-center justify-content-end ${styles.btn}`}
            >
              <button className={styles.import_btn} onClick={modalAction}>
                import Team
              </button>
            </div>
          </div>

          {/* Tabel  */}

          <div
            className={`col-md-12 ${styles.tableBody}`}
            style={{ overflowY: csvData.length > 0 ? 'scroll' : '' }}
          >
            {csvData.length > 0 ? (
              <table className={`table table-dark ${styles.table}`}>
                <thead>
                  <tr>
                    <th scope='col' className={styles.col}>
                      Player Name
                    </th>
                    <th scope='col' className={styles.col}>
                      Jersey Number
                    </th>
                    <th scope='col' className={styles.col}>
                      Starter
                    </th>
                    <th scope='col' className={styles.col}>
                      Position
                    </th>
                    <th scope='col' className={styles.col}>
                      height
                    </th>
                    <th scope='col' className={styles.col}>
                      weight
                    </th>
                    <th scope='col' className={styles.col}>
                      Nationality
                    </th>
                    <th scope='col' className={styles.col}>
                      Appearances
                    </th>
                    <th scope='col' className={styles.col}>
                      Minutes Played
                    </th>
                    <th scope='col' className={styles.col}></th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((player, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className={styles.row}>
                        <img
                          src={player['Flag Image']}
                          className={styles.table_img}
                          alt=''
                        />{' '}
                        {player['Player Name']}
                      </td>
                      <td className={styles.row}>{player['Jersey Number']}</td>
                      <td className={styles.row}>{player.Starter}</td>
                      <td className={styles.row}>{player.Position}</td>
                      <td className={styles.row}>{player.Height}</td>
                      <td className={styles.row}>{player.Weight}</td>
                      <td className={styles.row}>{player.Nationality}</td>
                      <td className={styles.row}>{player.Appearances}</td>
                      <td className={styles.row}>{player['Minutes Played']}</td>
                      <td className={styles.row}
                      >
                        ...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.empty_screen}>
                <p className={styles.empty_title}>
                  You do not have any players on the Roaster.
                </p>
                <button className={styles.import_link} onClick={modalAction}>
                  import Team
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <>
          {
            <Modal onClose={modalAction} size={'md'} icon={true}>
              <div className={styles.import_container}>
                <h3 className={styles.import_head}>Importer</h3>
                <p>Roster File</p>
                <div class='input-group mb-3'>
                  <input
                    id='file-input'
                    type='file'
                    class='form-control'
                    placeholder='No file Selected'
                    aria-label="Recipient's username"
                    aria-describedby='basic-addon2'
                    className={styles.import_input}
                    onChange={handleFileUpload}
                  />
                  <div
                    class='input-group-append'
                    className={styles.import_input}
                  >
                    <label
                      htmlFor='file-input'
                      class='input-group-text'
                      id='basic-addon2'
                      className={styles.imp_btn}
                    >
                      Select File
                    </label>
                  </div>
                </div>
                <p style={{ color: '#7e7e7e' }}>File must be .csv file</p>
              </div>
              <div className={styles.footer_btn}>
                <button>import</button>
              </div>
            </Modal>
          }
        </>
      )}
    </div>
  );
};

export default LandPage;
