import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import PreviewCourses from './PreviewCourses';

export default function FeaturedCourses() {

	const [previews, setPreviews] = useState([]);

	useEffect(() => {

		fetch('http://localhost:4000/courses')
		.then(res => res.json())
		.then(data => {

			const numbers = [];
			const featured = [];

			const generateRandomNumber = () => {
				let randomNum = Math.floor(Math.random() * data.length)

				if(numbers.indexOf(randomNum) === -1) {
					numbers.push(randomNum)
				} else {
					generateRandomNumber()
				}
			}

			for(let i=0; i < 3; i++) {
				generateRandomNumber()

				featured.push(<PreviewCourses data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={4} />)
			}

			setPreviews(featured);
		})
	}, [])
	return (
		<>
		<h2 className="text-center">Featured Courses</h2>
		<CardGroup className="justify-content-center">
		{previews}
		</CardGroup>
		</>


		)
}