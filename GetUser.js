import React from 'react';
import {Query } from 'react-apollo';

import gql  from 'graphql-tag';
const ListUser= gql`query listUmiiUserTypes ($TableUmiiUserTypeFilterInput: TableUmiiUserTypeFilterInput ){
    listUmiiUserTypes (filter: $TableUmiiUserTypeFilterInput) {
    items{
      id
      name
      profilepic
      email
      addedon
    }
}
}`;

export const GetUser = ({TableUmiiUserTypeFilterInput, onResponse}) => { 
    return(
    <Query query={ListUser} variables={{TableUmiiUserTypeFilterInput}}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return `Error!: ${error.messsage}`;
  
         if(data && data.listUmiiUserTypes.items){
               onResponse(data.listUmiiUserTypes.items);
               return true;
         }
      }}
    </Query>
);
    }