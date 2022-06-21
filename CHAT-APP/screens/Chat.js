import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View,Platform, TextInput, Keyboard, TouchableWithoutFeedback, ToastAndroid, FlatList } from 'react-native'
import React, { useLayoutEffect, useState,useContext, useRef, useEffect } from 'react'
import { Avatar } from '@rneui/base'
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons"
import { StatusBar } from 'expo-status-bar'
import { ScrollView } from 'react-native-gesture-handler'
import { AuthContext } from '../context/AuthContext'
import axios from "../axios"
import { pusher } from '../pusher'
import {format} from "timeago.js"
import AddGroupMembers from './AddGroupMembers'


const Chat = ({navigation, route}) => {

    const {user} = useContext(AuthContext);
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const messageCount = useRef(true);
    const scrollRef = useRef();
    const [modal, setModal] = useState(false);
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };
    



    useLayoutEffect(()=>{
        navigation.setOptions({
            title:'Chat',
            headerTitleAlign:'left',
            headerTitle:()=>
                <View style={{
                    flexDirection:'row',
                    alignItems:'center'
                }} >
                    <Avatar rounded source={{
                        uri:route.params.showImg
                    }}
                    />
                    <Text
                    style={{color:'white',marginLeft:10,fontWeight:'700'}}>
                        {route.params.chatName}</Text>
                </View>
                ,
            headerRight:()=>
            <View 
            style={{
                flexDirection:'row',
                justifyContent:'space-between',
                width:80,
                marginRight:20,
            }}>
                <TouchableOpacity>
                    <FontAwesome name='video-camera' size={24} color='white' />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Ionicons name='call' size={24} color='white' /> 
                </TouchableOpacity>
            </View>
            ,
            headerLeft:()=>
            <TouchableOpacity
            style={{
                marginLeft:5
            }}
            onPress={()=>navigation.replace('Home')}>
                <FontAwesome name='arrow-left' size={24} color='white' /> 
            </TouchableOpacity>

            
        })
    },[navigation])

    const showModal = ()=>{
        setModal(true);
    }

    const closeModal = ()=>{
        setModal(false);
    }

    const sendMessage = async ()=>{
        Keyboard.dismiss();
        await axios.post(`/messages/${route.params.id}`,{messageText:input},config)
        .catch((err)=>{console.log(err)});
        setInput('')
    }


    useEffect(()=>{
        const getMessages = async ()=>{
            await axios.get(`/messages/${route.params.id}`,config)
            .then((messages)=>{
                setMessages(messages.data);
            },(err)=>{console.log(err)})
            .catch((err)=>{console.log(err)});
            scrollRef.current?.scrollIntoView({behaviour: "instant"})
        }
        getMessages();


        return ()=>{};
    },[])

    useEffect(()=>{
        var channel = pusher.subscribe('messages');
        channel.bind('inserted', function(data) {
            if(String(data.chatId) == String(route.params.id)){
                setMessages([...messages,data])

            }
        });

        return ()=>{
            channel.unbind_all();
            channel.unsubscribe();
        }
    },[messages])



  return (
    <View style={{
        flex:1,
        backgroundColor:'white'
    }}>
        <AddGroupMembers modal={modal} close={closeModal} chatId={route.params.id}/>
        <StatusBar style='light'/>
      <KeyboardAvoidingView
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={90}
      >
          <TouchableWithoutFeedback>  
            <>     
                {route.params.chatType == 'private' 
                ?
                <FlatList contentContainerStyle={{paddingTop:15}} data={messages} renderItem={(message)=>
                    String(message.item.sender._id) === String(user._id) ? (
                        <View key={message.item._id} ref={scrollRef} style={styles.Recievercover}>
                            <View  style={styles.reciever}>
                                <Text style={styles.recieverText}>
                                    {message.item.messageText}
                                </Text>
                            </View>
                            <Text style={{fontSize:10,alignSelf:'flex-end'}}>{format(message.item.createdAt)}</Text>
                        </View>
                        
                    ) : (
                        <View key={message.item._id} ref={scrollRef} style={styles.Sendercover}>
                        <View  style={styles.sender}>
                            <Text style={styles.senderText}>
                                {message.item.messageText}
                            </Text>
                        </View>
                        <Text style={{fontSize:10,alignSelf:'flex-start'}}>{format(message.item.createdAt)}</Text>
                        </View>
                        
                    )
                } />
                :
                <FlatList  contentContainerStyle={{paddingTop:15}} data={messages} renderItem={(message)=>
                    String(message.item.sender._id) === String(user._id) ? (
                        <View  key={message.item._id} ref={scrollRef} style={styles.Recievercover}>
                        <View  style={styles.reciever}>
                            <Avatar rounded 
                            containerStyle={{
                            position :'absolute',
                            bottom:-15,
                            right:-5
                        }} 
                        position="absolute" 
                        bottom={-15} 
                        right={-5} 
                        source={{
                                uri: message.item.sender.photoUrl
                            }} 
                            size={30}/>
                            <Text style={styles.messageFromName}>
                                {message.item.sender.username}
                            </Text>
                            <Text style={styles.recieverText}>
                                {message.item.messageText}
                            </Text>
                        </View>
                        <Text style={{fontSize:10,alignSelf:'flex-start',marginRight:10,marginTop:10}}>{format(message.item.createdAt)}</Text>

                        </View>
                    ) : (
                        <View  ref={scrollRef} key={message.item._id} style={styles.Sendercover}>
                        <View style={styles.sender}>
                            <Avatar rounded 
                            containerStyle={{
                                position :'absolute',
                                bottom:-15,
                                left:-5
                            }} 
                            position="absolute"  
                            size={30} 
                            source={{
                                uri: message.item.sender.photoUrl
                            }}  />
                             <Text style={styles.messageFromName}>
                                {message.item.sender.username}
                            </Text>
                            <Text style={styles.senderText}>
                                {message.item.messageText}
                            </Text>
                        </View>
                        <Text style={{fontSize:10,alignSelf:'flex-start',marginLeft:10,marginTop:10}}>{format(message.item.createdAt)}</Text>
                        </View>
                        )
                    } />
                }

                <View style={styles.footer}>
                    
                    {(route.params.chatType == 'group' && String(route.params.createdBy) == String(user._id)) ? <TouchableOpacity activeOpacity={0.5} onPress={showModal} style={{padding:10}}><FontAwesome name='plus' color={'#2B68E6'} size={20} /></TouchableOpacity> : null }
                    
                    <TextInput value={input} onChangeText={(text)=>setInput(text)} placeholder='Signal Message' style={styles.textInput} onSubmitEditing={sendMessage}/>
                    <TouchableOpacity activeOpacity={0.5} onPress={sendMessage} >
                        <Ionicons name='send' size={24} color='#2B68E6'  />
                    </TouchableOpacity>
                    </View> 

            </> 
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    reciever:{
        padding:15,
        backgroundColor:'#ececec',
        borderRadius:20,
        position:'relative',
    },
    Recievercover:{
        alignSelf:'flex-end',
        marginRight:15,
        marginBottom:20,
        maxWidth:'80%',
        position:'relative',
        alignItems:'center'
    },
    sender:{
        padding:15,
        backgroundColor:'#2b68e6',
        borderRadius:20,
        position:'relative',
    },
    Sendercover:{
        padding:15,
        alignSelf:'flex-start',
        borderRadius:20,
        margin:15,
        maxWidth:'80%',
        position:'relative',
        alignItems:'center'
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        padding:15,
    },
    textInput:{
        bottom:0,
        height:40,
        flex:1,
        marginRight:15,
        backgroundColor:'#ECECEC',
        padding:10,
        color:'grey',
        borderRadius:30,
    },
    messageFromName:{
        fontSize:10,
        fontWeight:'bold',
        opacity:0.5
    }
})