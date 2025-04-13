import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/user-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type FavoriteAffirmationProps = {
  id: number;
  text: string;
  category: string;
  onRemove: (id: number) => void;
};

function FavoriteAffirmation({ id, text, category, onRemove }: FavoriteAffirmationProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft">
      <p className="font-accent text-lg">{text}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500 font-medium px-2 py-0.5 bg-gray-100 rounded-full">{category}</span>
        <button 
          className="w-7 h-7 rounded-full flex items-center justify-center text-error hover:bg-red-50 transition"
          onClick={() => onRemove(id)}
        >
          <i className="ri-heart-fill"></i>
        </button>
      </div>
    </div>
  );
}

export function FavoriteAffirmations() {
  const { isLoggedIn } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ['/api/favorites'],
    enabled: isLoggedIn
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (affirmationId: number) => {
      const res = await apiRequest("DELETE", `/api/favorites/${affirmationId}`);
      return { affirmationId, data: await res.json() };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Removed from favorites",
        description: "Affirmation has been removed from your favorites",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleRemoveFavorite = (affirmationId: number) => {
    removeFavoriteMutation.mutate(affirmationId);
  };

  if (!isLoggedIn) {
    return (
      <section className="px-6 mb-8">
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
          <i className="ri-heart-3-line text-error mr-2"></i>
          Your Favorites
        </h2>
        <div className="bg-white rounded-3xl p-5 shadow-medium">
          <p className="text-sm text-gray-500 text-center">Please sign in to view your favorites</p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="px-6 mb-8">
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
          <i className="ri-heart-3-line text-error mr-2"></i>
          Your Favorites
        </h2>
        <div className="space-y-3">
          {Array(2).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-100 h-24 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (error || !favorites) {
    return (
      <section className="px-6 mb-8">
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
          <i className="ri-heart-3-line text-error mr-2"></i>
          Your Favorites
        </h2>
        <div className="bg-white rounded-3xl p-5 shadow-medium">
          <p className="text-sm text-gray-500">Failed to load favorites. Please try again.</p>
        </div>
      </section>
    );
  }

  if (favorites.length === 0) {
    return (
      <section className="px-6 mb-8">
        <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
          <i className="ri-heart-3-line text-error mr-2"></i>
          Your Favorites
        </h2>
        <div className="bg-white rounded-3xl p-5 shadow-medium">
          <p className="text-sm text-gray-500 text-center">You haven't saved any favorites yet</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 mb-8">
      <h2 className="font-heading text-xl font-bold mb-3 flex items-center">
        <i className="ri-heart-3-line text-error mr-2"></i>
        Your Favorites
      </h2>
      
      <div className="space-y-3">
        {favorites.map((item: any) => (
          <FavoriteAffirmation
            key={item.favorite.id}
            id={item.affirmation.id}
            text={item.affirmation.text}
            category={item.affirmation.category}
            onRemove={handleRemoveFavorite}
          />
        ))}
      </div>
    </section>
  );
}
