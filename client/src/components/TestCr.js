import React, { useRef } from 'react';
import { useParams } from 'react-router';

//import { Navbar } from '../componentIndex';
function Test(props) {
    const test_name = useRef(null);
    const test_marks = useRef(null);
    const test_type = useRef(null);
    const test_date = useRef(null);
    const test_duration = useRef(null);
    const test_start_time = useRef(null);

    const courseid = useParams().code;

    function onSubmitHandle(e) {
        e.preventDefault();
        console.log(process.env.REACT_APP_BASE_URI);

        const formObj = {
            testName: test_name.current.value,
            testType: test_type.current.value,
            marks: test_marks.current.value,
            test_date: test_date.current.value,
            test_duration: parseFloat(test_duration.current.value) / 60.0,
            test_start_time: test_start_time.current.value,
        };
        console.log(formObj);
        fetch(`${process.env.REACT_APP_BASE_URI}/api/course/new/${courseid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `bearer ${JSON.parse(
                    localStorage.getItem('token')
                )}`,
            },
            body: JSON.stringify(formObj),
        })
            .then((data, err) => {
                if (data) {
                    return data.json();
                } else {
                    console.log(err);
                }
            })
            .then((data) => {
                if (data.ok) {
                    props.setcreateButtonClicked(false);
                    console.log(data);
                } else {
                    console.log(data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <>
            <div className='popup-Testcontainer'>
                <form className='popup-Testform' onSubmit={onSubmitHandle}>
                    <h1 className='test-heading'>Create Test</h1>
                    <input
                        name='Test name'
                        type='text'
                        placeholder='Test name'
                        ref={test_name}
                        required
                    />
                    <input
                        name='Test Type'
                        type='text'
                        placeholder='Type of test'
                        ref={test_type}
                        required
                    />
                    <input
                        name='Total marks'
                        type='number'
                        placeholder='Total marks'
                        ref={test_marks}
                        required
                    />
                    <div>
                        Test Date{' '}
                        <input
                            name='Test Date'
                            type='date'
                            placeholder='Test Date'
                            ref={test_date}
                            required
                        />
                    </div>

                    <div>
                        Start time{' '}
                        <input
                            name='Start Time'
                            type='time'
                            placeholder='time'
                            ref={test_start_time}
                        />
                    </div>

                    <div>
                        <input
                            name='Duration'
                            type='number'
                            placeholder='Duration'
                            ref={test_duration}
                        />{' '}
                        mins
                    </div>

                    <button className='popup-testbttn' type='submit'>
                        Create test
                    </button>
                </form>
            </div>
        </>
    );
}
export default Test;
