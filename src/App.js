import './App.css';
import {useRoutes} from './routes'
import React from "react";
import {Provider} from "react-redux";
import store from './redux/store'
import {BrowserRouter as Router} from "react-router-dom";


function App(props) {
    const routes = useRoutes()
  return (
      <Provider store={store}>
      <Router>
        {routes}
      </Router>
      </Provider>
  );
}

export default App;
