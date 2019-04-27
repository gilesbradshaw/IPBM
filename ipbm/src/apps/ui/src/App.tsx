import React from 'react';
import ApolloClient from 'apollo-boost';
import {
  ApolloProvider,
} from 'react-apollo';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import {
  InMemoryCache,
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';

import Accounts from './Accounts'
import Policies from './policies/Policies'
import RoleTasks from './RoleTasks'

import Registries from './registries/Registries'
import Registry from './registries/Registry'
import AddRegistry from './registries/AddRegistry'

import './App.css';

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: (object: any) => {
      if(object.__typename ==='ProcessContract') {
        return object.address
      }
      return defaultDataIdFromObject(object)
    }
  }),
  uri: "http://localhost:6500/graphql"
});


const App: React.FC = () => {
  return (
    <Router>
      <Link
        to='/'
      >
        <h1>Caterpillar</h1>
      </Link>
      <Link
        to='/accounts'
      >
        accounts
      </Link>
      <Link
        to='/registries'
      >
        registries
      </Link>
      <Link
        to='/registries-add'
      >
        +
      </Link>
      <Link
        to='/policies'
      >
        policies
      </Link>
      <Link
        to='/role-tasks'
      >
        role tasks
      </Link>      
      <ApolloProvider
        client={client}
      >
        <Route
          path='/accounts'
          component={Accounts}
        />
        <Route
          exact
          path='/registries-add'
          component={AddRegistry}
        />
        <Route
          exact
          path='/registries'
          component={Registries}
        />
        <Route
          path='/registries/:registry'
          component={Registry}
        />
        <Route
          path='/policies'
          component={Policies}
        />
        <Route
          path='/role-tasks'
          component={RoleTasks}
        />
      </ApolloProvider>
    </Router>
  );
}

export default App;