import React, {useState, useEffect} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import Cookie from 'js-cookie'
import TextField from '@material-ui/core/TextField';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';

export default function MediaCard({data, members, getCards, getMembers, workspace}) {
    const [open, setOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [selectedElem, setSelectedElem] = useState({});
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [editDue, setEditDue] = useState('');
    const [member, setMember] = useState({});
    const [dueComplete, setDueComplete] = useState(false);
    const [ischecked, setIsChecked] = useState([0]);
    const [createName, setCreateName] = useState('');
    const [createDesc, setCreateDesc] = useState('');
    const [createDue, setCreateDue] = useState('');
    const [createMembers, setCreateMembers] = useState([]);
    const [checked, setChecked] = useState([]);

    useEffect(() => {
        updateCard()
    }, [dueComplete])

    useEffect(() => {
        membersCheckbox()
    },[])

    const convertDate = (dueDate) => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ]
        const days = [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat'
        ]
        const isoDate = new Date(dueDate);
        const d = new Date(isoDate.getFullYear(), (isoDate.getMonth()+1), isoDate.getDate())
        const year = d.getFullYear() 
        const date = d.getDate() 
        const monthName = months[d.getMonth()]
        const dayIndex = d.getDay()
        const dayName = days[dayIndex]
        const formatted = `${dayName}, ${date} ${monthName} ${year}`
        return dueDate !== null ? formatted : null;
    }

    const result = () =>{
        const intersection = members.filter(element => selectedElem.idMembers.includes(element.id));
        const difference = members.filter(x => !selectedElem.idMembers.includes(x.id));
        const newMemberObj = [];
        intersection.forEach((element,i) => {
            newMemberObj.push(element);
        });
        difference.forEach(element => {
            newMemberObj.push(element);
        });
        return intersection;
    } 

    const difference = () =>{
        const difference = members.filter(x => !selectedElem.idMembers.includes(x.id));
        return difference;
    } 

    const intersection = () =>{
        const intersection = members.filter(element => selectedElem.idMembers.includes(element.id));
        return intersection;
    } 

    const addMember = (idMembers) => {
        const newMembers = [];
        intersection().forEach(element => {
            newMembers.push(element.id);
        });
        newMembers.push(idMembers);
        updateCard(newMembers)
    }

    const deleteMember = (idMember) => {
        const membersArr = intersection();
        const delMembers = [];
        const index = membersArr.indexOf(idMember);
        if (index > -1) {
            membersArr.splice(index, 1);
        }
        membersArr.forEach(element => {
            delMembers.push(element.id)
        });
        updateCard(delMembers); 
    }

    const updateCard = (idMembers) => {
        const idBoard = Cookie.get('idBoard')
        const data = {
            cardId: selectedElem.id,
            names: editName,
            desc: editDesc,
            due: editDue,
            dueComplete: dueComplete,
            idMembers: idMembers !== undefined ? idMembers : member
        }
        axios.put('http://localhost:8080/card', data).then((res) => {
            getCards(idBoard);
            getMembers(workspace);
        }).catch((e)=> {
            console.log(e)
        });
    }

    const deleteCard = () => {
        const idBoard = Cookie.get('idBoard')
        const userCookie = Cookie.get('uData')
        const userData = JSON.parse(userCookie)
        const deleteData = {
            idCard: selectedElem.id,
            name: userData.fullName,
            desc: selectedElem.desc,
        }
        axios.post('http://localhost:8080/delcard', deleteData).then((res) => {
            getCards(idBoard);
            setOpen(false)
        }).catch((e)=> {
            console.log(e)
        });
    }

    const selectCard = (card) => {
        setOpen(true)
        setSelectedElem(card)
        setMember(card.idMembers)
        setEditName(card.name)
        setEditDue(card.due)
        setEditDesc(card.desc)
        setDueComplete(card.dueComplete)
    }

    const membersCheckbox = () => {
        let membersCb = [];
        members.forEach((element, i) => {
            membersCb.push({id: element.id, fullName: element.fullName, value: i})
        });
        setChecked(membersCb)
    }

    const handleSelect = (value) =>  {
        const currentIndex = ischecked.indexOf(value.value);
        const newChecked = [...ischecked];
        const currentMember = createMembers.indexOf(value.id);
        const newCheckedMember = [...createMembers];
        if (currentIndex === -1) {
          newChecked.push(value.value);
          newCheckedMember.push(value.id)
        } else {
          newChecked.splice(currentIndex, 1);
          newCheckedMember.splice(currentMember, 1)
        }
        setCreateMembers(newCheckedMember)
        setIsChecked(newChecked);
      };

    const createCard = () => {
        const idBoard = Cookie.get('idBoard')
        let createData = {
            name:createName,
            desc:createDesc,
            due:createDue,
            idMembers:createMembers,
        }
        console.log(createMembers)
        axios.post('http://localhost:8080/card', createData).then((res) => {
            getCards(idBoard);
            setOpenCreate(false)
        }).catch((e)=> {
            console.log(e)
        });
    }

    const editar = () => {
        return(
            <div className="modalForms">
                <ClearIcon onClick={()=>{setOpen(false)}} style={{position:'absolute',top:10, right:10, cursor:'pointer'}}></ClearIcon>
                <div style={{width:'50%', display:'flex', flexDirection:'column'}}>

                    <TextField id="outlined-basic" style={{margin:'0px 10px 10px 40px'}} label="Card name" variant="outlined" value={editName} onBlur={()=>{updateCard()}} onChange={(e)=>{setEditName(e.target.value) }} onKeyDown={(e) => e.key== 'Enter' ? updateCard(): ''} />
                    <TextField
                        id="standard-multiline-flexible"
                        label="Card description"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={editDesc}
                        onChange={(e)=>{setEditDesc(e.target.value) }}
                        onKeyDown={(e) => e.key== 'Enter' ? updateCard(): ''}
                        onBlur={()=>{updateCard()}}
                        style={{margin:'10px 10px 0 40px'}}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Due date"
                            value={editDue}
                            onChange={(e)=>{setEditDue(e)}}
                            onKeyDown={(e) => e.key== 'Enter' ? updateCard(): ''}
                            onBlur={()=>{updateCard()}}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{margin:'10px 10px 0 40px'}}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div role="group" aria-labelledby="checkbox-group" style={{display:"flex", flexDirection:"column",  width:"50%", margin:'0px 10px 0px 40px'}}>
                    <InputLabel style={{marginTop:20,marginBottom:20}}>Members</InputLabel>
                    { members.length > result().length ? <><InputLabel>Assign member</InputLabel><Select style={{width:'40%', marginBottom:40 }} value={''} onChange={(e)=>{addMember(e.target.value), setOpen(false)}}>
                        {
                            difference().map((element) => { 
                                return (<MenuItem value={element.id}>{element.fullName}</MenuItem>)
                            })
                        }
                    </Select></> : '' }
                    <div style={{display:"inline-block", flexDirection:"row"}}>
                    {
                        result().map((member, i)=> {
                            return (
                                <Chip style={{backgroundColor: '#737CFF', width:'30%', color:'white' ,margin:'5px 5px 5px 0px'}} onDelete={()=>{deleteMember(member), setOpen(false)}} label={member.fullName} />
                            )
                        })
                    }
                    </div>
                    <InputLabel style={{marginTop:20,marginBottom:20}}>Actions</InputLabel>
                    <div style={{display:"inline-block", flexDirection:"row"}}>
                        {dueComplete ? '' : <Button style={{backgroundColor:"#61bd4f", color:"white", borderRadius:20, width:200, margin:'5px 5px 5px 0px'}} onClick={()=>{setDueComplete(true)}}><CheckIcon style={{color:"#fff"}}  />Mark as finished</Button>}
                        <Button variant="contained" color="secondary" style={{ color:"white", borderRadius:20, width:170, margin:'5px 5px 5px 0px'}} onClick={()=>{deleteCard()}}><DeleteIcon style={{color:"#fff"}}  />Delete Card</Button>
                    </div>
                </div>
            </div>
        )
    }

    const create = () => {
        return(
            <div className="modalForms">
                <ClearIcon onClick={()=>{setOpenCreate(false)}} style={{position:'absolute',top:10, right:10, cursor:'pointer'}}></ClearIcon>
                <div style={{width:'50%', display:'flex', flexDirection:'column'}}>
                    <TextField id="outlined-basic" style={{margin:'0px 10px 10px 40px'}} label="Card name" variant="outlined" value={createName} onChange={(e)=>{setCreateName(e.target.value)}}  />
                    <TextField
                        id="standard-multiline-flexible"
                        label="Card description"
                        variant="outlined"
                        multiline
                        rows={4}
                        value={createDesc}
                        onChange={(e)=>{setCreateDesc(e.target.value)}}
                        style={{margin:'10px 10px 0 40px'}}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Due date"
                            value={createDue}
                            onChange={(e)=>{setCreateDue(e)}}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{margin:'10px 10px 0 40px'}}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div role="group" aria-labelledby="checkbox-group" style={{display:"flex", flexDirection:"column",  width:"50%", margin:'0px 10px 0px 40px'}}>
                    <InputLabel style={{marginTop:20,marginBottom:20}}>Members</InputLabel>
                    <List >
                        { checked.map((value) => {
                            const labelId = `checkbox-list-label-${value.fullName}`;

                            return (
                            <ListItem key={value.value} role={undefined} dense button onClick={()=>{handleSelect(value)}}>
                                <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={ischecked.indexOf(value.value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${value.fullName}`} />
                                <ListItemSecondaryAction>
                                </ListItemSecondaryAction>
                            </ListItem>
                            );
                        })}
                    </List>
                    <InputLabel style={{marginTop:20,marginBottom:20}}>Actions</InputLabel>
                    <div style={{display:"inline-block", flexDirection:"row"}}>
                        <Button style={{backgroundColor:"#61bd4f", color:"white", borderRadius:20, width:150, margin:'5px 5px 5px 0px'}} onClick={()=>{createCard()}}>Create Card</Button>
                    </div>
                </div>
            </div>
        )
    }

    const card = (element) =>{
        return (
        <Card onClick={() => {selectCard(element)}} className="cardElement">
            <CardActionArea>
                <CardContent>
                    <Typography style={{fontSize:15}}  variant="p" component="p">
                        {element.name}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                {convertDate(element.due) !== null ? <Chip style={{backgroundColor: element.dueComplete ? '#61bd4f' : '#ec9488', color:'white' }} label={convertDate(element.due)} /> : ''}
                {element.idMembers.length > 0 ? <Chip icon={<AccountCircleIcon style={{color:"white"}} />} label={element.idMembers.length} style={{backgroundColor:"#737CFF", color:"white"}}/> : ''}
            </CardActions>
        </Card>
        )
    }

    return (
        <>
        <Grid container
        direction="row"
        justify="flex-start"
        alignItems="center" style={{width:"90%"}}>
            <Button onClick={()=>{setOpenCreate(true)}} variant="contained" color="secondary">Crear</Button>
        </Grid>
        <Grid 
            container
            direction="row"
            justify="center"
            alignItems="flex-start"
        >
            { open ? editar() : '' }
            { openCreate ? create() : '' }
            <Grid container
                direction="row"
                alignItems="center"
                justify="center" style={{backgroundColor:"#A9A9A9", width: "45%", margin:"10px 10px 10px 10px", borderRadius:10}}>
                {data.map(element => {return( !element.dueComplete ? card(element) : null )})}
            </Grid>
            <Grid container
                direction="row"
                alignItems="center"
                justify="center" style={{backgroundColor:"#A0A6FF", width: "45%", margin:"10px 10px 10px 10px", borderRadius:10}}>
                {data.map(element => { return ( element.dueComplete ? card(element) : null )})}
            </Grid>
        </Grid>
        </>
    );
}