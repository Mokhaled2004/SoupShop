import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: #e74c3c;
        color: white;
        border: none;
        &:hover:not(:disabled) {
          background-color: #c0392b;
        }
      `;
    case 'secondary':
      return css`
        background-color: #3498db;
        color: white;
        border: none;
        &:hover:not(:disabled) {
          background-color: #2980b9;
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: #e74c3c;
        border: 1px solid #e74c3c;
        &:hover:not(:disabled) {
          background-color: rgba(231, 76, 60, 0.1);
        }
      `;
    case 'danger':
      return css`
        background-color: #e74c3c;
        color: white;
        border: none;
        &:hover:not(:disabled) {
          background-color: #c0392b;
        }
      `;
    default:
      return '';
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'small':
      return css`
        padding: 8px 16px;
        font-size: 0.875rem;
      `;
    case 'medium':
      return css`
        padding: 12px 20px;
        font-size: 1rem;
      `;
    case 'large':
      return css`
        padding: 16px 24px;
        font-size: 1.125rem;
      `;
    default:
      return '';
  }
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${({ variant = 'primary' }) => getVariantStyles(variant)}
  ${({ size = 'medium' }) => getSizeStyles(size)}
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3);
  }
`;