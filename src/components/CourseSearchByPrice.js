import React, { useState } from 'react';
import CourseCard from './CourseCard';

const CourseSearchByPriceRange = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchResults, setSearchResults] = useState([]);

const handleSearch = async () => {
  try {
    const response = await fetch('http://localhost:4000/courses/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ minPrice, maxPrice })
    });

    const data = await response.json();
    // Ensure data is an array before setting it to state
    setSearchResults(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error searching for courses by price range:', error);
    setSearchResults([]); // Reset searchResults in case of an error
  }
};
  return (
    <div>
      <h2>Course Search by Price Range</h2>
      <div className="form-group">
        <label htmlFor="minPrice">Min Price:</label>
        <input
          type="text"
          id="minPrice"
          className="form-control"
          value={minPrice}
          onChange={event => setMinPrice(event.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="text"
          id="maxPrice"
          className="form-control"
          value={maxPrice}
          onChange={event => setMaxPrice(event.target.value)}
        />
      </div>
      <button className="btn btn-primary my-3" onClick={handleSearch}>
        Search
      </button>
      <h3>Search Results:</h3>
      <ul>
        {searchResults.map(course => (
          <CourseCard courseProp={course} key={course._id} />
        ))}
      </ul>
    </div>
  );
};

export default CourseSearchByPriceRange;