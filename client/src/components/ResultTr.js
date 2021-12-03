import React, { useEffect, useState, useLayoutEffect } from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useParams } from 'react-router-dom';
import { IoMdRefresh } from 'react-icons/io';
import { FiDownload } from 'react-icons/fi';

import './TestTr.css';
import './ResultTr.css';

const ResultTr = ({ user }) => {
    const [courseCode, setCourseCode] = useState(useParams().code);
    const [testCode, setTestCode] = useState(useParams().test);
    const [test, setTest] = useState({});
    const [marks, setMarks] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMarks, setIsLoadingMarks] = useState(true);

    const getMarks = () => {
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
                    setMarks(data);
                    setIsLoadingMarks(false);
                } else {
                    console.log('error', data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getTest = () => {
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
                    setTest({ ok: data.ok, ...data.data });
                    setIsLoading(false);
                } else {
                    setTest(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useLayoutEffect(() => {
        getMarks();
        getTest();
    }, []);

    const handleShowMarksBtn = (e) => {
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
    };

    return (
        <>
            {isLoading || isLoadingMarks ? (
                <div className='center-msg'>Loading...</div>
            ) : (
                <div className='body-contd'>
                    <Heading
                        courseName={test.name}
                        testName={test.test_name}
                        attempts={marks.students_marks.length}
                    />
                    <button className='task-btn' onClick={getMarks}>
                        <IoMdRefresh /> Refresh
                    </button>
                    <ReactHTMLTableToExcel
                        className='task-btn'
                        table='style-table'
                        filename={`${courseCode}-${testCode}`}
                        sheet='result'
                        buttonText='Download'
                    />
                    Show Marks : {test.showMarks ? 'Yes' : 'No'}{' '}
                    <button className='task-btn' onClick={handleShowMarksBtn}>
                        Change
                    </button>
                    <StyleTable marks={marks} total_marks={test.total_marks} />
                </div>
            )}
        </>
    );
};

const Heading = ({ courseName, testName, attempts }) => {
    return (
        <div
            className='hero-container'
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <div className='heading-sep heading'>
                {courseName} - {testName}
            </div>
            <div className='heading-sep heading' style={{ fontSize: '1rem' }}>
                {attempts} attempts
            </div>
        </div>
    );
};

const StyleTable = ({ marks, total_marks }) => {
    var count = 1;
    return (
        <table id='style-table'>
            <thead>
                <tr>
                    <th>Sr</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Marks out of {total_marks}</th>
                    <th>Percentage</th>
                    <th>Result</th>
                </tr>
            </thead>
            <tbody>
                {marks.students_marks.map((student) => {
                    var per = (student.marks / total_marks) * 100;
                    var status = per >= 35 ? 'Pass' : 'Fail';

                    return (
                        <tr key={student.student_email}>
                            <td>{count++}</td>
                            <td>{student.student_name}</td>
                            <td>{student.student_email}</td>
                            <td>{student.marks}</td>
                            <td>{per} %</td>
                            <td>{status}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ResultTr;
