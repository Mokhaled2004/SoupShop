import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "./Button";

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  margin-top: 0;
  margin-bottom: 24px;
  border-radius: 12px 12px 12px 12px; /* rounded bottom only */
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #e74c3c;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoIcon = styled.span`
  font-size: 1.75rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #e74c3c;
  }
`;

const CartButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  position: relative;
`;

const CartCount = styled.span`
  background-color: #e74c3c;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -8px;
  right: -8px;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = styled.div<{ isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 16px;
    gap: 16px;
  }
`;

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          <LogoIcon>🍜</LogoIcon> SoupShop
        </Logo>

        <MobileMenuButton onClick={toggleMenu}>
          {isMenuOpen ? "✕" : "☰"}
        </MobileMenuButton>

        <DesktopNav>
          <SearchContainer>
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Search for soups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </SearchContainer>

          <Nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>

            {user ? (
              <>
                <NavLink to="/orders">My Orders</NavLink>
                <Button variant="outline" size="small" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <Button size="small" as={Link} to="/register">
                  Sign Up
                </Button>
              </>
            )}

            <CartButton to="/cart">
              🛒 Cart
              {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
            </CartButton>
          </Nav>
        </DesktopNav>

        <MobileNav isOpen={isMenuOpen}>
          <SearchContainer>
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="Search for soups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </SearchContainer>

          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {user ? (
            <>
              <NavLink to="/orders">My Orders</NavLink>
              <Button variant="outline" size="small" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <Button size="small" as={Link} to="/register">
                Sign Up
              </Button>
            </>
          )}

          <CartButton to="/cart">
            🛒 Cart
            {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
          </CartButton>
        </MobileNav>
      </HeaderContent>
    </HeaderContainer>
  );
};
