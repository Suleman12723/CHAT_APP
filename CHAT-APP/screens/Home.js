import { FlatList, ScrollView, StyleSheet, Text, View,TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import React, { useEffect,useRef, useLayoutEffect, useState, useContext } from 'react'
import { StatusBar } from 'expo-status-bar'
import CustomListItems from '../components/CustomListItems'
import { Avatar } from '@rneui/base'
import {AntDesign, SimpleLineIcons} from "@expo/vector-icons"
import axios from "../axios";
import { AuthContext } from '../context/AuthContext'
import { pusher } from '../pusher'

const Home = ({navigation, route}) => {

    const {user} = useContext(AuthContext);
    const [chats, setChats] = useState([])
    // const socket = useRef(io('ws://localhost:8900'))
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };


    useEffect(()=>{
        
        var channel = pusher.subscribe('userUpdated');
        channel.bind('inserted', function(data) {
            if(String(data._id) == String(user._id)){
                
                getChats();
            }
 
        });

        return ()=>{
            channel.unbind_all();
            channel.unsubscribe();
        }
    },[chats])



    const signOut = ()=>{
        Alert.alert('','Are you sure you want to Sign Out?',[{text:'Yes',onPress:
        ()=>{
            axios.get('/auth/logout')
            .then(()=>{
                navigation.replace('Login');
            })
            .catch((err)=>alert(err.message));
        }},{text:'No'}])
    }


    const getChats = async ()=>  {
        await axios.get(`/users/${user._id}/chats`,config)
        .then((res)=>{
            setChats(res.data.chats);                  
           
        },(err)=>{alert(err.message)})
        .catch((err)=>{alert(err.message)});
    }

    useEffect(()=>{

        getChats();

       return getChats;
    },[])

    

    useLayoutEffect(()=>{
        navigation.setOptions({
            title:'Signal',
            headerStyle:{backgroundColor: '#fff'},
            headerTitleStyle:{color:'black'},
            headerTintColor:"black",
            headerLeft:()=>
                <View style={{marginLeft:20}}>
                    <TouchableOpacity onPress={signOut} activeOpacity={0.5}>
                    <Avatar 
                    rounded
                    source={{ uri: user.photoUrl}}
                    />
                    </TouchableOpacity>
                </View>
                ,
            headerRight:()=>
                <View style={{
                    flexDirection:'row',
                    justifyContent:'space-around',
                    width:80,
                    marginRight:5
                }} >
                    <TouchableOpacity activeOpacity={0.5}>
                        <AntDesign name='camerao' size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>navigation.navigate('AddChat')}  activeOpacity={0.5}>
                        <SimpleLineIcons name='pencil' size={24} color='black'/>
                    </TouchableOpacity>

                </View>


            
        })
    },[navigation])


    const enterChat = (id, chatName,showImg,chatType,createdBy)=>{
        navigation.navigate('Chat',{
            id,
            chatName,
            showImg,
            chatType,
            createdBy
        })
    }



  return (
    <View>
        <StatusBar style='dark'/>
        <FlatList data={chats} renderItem={(chat)=>
            <CustomListItems key={chat.item._id} id={chat.item._id} chatName={chat.item.chatName} createdBy={chat.item.createdBy} chatType={chat.item.chatType} showImg={chat.item.photoUrl} enterChat={enterChat} />
        } />

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        height:'100%'
    }
})