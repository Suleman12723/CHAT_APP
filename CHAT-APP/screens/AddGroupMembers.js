import { StyleSheet, View, Modal, ScrollView, FlatList } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import axios from "../axios"
import React, { useLayoutEffect, useState, useContext, useEffect } from 'react'
import AddMembers from '../components/AddMembers'
import { Button, Image,Text ,Input } from '@rneui/base';


const AddGroupMembers = (props) => {
    const {user} = useContext(AuthContext);
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };
    const [users, setUsers] = useState([]);
    const [addMembers, setAddMembers] = useState([]);
    


    useEffect(()=>{
        const getUsers = async()=>{
            await axios.get('/users',config)
            .then((res)=>{
                setUsers(res.data);
            },(err)=>{ToastAndroid.show(err,ToastAndroid.SHORT)})
            .catch((err)=>{ToastAndroid.show(err,ToastAndroid.SHORT)});
        }
        getUsers();
        setAddMembers([]);
        return ()=>{};
    },[])


    const handleClick = (id)=>{
        if(!addMembers.includes(id)){
            setAddMembers([...addMembers,id])
            
        }
        else{
            setAddMembers(
                addMembers.filter(member => member!==id )
            )
        }
        
    }



    const Add = async()=>{
        await axios.post(`/chats/group/${props.chatId}`,{
            members:addMembers
        },config)
        .then((resp)=>{
            setAddMembers([]);
            props.close();
        },(err)=>{alert(err.message)})
        .catch((err)=>{alert(err.message)});
    }


  return (
    <Modal visible={props.modal}>
        <Text h2 style={{textAlign:'center',marginBottom:30}}>Add Users to Group!</Text>
        <FlatList data={users} keyExtractor={(item,index)=>item+index} renderItem={(user)=>
                 <AddMembers _id={user.item._id} key={user.item._id} username={user.item.username} photoUrl={user.item.photoUrl} addMember={handleClick}/>

        }/>
      <View style={{flexDirection:'row',justifyContent:'space-around',marginBottom:20}}>
        <Button containerStyle={styles.button} color={'success'} onPress={Add} title="Add"/>
        <Button containerStyle={styles.button} color={'error'} onPress={()=>{props.close()}} title="Cancel"/>
      </View>
    </Modal>
  )
}

export default AddGroupMembers

const styles = StyleSheet.create({
    container:{
        height:'100%'
    },
    button:{
        width:150,
        marginTop:10
    }
})