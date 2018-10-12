import React from 'react';
import {  Text, View } from 'react-native';
import {Button,Item,Input} from 'native-base';
import {GetUser} from './GetUser';
//parameterized graphql query to get users 


 export default class AlreadyRegister extends React.Component {
     state ={
            email: "",
            getuser: false
     };

  render() {
      var me =this;
    //max take limit of messages
    var TableUmiiUserTypeFilterInput = {
        "email": { "eq": this.state.email.trim().toLowerCase()}
    }
    return (
      <View style={{flex: 1, justifyContent:'center', margin: 15}}>
            <View style={{marginVertical : 5}}>
            <View>
                <Item rounded  small>
                  <Input value={this.state.email} onChangeText={(val)=>this.setState({email:val})}  placeholder="Your email"   />
                </Item>
            </View>
            <View style={{marginVertical : 10}}>
            <Button style={{height:48, alignSelf:'center',justifyContent:'center'}} onPress={()=>{ if(this.state.email.length > 0 ) {
                        me.setState({getuser: true});
                       
                } }} primary small rounded block>
                    <Text style={{color :'white'}}>Find!</Text>
                </Button>
            {this.state.getuser && <GetUser   TableUmiiUserTypeFilterInput={TableUmiiUserTypeFilterInput} onResponse ={(resp)=>{ 
               if(resp.length === 0 ){
                alert("no user found");
            }
        else{
            var newobj=Object.values(resp[0]);
            console.warn('',newobj);
            var obj = {
                "id":newobj[0],
                "email":newobj[3],
                "name":newobj[1]
            };
                me.props.onSaveReg(obj);
        }
        }
             }/>     }         
            </View>
            </View>
        </View>
          );
    
  }
}

          


