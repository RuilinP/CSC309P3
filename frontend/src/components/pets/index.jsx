import React, { useState, useEffect } from 'react';
import { Button, Navbar, Nav, Container } from 'react-bootstrap';
import { scrollToTop } from '../../assets/js/scroll';
import { useNavigate } from 'react-router-dom';
import Header from '../common/header';
import Footer from '../common/footer';


function PetList() {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [age, setAge] = useState('Any');
  const [status, setStatus] = useState('Available');
  const [species, setSpecies] = useState('Any');
  const [size, setSize] = useState('Any');
  const [gender, setGender] = useState('Any');
  const [sortOption, setSortOption] = useState('id');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
const [nextPageUrl, setNextPageUrl] = useState(null);
const [previousPageUrl, setPreviousPageUrl] = useState(null);

  const ages = ['Any', 'Baby', 'Young', 'Adult', 'Senior'];
  const genders = ['Any', 'Male', 'Female'];
  const sizes = ['Any', 'Small', 'Medium', 'Large'];
  const navigate = useNavigate();

  const handleStatusChange = (selectedStatus) => {
    if (
      selectedStatus === 'Cat' ||
      selectedStatus === 'Dog' ||
      selectedStatus === 'Any'
    ) {
      setSpecies(selectedStatus);
    } else if (
      selectedStatus === 'Small' ||
      selectedStatus === 'Medium' ||
      selectedStatus === 'Large'
    ) {
      setSize(selectedStatus);
    } else if (
      selectedStatus === 'Baby' ||
      selectedStatus === 'Young' ||
      selectedStatus === 'Adult' ||
      selectedStatus === 'Senior'
    ) {
      setAge(selectedStatus);
    } else if (selectedStatus === 'Male' || selectedStatus === 'Female') {
      setGender(selectedStatus);
    } else {
      const statusArray = status.split(',');
      if (statusArray.includes(selectedStatus)) {
        const updatedStatus = statusArray.filter((s) => s !== selectedStatus).join(',');
        setStatus(updatedStatus);
      } else {
        const updatedStatus = status ? `${status},${selectedStatus}` : selectedStatus;
        setStatus(updatedStatus);
      }
    }
  };
  useEffect(() => {
    async function fetchAccessToken() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: '123@email.com',
            password: '123',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch access token');
        }

        const tokenData = await response.json();
        setAccessToken(tokenData.access); // Store the access token in state
      } catch (error) {
        setError(error.message);
      }
    }

    fetchAccessToken();
  }, []);

  useEffect(() => {
    async function fetchPets() {
      try {
        const url = `http://127.0.0.1:8000/pets${
          status ? `/?status=${status}` : ''
        }${species !== 'Any' ? `&specie=${species}` : ''}${
          size !== 'Any' ? `&size=${size}` : ''
        }${age !== 'Any' ? `&age=${age}` : ''}${
          gender !== 'Any' ? `&gender=${gender}` : ''
        }${sortOption !== 'id' ? `&sort=${sortOption}` : ''}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          navigate('/404');
        }

        const petData = await response.json();
        setPets(petData.results); // Set the 'results' array in the state
        const { count, next } = petData;
        const pageCount = Math.ceil(count / 10); 
        setTotalPages(pageCount);
        setNextPageUrl(next);
      } catch (error) {
        setError(error.message);
      }
    }

    if (accessToken) {
      fetchPets();
    }
  }, [accessToken, status, species, size, age, gender, sortOption, currentPage]); // Trigger the effect when the access token changes

  if (error) {
    return <div>Error: {error}</div>;
  }

  
  function createPetCard(pet) {
    const firstGalleryItem = pet.gallery.split(',')[0];
  
    // Check if the first gallery item contains "imgur"
    const isImgurLink = firstGalleryItem.includes('imgur');
  
    return (
      <div className="card h-100 bg-white">
        <img
          src={isImgurLink ? firstGalleryItem : `../assets/images/shelter-uploads/${firstGalleryItem}`}
          className="card-img-top"
          alt="..."
        />
        <div className="card-body">
          <h5 className="card-title fw-bold text-center text-dark">{pet.name}</h5>
          <p className="card-text text-center">{pet.age} - {pet.breed}</p>
          <p className="card-text text-center">{pet.location}</p>
          <ul className="list-group">
            <li className="list-group-item border-0 bg-white text-center">
              <a href={`/pets/${pet.id}`} className="btn btn-dark">Learn more</a>
            </li>
          </ul>
        </div>
        <div className="card-footer bg-info">
          <small className="text-white">{pet.status}</small>
        </div>
      </div>
    );
  }
  const handleNextPage = async () => {
    if (nextPageUrl) { // Ensure there's a next page URL available
      try {
        const response = await fetch(nextPageUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch next page data');
        }
  
        const nextPageData = await response.json();
        setPets(nextPageData.results);
        
        // Update pagination info for the subsequent page
        const { count, next } = nextPageData;
        const pageCount = Math.ceil(count / 10); // Adjust per your API's page size
        setTotalPages(pageCount);
        setNextPageUrl(next);
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handlePreviousPage = async () => {
    if (previousPageUrl) {
      try {
        const response = await fetch(previousPageUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch previous page data');
        }
  
        const previousPageData = await response.json();
        setPets(previousPageData.results);
  
        // Update pagination info for the previous page
        const { count, next, previous } = previousPageData;
        const pageCount = Math.ceil(count / 10); // Adjust per your API's page size
        setTotalPages(pageCount);
        setNextPageUrl(next);
        setPreviousPageUrl(previous);
      } catch (error) {
        setError(error.message);
      }
    }
  };
  
  const fetchPetsByPage = async (pageNumber) => {
    try {
      const url = `http://127.0.0.1:8000/pets?page=${pageNumber}${
        status ? `&status=${status}` : ''
      }${species !== 'Any' ? `&specie=${species}` : ''}${
        size !== 'Any' ? `&size=${size}` : ''
      }${age !== 'Any' ? `&age=${age}` : ''}${
        gender !== 'Any' ? `&gender=${gender}` : ''
      }${sortOption !== 'id' ? `&sort=${sortOption}` : ''}`;
  
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const petData = await response.json();
      setPets(petData.results); // Set the 'results' array in the state
      const { count, next, previous } = petData;
      const pageCount = Math.ceil(count / 10);
      setTotalPages(pageCount);
      setNextPageUrl(next);
      setPreviousPageUrl(previous);
    } catch (error) {
      setError(error.message);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button key={i} onClick={() => fetchPetsByPage(i)} className="btn btn-dark me-2">
          {i}
        </button>
      );
    }
    return buttons;
  };



  return (
    <div className='bg-secondary'>
      <Header />
            <main>
            <div className="container">
            <div className="row mb-3 p-3">
            <div className="col mt-3">
  <div className="form-group">
    <label htmlFor="orderbreed" className="form-label fw-bold">Status:</label>
    <div className="dropdown">
      <div className="btn-group">
        <button
          type="button"
          id="orderbreed"
          className="btn btn-dark dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-default-text={status}
        >
          {status}
        </button>
        <ul className="dropdown-menu">
  <li key="available">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value="Available"
        id="availableCheckbox"
        onChange={() => handleStatusChange('Available')}
        checked={status.includes('Available')}
      />
      <label className="form-check-label" htmlFor="availableCheckbox">
        Available
      </label> 
    </div>
  </li>
  <li key="adopted">
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value="Adopted"
        id="adoptedCheckbox"
        onChange={() => handleStatusChange('Adopted')}
        checked={status.includes('Adopted')}
      />
      <label className="form-check-label" htmlFor="adoptedCheckbox">
        Adopted
      </label>
    </div>
  </li>
</ul>
      </div>
    </div>
  </div>
</div>

<div className="col mt-3">
  <div className="form-group">
    <label htmlFor="orderbreed" className="form-label fw-bold">Species:</label>
    <div className="dropdown">
      <div className="btn-group">
      <button
  type="button"
  id="orderbreed"
  className="btn btn-dark dropdown-toggle"
  data-bs-toggle="dropdown"
  aria-expanded="false"
  data-default-text={species === 'Any' ? 'Any' : species} // Update the displayed text to show the selected species
>
  {species === 'Any' ? 'Any' : species}
</button>
        <ul className="dropdown-menu">
          <li key="any">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Any"
                id="anySpeciesCheckbox"
                onChange={() => setSpecies('Any')} // Reset species to 'Any' when checkbox is selected
                checked={species === 'Any'}
              />
              <label className="form-check-label" htmlFor="anySpeciesCheckbox">
                Any
              </label>
            </div>
          </li>
          <li key="cat">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Cat"
                id="catCheckbox"
                onChange={() => setSpecies('Cat')} // Set species to 'Cat' when checkbox is selected
                checked={species === 'Cat'}
              />
              <label className="form-check-label" htmlFor="catCheckbox">
                Cat
              </label>
            </div>
          </li>
          <li key="dog">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Dog"
                id="dogCheckbox"
                onChange={() => setSpecies('Dog')} // Set species to 'Dog' when checkbox is selected
                checked={species === 'Dog'}
              />
              <label className="form-check-label" htmlFor="dogCheckbox">
                Dog
              </label>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>


{/* Size Filter */}
<div className="col mt-3">
  <div className="form-group">
    <label htmlFor="size" className="form-label fw-bold">Size:</label>
    <div className="dropdown">
      <div className="btn-group">
        <button
  type="button"
  id="size"
  className="btn btn-dark dropdown-toggle"
  data-bs-toggle="dropdown"
  aria-expanded="false"
  data-default-text={size === 'Any' ? 'Any' : size}
>
  {size === 'Any' ? 'Any' : size}
</button>
        <ul className="dropdown-menu">
          {sizes.map((s) => (
            <li key={s}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={s}
                  id={`${s}Checkbox`}
                  onChange={() => setSize(s)}
                  checked={size === s}
                />
                <label className="form-check-label" htmlFor={`${s}Checkbox`}>
                  {s}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>

{/* Age Filter */}
<div className="col mt-3">
  <div className="form-group">
    <label htmlFor="orderbreed" className="form-label fw-bold">Age:</label>
    <div className="dropdown">
      <div className="btn-group">
        <button
          type="button"
          id="orderbreed"
          className="btn btn-dark dropdown-toggle"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          data-default-text={age === 'Any' ? 'Any' : 'Age'} // Update the displayed text to show the selected age
        >
          {age === 'Any' ? 'Any' : age}
        </button>
        <ul className="dropdown-menu">
          <li key="anyAge">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value="Any"
                id="anyAgeCheckbox"
                onChange={() => setAge('Any')} // Reset age to 'Any' when checkbox is selected
                checked={age === 'Any'}
              />
              <label className="form-check-label" htmlFor="anyAgeCheckbox">
                Any
              </label>
            </div>
          </li>
          {['Baby', 'Young', 'Adult', 'Senior'].map((a) => (
            <li key={a}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={a}
                  id={`${a}Checkbox`}
                  onChange={() => setAge(a)} // Set age to the selected value when checkbox is selected
                  checked={age === a}
                />
                <label className="form-check-label" htmlFor={`${a}Checkbox`}>
                  {a}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>

{/* Gender Filter */}
<div className="col mt-3">
  <div className="form-group">
    <label htmlFor="gender" className="form-label fw-bold">Gender:</label>
    <div className="dropdown">
      <div className="btn-group">
      <button
  type="button"
  id="gender"
  className="btn btn-dark dropdown-toggle"
  data-bs-toggle="dropdown"
  aria-expanded="false"
  data-default-text={gender === 'Any' ? 'Any' : gender}
>
  {gender === 'Any' ? 'Any' : gender}
</button>
        <ul className="dropdown-menu">
          {genders.map((g) => (
            <li key={g}>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={g}
                  id={`${g}Checkbox`}
                  onChange={() => setGender(g)}
                  checked={gender === g}
                />
                <label className="form-check-label" htmlFor={`${g}Checkbox`}>
                  {g}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>

<div className="col offset-md-4 mt-3">
  <div className="form-group">
    <label htmlFor="sortby" className="form-label fw-bold">
      Sort by:
    </label>
    <div className="dropdown">
    <button
  type="button"
  id="sortby"
  className="btn btn-dark dropdown-toggle"
  data-bs-toggle="dropdown"
  aria-expanded="false"
  data-default-text={sortOption}
>
  {sortOption === 'name' ? 'A-Z' : sortOption}
</button>
      <ul className="dropdown-menu">
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={() => setSortOption('id')} // Set to 'id' for default sorting
          >
            Default match
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={() => setSortOption('name')} // Set to 'id' for default sorting
          >
            A-Z
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={() => setSortOption('age')} // Set to 'id' for default sorting
          >
            Young to old
          </a>
        </li>
        <li>
          <a
            className="dropdown-item"
            href="#"
            onClick={() => setSortOption('size')} // Set to 'id' for default sorting
          >
            Small to large
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>


</div>
      </div>

<div className="container mb-5">
    <div className="row row-cols-1 row-cols-md-3 g-4">
    {pets.map((pet, index) => (
      <div className="col" key={index} data-sort-value="Best match" data-last-updated="00000000000060">
        {createPetCard(pet)}
      </div>
    ))}
  </div>
  {pets.length === 0 && (
    <div className="no-result-message text-center mt-3" style={{ marginTop: '20px' }}>
      <h1 className="fw-bold text-center">No results found.</h1>
    </div>
  )}
  </div>
       {/* Pagination controls */}
  <div className="d-flex justify-content-center mt-4 mb-3">
  {renderPageButtons()}
  </div>
            </main>
      
      <Footer />
    </div>
  );
}

export default PetList;
