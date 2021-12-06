import React, { useState, useEffect } from "react";
import { BG1, BG2, BG3, BG4, BG5, BG6, plusImg } from "../res/resIndex";
import { Link, useParams } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaClone } from "react-icons/fa";
import { TestCr } from "./componentIndex";
import to12hrFormat from "../methods/to12hrFormat";

const CourseTr = (params) => {
	const [tests, setTests] = useState([]);
	const [course, setCourse] = useState(null);
	const [code, setCode] = useState(useParams().code);
	const [isLoading, setIsLoading] = useState(true);
	const [createButtonClicked, setcreateButtonClicked] = useState(false);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_BASE_URI}/api/course`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
			},
		})
			.then((data, err) => {
				if (data) return data.json();
				else console.log(err);
			})
			.then((data) => {
				setCourse(data.find((ele) => ele.course_code === code));
			})
			.catch((err) => console.log(err));

		fetch(
			`${
				process.env.REACT_APP_BASE_URI
			}/api/course/${window.location.pathname.replace("/c/", "")}`,
			{
				method: "GET",
				headers: {
					"Content-type": "application/json",
					Authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
				},
			}
		)
			.then((data, err) => {
				if (data) return data.json();
				else console.log(err);
			})
			.then((data) => {
				setTests(data);
				console.log(data);
				setIsLoading(false);
			})
			.catch((err) => console.log(err));
	}, [createButtonClicked]);
	return (
		<>
			{course ? (
				<div className="body-container">
					<div className="heading-sep">{course.course_name} Tests:</div>
					<div id="test-container">
						{isLoading ? (
							<div className="center-msg">Loading...</div>
						) : tests.length === 0 ? (
							<div className="center-msg">No Test Created Yet</div>
						) : (
							<div className="r2">
								{tests.map((test) => {
									return <TestCard key={test.test_name} test={test} />;
								})}
							</div>
						)}
						{course ? <StudentDisplay courseCode={course.course_code} /> : null}
					</div>
					<CreateButton
						createButtonClicked={createButtonClicked}
						setcreateButtonClicked={setcreateButtonClicked}
					/>
					{createButtonClicked ? (
						<TestCr setcreateButtonClicked={setcreateButtonClicked} />
					) : null}
				</div>
			) : (
				<div className="center-msg">Loading.......</div>
			)}
		</>
	);
};
const CreateButton = (params) => {
	return (
		<button
			onClick={(e) => {
				params.setcreateButtonClicked(!params.createButtonClicked);
			}}
			className="create-btn"
		>
			<img src={plusImg} alt="+" />
		</button>
	);
};
const StudentDisplay = ({ courseCode }) => {
	const [students, setStudents] = useState([]);
	const [isloading, setIsLoading] = useState(true);
	var c = 1;

	const showCopied = () => {
		const label = document.querySelector(`#${CSS.escape(courseCode)}`);
		label.style.display = "inline-block";
		setTimeout(() => (label.style.display = "none"), 1000);
	};

	useEffect(() => {
		if (courseCode !== undefined) {
			fetch(
				`${process.env.REACT_APP_BASE_URI}/api/search/course/student/${courseCode}`,
				{
					method: "GET",
					headers: {
						"Content-type": "application/json",
						Authorization: `bearer ${JSON.parse(
							localStorage.getItem("token")
						)}`,
					},
				}
			)
				.then((data, err) => {
					if (data) return data.json();
					else console.log(err);
				})
				.then((data) => {
					setStudents(data);
					console.log(data);
					setIsLoading(false);
				})
				.catch((err) => console.log(err));
		}
	}, []);
	return (
		<div id="test-search-container">
			<span
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					fontSize: "1rem",
					fontWeight: "normal",
					padding: "0.5rem",
					backgroundColor: "#111",
					color: "white",
					width: "100%",
				}}
			>
				{courseCode}
				<CopyToClipboard text={courseCode} onCopy={() => showCopied()}>
					<button
						style={{
							background: "none",
							border: "none",
							color: "white",
							marginLeft: "0.7rem",
							marginTop: "0.3rem",
							cursor: "pointer",
						}}
					>
						<FaClone />
					</button>
				</CopyToClipboard>
				<div
					className="copied-label"
					id={courseCode}
					style={{ height: "fit-content" }}
				>
					Copied
				</div>
			</span>
			<span
				style={{
					backgroundColor: "slategray",
					display: "block",
					width: "100%",
					color: "white",
					padding: "0.3rem",
					textAlign: "center",
				}}
			>
				Students Enrolled
			</span>
			<ol style={{ overflowY: "auto", maxHeight: "90%" }}>
				{isloading ? (
					<span>Loading...</span>
				) : (
					students.map((student) => {
						return (
							<li className="test-list" key={student._id}>
								<span>{c++})</span>
								<span>{student.name}</span>
								<span>{student.email}</span>
							</li>
						);
					})
				)}
			</ol>
		</div>
	);
};

const TestCard = ({ test }) => {
	const randomBG = (code) => {
		var stbody = "BG" + ((code.charCodeAt(0) % 6) + 1);
		switch (stbody) {
			case "BG1":
				return BG1;
			case "BG2":
				return BG2;
			case "BG3":
				return BG3;
			case "BG4":
				return BG4;
			case "BG5":
				return BG5;
			case "BG6":
				return BG6;
			default:
				return BG3;
		}
	};

	return (
		<div className="r2-card" style={{ width: "12rem", height: "12rem" }}>
			<div
				className="r-card-top"
				style={{
					backgroundImage: `url(${randomBG(test.test_name)})`,
					backgroundSize: "cover",
					height: "35%",
				}}
			>
				<Link to={`/c/${test.courseId}/${test.test_name}`}>
					<span>{test.test_name}</span>
				</Link>
			</div>
			<div className="r-card-bottom" style={{ padding: "0px" }}>
				<table className="table-info">
					<tbody>
						<tr>
							<th>Started</th>
							<td>{test.isStarted ? "Yes" : "No"}</td>
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
							<td>{test.startDate}</td>
						</tr>
						<tr>
							<th>Time</th>
							<td>{to12hrFormat(test.time)}</td>
						</tr>
						<tr>
							<th>Duration</th>
							<td>
								{Math.floor(test.duration)} hr{" "}
								{(test.duration - Math.floor(test.duration)) * 60} mins
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CourseTr;
