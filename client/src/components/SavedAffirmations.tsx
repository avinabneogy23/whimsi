import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Affirmation } from "@shared/schema";
import { Link } from "wouter";
import { truncateText, getCategoryColor } from "@/lib/utils";

interface SavedAffirmationsProps {
  userId: number;
  limit?: number;
}

export function SavedAffirmations({ userId, limit = 3 }: SavedAffirmationsProps) {
  const { data: savedAffirmations, isLoading } = useQuery<Affirmation[]>({
    queryKey: [`/api/users/${userId}/saved-affirmations`],
  });

  if (isLoading) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-nunito font-semibold text-lg">Your Favorites</h3>
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        
        <div className="overflow-x-auto pb-4 -mx-5 px-5">
          <div className="flex space-x-4">
            {Array(limit).fill(0).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 h-36 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!savedAffirmations || savedAffirmations.length === 0) {
    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-nunito font-semibold text-lg">Your Favorites</h3>
        </div>
        
        <div className="bg-white rounded-3xl p-6 shadow-soft text-center">
          <p className="text-gray-500">You haven't saved any affirmations yet.</p>
          <p className="text-sm text-gray-400 mt-2">Save your favorite affirmations to see them here.</p>
        </div>
      </section>
    );
  }

  const displayAffirmations = savedAffirmations.slice(0, limit);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-nunito font-semibold text-lg">Your Favorites</h3>
        {savedAffirmations.length > limit && (
          <Link href="/favorites">
            <a className="text-sm text-primary">View All</a>
          </Link>
        )}
      </div>
      
      <div className="overflow-x-auto pb-4 -mx-5 px-5">
        <div className="flex space-x-4">
          {displayAffirmations.map((affirmation, index) => (
            <div key={affirmation.id} className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className={`h-24 ${getCategoryColor(affirmation.category)} flex items-center justify-center p-4`}>
                <p className="font-caveat text-lg text-white text-center leading-tight">
                  "{truncateText(affirmation.text, 70)}"
                </p>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {affirmation.category.charAt(0).toUpperCase() + affirmation.category.slice(1).replace(/-/g, ' ')}
                </span>
                <div className="flex space-x-1">
                  <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SavedAffirmations;
