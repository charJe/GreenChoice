import React from 'react';
//var analyze = require('./backend');
import { Button,Text,Image, View, StyleSheet, ImageStore,BackHandler, ToastAndroid, ScrollView, SectionList} from 'react-native';
import {Camera,
  Permissions, 
  Constants, 
  ImagePicker,
  } from 'expo';
var backend = require('./backend.js');


function POST(data, endpoint) {
  let formData = new FormData();
  formData.append('apikey', '072262d90988957')
  formData.append('base64Image', data)
  console.log(formData);

  return fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData,
  }).then(function(response){
    console.log(response.text());
    //this.state.ocr = response.json();
  }, function(error){
    error.message
  })
}


export default class App extends React.Component {

  state = {
    backHandler: null,
    ocr: ["FLOUR","NIACIN","THIAMINE MONONITRATE", "GELATIN", "FOLIC ACID", "RIBOFLAVIN", "SOYBEAN OIL", "SALT", "CALCIUM PROPIONATE"],
    type: Camera.Constants.Type.back,
    photo: 'null',
    view: 'Camera',
    readyToGet: 1,
    information: {
      overallType: "loading..."
    },
  };

  dummy = [
    {
      ingredient: 'BALLOONS',
      data: [{
        type: "VEGAN", water: "0"
      }]
    },
    {
      ingredient: 'CORN MEAL',
      data: [{
        type: "VEGAN", water: "0"
      }]
    },
    {
      ingredient: 'WHEAT',
      data: [{
        type: "VEGAN", water: "0"
      }]
    }
  ]

  extractKey = ({ingredient}) => ingredient;

  renderItem = ({item}) => {
    return(
      <View style={styles.item}>
        <Text style={styles.itemText}>
          Type: {item.type}
        </Text>
        <Text style={styles.itemText}>
          Water Usage: {item.water}
        </Text>
      </View>
    )
  }

  renderSectionHeader = ({section}) => {
    return(
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>
          {section.ingredient}
        </Text>
      </View>
    )
  }

  async goBack() {
    if(this.state.view == 'View'){
      this.setState({view: 'Camera'})
    }
    else if(this.state.view == 'Picker'){
      this.setState({view: 'Camera'})
    }
    else if(this.state.view == 'Details'){
      this.setState({view: 'View'})
    }
    else{
      BackHandler.exitApp()
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.goBack(); // works best when the goBack is async
    return true;
  }

  async takePhoto() {
    await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.state.photo = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    quality: 0.8,
    base64: true,
    })
    if(this.state.photo.cancelled != true){
      console.log(this.state)
      this.setState({view: 'View'});
      this.postPhoto();
    }
    else{
      ToastAndroid.show('Picture not taken', ToastAndroid.SHORT);
    }
  }

  async selectPhoto() {
    await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    this.state.photo = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    base64: true,
    })
    if(this.state.photo.cancelled != true){
      this.setState({view: 'View'})
      console.log(this.state);
      this.postPhoto();

      console.log(this.state.ocr)
    }
    else{
      ToastAndroid.show('Picture not taken', ToastAndroid.SHORT);
    }
  }

  postPhoto(){
      let data = 'data:image/jpeg;base64,' + this.state.photo.base64;
      this.setState({posting: true})
      POST(data, 'https://api.ocr.space/parse/image').then(() => {
        this.setState({readyToGet: 1})
      }, (err) => {
        ToastAndroid.show('Error connecting with server', ToastAndroid.SHORT);
        console.log("Error connecting with server")
        this.setState({posting: false})
      })
  }

  render() {
    if(this.state.view == 'Camera'){
      return (
        <View style={{backgroundColor: '#ffffff',flex:1}}>

            <View style={{backgroundColor: '#ffffff', height: Constants.statusBarHeight}}></View>

            <View style={{height: '55%', alignItems:'center'}}>
            <Image 
              style={{width: '100%', height: '100%'}}
              source={{uri: 'https://i.imgur.com/T1ltwTl.png'}}>
            </Image>
            </View>

            <View style={{height: Constants.statusBarHeight}}></View>

            <View style={{flex: 1, backgroundColor: '#9aeae8'}}>
              <View style={{backgroundColor: '#9aeae8', height: Constants.statusBarHeight}}></View>
              <View style={{backgroundColor: '#9aeae8',justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={{fontSize:28, color:'#ffffff'}}>Mind Your Food</Text>
                  <Text style={{fontSize:15, color:'#ffffff'}}>Get started by taking a picture of a product's </Text>
                  <Text style={{fontSize:15, color:'#ffffff'}}>ingredient list</Text>
              </View>

              <View style={{backgroundColor: '#9aeae8', height: Constants.statusBarHeight}}></View>


              <View style={{backgroundColor: '#71c7f7', flex: 1, justifyContent: 'center'}}>

              <View style={{backgroundColor: '#71c7f7',flexDirection: 'row', justifyContent:'center'}}>

                <View width = '25%'>
                  <Button
                    title='capture'
                    color='#4e79ad'
                    containerViewStyle={{}}
                    onPress={()=>{
                      this.takePhoto()}}><Text style={{color: 'black'}}>Capture</Text></Button>
                </View>
                  
                  <View width = '20%'></View>

                  <View width = '25%'>
                  <Button
                    title='gallery'
                    color='#4e79ad'
                    onPress={()=>{
                      this.selectPhoto()}}></Button>
                  </View>
                  </View>
                </View>
            </View>
        </View>
      );
    }

    else if(this.state.view == "Details"){

      console.log(this.state.information.ingredients)

      return(
        <View style={{backgroundColor: '#ffffff',flex: 1}}>
        <View style={{backgroundColor: '#ffffff', height: Constants.statusBarHeight}}></View>
          <View style={{backgroundColor: '#71c7f7', alignItems: 'center', height: '10%'}}>
            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 20}}>
                Details
              </Text>
            </View>
          </View>
          <ScrollView style={{paddingTop: 0}}>
            <SectionList
                sections={this.dummy}
                renderItem={this.renderItem}
                renderSectionHeader={this.renderSectionHeader}
                keyExtractor={this.extractKey}
            />
          </ScrollView>
        </View>
      );
    }

    else if(this.state.view == 'View'){

      if(this.state.readyToGet == 1){
        this.state.information = backend.calculateEverything(this.state.ocr);
        this.state.information = JSON.parse(this.state.information)
        console.log(this.state.information)
      }

      return(
        <View style={{backgroundColor: '#ffffff', flex: 1}}>
        <View style={{backgroundColor: '#ffffff', height: Constants.statusBarHeight}}></View>
        <View style={{backgroundColor: '#ffffff', height: '20%', width: '100%'}}></View>

          <View style={{backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{height: Constants.statusBarHeight}}></View>
          <Text style={{fontSize:52 }}>ITS</Text>
          <Text style={{fontSize:45, color:'#9aeae8'}}>{this.state.information.overallType}</Text>
          </View>

          <View style={{backgroundColor: '#ffffff', height: '42%', width: '100%'}}></View>

          <View style={{backgroundColor: '#ffffff', justifyContent: 'center', flexDirection: 'row'}}>
            <View width='25%'>
              <Button containerViewStyle={{flex: 1}} color='#4e79ad' title='details' onPress={() => {
                console.log("Details")
                this.setState({view: "Details", photo: 'null'})
              }}>Details</Button>
            </View>
            <View style={{backgroundColor: '#ffffff', width: '20%'}}></View>
            <View width='25%'>
              <Button containerViewStyle={{flex: 1}} color='#4e79ad' title='back' onPress={() => {
                console.log("Back")
                this.setState({view: "Camera", photo: 'null'})
              }}>Back</Button>
            </View>
          </View>

          <View style={{backgroundColor: '#ffffff',height: Constants.statusBarHeight}}></View>

          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'black'}}>To take another picture, click 'Back'</Text>
          </View>

          <View style={{justifyContent: 'center', alignItems: 'center', height: '8%', width:'100%'}}></View>
        </View>
      )
    }

    else{
      return(
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1, flexDirection:'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text>Whoops! You were not supposed to be here :(</Text>
        <Text>Please close the app and try again!</Text>
        </View>
      </View>
      )
    }
    }
    
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    backgroundColor: 'whitesmoke'
  },
  itemText: {
    fontSize: 12,
    backgroundColor: 'whitesmoke'
  },
  sectionHeader: {
    padding: 10,
    backgroundColor: '#9aeae8',
  },
  sectionHeaderText: {
    fontSize: 13,
  },
})