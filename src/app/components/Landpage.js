// Dashboard.js
'use client';
import { React, useEffect, useState, useContext, useRef } from 'react';
import { UilPen, UilCheck, UilTrashAlt } from '@iconscout/react-unicons';
import styles from '../Styles/landpage.module.css';
import Modal from './Modal';
import * as Papa from 'papaparse';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { setCsvData } from '@/Global/cvAction';
import { Form, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Toaster from './Toaster';


const LandPage = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isActionModal, setIsActionModal] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [teamName, setTeamName] = useState('team name');
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [csvData1, setCsvDataPlayer] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isChange, setIsChange] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(false);
  const [correctFile,setCorrectFile] = useState(false);
  const [showToast , setShowToast] = useState(false);
  const [toastMessage , setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    'Flag Image': '',
    'Player Name': '',
    'Jersey Number': '',
    Height: '',
    Weight: '',
    Nationality: '',
    Position: '',
    Starter: '',
    Appearances: '',
    'Minutes Played': '',
  });

  const [summary, setSummary] = useState({
    total: 0,
    goalkeeper: 0,
    forward: 0,
    midfielder: 0,
    defender: 0,
  });

  const nationality = [
    'Costa Rica',
    'Morocco',
    'French',
    'Spanish',
    'Brazilian',
    'Italian',
    'Argentina',
    'Guinea-Bissau',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setIsChange(true);
  };


  const AddToast = (message) =>{

    setShowToast(true);
    setToastMessage(message);
    setTimeout(()=>{
      setShowToast(false);
      setToastMessage('');
    },5000)
    
  }

  let displayPlayers = [];
  const csvData = useSelector((state) => state.csv.csvData);

  useEffect(() => {
    const filteredPlayers = csvData.filter(
      (player) =>
        player['Player Name']
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        player?.Position?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    displayPlayers = searchQuery.length > 0 ? filteredPlayers : csvData;

    setCsvDataPlayer(displayPlayers);
  }, [searchQuery]);



  useEffect(()=>{
    const savedTransformedData = sessionStorage.getItem('transformedData');
    const changedTeamName = sessionStorage.getItem('TeamName');

    if(changedTeamName){
      setIsNameChanged(true);
    }
    

    if(savedTransformedData){
      const transformedData = savedTransformedData ? JSON.parse(savedTransformedData) : [];
      setCsvDataPlayer(transformedData);
      dispatch(setCsvData(transformData(transformedData)));
    }

   


  },[])

  useEffect(() => {
   
  }, []);

  const transformData = (playerObjects) => {
    const transformedData = playerObjects.map((playerObject) => {
      const heightInMeters = playerObject.Height / 100;

      return {
        ...playerObject,
        Height: heightInMeters.toFixed(2),
      };
    });

    return transformedData;
  };

  const modalAction = (pass) => {
   
    switch (pass) {
      case 'import':
        setModalOpen(false);
      case 'action':
        setIsActionModal(false);
      case 'delete':
        setIsDelete(false);
      case 'edit':
        setIsEdit(false);
    }
  };

 

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {

      if(file.type === 'text/csv' ||  file.name.endsWith('.csv')){


        const data = await fetchCsv(file);
        const parsedData = Papa.parse(data);
        
      


  
        const headers = parsedData.data[0];
  
        const playerObjects = parsedData.data.slice(1).map((playerData) => {
          const playerObject = {};
          headers.forEach((header, index) => {
            playerObject[header] = playerData[index];
          });
          return playerObject;
        });
  
        const positionFrequency = playerObjects.reduce((acc, player) => {
          const position = player.Position;
          acc[position] = (acc[position] || 0) + 1;
          return acc;
        }, {});
  
        setSummary({
          total: playerObjects.length,
          goalkeeper: positionFrequency.Goalkeeper || 0,
          forward: positionFrequency.Forward || 0,
          midfielder: positionFrequency.Midfielder || 0,
          defender: positionFrequency.Defender || 0,
        });
  
        sessionStorage.setItem('transformedData', JSON.stringify(transformData(playerObjects)));
        
        dispatch(setCsvData(transformData(playerObjects)));

        setError(false);
        setCorrectFile(true);
      }


      else{
        //set error
        setError(true);
        setCorrectFile(false);
      }



   
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

  const handleDelete = () => {
    const updatedPlayerData = csvData.filter(
      (p) => p['Jersey Number'] !== selectedPlayer['Jersey Number']
    );
  
    sessionStorage.setItem('transformedData', JSON.stringify(updatedPlayerData));
  
    setCsvDataPlayer(updatedPlayerData);
    dispatch(setCsvData(updatedPlayerData));

    AddToast('Deleted Successfully');
  
    setSelectedPlayer(null);
  
    setIsActionModal(false);
  };

  const handleEdit = () => {
    setFormData({
      'Flag Image': selectedPlayer['Flag Image'],
      'Player Name': selectedPlayer['Player Name'],
      'Jersey Number': selectedPlayer['Jersey Number'],
      Height: selectedPlayer.Height,
      Weight: selectedPlayer.Weight,
      Nationality: selectedPlayer.Nationality,
      Position: selectedPlayer.Position,
      Starter: selectedPlayer.Starter,
      Appearances: selectedPlayer.Appearances,
      'Minutes Played': selectedPlayer['Minutes Played'],
    });
  };

  const handleTeaChange = (e) => {
    setTeamName(e.target.value);
    sessionStorage.setItem('TeamName', JSON.stringify(e.target.value));
    setIsChanging(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
  
    const updatedPlayerData = csvData.map((player) =>
      player['Jersey Number'] === selectedPlayer['Jersey Number'] ? formData : player
    );
  
    sessionStorage.setItem('transformedData', JSON.stringify(updatedPlayerData));
  
    setCsvDataPlayer(updatedPlayerData);
    dispatch(setCsvData(updatedPlayerData));
  
    setIsChange(false);
    setIsEdit(false);
    setSelectedPlayer(null);
    AddToast('Updated Successfully');
    setIsActionModal(false);
  };

  const renderImportModal = (
    <>
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
            className={!error ? styles.import_input : styles.import_input_error}
            onChange={handleFileUpload}
          />
          <div class='input-group-append' className={!error ? styles.import_input : styles.import_input_error}>
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
        {error && <p style={{color:'red'}}>Error</p>}
        {<p style={{ color: '#7e7e7e' }}>File must be .csv file</p>}
      </div>

      { correctFile &&
        <div className={styles.field_summary}>
          <h6>Field Summary</h6>
          <div className={styles.field_head}>
            <div>
              <span style={{ fontSize: '14px' }}>Total Players</span>
              <span style={{ fontSize: '24px' }}>{summary.total}</span>
            </div>
            <div>
              <span style={{ fontSize: '14px' }}>GoalKeepers</span>
              <span style={{ fontSize: '24px' }}>{summary.goalkeeper}</span>
            </div>
            <div>
              <span style={{ fontSize: '14px' }}>Defenders</span>
              <span style={{ fontSize: '24px' }}>{summary.defender}</span>
            </div>
            <div>
              <span style={{ fontSize: '14px' }}>MidFielders</span>
              <span style={{ fontSize: '24px' }}>{summary.midfielder}</span>
            </div>
            <div>
              <span style={{ fontSize: '14px' }}>Forwards</span>
              <span style={{ fontSize: '24px' }}>{summary.forward}</span>
            </div>
          </div>
        </div>
      }

      <div className={styles.footer_btn}>
        <button
          className={correctFile ? styles.acs_btn : styles.no_acs_btn}
          onClick={() => {
            setModalOpen(false);
            setCsvDataPlayer(csvData);
            AddToast('Import Success!')
          }}
        >
          import  
        </button>
      </div>
    </>
  );

  const renderDeleteModal = (
    <div className={styles.delete_container}>
      <h4>Are you sure ?</h4>

      <p> the action cannot be undone </p>

      <div className={styles.action_btn}>
        <button
          className={styles.cancel_btn}
          onClick={() => setIsDelete(false)}
        >
          Cancel
        </button>
        <button
          className={styles.delete_btn}
          onClick={() => {
            handleDelete(), setIsDelete(false);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  const renderActionModal = (
    <div className={styles.action_container}>
      <h4>Actions</h4>
      <div
        className={styles.sub_action}
        onClick={() => {
          setIsEdit(true);
          setIsActionModal(false);
          handleEdit();
        }}
      >
        <UilPen size='18px' color='#999999' /> Edit
      </div>
      <div
        className={styles.sub_action}
        onClick={() => {
          setIsDelete(true);
          setIsActionModal(false);
        }}
      >
        <UilTrashAlt size='18px' color='#999999' /> Delete
      </div>
    </div>
  );

  const renderEditForm = (
    <Form>
      <h4>Edit Player</h4>
      <Row className={styles.form_row}>
        <Col className=''>
          <label htmlFor='' className={styles.form_label}>
            Player Name
          </label>
          <Form.Control
            type='text'
            name='Player Name'
            onChange={handleInputChange}
            className={styles.form_input}
            value={formData['Player Name']}
          />
        </Col>
        <Col>
          <label htmlFor='' className={styles.form_label}>
            Jersey Number
          </label>
          <Form.Control
            type='text'
            name='Jersey Number'
            onChange={handleInputChange}
            className={styles.form_input}
            value={formData['Jersey Number']}
          />
        </Col>
      </Row>
      <Row className={styles.form_row}>
        <Col>
          <label htmlFor='' className={styles.form_label}>
            Height
          </label>
          <Form.Control
            type='text'
            name='Height'
            onChange={handleInputChange}
            className={styles.form_input}
            value={formData.Height}
          />
        </Col>
        <Col>
          <label htmlFor='' className={styles.form_label}>
            Weight
          </label>
          <Form.Control
            type='text'
            name='Weight'
            onChange={handleInputChange}
            className={styles.form_input}
            value={formData.Weight}
          />
        </Col>
      </Row>
      <Row className={styles.form_row}>
        <Col>
          <label htmlFor='' className={styles.form_label}>
            Nationality
          </label>
          <Form.Control
            as='select'
            name='Nationality'
            onChange={handleInputChange}
            className={styles.form_input}
            value={formData.Nationality}
          >
            <option value='' style={{ background: '#494949' }}>
              Select Nationality
            </option>
            {nationality.map((item) => (
              <option value={item} style={{ background: '#494949' }}>
                {item}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>
      <Row className={styles.form_row}>
        <Col>
          <label htmlFor='' className={styles.form_label}>
            Poisiton
          </label>
          <Form.Control
            as='select'
            name='Position'
            onChange={handleInputChange}
            className={styles.form_input}
            value={formData.Position}
          >
            <option value='' style={{ background: '#494949' }}>
              Select Position
            </option>
            <option value='GoalKeeper' style={{ background: '#494949' }}>
              GoalKeeper
            </option>
            <option value='Defender' style={{ background: '#494949' }}>
              Defender
            </option>
            <option value='MiddleFielder' style={{ background: '#494949' }}>
              MiddleFielder
            </option>
            <option value='Forward' style={{ background: '#494949' }}>
              Forward
            </option>
          </Form.Control>
        </Col>
      </Row>
      <Row className={styles.form_row}>
        <Col className={styles.formData_radio}>
          <label htmlFor='' className={styles.form_label}>
            Starter
          </label>
          <Form.Check
            type='radio'
            label='Yes'
            name='Starter'
            value='Yes'
            onChange={handleInputChange}
            className={styles.r_btn}
            checked={formData.Starter === 'Yes'}
          />
          <Form.Check
            type='radio'
            label='No'
            name='Starter'
            value='No'
            onChange={handleInputChange}
            className={styles.r_btn}
            checked={formData.Starter === 'No'}
          />
        </Col>
      </Row>

      <div className={styles.editBtn_container}>
        <button
          className={styles.edit_btn}
          type='submit'
          onClick={handleEditSubmit}
          style={{
            backgroundColor: isChange ? '#fea013' : 'transparent',
            color: isChange ? '#fff' : '#7e7e7e',
            border: !isChange ? 'none' : '',
          }}
        >
          Edit Player
        </button>
      </div>
    </Form>
  );

  const renderModal = () => {
    if (isModalOpen) {
      return renderImportModal;
    } else if (isActionModal) {
      return renderActionModal;
    } else if (isDelete) {
      return renderDeleteModal;
    } else if (isEdit) {
      return renderEditForm;
    }
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
                  required
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
                            teamName.length>0 && setIsNameChanged(true);
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
      
            

            <div
              className={`col-md-2 d-flex align-items-center justify-content-end ${styles.btn}`}
            >
              <button
                className={csvData1.length > 0 ? styles.re_import_button :styles.import_btn}
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                {csvData1.length > 0  ? 'Re-import Team'  : 'import Team'}
              </button>
            </div>
          </div>

          {/* Tabel  */}

          <div
            className={`col-md-12 ${styles.tableBody}`}
            style={{ overflowY: csvData1.length > 0 ? 'scroll' : '' }}
          >
            {csvData1.length > 0 ? (
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
                  {csvData1.map((player, rowIndex) => (
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
                      <td className={styles.row}>{player.Height}m</td>
                      <td className={styles.row}>{player.Weight}</td>
                      <td className={styles.row}>{player.Nationality}</td>
                      <td className={styles.row}>{player.Appearances}</td>
                      <td className={styles.row}>{player['Minutes Played']}</td>
                      <td
                        className={styles.row}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setIsActionModal(true);
                          setSelectedPlayer(player);
                        }}
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
                <button
                  className={styles.import_link}
                  onClick={() => {
                    setModalOpen(true);
                  }}
                >
                  import Team
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {(isModalOpen || isActionModal || isDelete || isEdit) && (
        <>
          {
            <Modal
              onClose={() => {
                setCorrectFile(false);
                isModalOpen
                  ? modalAction('import')
                  : isActionModal
                  ? modalAction('action')
                  : isDelete
                  ? modalAction('delete')
                  : modalAction('edit');
              }}
              size={
                isModalOpen
                  ? 'md'
                  : isActionModal
                  ? 'xsm'
                  : isEdit
                  ? 'xmd'
                  : 'sm'
              }
              icon={true}
            >
              {renderModal()}
            </Modal>
          }
        </>
      )}

            
        <div>
        <Toaster
        showMessage={showToast}  // Make sure this is dynamically controlled based on some condition
        message={toastMessage}
        onClose={() => {}}
      />
        </div>

    </div>
  );
};

export default LandPage;
