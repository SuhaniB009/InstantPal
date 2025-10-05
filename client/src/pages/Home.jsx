import { Link } from 'react-router-dom'
import WhyInstapal from '../components/WhyInstapal.jsx'
import HowInstapalWorks from '../components/HowInstapalWorks'
import Navbar from '../components/Navbar';


export default function Home() {
  return (
    <div className=" min-h-screen flex flex-col">

      <Navbar/>
      <div className="flex-1 flex flex-col lg:flex-row bg-white shadow-yellow">
        <div className="flex-1 flex items-center justify-center p-8 bg-white">
          <div className="max-w-md text-center lg:text-left">
            <div className="text-left mb-6 relative">
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900">
                Group Orders Made <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-secondary">Simple</span>
                  <span className="absolute inset-0 bg-yellow-200 z-0 rotate-[-2deg] rounded-sm -skew-y-2"></span>
                </span>{' '}
                for NIT <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-secondary">Jamshedpur</span>
                  <svg
                    className="absolute left-0 bottom-0 w-full h-2"
                    viewBox="0 0 200 10"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,5 Q100,15 200,5"
                      stroke="oklch(94.5% 0.129 101.54)"
                      strokeWidth="4"
                      fill="none"
                    />
                  </svg>
                </span>
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              A collaborative ordering platform for NIT Jamshedpur students. Group up with hostelmates, meet order minimums, and save on delivery charges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <button className="btn bg-white text-primary border border-primary hover:bg-primary hover:text-black px-6">
                  Get Started
                </button>
              </Link>
              <Link to="/login">
                <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-black px-6">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <img
            src="/instapal_home_image copy.png"
            alt="Group order illustration"
            className="w-[400px] lg:w-[500px] xl:w-[600px]"
          />
        </div>
      </div>
      
      <WhyInstapal />

      <section className="bg-white py-12 px-4 text-center">
        <h2 className="text-3xl font-semibold text-blue-800">Order From Your Favorite Platforms</h2>
        <br></br>
        <div className="flex justify-center items-center gap-10 flex-wrap">
          <img
            src="/blinkit-logo.png"
            alt="Blinkit"
            className="h-14 transition transform hover:scale-110 hover:gap-12 duration-200"
          />
          <img
            src="/zomato_logo.png"
            alt="Zomato"
            className="h-14 transition transform hover:scale-110 hover:gap-12 duration-200"
          />
          <img
            src="/swiggy-logo.jpg"
            alt="Swiggy"
            className="h-14 transition transform hover:scale-110 hover:gap-12 duration-200"
          />
          <img
            src="/instamart-logo.png"
            alt="Instamart"
            className="h-14 transition transform hover:scale-110 hover:gap-12 duration-200"
          />
          <img
            src="/ap-logo.jpg"
            alt="Annupurna Canteen"
            className="h-14 transition transform hover:scale-110 hover:gap-12 duration-200"
          />
        </div>
      </section>

      <HowInstapalWorks />


      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500">
        Built by NITJSR students | Instapal 2025
      </footer>

    </div>
  )
}
