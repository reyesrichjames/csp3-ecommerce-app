import { useState, useEffect, useContext } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext'

export default function CourseView() {

	const { user } = useContext(UserContext);

	const notyf = new Notyf();
	const navigate = useNavigate();

	const { courseId } = useParams();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);

	function enroll(courseId) {
		fetch('http://localhost:4000/enrollments/enroll', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				userId: user.id,
				enrolledCourses: [
					{ courseId: courseId }
				],
				totalPrice: price
			})
		})
		.then(res => res.json())
		.then(data => {
			if(data.message === 'Admin is forbidden') {
				notyf.error("Admin Forbidden")
			} else if(data.message === 'Enrolled successfully') {

				notyf.success('Enrollment successful');
				navigate("/courses");
			} else {
				notyf.error('Internal Server Error. Notify system admin')
			}
		})
	}

	useEffect(() => {
		fetch(`http://localhost:4000/courses/specific/${courseId}`)
		.then(res => res.json())
		.then(data => {

			setName(data.name);
			setDescription(data.description);
			setPrice(data.price);
		})
	}, [courseId])

	return(
		<Container className="mt-5">
			<Row>
				<Col lg={{ span: 6, offset: 3}}>
					<Card>
						<Card.Body className="text-center">
							<Card.Title>{name}</Card.Title>
							<Card.Subtitle>Description</Card.Subtitle>
							<Card.Text>{description}</Card.Text>
							<Card.Subtitle>Price</Card.Subtitle>
							<Card.Text>{price}</Card.Text>
							<Card.Subtitle>Class Schedule:</Card.Subtitle>
							<Card.Text>8 am - 5 pm</Card.Text>
							{
								user.id !== null ?
									<Button variant="primary" block="true" onClick={() => enroll(courseId)}>Enroll</Button>
								:
									<Link className="btn btn-danger btn-block" to="/login">Login to Enroll</Link>

							}
							
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</Container>

		)

}