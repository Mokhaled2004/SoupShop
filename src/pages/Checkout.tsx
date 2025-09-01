import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../components/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 32px;
  text-align: center;
`;

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
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

const OrderItems = styled.div`
  margin-top: 24px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ItemImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.span`
  font-weight: 500;
`;

const ItemQuantity = styled.span`
  font-size: 0.875rem;
  color: #666;
`;

const ItemPrice = styled.span`
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 4px;
`;

const SuccessMessage = styled.div`
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
`;

const PaymentMethodContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PaymentOption = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #e74c3c;
  }
  
  &.selected {
    border-color: #e74c3c;
    background-color: #fff8f8;
  }
`;

const RadioInput = styled.input`
  margin-right: 8px;
`;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: 'credit_card' | 'paypal' | 'cash';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export const Checkout = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [isAuthenticated, cart.length, navigate, orderSuccess]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof FormData]) {
        newErrors[field as keyof FormData] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Zip code validation
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid zip code';
    }
    
    // Credit card validation if payment method is credit card
    if (formData.paymentMethod === 'credit_card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\D/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!formData.cardExpiry) {
        newErrors.cardExpiry = 'Expiration date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Please enter a valid expiration date (MM/YY)';
      }
      
      if (!formData.cardCvv) {
        newErrors.cardCvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cardCvv)) {
        newErrors.cardCvv = 'Please enter a valid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create address object from form data
      const address = {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: 'USA' // Default country
      };
      
      // Create order
      const orderResponse = await orderService.createOrder({
        items: cart.map(item => ({
          soupId: item.soup.id,
          quantity: item.quantity,
          price: item.soup.price
        })),
        address,
        paymentMethod: formData.paymentMethod,
        totalAmount: total
      });
      
      // Handle successful order
      setOrderSuccess(true);
      setOrderId(orderResponse.id);
      clearCart();
      
      // Redirect to order confirmation after a delay
      setTimeout(() => {
        navigate(`/orders/${orderResponse.id}`);
      }, 3000);
    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate subtotal, tax, and shipping
  const subtotal = totalPrice;
  const tax = subtotal * 0.08; // 8% tax rate
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;
  
  if (orderSuccess) {
    return (
      <>
        <PageTitle>Order Confirmation</PageTitle>
        <SuccessMessage>
          <h2>Thank you for your order!</h2>
          <p>Your order #{orderId} has been successfully placed.</p>
          <p>You will be redirected to the order details page shortly.</p>
        </SuccessMessage>
        <Button 
          onClick={() => navigate(`/orders/${orderId}`)}
          size="large"
          style={{ margin: '0 auto', display: 'block' }}
        >
          View Order Details
        </Button>
      </>
    );
  }
  
  return (
    <>
      <PageTitle>Checkout</PageTitle>
      <form onSubmit={handleSubmit}>
        <CheckoutContainer>
          <div>
            <FormSection>
              <SectionTitle>Contact Information</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </FormGroup>
              </FormRow>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Shipping Address</SectionTitle>
              <FormGroup>
                <Label htmlFor="address">Street Address</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
              </FormGroup>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="city">City</Label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="state">State</Label>
                  <Select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  >
                    <option value="">Select State</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </Select>
                  {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                </FormGroup>
              </FormRow>
              <FormGroup>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  maxLength={10}
                />
                {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Payment Method</SectionTitle>
              <PaymentMethodContainer>
                <PaymentOption className={formData.paymentMethod === 'credit_card' ? 'selected' : ''}>
                  <RadioInput
                    type="radio"
                    id="credit_card"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="credit_card" style={{ margin: 0 }}>Credit Card</Label>
                </PaymentOption>
                
                <PaymentOption className={formData.paymentMethod === 'paypal' ? 'selected' : ''}>
                  <RadioInput
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="paypal" style={{ margin: 0 }}>PayPal</Label>
                </PaymentOption>
                
                <PaymentOption className={formData.paymentMethod === 'cash' ? 'selected' : ''}>
                  <RadioInput
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="cash" style={{ margin: 0 }}>Cash on Delivery</Label>
                </PaymentOption>
              </PaymentMethodContainer>
              
              {formData.paymentMethod === 'credit_card' && (
                <div style={{ marginTop: '20px' }}>
                  <FormGroup>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
                  </FormGroup>
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="cardExpiry">Expiration Date</Label>
                      <Input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {errors.cardExpiry && <ErrorMessage>{errors.cardExpiry}</ErrorMessage>}
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        type="text"
                        id="cardCvv"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                      />
                      {errors.cardCvv && <ErrorMessage>{errors.cardCvv}</ErrorMessage>}
                    </FormGroup>
                  </FormRow>
                </div>
              )}
            </FormSection>
          </div>
          
          <div>
            <OrderSummary>
              <SectionTitle>Order Summary</SectionTitle>
              <OrderItems>
                {cart.map(item => (
                  <OrderItem key={item.soup.id}>
                    <ItemInfo>
                      <ItemImage>
                        <img src={item.soup.imageUrl} alt={item.soup.name} />
                      </ItemImage>
                      <ItemDetails>
                        <ItemName>{item.soup.name}</ItemName>
                        <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
                      </ItemDetails>
                    </ItemInfo>
                    <ItemPrice>${(item.soup.price * item.quantity).toFixed(2)}</ItemPrice>
                  </OrderItem>
                ))}
              </OrderItems>
              
              <div style={{ marginTop: '24px' }}>
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
              </div>
              
              <Button 
                type="submit" 
                fullWidth 
                size="large" 
                style={{ marginTop: '24px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </OrderSummary>
          </div>
        </CheckoutContainer>
      </form>
    </>
  );
};