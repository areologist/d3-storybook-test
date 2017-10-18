import * as React from 'react';
import './App.css';
import AreaChart from './components/AreaChart';
import { generateLineData } from './data';

const logo = require('./logo.svg');
const testData = generateLineData(20);

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <AreaChart data={testData} width={960} height={400} />
      </div>
    );
  }
}

export default App;
