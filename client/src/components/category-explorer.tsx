import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

type CategoryCardProps = {
  id: number;
  name: string;
  count: number;
  imagePath?: string;
  onClick: (categoryName: string) => void;
};

function CategoryCard({ id, name, count, imagePath, onClick }: CategoryCardProps) {
  return (
    <div 
      className="category-card bg-white rounded-2xl shadow-soft overflow-hidden w-36 flex-shrink-0 cursor-pointer"
      onClick={() => onClick(name)}
    >
      <div className="h-20 overflow-hidden">
        {/* Use a placeholder image since we can't generate images */}
        <div className="w-full h-full bg-gradient-to-br from-primary-light to-accent-light opacity-70"></div>
      </div>
      <div className="p-3">
        <h3 className="font-heading font-semibold text-sm">{name}</h3>
        <p className="text-xs text-gray-500 mt-1">{count} affirmations</p>
      </div>
    </div>
  );
}

export function CategoryExplorer() {
  const [, setLocation] = useLocation();

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ["/api/categories"],
  });

  const handleCategoryClick = (categoryName: string) => {
    setLocation(`/explore?category=${encodeURIComponent(categoryName)}`);
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="px-6">
          <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
            <i className="ri-compass-3-line text-primary mr-2"></i>
            Explore Categories
          </h2>
        </div>
        <div className="categories-scroll overflow-x-auto pl-6 pb-3">
          <div className="flex space-x-4 w-max">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="category-card bg-gray-100 rounded-2xl shadow-soft overflow-hidden w-36 h-52 flex-shrink-0 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories) {
    return (
      <section className="mb-8 px-6">
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
          <i className="ri-compass-3-line text-primary mr-2"></i>
          Explore Categories
        </h2>
        <div className="bg-white rounded-3xl p-5 shadow-medium">
          <p className="text-sm text-gray-500">Failed to load categories. Please try again.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="px-6">
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
          <i className="ri-compass-3-line text-primary mr-2"></i>
          Explore Categories
        </h2>
      </div>
      
      <div className="categories-scroll overflow-x-auto pl-6 pb-3">
        <div className="flex space-x-4 w-max">
          {categories.map((category: any) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              count={category.count}
              imagePath={category.imagePath}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
