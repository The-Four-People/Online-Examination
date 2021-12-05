import React from 'react';
import hasToken from '../methods/hasToken';
import { Navbar, CourseTr, CourseSt } from '../components/componentIndex';

const Course = () => {
    const [user, setUser] = React.useState({});
    document.title = 'Courses';
    React.useLayoutEffect(() => {
        setUser(hasToken());
    }, []);

    const decideRender = () => {
        if (user.role === 'teacher') {
            return (
                <>
                    <Navbar signIn={false} />
                    <CourseTr user={user} />
                </>
            );
        } else if (user.role === 'student') {
            return (
                <>
                    <Navbar signIn={false} />
                    <CourseSt user={user} />
                </>
            );
        } else {
            return <h1>Something went wrong</h1>;
        }
    };
    return decideRender();
};

export default Course;
