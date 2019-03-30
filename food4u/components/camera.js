import React from 'react';
import { Button,Text,Image, View, StyleSheet, ImageStore, ToastAndroid} from 'react-native';
import {
  Permissions, 
  Constants, 
  ImagePicker,
  BackHandler} from 'expo';

function POST(data, endpoint) {
  return fetch('http://192.168.137.134:5000' + endpoint, {
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
  return fetch('http://192.168.137.134:5000' + endpoint, {
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
    backHandler: null,
    type: Camera.Constants.Type.back,
    photo: 'null',
    view: 'View',
    readyToGet: 1,
    information: {
      overallType:"loading..."
    },
  };

  async goBack() {
    if(this.state.view == 'View'){
      this.state.view == 'Camera';
    }
    else if(this.state.view == 'Camera'){
      BackHandler.exitApp()
    }
    else if(this.state.view == 'Details'){
      this.state.view == 'View';
    }
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.goBack(); // works best when the goBack is async
      return true;
    });
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  async takePhoto() {
    await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.state.photo = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.8,
    })
    console.log('Taken Picture')
    this.setState({view: 'View'})
    //this.postPhoto();
    console.log(this.state)
  }

  async selectPhoto() {
    await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.state.photo = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    })
    console.log('Taken Picture')
    this.setState({view: 'View'})
    //this.postPhoto();
    console.log(this.state)
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
    if(this.state.view == 'Camera'){
      return (
        <View style={{backgroundColor: '#d1edff',flex:1}}>

            <View style={{backgroundColor: '#58426C', height: Constants.statusBarHeight}}></View>
            <View style={{height: '1.5%'}}></View>

            <View style={{height: '55%', alignItems:'center'}}>
            <Image 
              style={{width: '100%', height: '100%'}}
              source={{uri: 'https://i.imgur.com/T1ltwTl.png'}}>
            </Image>
            </View>

            <View style={{height: Constants.statusBarHeight}}></View>
            <View style={{backgroundColor: '#42CCC8', height: Constants.statusBarHeight}}></View>

            <View style={{backgroundColor: '#42CCC8',justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize:26, color:'#ffffff'}}>Mind Your Food</Text>
                <Text style={{fontSize:15, color:'#ffffff'}}>Get started by taking a picture of a product's </Text>
                <Text style={{fontSize:15, color:'#ffffff'}}>ingredient list</Text>
            </View>

            <View style={{backgroundColor: '#42CCC8', height: Constants.statusBarHeight}}></View>
            <View style={{backgroundColor: '#4873A6',height: Constants.statusBarHeight}}></View>
            <View style={{backgroundColor: '#4873A6',height: Constants.statusBarHeight}}></View>

            <View style={{backgroundColor: '#4873A6',flexDirection: 'row', justifyContent:'center'}}>

              <View width = '25%'>
                <Button
                  title='capture'
                  color='#58426C'
                  containerViewStyle={{}}
                  onPress={()=>{
                    this.takePhoto()}}><Text style={{color: 'black'}}>Capture</Text></Button>
              </View>
                
                <View width = '20%'></View>

                <View width = '25%'>
                <Button
                  title='gallery'
                  color='#58426C'
                  onPress={()=>{
                    this.selectPhoto()}}></Button>
                </View>
                
            </View>

            <View style={{backgroundColor: '#4873A6',height: Constants.statusBarHeight}}></View>
            <View style={{backgroundColor: '#4873A6',height: Constants.statusBarHeight}}></View>
        </View>
      );
    }

    else if(this.state.view == "Details"){

      console.log(this.state.information.ingredients)

      return(
        <View style={{backgroundColor: '#d1edff',flex: 1, alignItems: 'center'}}>
        <View style={{height: '10%', width:'100%'}}></View>

        <Text style={styles.container}>{JSON.stringify(this.state.information.ingredients)}</Text>

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '10%', width:'100%'}}></View>
        <View style={{width:'70%'}}>
        <Button containerViewStyle={{flex: 1}} color='#58426C' title='back' onPress={() => {
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

      console.log(this.state.information)

      return(
        <View style={{backgroundColor: '#4EA1D2', flex: 1}}>
        <View style={{backgroundColor: '#58426C', height: Constants.statusBarHeight}}></View>
        <View style={{backgroundColor: '#40C9C5', height: '20%', width: '100%'}}></View>

          <View style={{backgroundColor: '#4EA1D2', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{height: Constants.statusBarHeight}}></View>
          <Text style={{fontSize:56 }}>It's </Text>
          <Text style={{fontSize:56, color:'white'}}>{this.state.information.overallType}</Text>
          </View>

          <View style={{backgroundColor: '#4EA1D2', height: '35%', width: '100%'}}></View>

          <View style={{backgroundColor: '#4EA1D2', justifyContent: 'center', flexDirection: 'row'}}>
            <View width='20%'>
              <Button containerViewStyle={{flex: 1}} color='#58426C' title='details' onPress={() => {
                console.log("Details")
                this.setState({view: "Details", photo: 'null'})
              }}>Details</Button>
            </View>
            <View style={{backgroundColor: '#4EA1D2', width: '20%'}}></View>
            <View width='20%'>
              <Button containerViewStyle={{flex: 1}} color='#58426C' title='back' onPress={() => {
                console.log("Back")
                this.setState({view: "Camera", photo: 'null'})
              }}>Back</Button>
            </View>
          </View>

          <View style={{backgroundColor: '#4EA1D2',height: Constants.statusBarHeight}}></View>

          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'white'}}>To take another picture, click 'Back'</Text>
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