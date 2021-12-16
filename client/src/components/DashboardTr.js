import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FaClone } from 'react-icons/fa';
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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import './TestTr.css';
import moment from 'moment';
import './ResultTr.css';

const DashboardTr = (params) => {
    const [courses, setCourses] = useState([]);
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
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        getCourses();
    }, []);

    return (
        <>
            <PopUp
                setcreateButtonClicked={setcreateButtonClicked}
                clicked={createButtonClicked}
                getCourses={getCourses}
            />
            <div className='body-container'>
                <div className='r1'>
                    <InfoCard
                        user={params.user}
                        coursesLength={courses.length}
                    />
                    <div className='r1-card upcoming'>
                        <table
                            id='style-table'
                            cellSpacing='0px'
                            className='table-upcoming'
                            style={{ marginTop: '0px' }}
                        >
                            <thead>
                                <tr>
                                    <th colSpan='2'>Upcoming Test</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses
                                    ? courses.map((cour) => {
                                          return (
                                              <UpcomingTest
                                                  key={cour._id}
                                                  courseCode={cour.course_code}
                                                  courseName={cour.course_name}
                                              />
                                          );
                                      })
                                    : null}
                            </tbody>
                        </table>
                    </div>
                    {/* <div className="r1-card">Search bar</div> */}
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
                                                courseCode={course.course_code}
                                                courseName={course.course_name}
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
                                    No course created
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

function UpcomingTest({ courseCode, courseName }) {
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${JSON.parse(
                    localStorage.getItem('token')
                )}`,
            },
        })
            .then((data, err) => {
                if (data) return data.json();
                else console.log('Error : ' + err);
            })
            .then((data) => {
                data = data.filter((dt) => {
                    if (dt.startDate) {
                        let a = moment(new Date());
                        let c = dt.startDate.split('-');
                        let b = moment(new Date(dt.startDate));
                        // let b
                        let temp = b.diff(a, 'days');
                        if (temp <= 5) {
                            if (!(temp < 0)) {
                                console.log(dt.startDate);
                                dt.togo = b.diff(a, 'days');
                                return true;
                            } else {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                });
                return data;
            })
            .then((data) => {
                if (data && data.length > 0) {
                    console.log(data);
                    setItem(data);
                } else {
                    setItem(null);
                }
            });
    }, []);
    return (
        <>
            {item ? (
                item.length > 0 ? (
                    <>
                        {item.map((it) => {
                            return (
                                <>
                                    <tr
                                        className='table-row'
                                        key={`${it.courseId}-${it.test_name}`}
                                    >
                                        {/* <Link to="/dashboard"> */}
                                        <td>
                                            <Link
                                                className='table-link'
                                                to={`/c/${it.courseId}/${it.test_name}`}
                                            >
                                                {it.test_name}-{it.name}
                                            </Link>
                                        </td>
                                        <td>{it.togo} day(s) to go</td>
                                        {/* </Link> */}
                                    </tr>
                                </>
                            );
                        })}
                    </>
                ) : null
            ) : null}
        </>
    );
}

const CourseCards = (params) => {
    const [tests, setTests] = useState([]);
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
    const showCopied = () => {
        const label = document.querySelector(`#${params.courseCode}`);
        label.style.display = 'inline-block';
        setTimeout(() => (label.style.display = 'none'), 1000);
    };
    useEffect(() => {
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
                setIsLoading(false);
            });
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
                    <CopyToClipboard
                        text={params.courseCode}
                        onCopy={() => showCopied()}
                    >
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                marginLeft: '0.7rem',
                                marginTop: '0.3rem',
                                cursor: 'pointer',
                            }}
                        >
                            <FaClone />
                        </button>
                    </CopyToClipboard>
                    <div className='copied-label' id={params.courseCode}>
                        Copied
                    </div>
                </span>
            </div>
            <div className='r-card-bottom'>
                <ul>
                    {isLoading ? (
                        <h2>Loading...</h2>
                    ) : tests.length === 0 ? (
                        <li>
                            <Link to={`/c/${params.courseCode}/`}>
                                <button className='btn btn-primary'>
                                    Create test
                                </button>
                            </Link>
                        </li>
                    ) : (
                        tests.map((test) => {
                            // {
                            // 	params.settestNum(params.testNum + 1);
                            // 	console.log(params.testNum);
                            // }
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

const InfoCard = ({ user, coursesLength }) => {
    return (
        <div className='r1-card'>
            <div className='r-card-top'>
                <img alt='img' src={picEmptyProfile} />
                <span>{user.name}</span>
            </div>
            <div className='r-card-bottom'>
                <span>Role : {user.role}</span>
                <span>Email : {user.email}</span>
                <span>Courses Created : {coursesLength}</span>
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
                fetch(`${process.env.REACT_APP_BASE_URI}/api/course/new`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `bearer ${JSON.parse(
                            localStorage.getItem('token')
                        )}`,
                    },
                    body: JSON.stringify({
                        courseName: courseName.current.value,
                    }),
                })
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
                            placeholder='Enter course name'
                            required
                            ref={courseName}
                            autoFocus
                        />
                        <button type='submit' className='popup-btn'>
                            Create
                        </button>
                    </form>
                </div>
            </>
        );
    } else {
        return null;
    }
};
export default DashboardTr;
