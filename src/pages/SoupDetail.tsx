import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { useSoups } from '../hooks/useSoups';
import { useCart } from '../context/CartContext';
import { Layout } from '../components/Layout';

const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: var(--primary-color, #e74c3c);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 8px;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 1200px;
  margin: 32px auto 64px;
  padding: 32px 24px;
  
  @media (max-width: 992px) {
    gap: 32px;
    padding: 24px 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin: 16px auto 48px;
  }
`;

const ImageContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 0;
  padding-bottom: 75%;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.03);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    pointer-events: none;
    border-radius: 12px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;

const Category = styled.div`
  display: inline-block;
  padding: 4px 12px;
  background-color: #f8f9fa;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 16px;
  text-transform: capitalize;
`;

const Title = styled.h1`
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: #333;
  line-height: 1.2;
  
  @media (max-width: 992px) {
    font-size: 2.25rem;
  }
  
  @media (max-width: 576px) {
    font-size: 2rem;
  }
`;

const Price = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color, #e74c3c);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &::after {
    content: '';
    display: inline-block;
    width: 40px;
    height: 3px;
    background-color: #eee;
    border-radius: 3px;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #555;
  margin-bottom: 32px;
  
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ variant: 'spicy' | 'vegetarian' | 'vegan' | 'gluten-free' }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  ${({ variant }) => {
    switch (variant) {
      case 'spicy':
        return 'background-color: #ffebee; color: #e53935; border: 1px solid rgba(229, 57, 53, 0.3);';
      case 'vegetarian':
        return 'background-color: #e8f5e9; color: #43a047; border: 1px solid rgba(67, 160, 71, 0.3);';
      case 'vegan':
        return 'background-color: #e0f2f1; color: #00897b; border: 1px solid rgba(0, 137, 123, 0.3);';
      case 'gluten-free':
        return 'background-color: #fff8e1; color: #ffb300; border: 1px solid rgba(255, 179, 0, 0.3);';
      default:
        return '';
    }
  }}
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 8px;
    
    ${({ variant }) => {
      switch (variant) {
        case 'spicy':
          return 'background-color: #e53935;';
        case 'vegetarian':
          return 'background-color: #43a047;';
        case 'vegan':
          return 'background-color: #00897b;';
        case 'gluten-free':
          return 'background-color: #ffb300;';
        default:
          return '';
      }
    }}
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
  padding-top: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
  position: relative;
  padding-bottom: 8px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--primary-color, #e74c3c);
    border-radius: 3px;
  }
`;

const IngredientsList = styled.ul`
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  
  li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 8px;
    color: #666;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color, #e74c3c);
      font-size: 1.2rem;
    }
  }
`;

const QuantityContainer = styled.div`
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  
  &:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.05);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  height: 40px;
  text-align: center;
  margin: 0 8px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #495057;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color, #e74c3c);
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
  }
  
  /* Remove spinner arrows */
  &::-webkit-inner-spin-button, 
  &::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield; /* Firefox */
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 12px;
  }
  
  button {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #555;
  font-weight: 500;
`;

const StarIcon = styled.span`
  color: #f1c40f;
  margin-right: 6px;
  font-size: 1.3rem;
  position: relative;
  top: -1px;
`;

const ReviewCount = styled.span`
  margin-left: 10px;
  font-size: 0.9rem;
  color: #888;
  font-weight: normal;
  
  &:hover {
    text-decoration: underline;
    cursor: pointer;
    color: var(--primary-color, #e74c3c);
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 80px 24px;
  max-width: 600px;
  margin: 32px auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  
  h2 {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
  }
  
  p {
    font-size: 1.2rem;
    line-height: 1.6;
    color: #666;
    margin-bottom: 32px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  button {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }
`;

export const SoupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useSoupById } = useSoups();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  const { data: soup, isLoading, error } = useSoupById(Number(id));
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    if (soup) {
      addToCart(soup, quantity);
      // Show a success message or open cart
    }
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  if (isLoading) {
    return <Layout><p>Loading...</p></Layout>;
  }
  
  if (error || !soup) {
    return (
      <Layout>
        <NotFound>
          <h2>Soup Not Found</h2>
          <p>Sorry, we couldn't find the soup you're looking for.</p>
          <Button onClick={goBack} variant="secondary">Go Back</Button>
        </NotFound>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Breadcrumbs>
        <Link to="/">Home</Link> <span>/</span> <Link to="/menu">Menu</Link> <span>/</span> <span>{soup.name}</span>
      </Breadcrumbs>
      <Container>
        <ImageContainer>
          <img src={soup.imageUrl} alt={soup.name} />
        </ImageContainer>
        
        <InfoContainer>
          <Category>{soup.category}</Category>
          <Title>{soup.name}</Title>
          
          <RatingContainer>
            <StarIcon>★</StarIcon>
            <span>{soup.rating.toFixed(1)}</span>
            <ReviewCount>({soup.reviewCount} reviews)</ReviewCount>
          </RatingContainer>
          
          <Price>${soup.price.toFixed(2)}</Price>
          
          <BadgeContainer>
            {soup.isSpicy && <Badge variant="spicy">Spicy</Badge>}
            {soup.isVegetarian && <Badge variant="vegetarian">Vegetarian</Badge>}
            {soup.isVegan && <Badge variant="vegan">Vegan</Badge>}
            {soup.isGlutenFree && <Badge variant="gluten-free">Gluten-Free</Badge>}
          </BadgeContainer>
          
          <Description>{soup.description}</Description>
          
          <Section>
            <SectionTitle>Ingredients</SectionTitle>
            <IngredientsList>
              {soup.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </IngredientsList>
          </Section>
          
          <QuantityContainer>
            <SectionTitle>Quantity</SectionTitle>
            <QuantityButton onClick={decreaseQuantity}>-</QuantityButton>
            <QuantityInput 
              type="number" 
              min="1" 
              value={quantity} 
              onChange={handleQuantityChange} 
            />
            <QuantityButton onClick={increaseQuantity}>+</QuantityButton>
          </QuantityContainer>
          
          <ButtonContainer>
            <Button onClick={handleAddToCart} size="large">
              Add to Cart - ${(soup.price * quantity).toFixed(2)}
            </Button>
            <Button variant="outline" size="large" onClick={goBack}>
              Back to Menu
            </Button>
          </ButtonContainer>
        </InfoContainer>
      </Container>
    </Layout>
  );
};