import React from 'react';
import { Button,Text,Image, View, StyleSheet, TouchableOpacity, ImageStore, ToastAndroid} from 'react-native';
import { Camera, 
  Permissions, 
  FlatList, 
  AsyncStorage} from 'expo';
import { ScrollView } from 'react-native-gesture-handler';


let LOCATION = null

function POST(data, endpoint) {
  return fetch('http://192.168.137.1:5000' + endpoint, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
    body: JSON.stringify(data),
  });
}

function GET(endpoint) {
  console.log("Getting " + endpoint)
  return fetch('http://192.168.137.1:5000' + endpoint, {
  method: 'GET',
  methods: 'GET',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  });
}

export default class CameraComponent extends React.Component {

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photo: 'null',
    view: 'Camera',
    readyToGet: 1,
    information: {
      overallType:"waiting for server"
    },
  };


  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  async takePhoto() {
    console.log("taking picture")
    photo = await this.camera.takePictureAsync()
    this.setState({photo: photo, location:LOCATION, view: "Edit"})
    console.log("Picture Taken!")
    this.state.view = "View";

    this.postPhoto();
  }

  postPhoto(){
    ImageStore.getBase64ForTag(this.state.photo.uri, (base64Data) => {
      let data = base64Data
      this.setState({posting: true})
      POST(data, '/postPicture/').then(() => {
        this.setState({photo: 'null', readyToGet: 1})
      }, (err) => {
        ToastAndroid.show('Error connecting with server', ToastAndroid.SHORT);
        console.log("Error connecting with server")
        this.setState({posting: false})
      })
    }, (err) => {
      ToastAndroid.show('Critical error converting photo', ToastAndroid.SHORT);
      console.log("Critical error converting photo")
      this.setState({view: "Camera", photo: 'null'})
    })
  }

  render() {
    if(this.state.view == "Camera"){
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View><Text>null Permission</Text></View>;
    } else if (hasCameraPermission === false) {
      return <View><Text>Please set Camera Permissions!</Text></View>;
    } else {
      return (
        <View style={{flex:1}}>

            <View style={{ flex:1, height: '75%', width:'100%'}}>
            
                <Camera style={{ flex:1}} type={this.state.type} ratio='4:3' ref={ref => { this.camera = ref; }}>
                <View style={{justifyContent: 'center', alignItems: 'center', height: '15%', width:'100%'}}></View>
                
                </Camera>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', height: '5%', width:'100%', backgroundColor: '#a8f732'}}>
                <Text style={{fontSize:15, color:'#FFFFFF'}}>TAKE A PICTURE OF A FOOD PRODUCT'S INGREDIENT LIST</Text>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', height: '19%', width:'100%'}}>
                
                <TouchableOpacity onPress={()=>{
                  this.takePhoto();
                  }}>
                <Image style={styles.button} source={{uri: 'http://a2.mzstatic.com/us/r30/Purple69/v4/ca/47/da/ca47da2f-877c-68a4-124b-0eee5d38be2e/icon175x175.png'}} style= {{width: 120, height: 120}}></Image>
                </TouchableOpacity>
                
            </View>
        </View>
      );
    }
    }

    else if(this.state.view == "Details"){

      console.log(this.state.information.ingredients)

      return(
        <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{height: '10%', width:'100%'}}></View>

        <Text style={styles.container}>{JSON.stringify(this.state.information.ingredients)}</Text>

        {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '10%', width:'100%'}}></View> */}
        <View style={{width:'70%'}}>
        <Button containerViewStyle={{flex: 1}} color='#89ed25' title='back' onPress={() => {
              console.log("Back")
              this.setState({view: "Camera", photo: 'null'})
            }}>Back</Button>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', height: '8%', width:'100%'}}></View>
        </View>
      );
    }

    else{

      if(this.state.readyToGet == 1){
        GET(`/getInfo/`).then((res) => {
          return res.json()}).then((res) => {
            console.log(res.overallType)
            this.state.information = res
        }).catch((err) => {
          console.log(err)
          console.log("Error connecting to server[GET]")
          ToastAndroid.show("Error connecting to server", ToastAndroid.SHORT)
        });
      }

      // console.log(this.state.information)

      return(
        <View style={{height: '100%'}}>
        <View style={{height: '30%', width: '100%'}}></View>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize:56 }}>It's </Text>
          <Text style={{fontSize:56, color:'green'}}>{this.state.information.overallType}</Text>
          <View style={{height: '35%', width: '100%'}}></View>
          <View style={{width: '70%'}}>
            <Button containerViewStyle={{flex: 1}} color='#89ed25' title='details' onPress={() => {
              console.log("Details")
              this.setState({view: "Details", photo: 'null'})
            }}>Details</Button>
            <View style={{height: '13%'}}></View>
            <Button containerViewStyle={{flex: 1}} color='#89ed25' title='back' onPress={() => {
              console.log("Back")
              this.setState({view: "Camera", photo: 'null'})
            }}>Back</Button>
          </View>
          </View> 
          <View style={{justifyContent: 'center', alignItems: 'center', height: '8%', width:'100%'}}></View>
        </View>
      )
    }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#89ed25',
    padding: 10,
    width: '30%'
  },
  countContainer: {
    alignItems: 'center',
    padding: 10
  },
  countText: {
    color: '#FF00FF'
  }
})