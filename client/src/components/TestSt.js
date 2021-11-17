import React, { useState, useEffect } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useParams } from "react-router-dom";
import "./TestSt.css";
import "./TestTr.css";

function TestSt() {
	const [courseCode, setCourseCode] = useState(useParams().code);
	const [testCode, setTestCode] = useState(useParams().test);
	const [test, setTest] = useState(null);

	useEffect(() => {
		console.log("in Effect");
		fetch(
			`${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
					console.log(data);
					setTest(data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	return (
		<>
			{test ? (
				test.ok ? (
					test.isStarted ? (
						<Started test={test} />
					) : (
						<NotStarted test={test} />
					)
				) : (
					"Some error occured"
				)
			) : (
				"Hello"
			)}
		</>
	);
}

const NotStarted = ({ test }) => {
	const [arrowClicked, setArrowClicked] = useState(false);
	const css = {
		transform: arrowClicked ? "rotate(90deg)" : "",
	};

	function handleArrowClick() {
		setArrowClicked(!arrowClicked);
	}
	return (
		<div className="not-started-container">
			<div className="hero-container">
				<div className="heading-sep heading">
					{test.test_name} - {test.course_name}
				</div>
			</div>

			<div className="main-container">
				<div className="main-info">
					<h1 style={{ textAlign: "center" }}>{test.course_name}</h1>
					<table style={{ textAlign: "center" }}>
						<tr>
							<td>Test Name</td>
							<td>{test.test_name}</td>
						</tr>
						<tr>
							<td>Test Type</td>
							<td>{test.test_type}</td>
						</tr>
						<tr>
							<td>Test started</td>
							<td>No</td>
						</tr>
					</table>
				</div>
				<div className="main-countdown">
					<h1>This is countdown</h1>
				</div>
			</div>

			<div className="question-block">
				<AiOutlineArrowRight
					onClick={handleArrowClick}
					style={css}
					className="question-arrow"
				/>
				<h1>Rules</h1>
			</div>
			{arrowClicked ? (
				<div className="rules-block">
					<ul className="rules-list">
						<li>Don't Copy</li>
						<li>Don't Copy</li>
						<li>Don't Copy</li>
						<li>Don't Copy</li>
					</ul>
				</div>
			) : null}
		</div>
	);
};

const Started = ({ test }) => {
	const [result, setResult] = useState([]);
	function handleSubmit(e) {
		console.log(result);
		e.preventDefault();
		console.log(e.target);
		var bool = window.confirm("Do you want to really submit?");
		if (bool) {
			console.log("Submitted");
		}
	}
	return (
		<div className="started-block">
			<form onSubmit={handleSubmit}>
				{test.quiz.map((question) => (
					<Question result={result} setResult={setResult} question={question} />
				))}
				<button type="submit"> Submit </button>
			</form>
		</div>
	);
};

const Question = ({ question, result, setResult }) => {
	function checkIfExists(id, option) {
		// result.map((res) => {
		// 	console.log(res[`${id}`]);
		// 	// if(res[`${id}`] === )
		// });

		// if (result.find((res) => res[`${id}`] === option) === undefined)
		// 	return false;

		// return true;
		return result.hasOwnProperty(id);
	}
	return (
		<div className="question-student">
			<h1>{question.question}</h1>
			<ul>
				{question.options.map((option) => (
					<li>
						<input
							onChange={() => {
								// if (checkIfExists(question.id, option)) {
								// 	setResult(
								// 		result.filter((res) => {
								// 			let temp = res[`${question.id}`] !== option;
								// 			console.log(temp, res[`${question.id}`], option);
								// 			return temp;
								// 		})
								// 	);
								// 	console.log(result);
								// }
								const obj = result.filter(
									(res) => !res.hasOwnProperty(question.id)
								);
								// setResult(obj);

								console.log(obj);
								setResult([...obj, { [question.id]: option }]);
								console.log(result);
							}}
							name={question.id}
							type="radio"
							value={option}
						/>
						<label htmlFor={question.id}>{option}</label>
					</li>
				))}
			</ul>
		</div>
	);
};
export default TestSt;
