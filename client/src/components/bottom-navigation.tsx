import { useLocation, Link } from "wouter";

type NavItemProps = {
  icon: string;
  label: string;
  path: string;
  isActive: boolean;
};

function NavItem({ icon, label, path, isActive }: NavItemProps) {
  return (
    <Link href={path}>
      <a className={`nav-item flex flex-col items-center ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100 transition'}`}>
        <div className={`w-10 h-10 rounded-full ${isActive ? 'bg-primary-light' : 'bg-gray-100'} flex items-center justify-center mb-1`}>
          <i className={`ri-${icon} ${isActive ? 'text-primary-dark' : ''}`}></i>
        </div>
        <span className={`text-xs font-medium ${isActive ? 'text-primary-dark' : ''}`}>{label}</span>
      </a>
    </Link>
  );
}

export function BottomNavigation() {
  const [location] = useLocation();
  
  const navItems = [
    { icon: "home-4-line", label: "Home", path: "/" },
    { icon: "compass-3-line", label: "Explore", path: "/explore" },
    { icon: "emotion-line", label: "Mood", path: "/mood" },
    { icon: "user-line", label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-t-3xl shadow-lg py-3 px-6 z-20">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            path={item.path}
            isActive={location === item.path}
          />
        ))}
      </div>
    </nav>
  );
}
