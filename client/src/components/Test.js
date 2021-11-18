import React, { useRef } from "react";
import { useParams } from "react-router";

//import { Navbar } from '../componentIndex';
function Test() {
    const testName = useRef(null);
    const testMarks = useRef(null);
    const testType = useRef(null);
    const courseid = useParams().courseid;
    function onSubmitHandle(e) {
        e.preventDefault()
        fetch(`http://localhost:5000/api/course/new/${courseid})}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `bearer ${JSON.parse(
                        localStorage.getItem('token')
                    )}`,
                },
                body: JSON.stringify({
                    testName: testName.current.value,
                    testType: testType.current.value,
                    marks: testMarks.current.value,
                })
            })
            .then((data, err) => {
                if (data) {
                    return data.json();
                } else {
                    console.log(err);
                }
            }).then(data => {
                console.log(data)
            }).catch(err => {
                console.log(err)
            })

    }
    return (
        <>
            <div className="popup-Testcontainer">
                <form className="popup-Testform" onSubmit={onSubmitHandle}>
                    <h1 className="test-heading">Create Test</h1>
                    <input
                        name='Test name'
                        type='text'
                        placeholder='Test name'
                        ref={testName}
                        required
                    />

                    <input
                        name='Test Type'
                        type='text'
                        placeholder='Type of test'
                        ref={testType}
                        required
                    />

                    <input
                        name='Total marks'
                        type='number'
                        placeholder='Total marks'
                        ref={testMarks}
                        required
                    />

                    <button className="popup-testbttn" type="submit">Create test</button>

                </form>
            </div>
        </>

    );
}
export default Test