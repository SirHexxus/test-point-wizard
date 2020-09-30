import React from 'react';
import './App.css';
import InputForm from './inputForm/InputForm';
import { Card } from 'antd';

function App() {
  return (
    <div className="App">
      <Card style={{ width: '75vw', border: '1px solid black', margin: 'auto' }}>
        <h1>Test Point Wizard</h1>
        <InputForm />
      </Card>
    </div>
  );
}

export default App;
