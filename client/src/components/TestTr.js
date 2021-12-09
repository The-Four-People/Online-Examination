import React, { useState, useLayoutEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    AiOutlineArrowRight,
    AiFillEdit,
    AiOutlineCheck,
    AiOutlineClose,
} from 'react-icons/ai';
import { IoMdArrowDropright, IoMdTrash } from 'react-icons/io';
import to12hrFormat from '../methods/to12hrFormat';
import { InstantCountdown } from './componentIndex';
import './TestTr.css';

function TestTr() {
    const [courseCode] = useState(useParams().code);
    const [testCode] = useState(useParams().test);
    const [attempts, setAttempts] = useState(0);
    const [test, setTest] = useState(null);

    const [tDate, setTDate] = useState(false);
    const [tTime, setTTime] = useState(false);
    const [tDuration, setTDuration] = useState(false);

    const isStartedRef = useRef(null);
    const dateRef = useRef(null);
    const timeRef = useRef(null);
    const durationRef = useRef(null);

    function getAttempts() {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}/result`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(
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
                    setAttempts(data.students_marks.length);
                } else {
                    console.log('error', data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getTest() {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(
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
                    setTest({
                        ok: data.ok,
                        ...data.data,
                        duration: parseFloat(data.data.duration),
                    });
                } else {
                    setTest(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    useLayoutEffect(() => {
        getTest();
        getAttempts();
    }, []);
    function handleShowMarksBtn(e) {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}/show`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify({
                    showMarks: !test.showMarks,
                }),
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data.ok) {
                    console.log('Show Marks Toggled');
                    getTest();
                }
            });
    }
    function handleChangeDate(e) {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/update/${courseCode}/${testCode}/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify({
                    startDate: dateRef.current.value,
                }),
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data.ok) {
                    console.log('Date Changed');
                    getTest();
                    setTDate(!tDate);
                } else {
                    window.alert(data.msg);
                }
            });
    }
    function handleChangeTime(e) {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/update/${courseCode}/${testCode}/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify({
                    time: timeRef.current.value,
                }),
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data.ok) {
                    console.log('Time Changed');
                    getTest();
                    setTTime(!tTime);
                } else {
                    window.alert(data.msg);
                }
            });
    }
    function handleChangeDuration(e) {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/update/${courseCode}/${testCode}/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify({
                    duration: durationRef.current.value / 60,
                }),
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data.ok) {
                    console.log('Duration Changed');
                    getTest();
                    setTDuration(!tDuration);
                } else {
                    window.alert(data.msg);
                }
            });
    }
    function handleOnToggleBtn(e) {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}/start`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify({
                    start: !test.isStarted,
                }),
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data.ok) {
                    console.log('isStarted succesfully toggled');
                    getTest();
                }
            });
    }
    return (
        <>
            {test ? (
                test.ok === true ? (
                    <div className='body-contd'>
                        <div className='hero-container'>
                            <div className='heading-sep heading'>
                                {test.name} - {test.test_name}
                            </div>
                        </div>
                        <div className='main-container'>
                            <div className='main-info'>
                                <table
                                    className='table-info'
                                    style={{
                                        height: 'fit-content',
                                        color: 'black',
                                    }}
                                    cellSpacing={'3px'}
                                    cellPadding={'3px'}
                                >
                                    <tbody className='big-table-content'>
                                        <tr>
                                            <th>Started</th>
                                            <td>
                                                {test.isStarted ? 'Yes' : 'No'}
                                            </td>
                                            <td>
                                                <button
                                                    ref={isStartedRef}
                                                    onClick={handleOnToggleBtn}
                                                    className='toggle-test-btn btn btn-primary'
                                                >
                                                    Toggle
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Show Marks to students</th>
                                            <td>
                                                {test.showMarks ? 'Yes' : 'No'}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={handleShowMarksBtn}
                                                    className='toggle-test-btn btn btn-primary'
                                                >
                                                    Toggle
                                                </button>
                                            </td>
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
                                            <th>Start date</th>
                                            <td>
                                                {tDate ? (
                                                    <input
                                                        type='date'
                                                        ref={dateRef}
                                                    />
                                                ) : (
                                                    test.startDate
                                                )}
                                            </td>
                                            <td>
                                                {tDate && (
                                                    <button
                                                        style={{
                                                            height: 'fit-content',
                                                            padding:
                                                                '0.3rem 0.3rem 0 0.3rem',
                                                        }}
                                                        onClick={() => {
                                                            handleChangeDate();
                                                        }}
                                                    >
                                                        <AiOutlineCheck />{' '}
                                                    </button>
                                                )}{' '}
                                                <button
                                                    style={{
                                                        height: 'fit-content',
                                                        padding:
                                                            '0.3rem 0.3rem 0 0.3rem',
                                                    }}
                                                    onClick={() =>
                                                        setTDate(!tDate)
                                                    }
                                                >
                                                    {tDate ? (
                                                        <AiOutlineClose />
                                                    ) : (
                                                        <AiFillEdit />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Start time</th>
                                            <td>
                                                {tTime ? (
                                                    <input
                                                        ref={timeRef}
                                                        type='time'
                                                    />
                                                ) : (
                                                    to12hrFormat(test.time)
                                                )}
                                            </td>
                                            <td>
                                                {tTime && (
                                                    <button
                                                        style={{
                                                            height: 'fit-content',
                                                            padding:
                                                                '0.3rem 0.3rem 0 0.3rem',
                                                        }}
                                                        onClick={() => {
                                                            handleChangeTime();
                                                        }}
                                                    >
                                                        <AiOutlineCheck />{' '}
                                                    </button>
                                                )}{' '}
                                                <button
                                                    style={{
                                                        height: 'fit-content',
                                                        padding:
                                                            '0.3rem 0.3rem 0 0.3rem',
                                                    }}
                                                    onClick={() =>
                                                        setTTime(!tTime)
                                                    }
                                                >
                                                    {tTime ? (
                                                        <AiOutlineClose />
                                                    ) : (
                                                        <AiFillEdit />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Duration </th>
                                            <td>
                                                {tDuration ? (
                                                    <input
                                                        ref={durationRef}
                                                        type='number'
                                                        placeholder='in mins'
                                                    />
                                                ) : (
                                                    `${Math.floor(
                                                        test.duration
                                                    )} hr ${
                                                        (test.duration -
                                                            Math.floor(
                                                                test.duration
                                                            )) *
                                                        60
                                                    } mins`
                                                )}
                                            </td>
                                            <td>
                                                {tDuration && (
                                                    <button
                                                        style={{
                                                            height: 'fit-content',
                                                            padding:
                                                                '0.3rem 0.3rem 0 0.3rem',
                                                        }}
                                                        onClick={() => {
                                                            handleChangeDuration();
                                                        }}
                                                    >
                                                        <AiOutlineCheck />{' '}
                                                    </button>
                                                )}{' '}
                                                <button
                                                    style={{
                                                        height: 'fit-content',
                                                        padding:
                                                            '0.3rem 0.3rem 0 0.3rem',
                                                    }}
                                                    onClick={() =>
                                                        setTDuration(!tDuration)
                                                    }
                                                >
                                                    {tDuration ? (
                                                        <AiOutlineClose />
                                                    ) : (
                                                        <AiFillEdit />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '8rem',
                                        paddingTop: '1rem',
                                        flexDirection: 'column',
                                        rowGap: '0.5rem',
                                    }}
                                >
                                    <Link
                                        to={`/c/${courseCode}/${testCode}/result`}
                                    >
                                        <button className='btn btn-primary'>
                                            Results ({attempts})
                                        </button>
                                    </Link>
                                    <InstantCountdown
                                        dateTime={`${test.startDate}T${test.time}`}
                                        duration={test.duration}
                                        isStarted={test.isStarted}
                                        toggleRef={isStartedRef}
                                    />
                                </div>
                            </div>
                            <RenderForm
                                getTest={getTest}
                                courseCode={courseCode}
                                testCode={testCode}
                            />
                        </div>
                        <DisplayQuestions
                            test={test}
                            codeTest={`${courseCode}/${testCode}`}
                            getTest={getTest}
                        />
                    </div>
                ) : (
                    <div className='center-msg'>Test doesn't exists</div>
                )
            ) : (
                <div className='center-msg'>Loading.........</div>
            )}
        </>
    );
}

const DisplayQuestions = ({ test, codeTest, getTest }) => {
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
                    {test.quiz.map((data) => (
                        <DisplayIndividualQuestion
                            key={data.id}
                            question={data}
                            codeTest={codeTest}
                            getTest={getTest}
                        />
                    ))}
                </div>
            ) : null}
        </>
    );
};

const DisplayIndividualQuestion = ({ question, codeTest, getTest }) => {
    const [isSmallArrowClicked, setisSmallArrowClicked] = useState(true);
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
    const handleClick = () => {
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/update/${codeTest}/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify({
                    id: question.id,
                }),
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data.ok) {
                    console.log('Question Removed');
                    getTest();
                }
            });
    };
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
                                <h1>({question.id})</h1>
                            </div>
                            <div className='individual-question-heading'>
                                <h1>
                                    <button
                                        className='btn btn-txt'
                                        style={{
                                            fontSize: '1.3rem',
                                            color: 'darkblue',
                                        }}
                                        onClick={() => handleClick()}
                                    >
                                        <IoMdTrash />
                                    </button>
                                </h1>
                            </div>
                        </div>
                    </div>
                    <ul className='individual-question-options' style={css1}>
                        {question.options.map((option) => (
                            <li key={option}>{option}</li>
                        ))}
                    </ul>
                    <h1>Answer : {question.answer}</h1>
                    <h1>
                        Marks {'\u00A0'}: {question.marks}
                    </h1>
                </>
            ) : null}
        </div>
    );
};
const RenderForm = ({ courseCode, testCode, getTest }) => {
    const Id = useRef(null);
    const Question = useRef(null);
    const Answer = useRef(null);
    const Marks = useRef(null);
    const Options = useRef(null);

    function getFormValues() {
        const id = Id.current.value;
        const question = Question.current.value;
        const answer = Answer.current.value;
        const marks = Marks.current.value;
        const options = Options.current.value;

        return {
            id,
            question,
            answer,
            marks,
            options,
        };
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        let quiz = getFormValues();
        quiz.options = quiz.options.split(',');
        fetch(
            `${process.env.REACT_APP_BASE_URI}/api/course/new/${courseCode}/${testCode}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify(quiz),
            }
        )
            .then((data, err) => {
                if (data) return data.json();
                else console.log(err);
            })
            .then((data) => {
                if (data.ok) {
                    console.log('Quiz successfully added');
                    getTest();
                    document.getElementsByClassName('quiz-form')[0].reset();
                } else {
                    console.log('Quiz addition unsuccessfull');
                }
            })
            .catch((err) => {
                console.log('Quiz addition unsuccessfull');
            });
    }
    return (
        <div className='quiz'>
            <form className='quiz-form' onSubmit={handleFormSubmit}>
                <table className='quiz-table'>
                    <tbody>
                        <tr>
                            <td>
                                <label>ID </label>
                            </td>
                            <td>
                                <input
                                    ref={Id}
                                    type='number'
                                    placeholder='Enter id'
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Question </label>
                            </td>
                            <td>
                                <input
                                    ref={Question}
                                    type='text'
                                    placeholder='Enter question'
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Answer </label>
                            </td>
                            <td>
                                <input
                                    ref={Answer}
                                    type='text'
                                    placeholder='Enter answer'
                                    required
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label>Marks </label>
                            </td>
                            <td>
                                <input
                                    ref={Marks}
                                    type='number'
                                    placeholder='Enter marks'
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Options </label>
                            </td>

                            <td>
                                <input
                                    ref={Options}
                                    type='text'
                                    placeholder='Enter Comma separated options'
                                    required
                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan='2' style={{ textAlign: 'center' }}>
                                <input
                                    className='quiz-btn'
                                    type='submit'
                                    value='Insert'
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};
export default TestTr;
