import React from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

interface UserGreetingProps {
  userId: number;
}

export function UserGreeting({ userId }: UserGreetingProps) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
  });

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <section className="animate-pulse">
        <div className="flex items-center mb-2">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="ml-2 h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-56 mb-6"></div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="animate-fadeIn">
      <div className="flex items-center mb-2">
        <h2 className="font-quicksand text-lg font-medium text-foreground">{getGreeting()},</h2>
        <span className="ml-2 font-caveat text-xl text-primary">{user.name}</span>
      </div>
      <p className="text-sm text-gray-600 mb-6">A new day filled with wonder awaits you!</p>
    </section>
  );
}

export default UserGreeting;
