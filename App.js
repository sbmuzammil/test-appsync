import React from 'react';
import { StyleSheet, View,StatusBar, Modal,Text } from 'react-native';
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider} from 'react-apollo';
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import SaveGraph from './saveGrapgh';
import RegisterPage from './RegisterPage';
import GraphView  from './Graph';
import FriendList from "./friendList";
import { Font } from 'expo';
import {Container,Header,Content,Body,Title, Button, Icon, Left,Right} from 'native-base';
// Fixes isomorphic-fetch
GLOBAL.self = GLOBAL; 

class App extends React.Component {
  
  state = {
    fontLoaded: true,
    message: "",
    modalVisible: false,
    name:"",
    alreadyReg: false,
    accountInfo: null,
    chatInfo: null
  }
  async componentWillMount() {
    var me = this;
    await Font.loadAsync({
      'Roboto_medium': require('./fonts/Roboto-Medium.ttf')
    });
    this.setState({ fontLoaded: false });
    Expo.SecureStore.getItemAsync("user").then((value)=> {
      if(value === null || value === "")
      {
        me.setState({alreadyReg:false, modalVisible: true});
        console.warn("done");
      }else{
        
        me.setState({alreadyReg : true,accountInfo: JSON.parse(value)});
      }
    });
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
logout(){
  Expo.SecureStore.setItemAsync("user","").then(()=> {
      this.setState({alreadyReg:false, modalVisible: true});
  });
}
  render() {
    //check if font not get loaded
    if(this.state.fontLoaded)
    return null;
    //to show front registration page
    else if(this.state.modalVisible)
    return(
     <RegisterPage onSave={(value)=>{if(value !== ""){
       this.setState({accountInfo: JSON.parse(value), modalVisible:false, alreadyReg: true});}else{this.setState({ modalVisible:false});}}}/>
    );
    else if(this.state.chatInfo != null)
      return(   <Container>
                  <StatusBar hidden  />
                    <Header>
                      <Left> 
                      <Button transparent onPress={()=>this.setState({alreadyReg: true, chatInfo: null})}>
                        <Icon name='arrow-back' />
                      </Button>
                      </Left>
                      <Body>
                      <Title>{this.state.chatInfo.name}-Messages</Title>
                      
                      </Body>
                      <Right> 
                      <Button transparent onPress={()=>this.logout()}>
                        <Text>LogOut</Text>
                      </Button>
                      </Right>

                  </Header>
                <View style={{flex: 1}}>
                {/* submit message view */}
                
                <Text>You are logged in as - {this.state.accountInfo.name}</Text>
                  <View style={{ flex: 0.1, margin:4}}>
                    <SaveGraph  sender={this.state.accountInfo} reciever={this.state.chatInfo}/>
                  </View>
                {/* list message view  */}
                  <Content style={{flex: 0.9}}>                  
                  <GraphView sender={this.state.accountInfo} reciever={this.state.chatInfo} /> 
                  </Content>                
                </View>
              </Container>) 
    else if(this.state.alreadyReg)
    {
     return <Content style={{flex: 1}}>
                <StatusBar hidden  />
                 <Text>You are logged in as - {this.state.accountInfo.name}</Text>
                <FriendList user={this.state.accountInfo} onChatClick={(chatWith)=> {this.setState({chatInfo : chatWith})}} logout={()=> this.logout()}/>
            </Content>
    }
    
   
 else
  return <Text>Loading...</Text>;
  }
}

//creadentials App Sync
const clientXre =  {
  "aws_appsync_graphqlEndpoint": "https://g36jiezvirasdgcc4bgdrj7ewy.appsync-api.us-east-2.amazonaws.com/graphql",
  "aws_appsync_region": "us-east-2",
  "aws_appsync_authenticationType": "API_KEY",
  "aws_appsync_apiKey": "da2-qtkanovwyzarxfresbughuinzu",
};

//creating creadentials
const client = new AWSAppSyncClient({
  url: clientXre.aws_appsync_graphqlEndpoint,
  region: clientXre.aws_appsync_region,
  auth: {
      type: AUTH_TYPE.API_KEY,
      apiKey: clientXre.aws_appsync_apiKey,
  },
});


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

//wraping whole app in apollo provider
const WithProvider = () => (
  <ApolloProvider client={client}>
      <Rehydrated>
          <App />
      </Rehydrated>
  </ApolloProvider>
);
export default WithProvider;