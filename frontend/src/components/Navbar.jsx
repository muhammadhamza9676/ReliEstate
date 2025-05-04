import { useState, useRef, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import LogoutButton from "./LogoutButton"
import { Home, Search, PlusCircle, LayoutDashboard, MessageSquare, User, ChevronDown, Menu, X } from "lucide-react"

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const navLinks = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Browse", path: "/browse", icon: <Search className="h-4 w-4 mr-2" /> },
    { name: "Add Property", path: "/add-property", icon: <PlusCircle className="h-4 w-4 mr-2" /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { name: "Inquiries", path: "/inquiries", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ]

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Home className="h-8 w-8 text-red-600 mr-2" />
              <span className="text-xl font-bold">ReliEstate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === link.path
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                } transition-colors`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Profile and Mobile Menu Button */}
          <div className="flex items-center">
            {/* User Profile Dropdown */}
            <div className="relative ml-3" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="ml-2 hidden md:flex items-center text-gray-300">
                  {user?.name || "Guest"}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </span>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b">Signed in as</div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">{user?.name}</div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Your Profile
                  </Link>
                  {/* <Link
                    to="/edit-profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </Link> */}
                  <div className="border-t">
                    <LogoutButton className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center" />
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  location.pathname === link.path
                    ? "bg-red-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
