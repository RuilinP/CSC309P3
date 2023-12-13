import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ErrorCard from "../../ErrorCard";
import { fetchAccessToken, fetchSinglePet } from '../../../ajax';
import { getAccessToken, refreshToken } from "../../../utils/auth";
import { useParams } from 'react-router-dom';
import Header from "../../common/header";
import Footer from "../../common/footer";

function PetUpdate() {
    const { petId } = useParams();

	const [error, setError] = useState();
	const [accessToken, setAccessToken] = useState('');
	const shelterid = 1;
	const [shelterInfo, setShelterInfo] = useState({});
	const ageOptions = ['Select Age','Baby', 'Young', 'Adult', 'Senior'];
	const [imagePreviews, setImagePreviews] = useState([]);
	const storedImages = localStorage.getItem('imagePreviews');
	const [additionalGalleryUrls, setAdditionalGalleryUrls] = useState([]);


	const handleAgeChange = (e) => {
        setFormData({
            ...formData,
            age: e.target.value,
        });
    };

	const [formData, setFormData] = useState({
		"name": "",
		"gallery": "",
		"specie": "",
		"breed": "",
		"age": "",
		"size": "",
		"color": "",
		"gender": "Male",
		"location": "",
		"health": "",
		"characteristics": "",
		"story": "",
		"status": "Available",
		"shelter": 1,
	});
	const navigate = useNavigate();

	const onFormChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const isFormComplete = () => {
		const requiredFields = [
			'name',
			'specie',
			'breed',
			'age',
			'size',
			'color',
			'gender',
			'location',
			'health',
			'characteristics',
			'story',
		];
	
		const missingFields = requiredFields.filter((field) => !formData[field]);
	
		if (missingFields.length > 0) {
			const missingFieldNames = missingFields.join(', ');
			throw new Error(`Please fill in all required fields: ${missingFieldNames}`);
		}
	
		// Check if at least one image URL is provided in the gallery
		if (imagePreviews.length === 0 || imagePreviews.every((url) => url.trim() === '')) {
			throw new Error('Please provide at least one valid image URL in the gallery.');
		}
	
		return true; // Return true when all fields are present
	};
	
	
	useEffect(() => {
        async function fetchPetData() {
            try {
                if (accessToken && petId) {
                    const response = await axios.get(`http://127.0.0.1:8000/pets/${petId}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    // Update form data with fetched pet information
                    setFormData({
                        ...formData,
                        name: response.data.name,
                        specie: response.data.specie,
                        breed: response.data.breed,
                        // ... other fields similarly
                    });

                    // Update image previews or gallery URLs if needed
                    // For example:
                    // setImagePreviews([...response.data.images]);
                    // setFormData((prevFormData) => ({
                    //     ...prevFormData,
                    //     gallery: response.data.gallery,
                    // }));

                }
            } catch (error) {
                navigate('/404');
            }
        }

        fetchPetData();
    }, [accessToken, petId, navigate]);
	
	

	const onFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://127.0.0.1:8000/pets/${petId}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
    
            navigate(`/pets/${petId}/`);
        } catch (e) {
            setError(e);
        }
    };
    
	

	useEffect(() => {
		if (shelterInfo.city && shelterInfo.state) {
			setFormData((prevFormData) => ({
				...prevFormData,
				location: `${shelterInfo.city}, ${shelterInfo.state}`,
			}));
		}
	}, [shelterInfo.city, shelterInfo.state]);
	useEffect(() => {
		async function fetchData() {
		  try {
			const token = await fetchAccessToken('ruilin@gmail.com', '123');
			setAccessToken(token);
			localStorage.setItem('accessToken', token);
		  } catch (error) {
			setError(error.message);
		  }
		}
	
		fetchData();
	  }, []);


	useEffect(() => {
		async function fetchShelterData() {
		  try {
			if (accessToken && shelterid) { // Check if petInfo.shelter exists
			  const response = await axios.get(`http://127.0.0.1:8000/accounts/shelters/${shelterid}`, {
				headers: {
				  Authorization: `Bearer ${accessToken}`,
				},
			  });
			  
			  setShelterInfo(response.data);
			}
		  } catch (error) {
			setError(error.message);
		  }
		}
	
		fetchShelterData();
	  }, [accessToken, shelterid]);

	useEffect(() => {
		try {
			refreshToken();
		} catch (e) {
			setError(e);
		}
	}, []);
	const handleOptionalImageURLChange = (e, index) => {
		const newURL = e.target.value.trim();
	
		const updatedGalleryUrls = [...additionalGalleryUrls];
		updatedGalleryUrls[index] = newURL;
		setAdditionalGalleryUrls(updatedGalleryUrls);
	
		const galleryURLs = [formData.gallery, ...updatedGalleryUrls].filter(Boolean);
		const concatenatedURLs = galleryURLs.join(',');
	
		setFormData((prevFormData) => ({
			...prevFormData,
			gallery: concatenatedURLs,
		}));
	};
	
	
	
	  
	  
	  
	
	
	
	const uploadImages = async () => {
		try {
			const files = document.querySelectorAll('input[type="file"]');
			const fileNames = [];
	
			for (let i = 0; i < files.length; i++) {
				const file = files[i].files[0];
				if (file) {
					const fileName = `${formData.name}_${i + 1}.${file.name.split('.').pop()}`;
					// Simulate backend logic: save file to public/assets/images/shelter-uploads
					// Replace this with your backend API or logic to save the file
					// For example: await axios.post('http://your-api.com/upload', file);
	
					// For demo, log the filename and simulate file upload
					console.log(`Uploading ${fileName} to the server...`);
					// Simulated success message
					fileNames.push(fileName);
				}
			}
	
			if (fileNames.length > 0 && fileNames.length <= 4) {
				const concatenatedFileNames = fileNames.join(',');
	
				const updatedFormData = {
					...formData,
					gallery: concatenatedFileNames,
				};
	
				// Proceed with form submission or handle image upload logic here
				console.log('Images uploaded successfully:', concatenatedFileNames);
			} else {
				throw new Error("Please upload between 1 and 4 images.");
			}
		} catch (e) {
			setError(e);
		}
	};

	const handleFileChange = async (e) => {
		const files = e.target.files;
		const previews = [];
	  
		for (let i = 0; i < files.length; i++) {
		  const reader = new FileReader();
		  reader.readAsDataURL(files[i]);
	  
		  reader.onload = () => {
			previews.push(reader.result);
			if (previews.length === files.length) {
			  setImagePreviews(previews);
			  saveImagesLocally(previews); // Call function to save base64 images locally
			}
		  };
		}
	  };

	  const saveImagesLocally = (previews) => {
		// Store base64 images in local storage or app state
		// For instance, save them in local storage
		localStorage.setItem('imagePreviews', JSON.stringify(previews));
	  };
	  
	  // Add this useEffect to load previously uploaded images if available
	  useEffect(() => {
		const storedImages = localStorage.getItem('imagePreviews');
		if (storedImages) {
		  setImagePreviews(JSON.parse(storedImages));
		}
	  }, []);
	
	// Invoke uploadImages when the form changes (e.g., when files are selected)
	useEffect(() => {
		uploadImages();
	}, [formData.gallery]);

	return (
		<div className='bg-secondary'>
			<Header />
				<Card className='container pb-5 pt-5 my-5'>
					<Form onSubmit={onFormSubmit} onChange={onFormChange}>
						<Card.Body>
							<Card.Title>Update Pet</Card.Title>
							<Form.Group controlId="name">
								<Form.Label>Name:</Form.Label>
								<Form.Control
									type="text"
									name="name"
									placeholder="Name"
									value={formData.name}
									required
								/>
							</Form.Group>


							<Form.Group controlId="specie">
			<Form.Label>Specie:</Form.Label>
			<Form.Control
				as="select"
				name="specie"
				value={formData.specie}
				onChange={onFormChange} // Ensure you have an onChange handler to update the form data
				required
			>
				<option value="">Select a specie</option>
				<option value="Dog">Dog</option>
				<option value="Cat">Cat</option>
			</Form.Control>
		</Form.Group>

							<Form.Group controlId="breed">
								<Form.Label>Breed:</Form.Label>
								<Form.Control
									type="text"
									name="breed"
									placeholder="breed"
									value={formData.breed}
									required
								/>
							</Form.Group>

							<Form.Group controlId="age">
								<Form.Label>Age:</Form.Label>
								<Form.Control
									as="select"
									name="age"
									value={formData.age}
									onChange={handleAgeChange}
									required
								>
									{ageOptions.map((option, index) => (
										<option key={index} value={option}>
											{option}
										</option>
									))}
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="size">
			<Form.Label>Size:</Form.Label>
			<Form.Control
				as="select"
				name="size"
				value={formData.size}
				onChange={onFormChange} // Make sure to have an onChange handler to update the form data
				required
			>
				<option value="">Select a size</option>
				<option value="Small">Small</option>
				<option value="Medium">Medium</option>
				<option value="Large">Large</option>
			</Form.Control>
		</Form.Group>

							<Form.Group controlId="color">
								<Form.Label>Color:</Form.Label>
								<Form.Control
									type="text"
									name="color"
									placeholder="color"
									value={formData.color}
									required
								/>
							</Form.Group>

							<Form.Group controlId="gender">
								<Form.Label>Gender:</Form.Label>
								<Form.Control
									as="select"
									name="gender"
									value={formData.gender}
									required
								>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</Form.Control>
							</Form.Group>

							<Form.Group controlId="location">
								<Form.Label>Location:</Form.Label>
								<Form.Control
									type="text"
									name="location"
									placeholder="location"
									value={formData.location}
									required
								/>
							</Form.Group>

							<Form.Group controlId="health">
								<Form.Label>Health:</Form.Label>
								<Form.Control
									type="text"
									name="health"
									placeholder="health"
									value={formData.health}
									required
								/>
							</Form.Group>

							<Form.Group controlId="characteristics">
								<Form.Label>Characteristics:</Form.Label>
								<Form.Control
									type="text"
									name="characteristics"
									placeholder="characteristics"
									value={formData.characteristics}
									required
								/>
							</Form.Group>

							<Form.Group controlId="story">
								<Form.Label>Story:</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									name="story"
									placeholder="story"
									value={formData.story}
									required
								/>
							</Form.Group>

							<Form.Group controlId="gallery">
			<Form.Label>Main Imgur URLs, separate with , no space:(BBCode only, up to 4)</Form.Label>
			<Form.Control
				type="text"
				name="gallery"
				placeholder="Image URL"
				onChange={(e) => {
					onFormChange(e);
					handleOptionalImageURLChange(e, 0); // Sending the URL to handleOptionalImageURLChange
				}}
			/>
		</Form.Group>



							

							{/* <Form.Group controlId="gallery">
		<Form.Label>Gallery:</Form.Label>
		{[1, 2, 3, 4].map((index) => (
			<div key={index}>
			<Form.Control
				type="text"
				placeholder={`Image URL ${index}`}
				onChange={(e) => handleImageURLChange(e, index)}
			/>
			</div>
		))}
		</Form.Group> */}

							{
								error && (
									<ErrorCard error={error} />
								)
							}
						
						</Card.Body>
						<Card.Footer>
							<Button variant="secondary" type="submit">
								Submit
							</Button>
							<Button variant="secondary" href="/">
								Cancel
							</Button>
						</Card.Footer>
					</Form>
				</Card>
			<Footer />
		</div>
	)
}

export default PetUpdate;
