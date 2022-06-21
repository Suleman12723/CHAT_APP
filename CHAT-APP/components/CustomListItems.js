import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from '@rneui/base';
import React, { useContext, useEffect, useState } from 'react'
// import {db} from "../firebase"
import axios from "../axios";
import { AuthContext } from '../context/AuthContext';
import { pusher } from '../pusher';

const CustomListItems = ({id, chatName, enterChat, showImg, chatType, createdBy}) => {
    const {user}  = useContext(AuthContext)
    const [chatMessages, setchatMessages] = useState([])
    const config = {
        headers: { Authorization: `Bearer ${user.token}` }
    };

    useEffect(()=>{
            
        const getMessages = async()=>{
            await axios.get(`/messages/${id}`,config)
            .then((messages)=>{
                setchatMessages(messages.data);
            },(err)=>{console.log(err)})
            .catch((err)=>{console.log(err)});
        }
        getMessages();
        
         return ()=>{};
    },[])


    useEffect(()=>{
        var channel = pusher.subscribe('messages');
        channel.bind('inserted', function(data) {
            if(String(data.chatId) == String(id)){
                const getMessages = async()=>{
                    await axios.get(`/messages/${id}`,config)
                    .then((messages)=>{
                        setchatMessages(messages.data);
                    },(err)=>{console.log(err)})
                    .catch((err)=>{console.log(err)});
                }
                getMessages();
                
            }
        });

        return ()=>{
            channel.unbind_all();
            channel.unsubscribe();
        }
    },[chatMessages])
  return (
      <ListItem onPress={()=>enterChat(id,chatName,showImg,chatType,createdBy)} key={id} bottomDivider>
          <Avatar 
          rounded
          source={{
              uri: showImg
          }}
          />
          <ListItem.Content>
              <ListItem.Title style={{fontWeight:"800"}}>
                  {chatName}
              </ListItem.Title>
              <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                  {chatMessages.length>0 ? (chatMessages[chatMessages.length-1].sender.username + ': ' + chatMessages[chatMessages.length-1].messageText) : ('Start Chatting!')}
              </ListItem.Subtitle>
          </ListItem.Content>
      </ListItem>
  )
}

export default CustomListItems

const styles = StyleSheet.create({})