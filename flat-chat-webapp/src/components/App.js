import React, { Component } from 'react';
import './App.css';
import { ApolloClient, createNetworkInterface, gql, graphql } from 'react-apollo';

class App extends Component {

  constructor(props) {
    super(props);

    // Create GraphQL networkInterface.
    const networkInterface = createNetworkInterface({
      uri: 'http://api.localhost:1337/graphql'
    });

    // Create GraphQL client.
    const client = new ApolloClient({
      networkInterface: networkInterface
    });

    this.state = {
      loading: true,
      authenticated: false,
      authToken: null,
      graphQLClient: client
    }
  }

  // Checks if we are authenticated, and loads resources.
  componentDidMount() {
    let authToken = localStorage.getItem('authToken');
    checkAuthToken(authToken);
  }

  // Checks if the stored authToken is valid, and updates state appropriately.
  checkAuthToken(authToken) {

  }

  render() {
    return (
      <div>
        foo
      </div>
    );
  }

}

export default App;
