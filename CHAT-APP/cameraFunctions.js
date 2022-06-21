import * as ImagePicker from 'expo-image-picker';
import React,{useLayoutEffect, useState} from 'react'


export const openCamera = async ()=>{
    var image = '';
    const permissionResult = await ImagePicker.launchImageLibraryAsync({
      base64:true,
      allowsEditing:false,
      aspect:[4,3],
    });
    if(permissionResult.granted === false){
      alert("Permission is required to use camera");
      return ;
    }
    let pickResult = await ImagePicker.launchCameraAsync({
        base64:true
    });

    if(!pickResult.cancelled){
      image  = String(pickResult.base64);
    }
    return image;
  }


//   export const uploadImage= async(uri,path,fName)=>{
//     const blob = await new Promise((resolve, reject)=>{
//         const xhr = new XMLHttpRequest();
//         xhr.onload = ()=>{
//             resolve(xhr.response)
//         };
//         xhr.onerror = (e)=>{
//             console.log(e);
//             reject(new TypeError('Network request failed!'));
//         };
//         xhr.responseType = "blob";
//         xhr.open("GET",uri,true);
//         xhr.send(null);
//     })
//     const fileName = fName;
//     const imageRef = ref(storage, `${path}/${filename}.jpeg`)
//   }
  


export const pickImage = async()=>{
    var image ='';
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality:1,
    });

    if(!result.cancelled){
      image = String(result.uri);
      return image;

    }

    
  };