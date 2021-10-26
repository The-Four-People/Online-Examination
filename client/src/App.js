import './App.css';
import { Login, Home, Register } from './pages/pageIndex';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

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
