import React from 'react'
import { AppRegistry } from 'react-native'

//import ApolloClient, { createNetworkInterface } from 'apollo-client';
//import { ApolloProvider } from 'react-apollo'

import App from './App'
import {name as appName} from './app.json';


//const Client = () => {
//  const networkInterface = createNetworkInterface({
//    uri: 'http://localhost:5000/graphql'
//  });
//  const client = new ApolloClient({
//    networkInterface
//  });
//  return (
//    <ApolloProvider client={client}>
//      <App />
//    </ApolloProvider>)
//};

AppRegistry.registerComponent(appName, () => App);