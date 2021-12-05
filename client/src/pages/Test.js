import React from 'react';
import hasToken from '../methods/hasToken';
import { Navbar, TestTr, TestSt } from '../components/componentIndex';

function Test() {
    const [user, setUser] = React.useState({});
    React.useLayoutEffect(() => {
        setUser(hasToken());
    }, []);
    document.title = 'Test';

    const decideRender = () => {
        if (user.role === 'teacher') {
            return (
                <>
                    <Navbar signIn={!user.ok} />
                    <TestTr user={user} />
                </>
            );
        } else if (user.role === 'student') {
            return (
                <>
                    <Navbar signIn={!user.ok} />
                    <TestSt user={user} />
                </>
            );
        } else {
            return <h1>Something went wrong</h1>;
        }
    };
    return decideRender();
}

export default Test;
