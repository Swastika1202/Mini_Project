import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border/50 py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-4">
            <h3
              className="text-2xl font-bold gradient-text cursor-pointer"
              onClick={() => navigate("/")}
            >
              YouthWallet
            </h3>
            <p className="text-sm text-muted-foreground">
              Empowering youth to master their financial future.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => scrollTo("features")} className="hover:text-accent">Features</button></li>
              <li><span className="opacity-60">Pricing</span></li>
              <li><span className="opacity-60">Security</span></li>
              <li><span className="opacity-60">Roadmap</span></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="opacity-60">Blog</span></li>
              <li><span className="opacity-60">Guides</span></li>
              <li><span className="opacity-60">Help Center</span></li>
              <li><span className="opacity-60">Community</span></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><button onClick={() => scrollTo("about")} className="hover:text-accent">About</button></li>
              <li><span className="opacity-60">Careers</span></li>
              <li><span className="opacity-60">Contact</span></li>
              <li><span className="opacity-60">Privacy</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} YouthWallet. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all"
            >
              <Twitter className="w-5 h-5" />
            </a>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all"
            >
              <Github className="w-5 h-5" />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all"
            >
              <Linkedin className="w-5 h-5" />
            </a>

            <a
              href="mailto:support@youthwallet.com"
              aria-label="Email"
              className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-white transition-all"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
