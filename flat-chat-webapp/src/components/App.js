import React, { Component } from 'react';
import './App.css';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authenticated: false,
      authToken: null
    }
  }

  // Checks if we are authenticated, and loads resources.
  componentDidMount() {
    let authToken = localStorage.getItem('authToken');
  }

  // Checks if the stored authToken is valid, and updates state appropriately.
  checkAuthToken() {

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
