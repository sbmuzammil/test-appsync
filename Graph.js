import React from 'react';
import {  Text } from 'react-native';
import {Query } from 'react-apollo';
import gql  from 'graphql-tag';
import {MessageItems} from './MessageItems';

//parameterized graphql query to get messages 
const ListMessages= gql`query listUmiiMessageWithConTypes ($limit: Int,$TableUmiiMessageWithConTypeFilterInput: TableUmiiMessageWithConTypeFilterInput ){
  listUmiiMessageWithConTypes (limit: $limit, filter: $TableUmiiMessageWithConTypeFilterInput) {
  items{
    id
    body
    senderid
    recieverid
    conversationid
    addedon
  }
}
}`;
const MessageSubscription =gql`subscription oncreateusermessage($converID: ID!) {
  onCreateUmiiMessageWithConType(conversationid : $converID) {
    id
    body
    senderid
    recieverid
    conversationid
    addedon
  }
}`;

 export default class GraphView extends React.Component {
  //state to store message
  state = {
     message: "",
  }

  //order messages to display in list
    trySorting(values)
    {
      var obj= Object.values(values).sort((a,b)   =>{ 
        var dateA = new Date(a.addedon).getTime();
        var dateB = new Date(b.addedon).getTime();
        return dateB-dateA;
    });
      
      return obj;
    }
    getConId(values){
      
        return values.split("-").sort().join('');
    }
    decideName(sender,reciever,me){
      if(sender === me.props.sender.id){
        return me.props.sender.name;
      }
      return me.props.sender.name;
    }
  render() {
    var me = this;
    var limit = 2000;
    const conID=this.getConId(this.props.sender.id+'-'+ this.props.reciever.id);
    var converID = {
      "converID": conID
    };
    var TableUmiiMessageWithConTypeFilterInput = {
      "conversationid": {"eq": conID},
      
    }
    return (
     
      <Query query={ListMessages} variables={{limit,TableUmiiMessageWithConTypeFilterInput}}>
          {({ loading, error, data,subscribeToMore }) => {
              if (loading) return <Text>Loadings...</Text>
              if (error) return <Text>Error- {error.message}</Text>
              if (data && data.listUmiiMessageWithConTypes.items.length === 0) return <Text>please send message to start conversation</Text>
              else
              return <MessageItems
                   data={data}
                   sender = {me.props.sender}
                   reciever = {me.props.reciever}
                   subscribeToNewComments={
                                   ()=> subscribeToMore({
                                     document: MessageSubscription,
                                     variables: {  converID: conID },
                                     updateQuery: (prev, {subscriptionData} ) => {
                                       if (!subscriptionData.data) return prev;
                                      const Item = subscriptionData.data.onCreateUmiiMessageWithConType;
                                     var returnObj = Object.assign({}, prev, {
                                        listUmiiMessageWithConTypes: {items : [Item, ...prev.listUmiiMessageWithConTypes.items] }
                                    });
                                    returnObj.listUmiiMessageWithConTypes.__typename = prev.listUmiiMessageWithConTypes.__typename
                                    return returnObj;
                                       },
                                       onError: err => console.error(err)
                                       })
                                   }
                 />

          }
        }
        
       </Query>
   
 
    );
    }
  }
    
  


          