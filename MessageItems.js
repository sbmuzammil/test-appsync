import React from 'react';

import {  Text, View } from 'react-native';
import {List,ListItem,Body,Right, Left} from 'native-base';



export class MessageItems extends React.Component  {
    componentDidMount() {
        
            this.props.subscribeToNewComments();
    } 
  trySorting  (values)
{
  var obj= Object.values(values).sort((a,b)   =>{ 
    var dateA = new Date(a.addedon).getTime();
    var dateB = new Date(b.addedon).getTime();
    return dateB-dateA;
});
  
  return obj;
}

 decideName (messagesender,messagereciever,sender,reciever){
    if(messagesender === sender){
      return sender.name;
    }
    return reciever.name;
  }
    render () {
    debugger;
     const {data, subscribeToNewComments,sender,reciever} = this.props; 
    return( 
            <View style={{flex:1}}>
                    <List scrollEnabled>
                    {/* showing message after sorting */}
                    {data && this.trySorting(data.listUmiiMessageWithConTypes.items).map(message => (
                        <ListItem avatar key={"message-"+message.id}>
                          <Left>
                            <Text style={{width : 60, fontSize: 12, fontFamily: 'Roboto_medium'}}> {this.decideName(message.senderid,message.recieverid,sender,reciever)}</Text>
                          </Left>
                          <Body>
                            <Text note>{message.body}</Text>
                          </Body>
                          <Right>
                            <Text note>{new Date(message.addedon).getHours()}: {new Date(message.addedon).getMinutes()}</Text>
                          </Right>
                        </ListItem>
                    ))}                        
                    </List>
                    
        </View>
          );
    }
}