import { getAccessToken } from "../../utils/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useEffect, useState } from "react";


const ShelterList = () => {

	const accessToken = getAccessToken();
	const [shelters, setShelters] = useState([]);
	const navigate = useNavigate();

	const viewShelter = (id) => {
		navigate(`/shelter/${id}`);
	}

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
		<ListGroup>
			{shelters.map((shelter) => {
				return (
					<ListGroup.Item key={shelter.id}>
						<Card style={{ width: '18rem' }}>
							<Card.Body>
								<Card.Title>{shelter.organization}</Card.Title>
								<Card.Subtitle className="mb-2 text-muted">
									{shelter.mission_statement}
								</Card.Subtitle>
								<Card.Text>
									<strong>Email:</strong> {shelter.email}
									<br />
									<strong>Phone:</strong> {shelter.phone_number}
									<br />
									<strong>Address:</strong> {shelter.address}, {shelter.city}, {shelter.state}{' '}
									{shelter.zip}, {shelter.country}
								</Card.Text>
								<Button onClick={() => { viewShelter(shelter.id) }}> View </Button>
							</Card.Body>
						</Card>
					</ListGroup.Item>
				)
			})}
		</ListGroup>
	)
}

export default ShelterList;