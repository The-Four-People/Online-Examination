import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <Route exact path='/register'>
          <Register />
        </Route>

      </Switch>
    </BrowserRouter>
  );
}

export default App;
