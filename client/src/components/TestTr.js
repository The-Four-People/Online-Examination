import React, { useState, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { IoMdArrowDropright } from "react-icons/io";
import "./TestTr.css";

function TestTr() {
	const [courseCode, setCourseCode] = useState(useParams().code);
	const [testCode, setTestCode] = useState(useParams().test);
	const [test, setTest] = useState(null);

	function getTest() {
		fetch(
			`${process.env.REACT_APP_BASE_URI}/api/course/${courseCode}/${testCode}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
					setTest(data.data);
				} else {
					setTest({ ok: false });
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
	useLayoutEffect(() => {
		getTest();
	}, []);

	return (
		<>
			{test ? (
				<div className="body-contd">
					<div className="hero-container">
						<div className="heading-sep heading">
							{test.test_name} - {test.name}
						</div>
					</div>
					<div className="main-container">
						<div className="main-info">
							<table>
								<tr>
									<td>Started</td>
									<td>{test.isStarted ? "Yes" : "No"}</td>
								</tr>
								<tr>
									<td>Type</td>
									<td>{test.test_type}</td>
								</tr>
								<tr>
									<td>Marks</td>
									<td>{test.total_marks}</td>
								</tr>
							</table>
						</div>
						<RenderForm
							getTest={getTest}
							courseCode={courseCode}
							testCode={testCode}
						/>
					</div>
					<DisplayQuestions test={test} />
				</div>
			) : (
				<div className="center-msg">Loading.........</div>
			)}
		</>
	);
}

const DisplayQuestions = ({ test }) => {
	const [arrowClicked, setArrowClicked] = useState(false);
	const css = {
		transform: arrowClicked ? "rotate(90deg)" : "",
	};

	function handleArrowClick() {
		setArrowClicked(!arrowClicked);
	}
	return (
		<>
			<div className="question-block">
				<AiOutlineArrowRight
					onClick={handleArrowClick}
					style={css}
					className="question-arrow"
				/>
				<h1>Display Questions</h1>
			</div>
			{arrowClicked ? (
				<div className="questions">
					{test.quiz.map((data) => (
						<DisplayIndividualQuestion key={data.id} question={data} />
					))}
				</div>
			) : null}
		</>
	);
};

const DisplayIndividualQuestion = ({ question }) => {
	return (
		<div className="individual-question">
			{question ? (
				<>
					<IoMdArrowDropright />
					<h1>{question.question}</h1>
					<ul>
						{question.options.map((option) => (
							<li>{option}</li>
						))}
					</ul>
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
		quiz.options = quiz.options.split(",");
		fetch(
			`${process.env.REACT_APP_BASE_URI}/api/course/new/${courseCode}/${testCode}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
					console.log("Quiz successfully added");
					getTest();
				} else {
					console.log("Quiz addition unsuccessfull");
				}
			})
			.catch((err) => {
				console.log("Quiz addition unsuccessfull");
			});
	}
	return (
		<div className="quiz">
			<form className="quiz-form" onSubmit={handleFormSubmit}>
				<table>
					<tr>
						<td>
							<label>ID </label>
						</td>
						<td>
							<input ref={Id} type="number" placeholder="Enter id" required />
						</td>
					</tr>
					<tr>
						<td>
							<label>Question </label>
						</td>
						<td>
							<input
								ref={Question}
								type="text"
								placeholder="Enter question"
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
								type="text"
								placeholder="Enter answer"
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
								type="number"
								placeholder="Enter marks"
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
								type="text"
								placeholder="Enter space separated options"
								required
							/>
						</td>
					</tr>
					<tr>
						<td colSpan="2" style={{ textAlign: "center" }}>
							<input className="quiz-btn" type="submit" value="Insert" />
						</td>
					</tr>
				</table>
			</form>
		</div>
	);
};
export default TestTr;
