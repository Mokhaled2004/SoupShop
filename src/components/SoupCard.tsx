import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Soup } from "../types";
import {
  Card,
  CardContent,
  CardFooter,
  CardImage,
  CardPrice,
  CardText,
  CardTitle,
} from "./Card";
import { Button } from "./Button";
import { useCart } from "../context/CartContext";

interface SoupCardProps {
  soup: Soup;
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const Badge = styled.span<{
  variant: "spicy" | "vegetarian" | "vegan" | "gluten-free";
}>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;

  ${({ variant }) => {
    switch (variant) {
      case "spicy":
        return "background-color: #ffebee; color: #e53935; border-color: #ef9a9a;";
      case "vegetarian":
        return "background-color: #e8f5e9; color: #43a047; border-color: #a5d6a7;";
      case "vegan":
        return "background-color: #e0f2f1; color: #00897b; border-color: #80cbc4;";
      case "gluten-free":
        return "background-color: #fff8e1; color: #ffb300; border-color: #ffe082;";
      default:
        return "";
    }
  }}
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  margin-bottom: 12px;
`;

const StarIcon = styled.span`
  color: #f8ce0b;
  margin-right: 4px;
`;

const ReviewCount = styled.span`
  font-size: 0.75rem;
  color: #666;
`;

const StyledCard = styled(Card)`
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
  }
`;

const StyledCardImage = styled(CardImage)`
  overflow: hidden;
  height: 200px;

  img {
    transition: transform 0.3s ease;
    width: 100%;
    height: 100%;
    object-fit: cover;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

export const SoupCard = ({ soup }: SoupCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(soup, 1);
  };

  return (
    <StyledCard hoverEffect>
      <StyledLink to={`/soups/${soup.id}`}>
        <StyledCardImage>
          <img src={soup.imageUrl} alt={soup.name} />
        </StyledCardImage>
        <CardContent>
          <CardTitle>{soup.name}</CardTitle>
          <BadgeContainer>
            {soup.isSpicy && <Badge variant="spicy">Spicy</Badge>}
            {soup.isVegetarian && (
              <Badge variant="vegetarian">Vegetarian</Badge>
            )}
            {soup.isVegan && <Badge variant="vegan">Vegan</Badge>}
            {soup.isGlutenFree && (
              <Badge variant="gluten-free">Gluten-Free</Badge>
            )}
          </BadgeContainer>
          <CardText>{soup.description.substring(0, 100)}...</CardText>
          <RatingContainer>
            <StarIcon>★</StarIcon>
            <strong>{soup.rating.toFixed(1)}</strong>
            <ReviewCount>({soup.reviewCount} reviews)</ReviewCount>
          </RatingContainer>
        </CardContent>
        <CardFooter>
          <CardPrice>${soup.price.toFixed(2)}</CardPrice>
          <Button size="small" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </CardFooter>
      </StyledLink>
    </StyledCard>
  );
};
