import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.svg" alt="Bharat Forecast" className="w-8 h-8" />
              <div>
                <span className="font-semibold text-text-primary block leading-tight">Bharat Forecast</span>
                <span className="text-xs text-text-secondary block leading-tight">Hybrid Weather Intelligence</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:gap-6">
            <div className="flex items-center gap-2 mr-4 text-xs text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-status-success inline-block"></span>
              Data services online
            </div>
            <Link to="/" className={`text-sm ${isActive("/") ? "text-primary font-medium" : "text-text-secondary hover:text-text-primary"}`}>Home</Link>
            <Link to="/forecast" className={`text-sm ${isActive("/forecast") ? "text-primary font-medium" : "text-text-secondary hover:text-text-primary"}`}>Forecast</Link>
            <Link to="/about" className={`text-sm ${isActive("/about") ? "text-primary font-medium" : "text-text-secondary hover:text-text-primary"}`}>About</Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-secondary hover:text-text-primary focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border bg-surface">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base ${isActive("/") ? "bg-primary-light text-primary font-medium" : "text-text-secondary hover:bg-gray-50"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/forecast" 
              className={`block px-3 py-2 rounded-md text-base ${isActive("/forecast") ? "bg-primary-light text-primary font-medium" : "text-text-secondary hover:bg-gray-50"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Forecast
            </Link>
            <Link 
              to="/about" 
              className={`block px-3 py-2 rounded-md text-base ${isActive("/about") ? "bg-primary-light text-primary font-medium" : "text-text-secondary hover:bg-gray-50"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="px-3 py-2 mt-2 flex items-center gap-2 text-sm text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-status-success inline-block"></span>
              Data services online
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
