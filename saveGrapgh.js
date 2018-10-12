import React from 'react';
import { View } from 'react-native';
import { Mutation} from 'react-apollo';

import gql  from 'graphql-tag';
import {Button,Icon,Item,Input} from 'native-base';

//graph ql query to add message
// const SAVE_MESSAGE= gql`
// mutation createUmiiMessageOType($CreateUmiiMessageOTypeInput: CreateUmiiMessageOTypeInput!) {
//   createUmiiMessageOType(input: $CreateUmiiMessageOTypeInput) { 
//     id
    
//   }

// }
// `;
const SAVE_MESSAGE= gql`
mutation createUmiiMessageWithConType($createUmiiMessageWithConTypeInput: CreateUmiiMessageWithConTypeInput!){
  createUmiiMessageWithConType(input: $createUmiiMessageWithConTypeInput){
    id
    body
    senderid
    recieverid
    conversationid
    addedon

}
}
`;
 export default class SaveGraph extends React.Component {
   //state to save mssage
     state ={
        message :""
     };

     //method to generate guid
    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
      getConId(values){
        // var stringId = this.props.sender.id + "-" +this.props.reciever.id;
        console.warn(values);
           return values.split("-").sort().join('');
       }

  render() {
    //check if user skip or register name on front page
    var guidN = this.guid();
    return (
      // Mutation wrapper to run create query
        <Mutation mutation={SAVE_MESSAGE} >
        {/* addTodo is a call back function provided by Mutation */}
          {(addTodo) => (
          <View style={{flex: 1, flexDirection:'row'}}>
          {/* submit message  view */}
            <View style={{flex:1}}>
                  <Item rounded style={{marginHorizontal : 4}}>
                    <Input value={this.state.message} onChangeText={(val)=>this.setState({message:val})}  placeholder="message..."  />
                  </Item>
            </View>
            <View >              
                 <Button style={{height:48, alignSelf:'center',justifyContent:'center'}} onPress={()=>{ 
                  if(this.state.message != ""){
                    // method with call back to send query to aws Appsync   (Variables = params and optimistic response is needed when we need offline capabilities)
                                      addTodo({ variables: { 
                                        "createUmiiMessageWithConTypeInput":{
                                          id: guidN,
                                          body: this.state.message,
                                          senderid:this.props.sender.id, 
                                          recieverid: this.props.reciever.id , 
                                          addedon: new Date().toISOString(),
                                          conversationid: this.getConId(this.props.sender.id+'-'+ this.props.reciever.id)}
                                        },
                                              optimisticResponse: 
                                              {
                                                __typename: "Mutation",
                                                createUmiiMessageWithConType: {
                                                    __typename: "createUmiiMessageWithConType",
                                                    id: guidN,
                                                    body: this.state.message,
                                                    senderid:this.props.sender.id, 
                                                    recieverid: this.props.reciever.id ,
                                                    addedon: new Date().toISOString()  ,
                                                    conversationid: this.getConId(this.props.sender.id+'-'+ this.props.reciever.id)                                                             
                                                } 
                                                }}
                                            ).then( (value)=>
                                                  {
                                                    //success call back
                                                    this.setState({message:""});
                                                  }
                                            ).catch( (error)=>
                                                {
                                                  //exception log here
                                                });
                      
                                              }
                                           }
                                        } primary small rounded>
                    <Icon name='paper-plane' />
                </Button>
              </View>  
            </View>       
              )}
          </Mutation>
      );
  }
}

          
