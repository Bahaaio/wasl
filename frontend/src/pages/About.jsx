import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AboutLayout from "../components/AboutLayout.jsx";
import yussufImg from "../assets/Yussuf.jpg";
import bahaaImg from "../assets/Bahaa.jpeg";
import ahmedImg from "../assets/Ahmed.jpeg";

export default function AboutPage() {
  const team = [
    {
      name: "Yussuf Hassan",
      role: "Frontend Developer",
      img: yussufImg,
    },
    {
      name: "Bahaa El Deen Mohamed",
      role: "Backend Developer",
      img: bahaaImg,
    },
    {
      name: "Ahmed Nasser",
      role: "Backend Developer",
      img: ahmedImg,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-orange-500/30 font-sans overflow-x-hidden">
      <Navbar />

      <AboutLayout team={team} />

      <Footer />
    </div>
  );
}
