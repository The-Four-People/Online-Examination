import React from 'react';
import hasToken from '../methods/hasToken';
import { Navbar, ResultTr, ResultSt } from '../components/componentIndex';

const Result = () => {
    const [user, setUser] = React.useState({});
    React.useLayoutEffect(() => {
        setUser(hasToken());
    }, []);
    const decideRender = () => {
        if (user.role === 'teacher') {
            return (
                <>
                    <Navbar signIn={!user.ok} />
                    <ResultTr user={user} />
                </>
            );
        } else if (user.role === 'student') {
            return (
                <>
                    <Navbar signIn={!user.ok} />
                    <ResultSt user={user} />
                </>
            );
        } else {
            return <h1>Something went wrong</h1>;
        }
    };
    return decideRender();
};

export default Result;
