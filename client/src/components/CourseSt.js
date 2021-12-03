import React, { useState, useEffect } from 'react';
import { BG1, BG2, BG3, BG4, BG5, BG6, plusImg } from '../res/resIndex';
import { Link, useParams } from 'react-router-dom';

const CourseSt = (props) => {
    const [tests, setTests] = useState(null);
    const [code, setCode] = useState(useParams().code);
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getCourse = () => {
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
                console.log(code);
                console.log(data);
                setCourse(data.find((ele) => ele.course_id === code));
            })
            .catch((err) => console.log(err));
    };

    const getTests = () => {
        fetch(`${process.env.REACT_APP_BASE_URI}/api/course/${code}`, {
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
                setTests(data);
                setIsLoading(false);
            })
            .catch((err) => console.log(err));
    };
    useEffect(() => {
        getCourse();
        getTests();
    }, []);

    return (
        <>
            {course ? (
                <div className='body-container'>
                    <div className='heading-sep'>
                        {course.course_name} Tests:
                    </div>
                    <div id='test-container'>
                        {isLoading ? (
                            <div className='center-msg'>Loading...</div>
                        ) : tests.length === 0 ? (
                            <div className='center-msg'>
                                No Test Created Yet
                            </div>
                        ) : (
                            <div className='r2' style={{ width: '100%' }}>
                                {tests.map((test) => {
                                    return (
                                        <TestCard
                                            key={test.test_name}
                                            test={test}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className='center-msg'>Loading.......</div>
            )}
        </>
    );
};

const TestCard = ({ test }) => {
    const randomBG = (code) => {
        var stbody = 'BG' + ((code.charCodeAt(0) % 6) + 1);
        switch (stbody) {
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

    return (
        <div className='r2-card' style={{ width: '12rem', height: '12rem' }}>
            <div
                className='r-card-top'
                style={{
                    backgroundImage: `url(${randomBG(test.test_name)})`,
                    backgroundSize: 'cover',
                    height: '35%',
                }}
            >
                <Link to={`${window.location.pathname}/${test.test_name}`}>
                    <span>{test.test_name}</span>
                </Link>
            </div>
            <div className='r-card-bottom' style={{ padding: '0px' }}>
                <table className='table-info' style={{ height: '80%' }}>
                    <tbody>
                        <tr>
                            <th>Started</th>
                            <td>{test.isStarted ? 'Yes' : 'No'}</td>
                        </tr>
                        <tr>
                            <th>Type</th>
                            <td>{test.test_type}</td>
                        </tr>
                        <tr>
                            <th>Marks</th>
                            <td>{test.total_marks}</td>
                        </tr>
                        <tr>
                            <th>Start On</th>
                            <td>{test.test_date}</td>
                        </tr>
                        <tr>
                            <th>Time</th>
                            <td>{test.test_start_time}</td>
                        </tr>
                        <tr>
                            <th>Duration</th>
                            <td>{test.test_duration} hrs</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseSt;
