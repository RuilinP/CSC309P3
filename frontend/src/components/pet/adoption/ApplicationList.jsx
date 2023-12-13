import axios from "axios";
import { useEffect, useState } from "react";
import { Image, ListGroup, Button, Modal, Form } from "react-bootstrap";
import ErrorCard from "../../ErrorCard";
import propTypes from "prop-types";
import { getAccessToken } from "../../../utils/auth";
import ApplicationReview from "../../../pages/ApplicationPages/ApplicationReview";

const ApplicationList = () => {

	const [error, setError] = useState();
	const [applications, setApplications] = useState([]);
	const [filterStatus, setFilterStatus] = useState('');

	const filteredApplications = applications.filter((application) =>
		filterStatus ? application.status === filterStatus : true
	);

	useEffect(() => {
		async function fetchApplications() {
			try {
				const response = await axios.get(
					`http://localhost:8000/applications/`, {
					headers: {
						Authorization: `Bearer ${getAccessToken()}`,
					},
				});
				setApplications(response.data.results);
			} catch (e) {
				setError(e);
			}
		}

		fetchApplications();
	}, []);

	return (
		<div className="container py-3" >
			<h1>My Applications</h1>

			<Form.Group controlId="filterStatus" className="mb-3">
				<Form.Label>Filter by Status:</Form.Label>
				<Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
					<option value="">All</option>
					<option value="pending">Pending</option>
					<option value="accepted">Accepted</option>
					<option value="denied">Denied</option>
				</Form.Select>
			</Form.Group>

			<ListGroup className="pt-3">
				{
					filteredApplications.map((application) => (
						<ApplicationRow key={application.pet} petId={application.pet} setError={setError} application={application} />
					))
				}
			</ListGroup>

			{error && <ErrorCard error={error} />} 
		</div >
	)

}

const ApplicationRow = (props) => {
	const { petId, setError, application } = props;

	const [petInfo, setPetInfo] = useState({
		name: null
	});
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {

		async function fetchPetDetail() {
			try {
				const response = await axios.get(
					`http://localhost:8000/pets/${petId}/`, {
					headers: {
						Authorization: `Bearer ${getAccessToken()}`,
					}
				});
				setPetInfo(response.data);
			} catch (e) {
				setError(e);
			}
		}

		fetchPetDetail();
	}, [])

	return (
		<ListGroup.Item className="d-flex align-items-center">
			<Image src="/assets/images/landing-top3.jpg" rounded width={100} height={100} className="object-fit-cover me-3" />
			<h4>{petInfo.name}</h4>
			<Button variant="dark" className="ms-auto" onClick={() => { setShowModal(true) }}>
				View
			</Button>
			<Modal show={showModal} onHide={() => { setShowModal(false); }}>
				<ApplicationReview petId={petInfo.id} applicationId={application.id} />
			</Modal>

		</ListGroup.Item>
	)
}

ApplicationRow.propTypes = {
	petId: propTypes.number.isRequired,
	application: propTypes.object.isRequired,
}

export default ApplicationList;