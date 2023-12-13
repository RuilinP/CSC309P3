import { getAccessToken } from "../../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, ListGroup, Pagination, Row } from "react-bootstrap";
import { useEffect, useState } from "react";


const ShelterList = () => {

	const accessToken = getAccessToken();
	const [shelters, setShelters] = useState([]);
	const navigate = useNavigate();

	const viewShelter = (id) => {
		navigate(`/shelter/${id}`);
	}

	// Pagination Math
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;
	const totalPages = Math.ceil(shelters.length / itemsPerPage);
	const paginate = (pageNumber) => setCurrentPage(pageNumber);
	const indexOfLastShelter = currentPage * itemsPerPage;
	const indexOfFirstShelter = indexOfLastShelter - itemsPerPage;
	const currentShelters = shelters.slice(indexOfFirstShelter, indexOfLastShelter);


	useEffect(() => {
		async function fetchShelters() {
			try {
				if (accessToken) {
					const response = await axios({
						"method": "GET",
						"url": "http://localhost:8000/accounts/shelters/",
						"headers": {
							"Authorization": `Bearer ${accessToken}`,
						}
					})
					setShelters(response.data.results);
				} else {
					throw new Error("No access token found");
				}
			} catch (error) {
				navigate("/404");
			}
		}

		fetchShelters();
	}, [accessToken, navigate]);

	return (
		<div className="m-4">
			<Row>
				{currentShelters.map((shelter) => (
					// style={{ width: '18rem', marginBottom: '20px' }}
					<Col key={shelter.id} md={4}>
						<Card className="w-18 mb-4" >
							<Card.Body>
								<Card.Title>{shelter.organization}</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">{shelter.mission_statement}</Card.Subtitle>
								<Card.Text>
									<strong>Email:</strong> {shelter.email}
									<br />
									<strong>Phone:</strong> {shelter.phone_number}
									<br />
									<strong>Address:</strong> {shelter.address}, {shelter.city}, {shelter.state} {shelter.zip}, {shelter.country}
								</Card.Text>
								<Button onClick={() => viewShelter(shelter.id)}>View</Button>
							</Card.Body>
						</Card>
					</Col>
				))}
			</Row>

			<div>
				<Pagination>
					{Array.from({ length: totalPages }).map((_, index) => (
						<Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
							{index + 1}
						</Pagination.Item>
					))}
				</Pagination>
			</div>
		</div>
	)
}

export default ShelterList;