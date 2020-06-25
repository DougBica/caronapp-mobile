import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, PermissionsAndroid,TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';
import colors from '../../config/colors';


export default function Principal() {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [paradas, setParadas] = useState([]);
  const [location, setLocation] = useState([]);
  const [token, setToken] = useState(null);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));

  async function verifyLocationPermission() {
    const headers = {
      'Content-Type': 'application/json',
    }
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('permissão concedida');
        setHasLocationPermission(true);
      } else {
        console.error('permissão negada');
        setHasLocationPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  }
  function procurar() {

  };
  useEffect(() => {
    (async () =>{
      const token = await AsyncStorage.getItem('token');
      setToken(token);
    })();
    verifyLocationPermission();
    if (hasLocationPermission) {
      setCurrentRegion({
            latitude: -25.5257564,
            longitude: -49.2586166,
            latitudeDelta:0.005,
            longitudeDelta:0.005,
          })
        }
  }, [hasLocationPermission]);
  function handleRegionChanged(region){
    console.log(region);
    setCurrentRegion(region);
  }
  function handlePress(e){
    setLocation({coordinates: [e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude]});
    Alert.alert(
      "Ponto de Parada",
      "Deseja adicionar um ponto de parada?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress:  () => {
          setShow(true);


          console.log("OK Pressed")} }
      ],
      { cancelable: false }
    );
  }
  const showToast = () => {
    ToastAndroid.showWithGravity (
      "Falha ao carregas dados, Tente Novamente!",
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM
    );
  };
  async function procurar(){
    let index=0;
    if(currentRegion){
      try {
        const response = await api.apiCaronapp.post('/caronapp/public/paradas',{
          coordinates:[currentRegion.latitude,currentRegion.longitude]
        });
        for(parada in response.data){
          const teste = response.data[parada];
          const responseUsuario = await api.apiUserModule.post('/caronapp/public/usuario/email',{
            email: teste.email
          });
          response.data[index].usuario = responseUsuario.data;
          index++;
        }
        console.log(response.data[0]);
        setParadas([...response.data])
      } catch (error) {
        console.log(error.response.status);
        showToast();
      }
    }
  }
  async function onChangeTime(event, selectedDate){
    setShow(false);
    const currentDate = selectedDate || date;
    await setDate(currentDate);
    console.log(JSON.stringify({
      token
    }));
//    gravar ponto
    try {
      const response = await api.apiCaronapp.post('/caronapp/public/parada',{
        token,
        hora:currentDate,
        location
      });
      console.log(response);
      const responseUsuario = await api.apiUserModule.post('/caronapp/public/usuario/email',{
        email: response.data.email
      });
      response.data.usuario = responseUsuario.data;
     setParadas([...paradas,response.data])

    } catch (error) {
      console.log(error.response.status);
      showToast();
    }
  }
  return (
    <>
    <View style={styles.container}>
      <MapView
        onRegionChangeComplete={handleRegionChanged}
        style={styles.map}
        initialRegion={currentRegion}
        onLongPress={handlePress}
      >
        {paradas.map(parada => (
            <Marker
              key={parada.id}
              id={"id-" + parada.id}
              email={parada.email}
              coordinate={{
                latitude: parada.location.coordinates[0],
                longitude: parada.location.coordinates[1]
                }}>

              <Callout onPress={() => {console.log("hello");

              }} o>
                <View style={styles.callout}>
                  <Text style={styles.devName}>Nome: {parada.usuario.nome}</Text>
                  <Text style={styles.devName}>Idade: {parada.usuario.idade}</Text>
                  <Text style={styles.paradaHoras}>Vinculo: {parada.usuario.vinculoFilial}</Text>
                  <Text style={styles.paradaHoras}>Horário de parada: {new Date(parada.hora).toLocaleTimeString()}</Text>
                </View>
              </Callout>

            </Marker>
          ))}
      </MapView>
      <TouchableOpacity onPress={procurar} style={styles.button}>
        <Text style={styles.buttonText}>Procurar nesta Região</Text>
      </TouchableOpacity>
      {show ? <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />:<></>}
    </View>
      <View style={styles.mapDrawerOverlay} />
      </>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map:{
    flex:1,
  },
  callout:{
    width: 260.
  },
  paradaHoras: {
    marginTop: 5,
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    position: 'absolute',
    top: 20,
    right: 20,
    left: 40,
    width:'80%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: colors.PURPLE,
    marginBottom:12,
    paddingVertical:12,
    borderRadius:4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.BLACK,
    opacity:0.6
  },
  buttonText:{
    color:colors.WHITE,
    textAlign:'center',
    height:25,
    fontSize:20,
  },
  mapDrawerOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.0,
    height: Dimensions.get('window').height,
    width: 10,
  },
})

