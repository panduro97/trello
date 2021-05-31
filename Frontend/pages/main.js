import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Cookie from 'js-cookie'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '../components/card'

export default function Home() {
    const [workspaces, setWorkspaces] = useState([]);
    const [boards, setBoards] = useState([]);
    const [members, setMembers] = useState([]);
    const [cards, setCards] = useState([]);
    const [selectedWs, setSelectedWs] = useState('');
    const [selectedBd, setSelectedBd] = useState('');
 
    const getWorkspaces =  () => {
        axios.get('http://localhost:8080/workspaces').then((res) => {
            setWorkspaces(res.data.resp)
            console.log(res.data)
        }).catch((e)=> {
            console.log(e)
        });
    }

    useEffect(() => {
        getWorkspaces();
        const session = Cookie.get('uData');
        !session ? window.location.replace('/') : null;
    }, [])

    const getBoards = async(workspace) =>{
        setSelectedWs(workspace);
        getMembers(workspace);
        setCards([])
        axios.post('http://localhost:8080/board', {workspace}).then((res) => {
            console.log(res.data)
            setBoards(res.data.resp)
        }).catch((e)=> {
            console.log(e)
        });
    }

    const getCards = async (idBoard) => {
        console.log('solicitado')
        setSelectedBd(idBoard);
        Cookie.set('idBoard',idBoard)
        axios.post('http://localhost:8080/allcards', {idBoard}).then((res) => {
            setCards(res.data.resp)
            console.log(res.data)
        }).catch((e)=> {
            console.log(e)
        });
    }

    const getMembers = async (workspace) => {
        axios.post('http://localhost:8080/members', {workspace}).then((res) => {
            setMembers(res.data.resp)
        }).catch((e)=> {
            console.log(e)
        });
    }

    const boardsSelect = () =>{ 
        return (
            <div style={{width:"90%", marginTop:20}}>
                <InputLabel>Boards</InputLabel>
                <Select style={{width:'90%'}} value={selectedBd} onChange={(e)=>getCards(e.target.value)}>
                    {
                        boards.map((element) => { 
                            return (<MenuItem value={element.id}>{element.name}</MenuItem>)
                        })
                    }
                </Select>
            </div>
        )
    }

  return (
    <Grid container
    direction="column"
    justify="center"
    alignItems="center" className="main" style={{ maxWidth:"100%", minHeight:"100vh"}}>
      <div className="card">
        <div style={{width:"90%"}}>
            <InputLabel>Workspaces</InputLabel>
            <Select 
            style={{width:'90%'}}
            value={selectedWs}
            onChange={(e)=>getBoards(e.target.value)}>
                {
                    workspaces.map((element) =>{ 
                    return (<MenuItem value={element.id}>{element.displayName}</MenuItem>)
                    })
                }
            </Select>
        </div>
        {
            boards.length > 0 ? boardsSelect() : null
        }
      </div>
        {
            cards.length > 0 ? <Card data={cards} members={members} getCards={getCards} getMembers={getMembers} workspace={selectedWs} ></Card> : null
        }
    </Grid>
  )
}
