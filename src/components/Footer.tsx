import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #333;
  color: white;
  padding: 48px 0 24px;
  margin-top: 48px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #e74c3c;
`;

const FooterLink = styled(Link)`
  color: #ddd;
  text-decoration: none;
  margin-bottom: 8px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e74c3c;
  }
`;

const FooterText = styled.p`
  color: #ddd;
  margin-bottom: 16px;
  line-height: 1.5;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const SocialLink = styled.a`
  color: white;
  font-size: 1.5rem;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e74c3c;
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 0;
  text-align: center;
  border-top: 1px solid #444;
  margin-top: 32px;
  font-size: 0.875rem;
  color: #aaa;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
`;

export const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <Logo>
            <LogoIcon>🍜</LogoIcon> SoupShop
          </Logo>
          <FooterText>
            Delicious, handcrafted soups made with the finest ingredients.
            From classic favorites to unique creations, we have a soup for every taste.
          </FooterText>
          <SocialLinks>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">📱</SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">📘</SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">📸</SocialLink>
            <SocialLink href="#" target="_blank" rel="noopener noreferrer">🐦</SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Quick Links</FooterTitle>
          <FooterLink to="/">Home</FooterLink>
          <FooterLink to="/menu">Menu</FooterLink>
          <FooterLink to="/about">About Us</FooterLink>
          <FooterLink to="/contact">Contact</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Categories</FooterTitle>
          <FooterLink to="/menu/vegetarian">Vegetarian</FooterLink>
          <FooterLink to="/menu/vegan">Vegan</FooterLink>
          <FooterLink to="/menu/gluten-free">Gluten-Free</FooterLink>
          <FooterLink to="/menu/spicy">Spicy</FooterLink>
          <FooterLink to="/menu/seasonal">Seasonal</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Contact Us</FooterTitle>
          <FooterText>
            123 Soup Street<br />
            Flavor City, FC 12345<br />
            United States
          </FooterText>
          <FooterText>
            Phone: (123) 456-7890<br />
            Email: info@soupshop.com
          </FooterText>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {new Date().getFullYear()} SoupShop. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};