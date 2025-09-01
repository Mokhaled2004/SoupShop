import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 48px 0;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const OrderCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OrderId = styled.div`
  font-weight: 600;
`;

const OrderDate = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const OrderStatus = styled.div<{ status: 'processing' | 'completed' | 'cancelled' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${({ status }) => {
    switch (status) {
      case 'processing':
        return 'background-color: #e3f2fd; color: #1976d2;';
      case 'completed':
        return 'background-color: #e8f5e9; color: #43a047;';
      case 'cancelled':
        return 'background-color: #ffebee; color: #e53935;';
      default:
        return '';
    }
  }}
`;

const OrderContent = styled.div`
  padding: 24px;
`;

const OrderItems = styled.div`
  margin-bottom: 24px;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 576px) {
    width: 60px;
    height: 60px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const ItemQuantity = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const ItemPrice = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
  
  @media (max-width: 576px) {
    grid-column: 2;
    justify-content: flex-end;
  }
`;

const OrderSummary = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

const OrderAddress = styled.div`
  font-size: 0.875rem;
  color: #666;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  p {
    margin: 4px 0;
  }
`;

const OrderTotal = styled.div`
  text-align: right;
  
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  
  .total-amount {
    font-size: 1.25rem;
    font-weight: 600;
    color: #e74c3c;
  }
  
  .payment-method {
    font-size: 0.875rem;
    color: #666;
    margin-top: 4px;
  }
`;

const OrderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatPaymentMethod = (method: string) => {
  switch (method) {
    case 'credit_card':
      return 'Credit Card';
    case 'paypal':
      return 'PayPal';
    case 'cash':
      return 'Cash on Delivery';
    default:
      return method;
  }
};

export const Orders = () => {
  const { isAuthenticated } = useAuth();
  const { data: orders, isLoading, error, cancelOrder } = useOrders();
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);
  
  const handleCancelOrder = async (orderId: number) => {
    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setCancellingOrderId(null);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <>
        <PageTitle>My Orders</PageTitle>
        <EmptyOrders>
          <h2>Please log in to view your orders</h2>
          <Button as={Link} to="/login" size="large" style={{ marginTop: '24px' }}>
            Login
          </Button>
        </EmptyOrders>
      </>
    );
  }
  
  if (isLoading) {
    return (
      <>
        <PageTitle>My Orders</PageTitle>
        <OrdersContainer>
          <p>Loading your orders...</p>
        </OrdersContainer>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <PageTitle>My Orders</PageTitle>
        <OrdersContainer>
          <p>Error loading orders. Please try again later.</p>
        </OrdersContainer>
      </>
    );
  }
  
  if (!orders || orders.length === 0) {
    return (
      <>
        <PageTitle>My Orders</PageTitle>
        <EmptyOrders>
          <h2>You haven't placed any orders yet</h2>
          <p>Browse our menu and place your first order!</p>
          <Button as={Link} to="/menu" size="large" style={{ marginTop: '24px' }}>
            Browse Menu
          </Button>
        </EmptyOrders>
      </>
    );
  }
  
  return (
    <>
      <PageTitle>My Orders</PageTitle>
      <OrdersContainer>
        <OrdersList>
          {orders.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderId>Order #{order.id}</OrderId>
                <OrderDate>{formatDate(order.createdAt)}</OrderDate>
                <OrderStatus status={order.status}>
                  {order.status}
                </OrderStatus>
              </OrderHeader>
              
              <OrderContent>
                <OrderItems>
                  {order.items.map((item) => (
                    <OrderItem key={item.id}>
                      <ItemImage>
                        <img src={item.soup.imageUrl} alt={item.soup.name} />
                      </ItemImage>
                      
                      <ItemInfo>
                        <ItemName>{item.soup.name}</ItemName>
                        <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
                      </ItemInfo>
                      
                      <ItemPrice>
                        ${(item.price * item.quantity).toFixed(2)}
                      </ItemPrice>
                    </OrderItem>
                  ))}
                </OrderItems>
                
                <OrderSummary>
                  <OrderAddress>
                    <h4>Shipping Address</h4>
                    <p>{order.address.street}</p>
                    <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                    <p>{order.address.country}</p>
                  </OrderAddress>
                  
                  <OrderTotal>
                    <h4>Order Summary</h4>
                    <div className="total-amount">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                    <div className="payment-method">
                      {formatPaymentMethod(order.paymentMethod)}
                    </div>
                  </OrderTotal>
                </OrderSummary>
                
                {order.status === 'processing' && (
                  <OrderActions>
                    <Button 
                      variant="outline" 
                      onClick={() => handleCancelOrder(order.id)}
                      disabled={cancellingOrderId === order.id}
                    >
                      {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                  </OrderActions>
                )}
              </OrderContent>
            </OrderCard>
          ))}
        </OrdersList>
      </OrdersContainer>
    </>
  );
};