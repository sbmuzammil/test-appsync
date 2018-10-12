import React from 'react';
import {  Text, View } from 'react-native';
import {Query } from 'react-apollo';
import gql  from 'graphql-tag';
import {List,ListItem,Body,Right, Left, Button,Container,Header,Title} from 'native-base';

//parameterized graphql query to get users 
const ListUser= gql`query listUmiiUserTypes ($limit: Int, $TableUmiiUserTypeFilterInput: TableUmiiUserTypeFilterInput ){
  listUmiiUserTypes (limit: $limit, filter: $TableUmiiUserTypeFilterInput) {
  items{
    id
    name
    profilepic
    email
    addedon
  }
}
}`;

 export default class FriendList extends React.Component {

  render() {
    //max take limit of messages
    var limit = 2000;
    var TableUmiiUserTypeFilterInput = {
      "email": { "ne": this.props.user.email}
  }
    return (
      // pollInterval is time to refresh
      <View>
               <Header>
                 <Body>
                  <Title>Friends</Title>
                 </Body>
                 <Right> 
                      <Button transparent onPress={()=>this.props.logout()}>
                        <Text>LogOut</Text>
                      </Button>
                  </Right>
              </Header>
    <Query query={ListUser} variables={{limit, TableUmiiUserTypeFilterInput}} pollInterval={1000} >
        {({ loading, error, data  }) => {
          if (loading) return <Text>Loadings...</Text>
          if (error) return <Text>Error- {error}</Text>
          
          return ( 
                <View style={{flex:1}}>
                    <List scrollEnabled>
                    {/* showing users  */}
                    {data && data.listUmiiUserTypes.items.map(user => (
                        <ListItem avatar key={"user-"+user.id}>
                          <Left>
                            <Text style={{width : 60, fontSize: 12, fontFamily: 'Roboto_medium'}}> {user.name}</Text>
                          </Left>
                          <Body>
                            <Text note>{user.email}</Text>
                          </Body>
                          <Right>
                          <Button style={{ alignSelf:'center',justifyContent:'center'}} onPress={()=>{this.props.onChatClick(user); } } primary small>
                            <Text style={{color :'white'}}>Chat!</Text>
                         </Button>              
                          </Right>
                        </ListItem>
                    ))}                        
                    </List>
            </View>
          );
        }}
    </Query>
    </View>
 
    );
  }
}

          