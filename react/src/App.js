import React from 'react';
import {Content} from 'trunx'
import {Footer} from 'trunx'


import 'bulma/css/bulma.css'
import './App.css';
import Routes from './route.js'

function App() {
  return (
    <div className="App">
      <Routes />
      <Footer>
        <Content hasTextCentered>
          <p>
            <strong>Dashboard</strong> by <a href='http://jeanmichel'>Jean rené</a>.
          </p>
        </Content>
      </Footer>
    </div>
  );
}

export default App;