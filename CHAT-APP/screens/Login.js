import { StyleSheet, View, Text } from 'react-native'
import React, { useContext, useEffect, useState,useRef } from 'react';
import { Button, Image, Input } from '@rneui/base';
import { StatusBar } from 'expo-status-bar';
import { AuthContext } from '../context/AuthContext';
import { loginCall } from '../apiCalls';



const Login = ({navigation}) => {

    const userName = useRef()
    const password = useRef()
    const {user,isFetching, error, dispatch} = useContext(AuthContext);

    useEffect(()=>{
        console.log(user)
        if(user){
            navigation.replace('Home');
        }
        return ;
    },[user])

    const signIn = ()=>{
        loginCall({username:userName.current,password:password.current},dispatch);
        
    }
    const register = ()=>{
        navigation.navigate('Register')
    }
  return (
    <View style={styles.container}>
        <StatusBar style="light" />
        <Image source={{
            uri:"https://play-lh.googleusercontent.com/jCln_XT8Ruzp7loH1S6yM-ZzzpLP1kZ3CCdXVEo0tP2w5HNtWQds6lo6aLxLIjiW_X8"
        }} 
        style={{width:150, height:150,marginBottom:10}}/>
        <View style={styles.inputContainer}>
            <Input placeholder='User Name' autoFocus type="text" 
            onChangeText={(text) => {userName.current = text} } />
            <Input placeholder='Password' secureTextEntry type="password"
            onChangeText={(text) => {password.current = text}} 
            onSubmitEditing={signIn}/>
        </View>
        <Button containerStyle={styles.button} onPress={signIn} title="Login" disabled={isFetching} />
        <Button containerStyle={styles.button} onPress={register} type='outline' title="Register" disabled={isFetching} />
        <View style={{height:40}} />
    </View>
  )
};


const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        padding:10,
        backgroundColor:'#fff'
    },
    inputContainer:{
        width:300
    },
    button:{
        width:200,
        marginTop:10
    }

});

export default Login