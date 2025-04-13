import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { Link } from "wouter";
import { getRandomBackground } from "@/lib/utils";

interface ExploreCategoriesProps {
  limit?: number;
}

export function ExploreCategories({ limit = 4 }: ExploreCategoriesProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <h3 className="font-nunito font-semibold text-lg mb-4">Explore Affirmation Themes</h3>
        <div className="grid grid-cols-2 gap-4">
          {Array(limit).fill(0).map((_, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-soft h-32 animate-pulse bg-gray-200"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="mb-8">
        <h3 className="font-nunito font-semibold text-lg mb-4">Explore Affirmation Themes</h3>
        <div className="bg-white rounded-3xl p-6 shadow-soft text-center">
          <p className="text-gray-500">No categories available</p>
        </div>
      </section>
    );
  }

  const displayCategories = categories.slice(0, limit);
  const backgrounds = Array(limit).fill(0).map(() => getRandomBackground());

  return (
    <section className="mb-8">
      <h3 className="font-nunito font-semibold text-lg mb-4">Explore Affirmation Themes</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {displayCategories.map((category, index) => (
          <Link key={category.id} href={`/discover?category=${category.name}`}>
            <a className="group relative rounded-2xl overflow-hidden shadow-soft h-32 animate-float block" style={{ animationDelay: `${0.5 * (index + 1)}s` }}>
              <img 
                src={backgrounds[index]}
                alt={category.displayName} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h4 className="text-white font-caveat text-xl">{category.displayName}</h4>
              </div>
            </a>
          </Link>
        ))}
      </div>
      
      {categories.length > limit && (
        <div className="mt-4 text-center">
          <Link href="/discover">
            <a className="inline-block px-5 py-2 bg-secondary bg-opacity-20 text-secondary rounded-full font-medium text-sm wave-button">
              See All Themes
            </a>
          </Link>
        </div>
      )}
    </section>
  );
}

export default ExploreCategories;
