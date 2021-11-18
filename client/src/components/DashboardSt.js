import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    picEmptyProfile,
    plusImg,
    BG1,
    BG2,
    BG3,
    BG4,
    BG5,
    BG6,
} from '../res/resIndex';
import './TestTr.css';

const DashboardSt = (params) => {
    const [courses, setCourses] = useState(null);
    const [createButtonClicked, setcreateButtonClicked] = useState(false);

    const getCourses = () => {
        fetch(`${process.env.REACT_APP_BASE_URI}/api/course`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${JSON.parse(
                    localStorage.getItem('token')
                )}`,
            },
        })
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                setCourses(data);
                console.log(data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <>  <PopUp
        setcreateButtonClicked={setcreateButtonClicked}
        clicked={createButtonClicked}
        getCourses={getCourses}
    />
            <div className='body-container'>
                <div className='r1'>
                    <InfoCard user={params.user} />
                    <div className='r1-card'>Upcoming Tests</div>
                    <div className='r1-card'>Search bar</div>
                </div>

                {courses !== null ? (
                    <>
                        {courses.length > 0 ? (
                            <>
                                <h1 className='heading-sep'>Courses :</h1>
                                <div className='r2'>
                                    {courses.map((course) => {
                                        return (
                                            <CourseCards
                                                key={course._id}
                                                courseCode={course.course_id}
                                                courseName={course.course_name}
                                                teacherId={course.teacher_id}
                                            />
                                        );
                                    })}
                                </div>

                                <CreateButton
                                    createButtonClicked={createButtonClicked}
                                    setcreateButtonClicked={
                                        setcreateButtonClicked
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <div className='center-msg'>
                                    No course enrolled
                                </div>
                                <CreateButton
                                    createButtonClicked={createButtonClicked}
                                    setcreateButtonClicked={
                                        setcreateButtonClicked
                                    }
                                />
                            </>
                        )}
                    </>
                ) : (
                    <div className='center-msg'>Loading........</div>
                )}
            </div>
        </>
    );
};

const CourseCards = (params) => {
    const [tests, setTests] = useState([]);
    const [teacher, setTeacher] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const randomBG = (code) => {
        var str = 'BG' + ((code.charCodeAt(0) % 6) + 1);
        switch (str) {
            case 'BG1':
                return BG1;
            case 'BG2':
                return BG2;
            case 'BG3':
                return BG3;
            case 'BG4':
                return BG4;
            case 'BG5':
                return BG5;
            case 'BG6':
                return BG6;
            default:
                return BG3;
        }
    };
    const getTests = () => {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/${params.courseCode}`,
            {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                setTests(data);
                getTeacher();
                setIsLoading(false);
            });
    };

    const getTeacher = () => {
        fetch(`${process.env.REACT_APP_BASE_URI}/api/search/teacher/`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${JSON.parse(
                    localStorage.getItem('token')
                )}`,
            },
            body: JSON.stringify({
                id: params.teacher_id,
            }),
        })
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data !== null) setTeacher(data);
                else setTeacher({ name: 'unknown' });
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        setTeacher({ name: '...' });
        getTests();
    }, []);
    return (
        <div className='r2-card'>
            <div
                className='r-card-top'
                style={{
                    backgroundImage: `url(${randomBG(params.courseCode)})`,
                    backgroundSize: 'cover',
                }}
            >
                <Link to={`/c/${params.courseCode}`}>
                    <span>{params.courseName}</span>
                </Link>
                <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                    {params.courseCode}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                    {teacher?.name || '...'}
                </span>
            </div>
            <div className='r-card-bottom'>
                <ul>
                    {isLoading ? (
                        <h2>Loading...</h2>
                    ) : tests.length === 0 ? (
                        <li>
                            <span>No Upcoming Tests</span>
                        </li>
                    ) : (
                        tests.map((test) => {
                            return (
                                <li key={test.test_name}>
                                    <Link
                                        to={`/c/${params.courseCode}/${test.test_name}`}
                                    >
                                        {test.test_name}
                                    </Link>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </div>
    );
};

const InfoCard = ({ user }) => {
    return (
        <div className='r1-card'>
            <div className='r-card-top'>
                <img alt='img' src={picEmptyProfile} />
                <span>{user.name}</span>
            </div>
            <div className='r-card-bottom'>
                <span>Role : {user.role}</span>
                <span>Email : {user.email}</span>
            </div>
        </div>
    );
};

const CreateButton = (params) => {
    return (
        <button
            onClick={(e) => {
                params.setcreateButtonClicked(!params.createButtonClicked);
            }}
            className='create-btn'
        >
            <img src={plusImg} alt='+' />
        </button>
    );
};

const PopUp = (props) => {
    const courseName = useRef(null);
    function onSubmitHandle(e) {
        e.preventDefault();
        try {
            if (courseName.current.value !== null)
                fetch(
                    `${process.env.REACT_APP_BASE_URI}/api/course/${courseName.current.value}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `bearer ${JSON.parse(
                                localStorage.getItem('token')
                            )}`,
                        },
                    }
                )
                    .then((data, err) => {
                        if (!err) return data.json();
                        else console.log(err);
                    })
                    .then((data) => {
                        if (data.ok) {
                            props.getCourses();
                            props.setcreateButtonClicked(false);
                            console.log('Course successfully created');
                        }
                    });
        } catch (err) {
            console.log(err);
        }
    }

    if (props.clicked) {
        return (
            <>
                <div className='popup-container'>
                    <form className='popup-form' onSubmit={onSubmitHandle}>
                        <input
                            className='popup-input'
                            type='text'
                            placeholder='Enter course code'
                            required
                            ref={courseName}
                            autoFocus
                        />
                        <button type='submit' className='popup-btn'>
                            Enroll
                        </button>
                    </form>
                </div>
            </>
        );
    } else {
        return null;
    }
};

export default DashboardSt;
