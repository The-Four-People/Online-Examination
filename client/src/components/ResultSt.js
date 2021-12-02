import React, { useState, useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { BG1, BG2, BG3, BG4, BG5, BG6 } from '../res/resIndex';
import {
    AiOutlineArrowRight,
    AiOutlineCheck,
    AiOutlineClose,
} from 'react-icons/ai';
import { IoMdArrowDropright } from 'react-icons/io';
import './TestTr.css';

const ResultSt = ({ user }) => {
    // const [testAttempt, setTestAttempt] = useState([]);
    const [test, setTest] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [marks, setMarks] = useState([]);
    const [courseCode, setCourseCode] = useState(useParams().code);
    const [testCode, setTestCode] = useState(useParams().test);
    const getTest = () => {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
                console.log(data);
                if (data.ok) {
                    setTest(data);
                    console.log(data.attempt);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const getMarks = () => {
        fetch(`${process.env.REACT_APP_BASE_URI}/api/search/student/marks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${JSON.parse(
                    localStorage.getItem('token')
                )}`,
            },
            body: JSON.stringify({
                email: user.email,
            }),
        })
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                const hey = data.test_attempted.find((ele) => {
                    return ele.code === `${courseCode}-${testCode}`;
                });
                setMarks(hey);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        getTest();
        getMarks();
    }, []);

    return (
        <>
            {isLoading ? (
                <div className='center-msg'>Loading...</div>
            ) : test.attempted ? (
                <div
                    className='r2'
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <TestCard test={test} marks={marks} />
                    <DisplayQuestions question={test.attempt} />
                </div>
            ) : (
                <Redirect to={`/c/${courseCode}/${testCode}`} />
            )}
        </>
    );
};

const TestCard = ({ test, marks }) => {
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
        <div
            className='r2-card'
            style={{ width: '32rem', height: '18rem', alignSelf: 'center' }}
        >
            <div
                className='r-card-top'
                style={{
                    backgroundImage: `url(${randomBG(test.test_name)})`,
                    backgroundSize: 'cover',
                    height: '30%',
                }}
            >
                <span
                    style={{ fontSize: '1.8rem', paddingLeft: '1rem' }}
                >{`${test.course_name} - ${test.test_name}`}</span>
            </div>
            <div className='r-card-bottom' style={{ padding: '0px' }}>
                <table className='table-info' style={{ height: '99%' }}>
                    <tbody className='big-table-content'>
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
                            <td>{test.test_start_date}</td>
                        </tr>
                        <tr>
                            <th>Time</th>
                            <td>{test.test_start_time}</td>
                        </tr>
                        <tr>
                            <th>Duration</th>
                            <td>{test.test_duration}</td>
                        </tr>
                        <tr>
                            <th>Marks Obtained</th>
                            <td>{marks.marks}</td>
                        </tr>
                        <tr>
                            <th>Percentage</th>
                            <td>{(marks.marks / test.total_marks) * 100} %</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DisplayQuestions = ({ question }) => {
    const [arrowClicked, setArrowClicked] = useState(false);
    const css = {
        transform: arrowClicked ? 'rotate(90deg)' : '',
    };

    function handleArrowClick() {
        setArrowClicked(!arrowClicked);
    }
    return (
        <>
            <div className='question-block'>
                <AiOutlineArrowRight
                    onClick={handleArrowClick}
                    style={css}
                    className='question-arrow'
                />
                <h1>Display Questions</h1>
            </div>
            {arrowClicked ? (
                <div className='questions'>
                    {question.map((ques) => {
                        return (
                            <DisplayIndividualQuestion
                                key={ques.id}
                                question={ques}
                            />
                        );
                    })}
                </div>
            ) : null}
        </>
    );
};

const DisplayIndividualQuestion = ({ question }) => {
    const [isSmallArrowClicked, setisSmallArrowClicked] = useState(false);
    const css = {
        transform: isSmallArrowClicked ? 'rotate(90deg)' : null,
        transition: '300ms ease-in-out',
        marginRight: '0.5rem',
    };

    const css1 = {
        display: isSmallArrowClicked ? 'block' : 'none',
    };

    function handleSmallArrowClicked() {
        setisSmallArrowClicked(!isSmallArrowClicked);
    }
    return (
        <div className='individual-question'>
            {question ? (
                <>
                    <div className='individual-question-heading'>
                        <IoMdArrowDropright
                            style={css}
                            onClick={handleSmallArrowClicked}
                        />
                        <h1>{question.question}</h1>
                        <div className='individual-question-heading right'>
                            <div className='individual-question-heading'>
                                <h1>Marks Obtained:</h1>
                                <h1>
                                    {' '}
                                    {question.marks} / {question.weight}
                                </h1>
                            </div>
                        </div>
                    </div>
                    <ul className='individual-question-options' style={css1}>
                        {question.options.map((option) => (
                            <li key={option}>
                                {option}{' '}
                                {option === question.c_ans ? (
                                    <AiOutlineCheck />
                                ) : (
                                    option === question.answer && (
                                        <AiOutlineClose />
                                    )
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            ) : null}
        </div>
    );
};

export default ResultSt;
