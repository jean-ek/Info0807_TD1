import React ,{ Component }  from 'react';
// import { View, StyleSheet, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import {db} from '../config/firebase'
import { auth } from '../config';


// export const HomeScreen = () => {
//   const handleLogout = () => {
//     signOut(auth).catch(error => console.log('Error logging out: ', error));
//   };
//   return (
//     <View style={styles.container}>
//       <Button title='Sign Out' onPress={handleLogout} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   }
// });


import { Text, View, StyleSheet, Dimensions, Image,Button, TouchableOpacity } from 'react-native';
import { Constants, Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import * as Network from 'expo-network';
import LottieView from 'lottie-react-native';




export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    

  }
  state = {
    accelerometerData: { x: 0, y: 0, z: 0 },
    conncted: false,
    maitre:true,
    isMaitre:false,
    start:false,
    location :{  latitude: 0,
      longitude: 0}

  
      };
  

  componentWillUnmount() {
    this._unsubscribeFromAccelerometer();
    clearInterval(this.interval)
  }

  componentDidMount() {
    
    this._subscribeToAccelerometer();
    this.requestLocationPermission();
    console.log(auth.currentUser)
   
    
    
 

  }
   handleLogout = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
     };

   storeData=() => {
     const accelerometre =this.state.accelerometerData
     var day = new Date().getDate(); //To get the Current Date
     var month = new Date().getMonth() + 1; //To get the Current Month
     var year = new Date().getFullYear(); //To get the Current Year
     var hours = new Date().getHours(); //To get the Current Hours
     var min = new Date().getMinutes(); //To get the Current Minutes
     var sec = new Date().getSeconds(); //To get the Current Seconds
     time={day,month,year,hours,min,sec}
     
     const location = this.state.location
  

   db.ref('courseData/'+auth.currentUser.email.split("@")[0]).push().set({
      accelerometre,
      time,
      location 
      
      
  }).then((data)=>{
      //success callback
      console.log('data ' , data)
  }).catch((error)=>{
      //error callback
      console.log('error ' , error)
  })
     
   }

  _subscribeToAccelerometer = () => {
    Accelerometer.setUpdateInterval(1000)
    this._accelerometerSubscription = Accelerometer.addListener(
      accelerometerData => {this.setState({ accelerometerData })
    this.storeData()
    }
    );
  };

  _unsubscribeFromAccelerometer = () => {
    //this._accelerometerSubscription && this._acceleroMeterSubscription.remove();
    //this._accelerometerSubscription = null;
  };
  
  requestLocationPermission = async () => { //permissions pour localiser le telephone
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }
    this.locateCurrentPosition();
  }
stopCours=async ()=>{ //arreter la course 
    
 clearInterval(this.interval);
 this.setState({start:false})
  }
  demarrer=async ()=>{ //arreter la course 
    
 
    this.setState({start:true})
     }

  locateCurrentPosition = async () => {  // fonction pour recevoir la longitude et latitude du mobile
    let position = await Location.getCurrentPositionAsync({});
    let My_ip= await Network.getIpAddressAsync();
    this.setState({My_ip})
    let initialPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      

    }
    this.setState({location: initialPosition})
    
  }

  render() {
    return (
       !this.state.start ? <View style={{ flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'}}>
     
        <TouchableOpacity 
       style={{alignItems:'center',justifyContent: 'center'}}
        onPress={this.demarrer}
        >
        <LottieView
                style={{marginLeft:50,height: '80%',marginRight:"20%",width: '80%'}}
                source={require('../assets/start.json')}
                autoPlay
                loop={true}
                speed={2}
                
            /> 

        </TouchableOpacity>

      </View>
      :
      <View style={styles.container}>
       
        <View style={styles.textContainer}>

          <Text style={styles.paragraph}>
            x = {this.state.accelerometerData.x.toFixed(2)}
            {', '}y = {this.state.accelerometerData.y.toFixed(2)}
            {', '}z = {this.state.accelerometerData.z.toFixed(2)}
          </Text>
          <Text style={{fontSize:20,marginLeft:"15%"}}>La COURSE A COMMENCEE !!!</Text> 
        
            <LottieView
                style={{height: '80%',marginRight:"20%",width: '80%'}}
                source={require('../assets/run.json')}
                autoPlay
                loop={true}
                speed={this.state.accelerometerData.x}
                
            /> 
            
            <View style={{flexDirection:'row',height:"40%",width:"100%" ,justifyContent: 'space-between'}}>
            <TouchableOpacity 
             style={{paddingLeft:50,paddingTop:100,borderRadius:60,height:'15%',width:'30%',opacity:0.7,backgroundColor:'transparent ',alignItems: 'center',justifyContent: 'center'}}
             onPress={this.handleLogout }
             >
             <Image
        style={{height:50,width:50}}
        source={require('../assets/signOut.png')}
      />
           
             </TouchableOpacity>
             <TouchableOpacity style ={{marginRight:70,borderRadius:60,height:'15%',width:'30%',opacity:0.7,backgroundColor:'blue',alignItems: 'center',justifyContent: 'center'}} onPress={this.stopCours} >
             <Text style={{color:'white'}}>STOP
             </Text>
             </TouchableOpacity>
             </View>
          
      <Text style={{ fontSize:26,color:'black'}}>{this.state.start}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    
    textAlign: 'center',
    color: '#34495e',
  },
  textContainer: {
    position: 'absolute',
    top: 40,
  },
});


