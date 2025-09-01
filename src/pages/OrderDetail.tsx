import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { useOrders } from '../hooks/useOrders';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

const OrderCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 32px;
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

const OrderSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OrderItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  
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

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  
  .label {
    font-weight: 500;
    color: #666;
  }
  
  .value {
    font-weight: 500;
  }
`;

const Address = styled.div`
  p {
    margin: 4px 0;
  }
`;

const OrderSummary = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
`;

const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  
  .label {
    color: #666;
  }
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
`;

const OrderActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 48px 0;
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

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || '0');
  const navigate = useNavigate();
  
  const { data: order, isLoading, error, cancelOrder } = useOrders(orderId);
  const [isCancelling, setIsCancelling] = useState(false);
  
  const handleCancelOrder = async () => {
    if (!order || order.status !== 'processing') return;
    
    setIsCancelling(true);
    try {
      await cancelOrder(order.id);
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setIsCancelling(false);
    }
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <PageTitle>Order Details</PageTitle>
        <p>Loading order details...</p>
      </PageContainer>
    );
  }
  
  if (error || !order) {
    return (
      <PageContainer>
        <PageTitle>Order Details</PageTitle>
        <ErrorContainer>
          <h2>Order not found</h2>
          <p>We couldn't find the order you're looking for.</p>
          <Button 
            as={Link} 
            to="/orders" 
            size="large" 
            style={{ marginTop: '24px' }}
          >
            Back to Orders
          </Button>
        </ErrorContainer>
      </PageContainer>
    );
  }
  
  // Calculate subtotal
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Estimate tax and shipping based on total
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99;
  
  return (
    <PageContainer>
      <PageTitle>Order Details</PageTitle>
      
      <OrderCard>
        <OrderHeader>
          <OrderId>Order #{order.id}</OrderId>
          <OrderDate>{formatDate(order.createdAt)}</OrderDate>
          <OrderStatus status={order.status}>
            {order.status}
          </OrderStatus>
        </OrderHeader>
        
        <OrderContent>
          <OrderSection>
            <SectionTitle>Items</SectionTitle>
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
          </OrderSection>
          
          <OrderSection>
            <SectionTitle>Order Information</SectionTitle>
            <InfoGrid>
              <InfoCard>
                <h4>Shipping Address</h4>
                <Address>
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipCode}</p>
                  <p>{order.address.country}</p>
                </Address>
              </InfoCard>
              
              <InfoCard>
                <h4>Order Details</h4>
                <InfoList>
                  <InfoItem>
                    <span className="label">Order Date</span>
                    <span className="value">{formatDate(order.createdAt)}</span>
                  </InfoItem>
                  <InfoItem>
                    <span className="label">Order Status</span>
                    <span className="value">{order.status}</span>
                  </InfoItem>
                  <InfoItem>
                    <span className="label">Payment Method</span>
                    <span className="value">{formatPaymentMethod(order.paymentMethod)}</span>
                  </InfoItem>
                </InfoList>
              </InfoCard>
            </InfoGrid>
          </OrderSection>
          
          <OrderSection>
            <SectionTitle>Order Summary</SectionTitle>
            <OrderSummary>
              <SummaryList>
                <SummaryItem>
                  <span className="label">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </SummaryItem>
                <SummaryItem>
                  <span className="label">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </SummaryItem>
                <SummaryItem>
                  <span className="label">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </SummaryItem>
                <SummaryTotal>
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </SummaryTotal>
              </SummaryList>
            </OrderSummary>
          </OrderSection>
          
          <OrderActions>
            <Button 
              as={Link} 
              to="/orders" 
              variant="outline"
            >
              Back to Orders
            </Button>
            
            {order.status === 'processing' && (
              <Button 
                variant="danger" 
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </Button>
            )}
          </OrderActions>
        </OrderContent>
      </OrderCard>
    </PageContainer>
  );
};