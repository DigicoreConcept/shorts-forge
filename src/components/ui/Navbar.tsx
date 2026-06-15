import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

const navLinks = [
  { label: "FEATURES", to: "/features" },
  { label: "PRICING", to: "/pricing" },
  { label: "ABOUT US", to: "/about" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If we are not on the homepage, or if we've scrolled, show a solid white background
  const showBg = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${showBg ? "bg-white shadow-md border-b border-[#FFCDD2]" : "bg-transparent"}`}
    >
      <nav className="w-full flex items-stretch justify-between h-20 max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="flex-1 flex items-center pl-6 lg:pl-8 gap-8 lg:gap-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="ShortForge Logo"
              className="w-8 h-8 rounded object-cover shadow-sm"
            />
            <span className="font-black italic text-2xl text-[#1A1A1A] tracking-widest drop-shadow-sm">
              <span className="text-[#EF5350]">S</span>HORT FORGE
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs font-bold italic tracking-widest text-[#616161] hover:text-[#EF5350] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side CTA Block */}
        <div className="flex items-center px-6 lg:px-8 h-full relative z-20">
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/dashboard")}
                className="text-[#1A1A1A] text-xs font-black italic tracking-widest hover:text-[#EF5350] transition-colors"
              >
                DASHBOARD
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-[#1A1A1A] text-xs font-black italic tracking-widest hover:text-[#EF5350] transition-colors"
                >
                  LOG IN
                </Link>
                <Link
                  to="/register"
                  className="bg-[#EF5350] text-white px-5 py-2.5 rounded-xl text-xs font-black italic tracking-widest hover:bg-[#C62828] transition-colors shadow-sm"
                >
                  START FREE
                </Link>
              </>
            )}
            {/* Hamburger Menu */}
            <button
              className="text-[#1A1A1A] hover:text-[#EF5350] transition-colors md:hidden ml-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#15171e] border-b border-white/10 px-6 py-8 flex flex-col gap-6 absolute top-20 left-0 right-0 shadow-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-black italic tracking-widest text-white hover:text-[#EF5350]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-black italic tracking-widest text-gray-400 hover:text-white"
            >
              LOG IN
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-black italic tracking-widest text-[#EF5350] hover:text-[#C62828] pt-2 border-t border-white/10 mt-2"
              >
                START FREE TRIAL
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
