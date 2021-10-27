import './App.css';
import { Login, Home, Register } from './pages/pageIndex';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Navbar, Sidebar } from './components/componentIndex';

function App() {
    return (
        // <BrowserRouter>
        //     <Switch>
        //         <Route exact path='/'>
        //             <Home />
        //         </Route>
        //         <Route exact path='/login'>
        //             <Login />
        //         </Route>
        //         <Route exact path='/register'>
        //             <Register />
        //         </Route>
        //     </Switch>
        // </BrowserRouter>

        <>
            <BrowserRouter>
                <Navbar />
                <Switch>
                    <Route path='/' />
                </Switch>
            </BrowserRouter>
        </>
    );
}

export default App;
