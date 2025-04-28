import { useState, useEffect } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import EditCourse from './EditCourse';
import ArchiveCourse from './ArchiveCourses';

export default function AdminDashboard({ coursesData, fetchData }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!Array.isArray(coursesData)) return;
  
    const courseArr = coursesData.map(course => ({
      ...course,
      isActive: course.isActive === 'true' || course.isActive === true
    }));
    setCourses(courseArr);
  }, [coursesData]);
  

  const toggleArchive = (courseId, isActive) => {
    const route = isActive ? "archive" : "activate";
  
    fetch(`http://localhost:4000/courses/${courseId}/${route}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert(data.message);
          fetchData(); 
        } else {
          alert(data.message || "Operation failed");
        }
      })
      .catch(err => {
        console.error("Toggle archive error:", err);
        alert("Something went wrong.");
      });
  };
  

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center text-center">
        <Col md={8}>
          <h1 className="mb-4 mt-4 fw-bold">Admin Dashboard</h1>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="text-center">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id}>
              <td className="text-center">{course._id}</td>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td className="text-center">${course.price}</td>
              <td className="text-center">
                <span className={course.isActive ? 'text-success' : 'text-danger'}>
                  {course.isActive ? 'Available' : 'Unavailable'}
                </span>
              </td>
              <td className="text-center">
                <EditCourse course={course} fetchData={fetchData}/>
              </td>
              <td className="text-center">
              <ArchiveCourse 
                courseId={course._id} 
                isActive={course.isActive} 
                fetchData={fetchData} 
              />
            </td>

            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}