import MembershipTabs from "../components/MembershipTabs";
import Navbar from "../components/Navbar";  
import Footer from "../components/Footer";
import Trainers from "../pages/Trainers";
const PersonalTrainer = () => {
  return (
    <div>
      <Navbar showMenu showIcons dark />
      <MembershipTabs />
      <div>
        <Trainers />
      </div>
      <Footer />
    </div>
  )
}

export default PersonalTrainer
