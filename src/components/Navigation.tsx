import { Link, useLocation } from "react-router-dom";
import { Home, Upload, User, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const Navigation = () => {
  const location = useLocation();

  const links = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/coach", icon: MessageCircle, label: "Coach" },
    { to: "/upload", icon: Upload, label: "Upload" },
    { to: "/profile", icon: User, label: "Me" },
  ];

  // Hide navigation on login/signup pages
  const hideNavigation = location.pathname === "/login" || location.pathname === "/signup";

  if (hideNavigation) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t-2 border-border z-50 shadow-elevated">
      <div className="container max-w-md mx-auto px-2">
        <div className="flex justify-around items-center h-18 py-2">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;
            
            return (
              <Link key={link.to} to={link.to} className="relative py-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1.5 transition-smooth px-4 py-2 rounded-xl ${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Icon className="h-7 w-7" />
                  <span className="text-sm font-semibold">{link.label}</span>

                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
