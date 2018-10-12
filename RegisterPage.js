    
import React from 'react';
import { View,Text, AsyncStorage } from 'react-native';

import gql  from 'graphql-tag';
import {Button,Item,Input} from 'native-base';
import { Mutation } from 'react-apollo';
import  AlreadyRegister  from './AlreadyRegister';

//graph ql query to add message
const Register_User= gql`
mutation createUmiiUserType($createumiiusertypeinput: CreateUmiiUserTypeInput!) {
    createUmiiUserType(input: $createumiiusertypeinput) {
      id
      name
      profilepic
      email
      addedon
    }
  }
`;
 export default class RegisterPage extends React.Component {
  state = {
     name: "",
     profilepic:"NOT AVAILABLE!",
     email:"",
     addedon: new Date().toISOString(),
     already: false
  }
  
   
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
 async saveDataLocal(me,obj){
    me.setState({name:"",email: ""});
    Expo.SecureStore.setItemAsync("user", obj);
        
        me.props.onSave(obj);
  }
  

  render() {
      var guidN= this.guid();
      var me = this;
    // fron page is registration page either user provide name or skip if user skipp then UMII name is used as sender id
    if (this.state.already) {
     return   <AlreadyRegister onSaveReg={(val) => me.saveDataLocal(me,JSON.stringify(val))} />
    }
    else
    return (
        <View style={{flex: 1, justifyContent:'center', margin: 15}}>
        {/* text field to take user name */}
            <View style={{marginVertical : 5}}>
            <View>
                <Item rounded  small>
                  <Input value={this.state.name} onChangeText={(val)=>this.setState({name:val})}  placeholder="Your Name" maxLength={50}  />
                </Item>
            </View>
            <View style={{marginVertical : 10}}>
                <Item rounded small >
                  <Input value={this.state.email} keyboardType="email-address" onChangeText={(val)=>this.setState({email:val})}  placeholder="Your Email" maxLength={50}  />
                </Item>
            </View>
            </View>
            {/* Register button */}
            <Mutation mutation={Register_User} >
        {/* addTodo is a call back function provided by Mutation */}
          {(addTodo) => (
            <View >              
                <Button style={{height:48, alignSelf:'center',justifyContent:'center'}} onPress={()=>{ if(this.state.name.length > 0 && this.state.email.length > 0) {
                    //this.props.onSave(this.state.name,this.state.email);
                    addTodo({ variables: { 
                        "createumiiusertypeinput":{  
                            id: guidN,
                            name: this.state.name, 
                            profilepic: "Not Available", 
                            email:this.state.email.trim().toLowerCase(),
                            addedon: this.state.addedon  
                        }
                        },
                              optimisticResponse: 
                              {
                                __typename: "Mutation",
                                createUmiiUserType: {
                                    __typename: "createUmiiUserType",
                                    id: guidN,
                                    name: this.state.name, 
                                    profilepic: "Not Available", 
                                    email:this.state.email.trim().toLowerCase(),
                                    addedon: this.state.addedon                                                                
                                } 
                                }}
                            ).then( (value)=>
                                  {
                                    //success call back
                                    const {email,id,name} = value.data.createUmiiUserType;
                                    var obj = {
                                        "id":id,
                                        "email":email,
                                        "name":name
                                    };
                                   me.saveDataLocal(me,JSON.stringify(obj));
                                    
                                  }
                            ).catch( (error)=>
                                {
                                  //exception log here
                                });
      
                } }} primary small rounded block>
                    <Text style={{color :'white'}}>Register Me!</Text>
                </Button>              
          </View>  )}
            </Mutation>
            {/* skip button */}
            <Button transparent onPress={()=>this.setState({already: true})} style={{alignSelf:'center', marginTop : 100}}>
                        <Text style={{fontSize : 20}}>have account?</Text>
            </Button>
        </View>   
    );
  }
}

          