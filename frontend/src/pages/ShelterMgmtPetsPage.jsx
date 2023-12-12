import React, { useState, useEffect } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/footer';
import { useNavigate } from 'react-router-dom';
import ClickHandlerLink from '../components/common/ClickHandlerLink';
import ClickHandlerButton from '../components/common/ClickHandlerButton';
import { getAccessToken } from '../utils/auth';

function FlipPage(action) {
    // scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Execute the passed action
    action();
}

function ShelterMgPets() {

    const [pets, setPets] = useState([]);
    const accessToken = getAccessToken();
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [query, setQuery] = useState({ page: 1 });
    const [totalPages, setTotalPages] = useState(1);

   
    useEffect(() => {
        const { page } = query;

        const fetchInfo = async () => {
            try {
                const response = await fetch('http://localhost:8000/accounts/check_user_type/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUserId(data.user_id);

    
                try {
                    const response = await fetch(`http://localhost:8000/pets_in_shelter/${data.user_id}/?page=${page}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const dataPets = await response.json();
                    setPets(dataPets.pets);
                    setTotalPages(dataPets.total_pages);
                } catch (error) {
                    navigate("/404");
                }

            } catch (error) {
                navigate("/404");
            }
        };

        fetchInfo();

    }, [userId, query, accessToken, navigate]);


    return (
        <div className='bg-secondary'>
            <Header />
            <main>
                <div className="container white-container p-3 mt-sm-4 mb-sm-4">
                    <section id="animal-inventory" className="my-5">
                        <div className="section-heading mb-4">
                            <h2>Animal Inventory
                                <ClickHandlerLink url={'/pet/create'} className={"btn btn-dark btn-sm ms-3"} children={'Add a Pet'} />
                            </h2>
                        </div>

                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">PetID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col" className="d-none d-md-table-cell">Breed</th>
                                    <th scope="col" className="d-none d-md-table-cell">Gender</th>
                                    <th scope="col" className="d-none d-md-table-cell">Specie</th>
                                    <th scope="col" className="d-none d-md-table-cell">Adoption Status</th>
                                    <th scope="col">Manage</th>
                                </tr>
                            </thead>
                            <tbody className="animal-page">
                                {pets.map(pet => (
                                    <tr key={pet.id}>
                                        <td>{pet.id}</td>
                                        <td>{pet.name}</td>
                                        <td className="d-none d-md-table-cell">{pet.breed}</td>
                                        <td className="d-none d-md-table-cell">{pet.gender}</td>
                                        <td className="d-none d-md-table-cell">{pet.specie}</td>
                                        <td className="d-none d-md-table-cell">{pet.status}</td>
                                        <td className="d-grid gap-2">
                                            <ClickHandlerButton className={"btn btn-info"} children={'Update'} url={`/shelter/pet/update/${pet.id}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="d-flex justify-content-center col-12 mt-4">
                            {query.page > 1 && (
                                <button className='btn btn-dark' onClick={() => FlipPage(() => setQuery({ ...query, page: query.page - 1 }))}>
                                    Previous
                                </button>
                            )}
                            {query.page < totalPages && (
                                <button className='btn btn-dark ms-3' onClick={() => FlipPage(() => setQuery({ ...query, page: query.page + 1 }))}>
                                    Next
                                </button>
                            )}
                        </div>
                        <div className="d-flex justify-content-center col-12 mt-3">
                            {pets.length === 0 ? "You have no animal in your inventory." : `Page ${query.page} out of ${totalPages}.`}
                        </div> 
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ShelterMgPets;
