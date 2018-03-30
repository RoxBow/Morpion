import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import Morpion from './Morpion';

ReactDOM.render(<Morpion />, document.getElementById('root'));
registerServiceWorker();
