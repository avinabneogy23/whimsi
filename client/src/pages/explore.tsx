import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AffirmationCard } from "@/components/affirmation-card";

export default function Explore() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/explore");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  // Get all categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/categories"],
  });

  // Get affirmations for selected category
  const { data: affirmations, isLoading: affirmationsLoading } = useQuery({
    queryKey: [selectedCategory ? `/api/affirmations/category/${selectedCategory}` : "/api/affirmations"],
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setLocation(`/explore?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="app-container max-w-md mx-auto min-h-screen flex flex-col bg-white bg-opacity-85 backdrop-blur-md">
      {/* App header */}
      <header className="pt-10 px-6 flex justify-between items-center z-10">
        <button className="w-9 h-9 rounded-full flex items-center justify-center bg-white shadow-soft" onClick={() => setLocation("/")}>
          <i className="ri-arrow-left-line"></i>
        </button>
        <h1 className="font-heading text-xl font-bold">Explore</h1>
        <div className="w-9 h-9"></div> {/* Empty div for spacing */}
      </header>

      {/* Category pills */}
      <div className="px-6 pt-6 pb-2">
        <div className="overflow-x-auto whitespace-nowrap pb-2 -mx-6 px-6">
          <div className="inline-flex space-x-2">
            <button 
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleCategorySelect("")}
            >
              All
            </button>
            
            {categoriesLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="w-24 h-10 bg-gray-100 rounded-full animate-pulse"></div>
              ))
            ) : (
              categories?.map((category: any) => (
                <button 
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedCategory === category.name ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategorySelect(category.name)}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main content area with scrolling */}
      <main className="flex-1 overflow-y-auto pt-2 pb-20 px-6">
        <h2 className="font-heading text-lg font-bold mb-4">
          {selectedCategory ? `${selectedCategory} Affirmations` : 'All Affirmations'}
        </h2>
        
        {affirmationsLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : affirmations?.length > 0 ? (
          <div className="space-y-4">
            {affirmations.map((affirmation: any) => (
              <AffirmationCard
                key={affirmation.id}
                id={affirmation.id}
                text={affirmation.text}
                category={affirmation.category}
                audioPath={affirmation.audioPath}
                isFavorite={affirmation.isFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-medium">
            <p className="text-gray-500 text-center">No affirmations found for this category.</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
