import React, {useEffect, useState} from 'react';
import {ToastAndroid, View, Image, TextInput, StyleSheet, TouchableOpacity, Text} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import colors from './config/colors';
import logo from './images/logo.png';
import api from './services/api';

import './config/ReactotronConfig';

import Routes from './routes';

function Login({navigation}) {
  const [pass, setPass] = useState([]);
  const [email, setEmail] = useState([]);

  const showToast = () => {
    ToastAndroid.showWithGravity (
      "Falha no login! Verifique o e-mail e senha.",
      ToastAndroid.LONG,
      ToastAndroid.TOP
    );
  };

  async function login(){
    console.log({email:email, senha:pass});
    try {
      const response = await api.apiUserModule.post('/login',{email:email, senha:pass});
      const {data} = response;
      console.log(data);
      navigation.navigate('Main');
    } catch (error) {
      console.log(error.response.status);
      showToast();
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo}/>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={'Email'}
          required
          onChangeText={setEmail}
          textContentType={'username'}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder={'Senha'}
          required
          onChangeText={setPass}
          textContentType={'password'}
        />
        <TouchableOpacity onPress={login} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  };

  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#fff',
      alignItems:'center',
      justifyContent:'space-between'
    },
    form:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      width:'80%'
    },
    input: {
      textAlign:'center',
      marginBottom:20,
      width:'80%',
      height: 50,
      backgroundColor: "#FFF",
      color:"#333",
      borderRadius: 25,
      paddingHorizontal: 20,
      fontSize: 16,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset:{
        width: 4,
        height: 4,
      },
      elevation: 2,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255,255,255,0.7)'
    },
    button: {
      width:'80%',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: colors.PURPLE,
      marginBottom:12,
      paddingVertical:12,
      borderRadius:4,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.BLACK
    },
    buttonText:{
      color:colors.WHITE,
      textAlign:'center',
      height:25,
      fontSize:20,
    },
    logo:{
      flex:1,
      resizeMode:'contain',
      width:'80%',
      marginBottom:12
    }
  });

  export default function App({navigation}) {
    return <Routes/>
  }
