import React, {useEffect, useState} from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Cookie from 'js-cookie'

export default function Home() {
  const [validation, setValidation] = useState(false)
  const login = async() => {
    let resp = await axios.get('http://localhost:8080/login');
    window.location.replace(resp.data.resp);
    setValidation(true);
  }

  const callback = async () => {
    let search = window.location.search;
    axios.post(`http://localhost:8080/callback${search}`).then((res)=> {
      var date = new Date();
      date.setTime(date.getTime() + (res.data.exp * 1000));
      Cookie.set('uData', res.data.resp, {expires: date})
      window.location.replace('/main');
    }).catch((e) => {
      alert('ocurrio un error')
      console.log(e)
    });
  }

  useEffect(() => {
    window.location.search ? callback() : null;
  }, [])

  return (
    <Grid container
    direction="column"
    justify="center"
    alignItems="center" style={{backgrounColor:"black", maxWidth:"100%", minHeight:"100vh"}}>
      <h2>Bienvenido a Trello</h2>
      <Button onClick={() => {login()}} variant="contained" color="primary">
        Login
      </Button>
    </Grid>
  )
}
