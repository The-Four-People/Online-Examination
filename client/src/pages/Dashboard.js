import React from 'react';
import hasToken from '../methods/hasToken';
import { Navbar, DashboardTr } from '../components/componentIndex';

const Dashboard = () => {
    const [user, setUser] = React.useState({});
    React.useLayoutEffect(() => {
        setUser(hasToken());
    }, []);
    const decideRender = () => {
        if (user.role === 'teacher') {
            return (
                <>
                    <Navbar signIn={false} />
                    <DashboardTr user={user} />
                </>
            );
        } else if (user.role === 'student') {
        } else {
            return <h1>Something went wrong</h1>;
        }
    };
    return decideRender();
};

export default Dashboard;
