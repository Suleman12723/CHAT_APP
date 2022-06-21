import { Alert, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React,{useLayoutEffect, useState} from 'react'
import { Button, Image, Input, normalizeText, Text } from '@rneui/base';
import { StatusBar } from 'expo-status-bar'
import axios from '../axios';
import {AntDesign, FontAwesome, Ionicons} from "@expo/vector-icons"
import { openCamera, pickImage} from '../cameraFunctions';


const Register = ({navigation}) => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [imageUrl,setImageUrl] = useState('')
  useLayoutEffect(()=>{
   navigation.setOptions({
     headerBackTitleVisible:true
   })
  },[navigation])
  
  const register = async ()=>{
    await axios.post('/auth/signup',{
      username:name,email:email,password:password,photoUrl: imageUrl
    })
    .then((res)=>{
      if(res.data.success){
       navigation.goBack();
      }
    },(err)=>{alert(err.message)})
    .catch((err)=>{alert(err.message)});
  }

  const handleChooseImage =()=>{
    pickImage().then((resp)=>{
      setImageUrl(resp);
    })
  }
  const handleCamera = ()=>{
    openCamera().then((resp)=>{
      console.log(resp);
    })

  }

  return (
    <View style={styles.container}>
      <StatusBar style='light'/>

      <Text h3 style={{marginBottom:50}}>
        Create a Signal Account
      </Text>
      <View style={styles.inputContainer}>
        <Input placeholder='Full Name' autoFocus type='text' value={name} onChangeText={(text)=>setName(text)}/>
        <Input placeholder='Email' type='email' value={email} onChangeText={(text)=>setEmail(text)}/>
        <Input placeholder='Passwrod' secureTextEntry type='password' value={password} onChangeText={(text)=>setPassword(text)}/>
       
          <Input placeholder='Profile Picture URL (optional)' type='text' value={imageUrl} onChangeText={(text)=>setImageUrl(text)} onSubmitEditing={register}/>
          <View style={styles.iconContainer}>
          <TouchableOpacity activeOpacity={0.5} onPress={handleCamera}>
          <FontAwesome style={{marginRight:5}} name='camera' size={28} color={'blue'}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={handleChooseImage}>
          <FontAwesome style={{marginLeft:5}} name='image' size={28} color={'skyblue'}/>
          </TouchableOpacity>
        </View>
      </View>
      <Button containerStyle={styles.button} raised title='Register' onPress={register} />
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    padding:10,
    backgroundColor:'#fff'

  },
  button:{
    width:200,
    marginTop:10
  },
  inputContainer:{
    width:300,
  },
  iconContainer:{
    flexDirection:'row',
    justifyContent:'flex-end',
  },
})