/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Dimensions,Text,Image,Alert,BackHandler,Button,View,SafeAreaView } from 'react-native';
import SearchableList from './src/SearchableList';
import {PermissionsAndroid} from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import MapView from 'react-native-maps';



export default class App extends Component {
  componentWillMount(){
    requestCameraPermission();
  }
  render() {
    return (

      <AppContainer />

      
    );
  }
}


async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'RDAAssignment App Location Permission',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the Location');
    } else {
      console.log('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}



const {width, height} = Dimensions.get('window')
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class LocationScreen extends Component {

  constructor() {
    super()
    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }

      this.setState({initialPosition: initialRegion})
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 30000});
  }





  render() {
    return (
      <View style={{flex:1}}>
      <View style={{ flex: .8}}>
      <MapView style={{ flex: 1}}
      showsUserLocation={true}
      showsMyLocationButton={false}
      zoomEnabled = {true}
            initialRegion={this.state.initialPosition}/>
      </View>

      <View style={{flex:.2, alignItems: 'center', justifyContent: 'center' }}>
      <Button
          title="Go to UserDetails"
          onPress={() => this.props.navigation.navigate('Users')}
        />
      </View>
      </View>
    );
  }
}

class ExapandUser extends Component {
  constructor(props){
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
}

handleBackButtonClick() {
    this.props.navigation.goBack("UserDetails");
    return true;
}
  render() {
    //Alert.alert(this.props.navigation.state.params.item.name)
    return (
      <View style={{flex:1 ,alignItems: 'center', justifyContent: 'center',}}>
      <View style={{flexDirection:'row' }}>
      <Image style={ {alignItems: 'center',justifyContent: 'center',width:150,height:150}} source={{uri: this.props.navigation.state.params.url}} />
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center',flexDirection:'row' }}>
      <Text>User Name: </Text>
      <Text>{this.props.navigation.state.params.name}</Text>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center',flexDirection:'row' }}>
      <Text>User Email: </Text>
      <Text>{this.props.navigation.state.params.email}</Text>
      </View>
      </View>
    );
  }
}

class UserDetails extends Component {

  constructor(props) {
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
}

componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
}

componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
}

handleBackButtonClick() {
    this.props.navigation.goBack("Location");
    return true;
}



  render() {
    return (
      <View style={{ flex: 1 }}>
        
         <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
         <SearchableList expandUser ={(item) => {
           //Alert.alert(JSON.stringify(item.name))
           this.props.navigation.navigate('Expand',{
            name : item.name.first +' '+ item.name.last,
            email:item.email,
            url:item.picture.thumbnail
        })
         }}/>
         </SafeAreaView>
       
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Location: {
      screen: LocationScreen,
    },
    Users: {
      screen: UserDetails,
    } ,
    Expand: {
      screen: ExapandUser,
    } 
  },

  {
    initialRouteName: 'Location',
  }
);

const AppContainer = createAppContainer(RootStack);
