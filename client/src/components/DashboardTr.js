import React, { useState, useEffect, useRef } from "react";
import { picEmptyProfile, plusImg } from "../res/resIndex";

const D = (params) => {
	document.title = "Dashboard | Online Examination";
	const [createButtonClicked, setcreateButtonClicked] = useState(false);
	const [courses, setCourses] = useState([]);
	const getCourses = () => {
		const res = fetch(`${process.env.REACT_APP_BASE_URI}/api/course`, {
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
				setCourses(data);
			})
			.catch((err) => console.log(err));

		return res;
	};
	useEffect(() => {
		getCourses();
	}, []);
	return (
		<>
			<PopUp
				setcreateButtonClicked={setcreateButtonClicked}
				clicked={createButtonClicked}
				getCourses={getCourses}
			/>
			<div className="body-container">
				<div className="r1">
					<InfoCard user={params.user} />
					<div className="r1-card">A</div>
					<div className="r1-card">A</div>
				</div>

				<div className="r2">
					{courses.map((course) => {
						return (
							<CourseCards
								key={course._id}
								courseCode={course.course_code}
								courseName={course.course_name}
							/>
						);
					})}
				</div>
				<CreateButton
					createButtonClicked={createButtonClicked}
					setcreateButtonClicked={setcreateButtonClicked}
				/>
			</div>
		</>
	);
};

const CourseCards = (params) => {
	const [tests, setTests] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_BASE_URI}/api/course/${params.courseCode}`, {
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
				setTests(data);
				setIsLoading(false);
			});
	}, []);

	return (
		<div className="r2-card">
			<div
				className="r-card-top"
				style={{
					background:
						"url(https://www.gravatar.com/avatar/pqr?s=600&d=identicon) no-repeat",
					backgroundSize: "cover",
				}}
			>
				<span>{params.courseName}</span>
			</div>
			<div className="r-card-bottom">
				<ul>
					{isLoading ? (
						<h2>Loading...</h2>
					) : (
						tests.map((test) => {
							return (
								<li key={test._id}>
									<a href="/#">{test.test_name}</a>
								</li>
							);
						})
					)}
				</ul>
			</div>
		</div>
	);
};

const InfoCard = ({ user }) => {
	return (
		<div className="r1-card">
			<div className="r-card-top">
				<img alt="img" src={picEmptyProfile} />
				<span>{user.email}</span>
			</div>
			<div className="r-card-bottom">{user.role}</div>
		</div>
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

const PopUp = (props) => {
	const courseName = useRef(null);

	function onSubmitHandle(e) {
		e.preventDefault();
		try {
			if (courseName.current.value !== null)
				fetch(`${process.env.REACT_APP_BASE_URI}/api/course/new`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `bearer ${JSON.parse(
							localStorage.getItem("token")
						)}`,
					},
					body: JSON.stringify({
						courseName: courseName.current.value,
					}),
				})
					.then((data, err) => {
						if (!err) return data.json();
						else console.log(err);
					})
					.then((data) => {
						if (data.ok) {
							props.getCourses();
							props.setcreateButtonClicked(false);
							console.log("Course successfully created");
						}
					});
		} catch (err) {
			console.log(err);
		}
	}

	if (props.clicked) {
		return (
			<>
				<div className="popup-container">
					<form className="popup-form" onSubmit={onSubmitHandle}>
						<input
							className="popup-input"
							type="text"
							placeholder="Enter course name"
							required
							ref={courseName}
						/>
						<button type="submit" className="popup-btn">
							Create
						</button>
					</form>
				</div>
			</>
		);
	} else {
		return null;
	}
};
export default D;
