import { useState, useEffect, useContext } from 'react';

import AdminDashboard from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../context/UserContext';

export default function Courses() {
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);

  const fetchData = () => {

    const fetchUrl = user.isAdmin
      ? 'https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/all'
      : 'https://34vyi1b8ge.execute-api.us-west-2.amazonaws.com/production/products/active'

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Fetched courses:', data);
        setCourses(data);
      })
      .catch(error => console.error('Error fetching courses:', error));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      {user ?.isAdmin ? (
        <AdminDashboard coursesData={courses} fetchData={fetchData} />
      ) : (
        <UserView coursesData={courses}/>
      )}
    </>
  );
}