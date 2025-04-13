import React from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { formatDate } from "@/lib/utils";

interface StreakCardProps {
  userId: number;
}

export function StreakCard({ userId }: StreakCardProps) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
  });

  if (isLoading) {
    return (
      <section className="mb-8 relative">
        <div className="relative bg-white rounded-3xl p-6 shadow-soft overflow-hidden">
          <div className="h-20 animate-pulse bg-gray-200 rounded mb-4"></div>
          <div className="flex items-center justify-between">
            <div className="h-4 animate-pulse bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 animate-pulse bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="mb-8 relative">
      <div className="relative bg-white rounded-3xl p-6 shadow-soft overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 -mt-10 -mr-10">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="#F7C59F" opacity="0.1">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>
        
        <h3 className="font-nunito font-semibold text-lg mb-2">Your Affirmation Journey</h3>
        
        <div className="flex items-center mb-4">
          <div className="h-20 flex items-center justify-center">
            {/* Streak leaves */}
            <div className="flex space-x-1">
              {Array(7).fill(0).map((_, index) => (
                <div 
                  key={index}
                  className="streak-leaf w-8 h-10 flex items-center justify-center" 
                >
                  <svg 
                    viewBox="0 0 30 40" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="#A0C8B3" 
                    className="w-full h-full" 
                    style={{ 
                      opacity: index < user.streakCount ? 0.9 : 0.3 
                    }}
                  >
                    <path d="M15 5 Q5 10 5 20 Q5 30 15 40 Q25 30 25 20 Q25 10 15 5 Z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          
          <div className="ml-4">
            <div className="text-2xl font-caveat font-bold">
              <span className="text-[#A0C8B3]">{user.streakCount}</span>
              <span className="text-gray-600"> day streak!</span>
            </div>
            <p className="text-sm text-gray-500">Keep growing your magical garden</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <i className="fas fa-calendar-alt mr-2 text-primary"></i>
            <span>Started on {formatDate(user.streakStartDate)}</span>
          </div>
          <button className="py-2 px-4 rounded-full bg-[#A0C8B3] bg-opacity-20 text-[#A0C8B3] font-medium text-sm wave-button">
            View Journey
          </button>
        </div>
      </div>
    </section>
  );
}

export default StreakCard;
