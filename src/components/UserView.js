import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import CourseSearch from './CourseSearch';
import CourseSearchByPrice from './CourseSearchByPrice';

export default function UserView({ coursesData = [] }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(coursesData);
  }, [coursesData]);

  return (
    <div>
      <div className="text-center">
      <h2>Courses</h2>
      <p>Select a course to enroll in!</p>
      </div>
      <div>
      <CourseSearch />
      <CourseSearchByPrice />
      </div>
      <div className="course-list">
        {courses.map(course => (
          <CourseCard key={course._id} courseProp={course} />
        ))}
      </div>
    </div>
  );
}