import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PetList from './components/pets';
import SinglePetInfo from './components/pet';
import Landing from './pages/landing';
import Login from './pages/LoginPage';
import SearchPets from './components/Searchpets';
import ShelterCommentPage from './pages/CommentPages/ShelterCommentPage';
import ShelterCommentDetails from './pages/CommentPages/ShelterCommentDetailsPage';
import NotFound from './pages/404';
import CreatePet from './components/pet/create/CreatePet';
import PetUpdate from './components/pets/update';
import Application from './components/pet/adoption/Application';
import ApplicationCommentPage from './pages/CommentPages/ApplicationCommentPage';
import ApplicationCommentDetails from './pages/CommentPages/ApplicationCommentDetailsPage';
import NotificationPage from './pages/NotificationPages/NotificationPage';
import ShelterDetails from './pages/ShelterDetailsPage';
import ShelterProfile from './pages/ShelterProfilePage';
import ShelterMgPets from './pages/ShelterMgmtPetsPage';
import BlogsPage from './pages/BlogPages/Blogs';
import BlogPage from './pages/BlogPages/Blog';
import BlogUpdatePage from './pages/BlogPages/BlogUpdate';
import BlogCreatePage from './pages/BlogPages/BlogCreate';
import PetUpdateShelter from './components/pets/update/indexForShelter';
import SignupPage from './pages/SignupPages/Signup';
import SignupShelterPage from './pages/SignupPages/SignupShelter';
import SignupShelterDonePage from './pages/SignupPages/SignupShelterDone';
import SignupSeekerPage from './pages/SignupPages/SignupSeeker';
import SignupSeekerContinuedPage from './pages/SignupPages/SignupSeekerContinued';
import SignupSeekerDonePage from './pages/SignupPages/SignupSeekerDone';
import ProfileShelterPage from './pages/ProfilePages/ProfileShelterPage';
import ProfileSeekerPage from './pages/ProfilePages/ProfileSeekerPage';
import ApplicationListPage from './pages/ApplicationPages/ApplicationListPage';
import ListSheltersPage from './pages/ShelterPages/ListSheltersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pets/" element={<PetList />} />
        <Route path="/pets/:petId" element={<SinglePetInfo />} />
        <Route path="/login/" element={<Login />} />
        {/* ... other routes ... */}
        <Route path="/pet/create" element={<CreatePet />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/shelter" element={<SignupShelterPage />} />
        <Route path="/signup/shelter/done" element={<SignupShelterDonePage />} />
        <Route path="/signup/seeker" element={<SignupSeekerPage />} />
        <Route path="/signup/seeker/continued" element={<SignupSeekerContinuedPage />} />
        <Route path="/signup/seeker/done" element={<SignupSeekerDonePage />} />
        <Route path="/profile/shelter/" element={<ProfileShelterPage />} />
        <Route path="/profile/seeker/" element={<ProfileSeekerPage />} />
        <Route path="/shelter/profile" element={<ShelterProfile />} />
        <Route path="/shelter/manage_pets" element={<ShelterMgPets />} />
        <Route path="/shelter/:shelterId" element={<ShelterDetails />} />
        <Route path="/search-pets" element={<SearchPets />} />
        <Route path="/pet/update/:petId" element={<PetUpdate />} />
        <Route path="/shelter/pet/update/:petId" element={<PetUpdateShelter />} />
        <Route path="/pet/application-list" element={<ApplicationListPage />} />
        <Route path="/pet/:petId/application" element={<Application />} />
        <Route path="/shelters/:shelterId/comments/" element={<ShelterCommentPage />} />
        <Route path="/shelters/:shelterId/comments/:commentId" element={<ShelterCommentDetails />} />
        <Route path="/applications/:applicationId/comments/" element={<ApplicationCommentPage />} />
        <Route path="/applications/:applicationId/comments/:commentId" element={<ApplicationCommentDetails />} />
        <Route path="/notifications/" element={<NotificationPage />} />
        <Route path="/blogs/update/:blogId" element={<BlogUpdatePage />} />
        <Route path="/blogs/create/" element={<BlogCreatePage />} />
        <Route path="/blogs/:blogId" element={<BlogPage />} />
        <Route path="/blogs/" element={<BlogsPage />} />
        <Route path="*" element={<NotFound />} />
          
        <Route path="/shelter/list" element={<ListSheltersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
