"use client"

import AppSideBar from './components/sidebar'
import LandPage from './components/Landpage'
import {React ,  useEffect } from 'react';
import { useRouter } from 'next/navigation'
import store from '@/Global/store';
import { Provider } from 'react-redux';


export default function Home() {


  const router = useRouter();
  useEffect(()=>{
    const {query} = router;
    console.log("router",query);
  },[router])


  return (
    // <React.StrictMode>
       <Provider store={store}>
    <div className='d-flex'>
  <AppSideBar/>

  <LandPage/>
    </div>
    </Provider>
    // </React.StrictMode>
  )
}
