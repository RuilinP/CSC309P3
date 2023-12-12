import axios from "axios";
import propTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Col, Container, FormControl, Image, Row, Form, ButtonGroup, Toast, ToastContainer } from "react-bootstrap";
import { getAccessToken } from "../../utils/auth";

const ApplicationReview = (props) => {
	const { petId, applicationId } = props;
	const accessToken = getAccessToken();
	const [application, setApplication] = useState({
		"id": null, 
		"seeker": null, 
		"shelter": null, 
		"pet": null, 
		"status": null, 
		"message": null, 
		"created_at": null, 
		"updated_at": null
	});
	const [petInfo, setPetInfo] = useState({ 
		"id": null,
		"name": null,
		"gallery": null,
		"specie": null,
		"breed": null,
		"age": null,
		"size": null,
		"color": null,
		"gender": null,
		"location": null,
		"health": null,
		"characteristics": null,
		"story": null,
		"status": null,
		"shelter": null,
	});
	const [toast, setToast] = useState("");
	useEffect(() => {

		async function fetchApplications() {
			try {
				if (accessToken) {
					const response = await axios.get(
						`http://localhost:8000/applications/${applicationId}/`, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});
					setApplication(response.data);
				} else {
					throw new Error("You must be logged in to perform this action.");
				}
			} catch (e) {
				setToast(e.message);
			}
		}

		fetchApplications();

		async function fetchPetDetail() {
			try {
				if (accessToken) {
					const response = await axios.get(
						`http://localhost:8000/pets/${petId}/`, {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						}
					});
					setPetInfo(response.data);
				} else { 
					throw new Error("You must be logged in to perform this action.");
				}
			} catch (e) {
				setToast(e.message);
			}
		}

		fetchPetDetail();

	}, [accessToken, petId]);

	const reactApplication = async (status) => {
		try {
			if (accessToken) {
				await axios.patch(
					`http://localhost:8000/applications/${application.id}/`, {
					"status": status
				}, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					}
				});
				setToast(`Application status set to ${status}!`);
			} else {
				throw new Error("You must be logged in to perform this action.");
			}
		} catch (e) {
			setToast(e.message);
		}
	}

	return (
		<div>
			<Container className="pt-5 pb-3">
				<Row className="justify-content-md-center">
					<Col md={6}>
						<div className="d-flex flex-column align-items-center">
							<div className="adoption-photo">
								<Image src="/assets/images/jeff-photo.png" roundedCircle width={120} height={120} className="object-fit-cover me-3" />
							</div>
							<h3 className="mt-3">Application Information</h3>
						</div>
					</Col>
				</Row>
			</Container>

			<Container className="pb-5">
				<Col md={8}>
					<Form className="form-inline p-3">
						<InfoRow label="Application ID" value={String(application.id)} />
						<InfoRow label="Application Status" value={application.status} />
						<InfoRow label="Applicant User ID" value={String(application.id)} />
						<InfoRow label="Pet ID" value={String(application.pet)} />
						<InfoRow label="Pet Name" value={petInfo.name} />
						<InfoRow label="Applicant Surname" value={"N/A"} />
						<InfoRow label="Applicant Given Name" value={"N/A"} />
						<InfoRow label="Applicant Address Line 1" value={"N/A"} />
						<InfoRow label="Applicant Address Line 2" value={"N/A"} />
						<InfoRow label="Applicant Message" value={application.message} as={"textarea"} rows={3} />



						<Row className="p-3 justify-content-md-center">
							<ButtonGroup>
								<Button variant="primary">
									Chat with Applicant
								</Button>
								<Button variant="secondary" onClick={() => { reactApplication("accepted") }}>
									Accept
								</Button>
								<Button variant="danger" onClick={() => { reactApplication("denied") }}>
									Deny
								</Button>
							</ButtonGroup>
						</Row>
						<Row className="pt-2 pb-1">
							<p>
								Application submitted: <span>{(new Date(application.created_at)).toLocaleString()}</span>
							</p>
						</Row>
					</Form>
				</Col>
			</Container>

			<ToastContainer position="middle-center" className="p-3">
				<Toast show={toast} onClose={() => { setToast(null) }} autohide>
					<Toast.Body>
						{toast}
					</Toast.Body>
				</Toast> 
			</ToastContainer>
		</div >
	)
}

ApplicationReview.propTypes = {
	petId: propTypes.number.isRequired,
};

ApplicationReview.defaultProps = {
	petId: 1,
};

const InfoRow = (props) => {
	const { label, value, as } = props;
	return (
		<Form.Group as={Row} className="py-1">
			<Form.Label column sm={4} className="fw-bold text-sm-start text-md-end">
				{label}
			</Form.Label>
			<Col sm={8}>
				<FormControl readOnly type="text" as={as} id="applicationID" value={value} plaintext {...props} />
			</Col>
		</Form.Group>
	)
}

InfoRow.propTypes = {
	label: propTypes.any,
	value: propTypes.any,
	as: propTypes.string,
};


export default ApplicationReview;
