import Footer from "../../components/common/footer";
import Header from "../../components/common/header"
import ShelterList from "./ShelterList";

const ListSheltersPage = () => {

	return (
		<div className='min-vh-100 d-flex flex-column bg-secondary'>
			<Header />
			<ShelterList />
			<Footer />
		</div>
	)
}

export default ListSheltersPage;