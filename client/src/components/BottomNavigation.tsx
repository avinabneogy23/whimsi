import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Home, Leaf, BookOpen, User } from "lucide-react";

export function BottomNavigation() {
  const [location] = useLocation();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  
  // Navigation items
  const navItems = [
    { path: "/discover", icon: <Leaf size={20} />, label: "Discover" },
    { path: "/", icon: <Home size={20} />, label: "Home" },
    { path: "/favorites", icon: <BookOpen size={20} />, label: "Favorites" },
    { path: "/profile", icon: <User size={20} />, label: "Profile" },
  ];

  // Find active index
  const activeIndex = navItems.findIndex((item) => item.path === location);
  
  // Update indicator position
  useEffect(() => {
    const updateIndicator = () => {
      if (!indicatorRef.current || !navRef.current) return;
      
      const navButtons = navRef.current.querySelectorAll('a');
      const activeButton = navButtons[activeIndex === -1 ? 1 : activeIndex]; // Default to home if not found
      
      if (activeButton) {
        const buttonRect = activeButton.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();
        const leftPosition = buttonRect.left - navRect.left + buttonRect.width / 2;
        
        indicatorRef.current.style.transform = `translateX(${leftPosition}px) translateY(-50%)`;
      }
    };
    
    updateIndicator();
    
    // Add resize listener
    window.addEventListener('resize', updateIndicator);
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeIndex, location]);

  return (
    <nav ref={navRef} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg px-6 py-4 z-40">
      <div className="relative flex items-center justify-around">
        {/* Active tab indicator */}
        <div 
          ref={indicatorRef}
          className="tab-indicator absolute h-12 w-12 rounded-full bg-primary bg-opacity-10 top-1/2 -translate-y-1/2 left-0 -translate-x-1" 
        />
        
        {navItems.map((item, index) => (
          <Link key={item.path} href={item.path}>
            <a 
              className={`relative z-10 p-3 transition-colors ${index === activeIndex ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label={item.label}
            >
              {item.icon}
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default BottomNavigation;
