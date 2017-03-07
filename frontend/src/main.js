import React from 'react';
import ReactDOM from 'react-dom';
import UI from './UI';
 
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(UI),
    document.getElementById('mount')
  );
});