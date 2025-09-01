import { Link } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { SoupCard } from "../components/SoupCard";
import { useSoups } from "../hooks/useSoups";
import { Layout } from "../components/Layout";

// Import SVG icons
import freshIngredientsIcon from "../assets/icons/fresh-ingredients.svg";
import fastDeliveryIcon from "../assets/icons/fast-delivery.svg";
import ecoFriendlyIcon from "../assets/icons/eco-friendly.svg";

const HeroSection = styled.section`
  background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
    url("https://images.unsplash.com/photo-1613844237701-8f3664fc2eff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80");
  background-size: cover;
  background-position: center;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin: -24px -16px 64px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  padding: 0 24px;
  position: relative;
  z-index: 2;
  animation: fadeIn 1.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.5px;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.35rem;
  margin-bottom: 40px;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 32px;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
  position: relative;
  padding-bottom: 16px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: var(--primary-color, #e74c3c);
    border-radius: 4px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 40px;
  color: #666;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 32px;
  }
`;

const SoupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 64px;

  /* Ensure all items in a row have the same height */
  & > * {
    height: 100%;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 24px;
  }
`;

const ViewAllLink = styled(Link)`
  display: inline-block;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 64px;
  text-decoration: none;
  color: var(--primary-color, #e74c3c);
  font-weight: 600;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(231, 76, 60, 0.1);
    transform: translateY(-2px);
  }

  &::after {
    content: " →";
    opacity: 0;
    transform: translateX(-8px);
    display: inline-block;
    transition: all 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
    transform: translateX(0);
  }
`;

const FeaturesSection = styled.section`
  padding: 64px 24px;
  background-color: #f9f9f9;
  margin: 0 -16px 64px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(
      90deg,
      var(--primary-color, #e74c3c),
      var(--secondary-color, #3498db)
    );
  }
`;

const FeatureContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 40px 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
`;

const FeatureIcon = styled.div`
  margin-bottom: 24px;
  transition: transform 0.3s ease;

  img {
    width: 80px;
    height: 80px;
  }

  ${FeatureCard}:hover & {
    transform: scale(1.1);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #333;
`;

const FeatureText = styled.p`
  color: #666;
  line-height: 1.7;
  font-size: 1.05rem;
`;

const CTASection = styled.section`
  background: linear-gradient(
    135deg,
    var(--primary-color, #e74c3c) 0%,
    #c0392b 100%
  );
  color: white;
  padding: 80px 32px;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 64px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("https://images.unsplash.com/photo-1605152276897-4f618f831968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80")
      center/cover no-repeat;
    opacity: 0.1;
    z-index: 1;
  }

  & > * {
    position: relative;
    z-index: 2;
  }
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTAText = styled.p`
  font-size: 1.25rem;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 40px 0;
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color, #e74c3c);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 32px;
  background-color: #ffebee;
  border-radius: 8px;
  color: #c62828;
  margin: 32px auto;
  max-width: 800px;
`;

export const Home = () => {
  const { useTopRatedSoups } = useSoups();
  const { data: topSoups = [], isLoading, error } = useTopRatedSoups(4);

  return (
    <Layout>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Delicious Soups Delivered to Your Door</HeroTitle>
          <HeroSubtitle>
            Handcrafted with love using the finest ingredients. Experience the
            comfort of homemade soup without the hassle. Our chefs prepare each
            soup with care to ensure maximum flavor and nutrition.
          </HeroSubtitle>
          <Button as={Link} to="/menu" size="large">
            View Our Menu
          </Button>
        </HeroContent>
      </HeroSection>

      <section>
        <SectionTitle>Featured Selections</SectionTitle>
        <SectionSubtitle>
          Our chef's handpicked favorites this season. Try these exceptional
          soups that our customers love.
        </SectionSubtitle>

        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <div>Loading featured soups...</div>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <h3>Error loading soups</h3>
            <p>{error.message}</p>
          </ErrorContainer>
        ) : (
          <>
            <SoupGrid>
              {topSoups.map((soup) => (
                <SoupCard key={soup.id} soup={soup} />
              ))}
            </SoupGrid>
            <div style={{ textAlign: "center" }}>
              <ViewAllLink to="/menu">Explore Our Full Menu</ViewAllLink>
            </div>
          </>
        )}
      </section>

      <FeaturesSection>
        <SectionTitle>Why Choose Our Soups?</SectionTitle>
        <SectionSubtitle>
          We take pride in creating the best soup experience for our customers.
          Here's what sets us apart from the rest.
        </SectionSubtitle>

        <FeatureContainer>
          <FeatureCard>
            <FeatureIcon>
              <img src={freshIngredientsIcon} alt="Fresh Ingredients Icon" />
            </FeatureIcon>
            <FeatureTitle>Fresh Ingredients</FeatureTitle>
            <FeatureText>
              We source only the freshest, highest-quality ingredients for our
              soups, ensuring maximum flavor and nutrition in every spoonful.
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <img src={fastDeliveryIcon} alt="Fast Delivery Icon" />
            </FeatureIcon>
            <FeatureTitle>Fast Delivery</FeatureTitle>
            <FeatureText>
              Our efficient delivery system ensures your soups arrive hot and
              fresh, right when you need them. Enjoy gourmet soup without
              leaving home.
            </FeatureText>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <img src={ecoFriendlyIcon} alt="Eco-Friendly Packaging Icon" />
            </FeatureIcon>
            <FeatureTitle>Eco-Friendly Packaging</FeatureTitle>
            <FeatureText>
              All our soups come in sustainable, biodegradable packaging to
              minimize environmental impact. Delicious soup with a clean
              conscience.
            </FeatureText>
          </FeatureCard>
        </FeatureContainer>
      </FeaturesSection>

      <CTASection>
        <CTATitle>Join Our Soup Club</CTATitle>
        <CTAText>
          Subscribe to our monthly soup delivery service and get exclusive
          flavors, discounts, and free delivery on all orders. Perfect for busy
          professionals and soup lovers alike!
        </CTAText>
        <ButtonContainer>
          <Button as={Link} to="/menu" variant="secondary" size="large">
            Order Now
          </Button>
          <Button
            as={Link}
            to="/subscribe"
            variant="outline"
            size="large"
            style={{ color: "white", borderColor: "white" }}
          >
            Join Soup Club
          </Button>
        </ButtonContainer>
      </CTASection>
    </Layout>
  );
};
