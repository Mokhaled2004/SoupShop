import { Soup } from '../types';
import { apiService } from './api';
import mockSoups from '../data/soups';

// Use this flag to switch between mock data and API calls
const USE_MOCK_DATA = true;

export const soupService = {
  getAllSoups: async (): Promise<Soup[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(mockSoups);
    }
    const response = await apiService.get<Soup[]>('/soups');
    return response.data;
  },

  getSoupById: async (id: number): Promise<Soup> => {
    if (USE_MOCK_DATA) {
      const soup = mockSoups.find(soup => soup.id === id);
      if (!soup) {
        return Promise.reject(new Error(`Soup with id ${id} not found`));
      }
      return Promise.resolve(soup);
    }
    const response = await apiService.get<Soup>(`/soups/${id}`);
    return response.data;
  },

  getSoupsByCategory: async (category: string): Promise<Soup[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(
        mockSoups.filter(soup => 
          category === 'all' ? true : soup.category === category
        )
      );
    }
    const response = await apiService.get<Soup[]>(`/soups/category/${category}`);
    return response.data;
  },

  searchSoups: async (query: string): Promise<Soup[]> => {
    if (USE_MOCK_DATA) {
      const lowerQuery = query.toLowerCase();
      return Promise.resolve(
        mockSoups.filter(soup => 
          soup.name.toLowerCase().includes(lowerQuery) || 
          soup.description.toLowerCase().includes(lowerQuery) ||
          soup.category.toLowerCase().includes(lowerQuery)
        )
      );
    }
    const response = await apiService.get<Soup[]>(`/soups/search?q=${query}`);
    return response.data;
  },

  getTopRatedSoups: async (limit: number = 5): Promise<Soup[]> => {
    if (USE_MOCK_DATA) {
      return Promise.resolve(
        [...mockSoups]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit)
      );
    }
    const response = await apiService.get<Soup[]>(`/soups/top-rated?limit=${limit}`);
    return response.data;
  },
};