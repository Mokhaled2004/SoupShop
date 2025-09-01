import styled from 'styled-components';

interface CardProps {
  elevation?: 0 | 1 | 2 | 3;
  hoverEffect?: boolean;
}

export const Card = styled.div<CardProps>`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  ${({ elevation = 1 }) => {
    switch (elevation) {
      case 0:
        return 'box-shadow: none; border: 1px solid #e1e1e1;';
      case 1:
        return 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);';
      case 2:
        return 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);';
      case 3:
        return 'box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);';
      default:
        return 'box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);';
    }
  }}
  
  ${({ hoverEffect }) => hoverEffect && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    }
  `}
`;

export const CardHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

export const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardFooter = styled.div`
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

export const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
`;

export const CardSubtitle = styled.h4`
  margin: 0 0 16px 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
`;

export const CardText = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.875rem;
  color: #666;
  line-height: 1.5;
  flex-grow: 1;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const CardPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e74c3c;
`;