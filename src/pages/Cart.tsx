import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 48px 0;
`;

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 16px;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 576px) {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto;
  }
`;

const ItemImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 576px) {
    width: 80px;
    height: 80px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ItemName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const ItemPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #e74c3c;
  margin-bottom: 8px;
`;

const ItemBadges = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ variant: 'spicy' | 'vegetarian' | 'vegan' | 'gluten-free' }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${({ variant }) => {
    switch (variant) {
      case 'spicy':
        return 'background-color: #ffebee; color: #e53935;';
      case 'vegetarian':
        return 'background-color: #e8f5e9; color: #43a047;';
      case 'vegan':
        return 'background-color: #e0f2f1; color: #00897b;';
      case 'gluten-free':
        return 'background-color: #fff8e1; color: #ffb300;';
      default:
        return '';
    }
  }}
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: 576px) {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
`;

const QuantityInput = styled.input`
  width: 40px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
  
  /* Hide spinner */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: #e74c3c;
    text-decoration: underline;
  }
  
  &:focus {
    outline: none;
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  position: sticky;
  top: 100px;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 1rem;
  color: #666;
`;

const SummaryTotal = styled(SummaryRow)`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

const CheckoutButton = styled(Button)`
  margin-top: 24px;
`;

const ContinueShoppingLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 16px;
  color: #666;
  text-decoration: none;
  
  &:hover {
    color: #e74c3c;
    text-decoration: underline;
  }
`;

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const handleQuantityChange = (soupId: number, value: string) => {
    const quantity = parseInt(value);
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(soupId, quantity);
    }
  };
  
  const decreaseQuantity = (soupId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(soupId, currentQuantity - 1);
    }
  };
  
  const increaseQuantity = (soupId: number, currentQuantity: number) => {
    updateQuantity(soupId, currentQuantity + 1);
  };
  
  const handleRemoveItem = (soupId: number) => {
    removeFromCart(soupId);
  };
  
  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };
  
  if (cart.length === 0) {
    return (
      <>
        <PageTitle>Your Cart</PageTitle>
        <EmptyCart>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any soups to your cart yet.</p>
          <Button as={Link} to="/menu" size="large" style={{ marginTop: '24px' }}>
            Browse Our Menu
          </Button>
        </EmptyCart>
      </>
    );
  }
  
  // Calculate subtotal, tax, and shipping
  const subtotal = totalPrice;
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;
  
  return (
    <>
      <PageTitle>Your Cart</PageTitle>
      <CartContainer>
        <CartItems>
          {cart.map((item) => (
            <CartItem key={item.soup.id}>
              <ItemImage>
                <img src={item.soup.imageUrl} alt={item.soup.name} />
              </ItemImage>
              
              <ItemInfo>
                <ItemName>{item.soup.name}</ItemName>
                <ItemPrice>${item.soup.price.toFixed(2)}</ItemPrice>
                <ItemBadges>
                  {item.soup.isSpicy && <Badge variant="spicy">Spicy</Badge>}
                  {item.soup.isVegetarian && <Badge variant="vegetarian">Vegetarian</Badge>}
                  {item.soup.isVegan && <Badge variant="vegan">Vegan</Badge>}
                  {item.soup.isGlutenFree && <Badge variant="gluten-free">Gluten-Free</Badge>}
                </ItemBadges>
              </ItemInfo>
              
              <ItemActions>
                <QuantityContainer>
                  <QuantityButton 
                    onClick={() => decreaseQuantity(item.soup.id, item.quantity)}
                  >
                    -
                  </QuantityButton>
                  <QuantityInput 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => handleQuantityChange(item.soup.id, e.target.value)} 
                  />
                  <QuantityButton 
                    onClick={() => increaseQuantity(item.soup.id, item.quantity)}
                  >
                    +
                  </QuantityButton>
                </QuantityContainer>
                <RemoveButton onClick={() => handleRemoveItem(item.soup.id)}>
                  Remove
                </RemoveButton>
              </ItemActions>
            </CartItem>
          ))}
        </CartItems>
        
        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          <SummaryRow>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </SummaryRow>
          <SummaryTotal>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </SummaryTotal>
          
          <CheckoutButton 
            fullWidth 
            size="large" 
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </CheckoutButton>
          
          <ContinueShoppingLink to="/menu">
            Continue Shopping
          </ContinueShoppingLink>
        </OrderSummary>
      </CartContainer>
    </>
  );
};