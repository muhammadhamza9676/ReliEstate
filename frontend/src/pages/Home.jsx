"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { HomeIcon, Search, Building, DollarSign, Shield, Users, ChevronRight, Star, Menu, X } from "lucide-react"

const Home = () => {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGoToDashboard = () => {
    navigate("/dashboard")
  }

  const handleGoToLogin = () => {
    navigate("/login")
  }

  const handleGoToSignup = () => {
    navigate("/signup")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <HomeIcon className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-2xl font-bold">ReliEstate</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-950 hover:text-red-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-950 hover:text-red-600 transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-950 hover:text-red-600 transition-colors">
                Testimonials
              </a>
              <button
                onClick={handleGoToLogin}
                className="px-4 py-2 text-red-600 font-medium hover:text-red-700 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={handleGoToSignup}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg mt-2 py-4 px-4">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-red-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <button
                onClick={() => {
                  handleGoToLogin()
                  setIsMenuOpen(false)
                }}
                className="px-4 py-2 text-red-600 font-medium hover:text-red-700 transition-colors text-left"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  handleGoToSignup()
                  setIsMenuOpen(false)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20">
        <div className="absolute inset-0 bg-black opacity-70 z-0"></div>
        <div
          className="min-h-[600px] bg-cover bg-center flex items-center relative z-10"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1773&q=80')",
            backgroundBlendMode: "overlay",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <div className="container mx-auto px-4 md:px-6 py-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Find Your Perfect Property with ReliEstate
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Your trusted partner for buying, selling, and renting properties. Discover your dream home or investment
                opportunity today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGoToDashboard}
                  className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  Browse Properties
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button
                  onClick={handleGoToLogin}
                  className="px-6 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ReliEstate</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the best property solutions with a focus on quality, transparency, and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Search className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy Property Search</h3>
              <p className="text-gray-600">
                Find properties that match your criteria with our advanced search filters and intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Building className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Extensive Listings</h3>
              <p className="text-gray-600">
                Access thousands of property listings across various locations, types, and price ranges.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Competitive Pricing</h3>
              <p className="text-gray-600">
                Get the best value for your money with our transparent pricing and no hidden fees.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Transactions</h3>
              <p className="text-gray-600">
                Feel confident with our secure platform that protects your personal and financial information.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Get assistance from our team of real estate experts who are ready to help you at every step.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <HomeIcon className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Virtual Tours</h3>
              <p className="text-gray-600">
                Explore properties from the comfort of your home with our immersive virtual tour technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our simple process makes finding and securing your ideal property quick and hassle-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Create an Account</h3>
              <p className="text-gray-600">
                Sign up for free and set up your profile with your preferences and requirements.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Search Properties</h3>
              <p className="text-gray-600">
                Browse our extensive listings and use filters to find properties that match your criteria.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Contact & Close</h3>
              <p className="text-gray-600">
                Connect with sellers or agents, schedule viewings, and finalize your transaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "ReliEstate made finding my dream home so easy. The platform is intuitive, and the support team was
                incredibly helpful throughout the process."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-gray-400">Homeowner</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "As a real estate investor, I've used many platforms, but ReliEstate stands out with its comprehensive
                listings and user-friendly interface."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Jane Smith</h4>
                  <p className="text-gray-400">Property Investor</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">
                "The virtual tour feature saved me so much time. I was able to narrow down my choices before physically
                visiting properties."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">RJ</span>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Robert Johnson</h4>
                  <p className="text-gray-400">First-time Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Property?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream properties through ReliEstate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoToSignup}
              className="px-8 py-3 bg-white text-red-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Sign Up Now
            </button>
            <button
              onClick={handleGoToDashboard}
              className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition-colors font-medium"
            >
              Browse Properties
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <HomeIcon className="h-6 w-6 text-red-600" />
                <span className="ml-2 text-xl font-bold">ReliEstate</span>
              </div>
              <p className="text-gray-400 mb-4">Your trusted partner for all your real estate needs.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            {/* Property Types */}
            <div>
              <h3 className="text-lg font-bold mb-4">Property Types</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Residential
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Commercial
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Industrial
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Land
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">123 Property Street</li>
                <li className="text-gray-400">Real Estate City, RE 12345</li>
                <li className="text-gray-400">info@reliestate.com</li>
                <li className="text-gray-400">(123) 456-7890</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 ReliEstate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home;
