import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Soup } from '../types';
import { soupService } from '../services/soupService';

export const useSoups = () => {
  const queryClient = useQueryClient();

  const {
    data: soups = [],
    isLoading,
    error,
  } = useQuery<Soup[]>({
    queryKey: ['soups'],
    queryFn: soupService.getAllSoups,
  });

  const getSoupById = (id: number) => {
    return soups.find(soup => soup.id === id) || null;
  };

  const prefetchSoup = async (id: number) => {
    await queryClient.prefetchQuery({
      queryKey: ['soup', id],
      queryFn: () => soupService.getSoupById(id),
    });
  };

  const useSoupById = (id: number) => {
    return useQuery<Soup>({
      queryKey: ['soup', id],
      queryFn: () => soupService.getSoupById(id),
      initialData: () => {
        const existingSoup = queryClient.getQueryData<Soup[]>(['soups'])?.find(soup => soup.id === id);
        return existingSoup;
      },
    });
  };

  const useSoupsByCategory = (category: string) => {
    return useQuery<Soup[]>({
      queryKey: ['soups', 'category', category],
      queryFn: () => soupService.getSoupsByCategory(category),
    });
  };

  const useTopRatedSoups = (limit: number = 5) => {
    return useQuery<Soup[]>({
      queryKey: ['soups', 'top-rated', limit],
      queryFn: () => soupService.getTopRatedSoups(limit),
    });
  };

  const useSearchSoups = (query: string) => {
    return useQuery<Soup[]>({
      queryKey: ['soups', 'search', query],
      queryFn: () => soupService.searchSoups(query),
      enabled: query.length > 2,
    });
  };

  return {
    soups,
    isLoading,
    error,
    getSoupById,
    prefetchSoup,
    useSoupById,
    useSoupsByCategory,
    useTopRatedSoups,
    useSearchSoups,
  };
};