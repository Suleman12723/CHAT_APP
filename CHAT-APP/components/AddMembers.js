import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { ListItem, Avatar } from '@rneui/base';

const AddMembers = (props) => {

    const [pressed,setPressed] = useState(false);
    const handlePress = (id)=>{
        setPressed(!pressed);
        props.addMember(id);
    }
  return (
    <ListItem onPress={()=>handlePress(props._id)} key={props._id} containerStyle={{backgroundColor: pressed ? '#00f6ff': null }} bottomDivider>
    <Avatar 
    rounded
    source={{
        uri: props.photoUrl
    }}
    />
    <ListItem.Content>
        <ListItem.Title style={{fontWeight:"800"}}>
            {props.username}
        </ListItem.Title>
    </ListItem.Content>
</ListItem>
  )
}

export default AddMembers

const styles = StyleSheet.create({})