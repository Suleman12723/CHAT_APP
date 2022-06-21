import { StyleSheet, Text, View,FlatList, ScrollView, ToastAndroid, Alert } from 'react-native'
import React, { useLayoutEffect, useState, useContext, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Input,ListItem, Avatar  } from '@rneui/base'
import Icon from "react-native-vector-icons/FontAwesome"
import CustomListItems from '../components/CustomListItems'
import axios from '../axios'
import { AuthContext } from '../context/AuthContext'


const AddChat = ({navigation,route}) => {
    const {user} = useContext(AuthContext);
    const [input, setInput] = useState('')
    const [users ,setUsers] = useState([])
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    const makeGroup = async ()=>{
        await axios.post('/chats',{
            chatName:input,
            members:[],
            chatType:'group'
        },config)
        .then((res)=>{
            navigation.replace('Home');
        },(err)=>{ToastAndroid.show(err.message,ToastAndroid.SHORT)})
        .catch((err)=>{ToastAndroid.show(err.message,ToastAndroid.SHORT)});
    };

    const createGroupChat = async ()=>{
       

        let exsists = await axios.get(`/chats/group/${input}`,config);
        if(exsists.data.found){
            Alert.alert(Notice,'A group with this Name already exsists still want to contunie?',[
                {text:'OK',onPress:makeGroup}
                ,{text:'Cancel',onPress:()=>{
                    setInput('');
                }}
            ])
        }
        else{
            makeGroup();
        }
       
    }
    const createPrivateChat = async (id,photoUrl)=>{
        let success = await axios.get(`/chats/${id}`,config);
        console.log(success.data.found);
        if(success.data.found){
            navigation.navigate('Chat',{id:success.data.chatId,showImg:photoUrl,chatName:success.data.chatName,chatType:'private'});
        }
        else{
            console.log('USER ID: '+ user._id);
            console.log('CHAT WITH: '+id);
            await axios.post('/chats',{
                chatWith:id,
                chatType:'private'
            },config)
            .then((res)=>{
                navigation.replace('Home');
            },(err)=>{ToastAndroid.show(err.message,ToastAndroid.SHORT)})
            .catch((err)=>{ToastAndroid.show(err.message,ToastAndroid.SHORT)});
        }
    }



    useLayoutEffect(()=>{
        navigation.setOptions({
            title:'New Chat',
            headerBackTitle:'Chats',
            headerBackTitleVisible:true
        })
        const getUsers = async()=>{
            await axios.get('/users',config)
            .then((res)=>{
                console.log(res.data);
                setUsers(res.data);
            },(err)=>{ToastAndroid.show(err,ToastAndroid.SHORT)})
            .catch((err)=>{ToastAndroid.show(err,ToastAndroid.SHORT)});
        }
        getUsers();
        
    },[navigation])



  return (
    <View style={styles.container}>
        <StatusBar style='light'/>
        <Input placeholder='Enter a Chat Name' value={input} onChangeText={(text)=>setInput(text)}
        leftIcon={
            <Icon name='wechat' size={24} type='antdesign' color="black" />
        }
        onSubmitEditing={createGroupChat}/>
        <Button title='Create New Chat' onPress={createGroupChat}/>

        <FlatList data={users} renderItem={
            (user)=>
            <ListItem onPress={()=>createPrivateChat(user.item._id,user.item.photoUrl)} key={user.item._id} bottomDivider>
            <Avatar 
            rounded
            source={{
                uri:user.item.photoUrl
            }}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:"800"}}>
                    {user.item.username}
                </ListItem.Title>
            </ListItem.Content>
        </ListItem>
        }
        />

    </View>
  )
}

export default AddChat

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        padding:30,
        height: '100%'
    },
})