import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const goToAuth = () => {
    setMobileMenuOpen(false);
    navigate("/auth");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">Y</span>
            </div>
            <span className="text-xl font-bold gradient-text">YouthWallet</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection("features")} className="text-foreground/80 hover:text-foreground">
              Features
            </button>
            <button onClick={() => scrollToSection("about")} className="text-foreground/80 hover:text-foreground">
              About
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="text-foreground/80 hover:text-foreground">
              Testimonials
            </button>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button variant="hero" onClick={goToAuth}>
              Get Started
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection("features")} className="text-left">Features</button>
              <button onClick={() => scrollToSection("about")} className="text-left">About</button>
              <button onClick={() => scrollToSection("testimonials")} className="text-left">Testimonials</button>
              <Button variant="hero" className="w-full" onClick={goToAuth}>
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
