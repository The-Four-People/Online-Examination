import React, { useEffect, useState, useLayoutEffect } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { useParams } from "react-router-dom";
import { IoMdRefresh } from "react-icons/io";
import { InstantCountdown } from "./componentIndex";

import "./TestTr.css";
import "./ResultTr.css";

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
					setMarks(data);
					setIsLoadingMarks(false);
				} else {
					console.log("error", data.msg);
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
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
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
					console.log("Show Marks Toggled");
					getTest();
				}
			});
	};

	return (
		<>
			{isLoading || isLoadingMarks ? (
				<div className="center-msg">Loading...</div>
			) : (
				<div className="body-contd">
					<Heading attempts={marks.students_marks.length} test={test} />
					<div className="controls-div">
						<div>
							<button className="task-btn" onClick={getMarks}>
								<IoMdRefresh /> Refresh
							</button>
						</div>
						<div>
							<ReactHTMLTableToExcel
								className="task-btn"
								table="style-table"
								filename={`${courseCode}-${testCode}`}
								sheet="result"
								buttonText="Download"
							/>
						</div>
						<div>
							Show Marks : {test.showMarks ? "Yes" : "No"}{" "}
							<button className="task-btn" onClick={handleShowMarksBtn}>
								Change
							</button>
						</div>
					</div>

					<StyleTable marks={marks} total_marks={test.total_marks} />
				</div>
			)}
		</>
	);
};

const Heading = ({ test, attempts }) => {
	return (
		<div
			className="hero-container"
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				color: "white",
			}}
		>
			<div className="heading-sep heading">
				{test.name} - {test.test_name}
			</div>

			<InstantCountdown
				duration={test.duration}
				dateTime={`${test.startDate}T${test.time}`}
				isStarted={test.isStarted}
			/>

			<div
				className="heading-sep heading sub-heading"
				style={{ fontSize: "1rem" }}
			>
				{attempts} attempts
			</div>
		</div>
	);
};

const StyleTable = ({ marks, total_marks }) => {
	var count = 1;
	return (
		<div className="style-table-div">
			<table id="style-table">
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
						var status = per >= 35 ? "Pass" : "Fail";

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
		</div>
	);
};

export default ResultTr;
