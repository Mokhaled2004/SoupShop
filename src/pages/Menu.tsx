import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SoupCard } from '../components/SoupCard';
import { useSoups } from '../hooks/useSoups';
import { Soup } from '../types';
import { Layout } from '../components/Layout';

const MenuContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const MenuHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  padding-bottom: 1.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: #e74c3c;
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: center;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid ${({ active }) => (active ? '#e74c3c' : '#ddd')};
  background-color: ${({ active }) => (active ? '#e74c3c' : 'white')};
  color: ${({ active }) => (active ? 'white' : '#333')};
  font-weight: ${({ active }) => (active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${({ active }) => (active ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none')};
  
  &:hover {
    background-color: ${({ active }) => (active ? '#c0392b' : '#f5f5f5')};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const SoupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 48px;
  
  /* Ensure all items in a row have the same height */
  & > * {
    height: 100%;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 24px;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #666;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #ddd;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  margin: 0 auto 32px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: 30px;
  border: 2px solid #ddd;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 1.2rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #e74c3c;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

type FilterType = 'all' | 'vegetarian' | 'vegan' | 'gluten-free' | 'spicy';

export const Menu = () => {
  const { soups, isLoading } = useSoups();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSoups, setFilteredSoups] = useState<Soup[]>([]);

  useEffect(() => {
    if (!soups) return;

    let result = [...soups];

    // Apply category filter
    if (activeFilter !== 'all') {
      result = result.filter(soup => {
        switch (activeFilter) {
          case 'vegetarian':
            return soup.isVegetarian;
          case 'vegan':
            return soup.isVegan;
          case 'gluten-free':
            return soup.isGlutenFree;
          case 'spicy':
            return soup.isSpicy;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        soup =>
          soup.name.toLowerCase().includes(query) ||
          soup.description.toLowerCase().includes(query) ||
          soup.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
      );
    }

    setFilteredSoups(result);
  }, [soups, activeFilter, searchQuery]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout>
      <MenuContainer>
        <MenuHeader>
          <Title>Our Soup Menu</Title>
          <Subtitle>
            Explore our wide variety of delicious, handcrafted soups made with the finest ingredients.
            From classic favorites to unique creations, we have a soup for every taste.
          </Subtitle>
        </MenuHeader>

        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by name, description, or ingredient..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchContainer>

        <FiltersContainer>
          <FilterButton
            active={activeFilter === 'all'}
            onClick={() => handleFilterChange('all')}
          >
            All Soups
          </FilterButton>
          <FilterButton
            active={activeFilter === 'vegetarian'}
            onClick={() => handleFilterChange('vegetarian')}
          >
            Vegetarian
          </FilterButton>
          <FilterButton
            active={activeFilter === 'vegan'}
            onClick={() => handleFilterChange('vegan')}
          >
            Vegan
          </FilterButton>
          <FilterButton
            active={activeFilter === 'gluten-free'}
            onClick={() => handleFilterChange('gluten-free')}
          >
            Gluten-Free
          </FilterButton>
          <FilterButton
            active={activeFilter === 'spicy'}
            onClick={() => handleFilterChange('spicy')}
          >
            Spicy
          </FilterButton>
        </FiltersContainer>

        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <div>Loading our delicious soups...</div>
          </LoadingContainer>
        ) : filteredSoups.length > 0 ? (
          <SoupGrid>
            {filteredSoups.map((soup) => (
              <SoupCard key={soup.id} soup={soup} />
            ))}
          </SoupGrid>
        ) : (
          <NoResults>
            <h3>No soups found</h3>
            <p>Try adjusting your filters or search query</p>
          </NoResults>
        )}
      </MenuContainer>
    </Layout>
  );
};