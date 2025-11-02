import styled, { css } from 'styled-components';
import { DesignTheme } from './theme';

interface StyledProps {
  theme: DesignTheme;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = styled.button<StyledProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  font-family: ${props => props.theme.typography.fontFamily};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.lg};
  transition: ${props => props.theme.transitions.fast};
  cursor: pointer;
  border: 1px solid transparent;
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${props.theme.spacing.sm} ${props.theme.spacing.md};
          font-size: ${props.theme.typography.fontSize.sm};
        `;
      case 'lg':
        return css`
          padding: ${props.theme.spacing.lg} ${props.theme.spacing.xl};
          font-size: ${props.theme.typography.fontSize.lg};
        `;
      default:
        return css`
          padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
          font-size: ${props.theme.typography.fontSize.base};
        `;
    }
  }}
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background-color: ${props.theme.colors.primary};
          color: white;
          &:hover {
            opacity: 0.9;
          }
        `;
      case 'secondary':
        return css`
          background-color: ${props.theme.colors.secondary};
          color: white;
          &:hover {
            opacity: 0.9;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.primary};
          border-color: ${props.theme.colors.primary};
          &:hover {
            background-color: ${props.theme.colors.primary};
            color: white;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.text};
          &:hover {
            background-color: ${props.theme.colors.surface};
          }
        `;
      default:
        return css`
          background-color: ${props.theme.colors.surface};
          color: ${props.theme.colors.text};
          border-color: ${props.theme.colors.border};
          &:hover {
            background-color: ${props.theme.colors.background};
          }
        `;
    }
  }}
`;

export const Card = styled.div<{ theme: DesignTheme }>`
  background-color: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: ${props => props.theme.transitions.normal};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

export const Text = styled.p<{ 
  theme: DesignTheme; 
  variant?: 'body' | 'caption' | 'subtitle';
  color?: 'primary' | 'secondary' | 'muted';
}>`
  font-family: ${props => props.theme.typography.fontFamily};
  line-height: ${props => props.theme.typography.lineHeight.normal};
  margin: 0;
  
  ${props => {
    switch (props.variant) {
      case 'caption':
        return css`
          font-size: ${props.theme.typography.fontSize.sm};
          font-weight: ${props.theme.typography.fontWeight.normal};
        `;
      case 'subtitle':
        return css`
          font-size: ${props.theme.typography.fontSize.lg};
          font-weight: ${props.theme.typography.fontWeight.medium};
        `;
      default:
        return css`
          font-size: ${props.theme.typography.fontSize.base};
          font-weight: ${props.theme.typography.fontWeight.normal};
        `;
    }
  }}
  
  ${props => {
    switch (props.color) {
      case 'primary':
        return css`color: ${props.theme.colors.primary};`;
      case 'secondary':
        return css`color: ${props.theme.colors.textSecondary};`;
      case 'muted':
        return css`color: ${props.theme.colors.textSecondary};`;
      default:
        return css`color: ${props.theme.colors.text};`;
    }
  }}
`;

export const Heading = styled.h1<{ 
  theme: DesignTheme; 
  level?: 1 | 2 | 3 | 4;
}>`
  font-family: ${props => props.theme.typography.fontFamily};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  line-height: ${props => props.theme.typography.lineHeight.tight};
  color: ${props => props.theme.colors.text};
  margin: 0;
  
  ${props => {
    switch (props.level) {
      case 1:
        return css`font-size: ${props.theme.typography.fontSize['3xl']};`;
      case 2:
        return css`font-size: ${props.theme.typography.fontSize['2xl']};`;
      case 3:
        return css`font-size: ${props.theme.typography.fontSize.xl};`;
      case 4:
        return css`font-size: ${props.theme.typography.fontSize.lg};`;
      default:
        return css`font-size: ${props.theme.typography.fontSize['2xl']};`;
    }
  }}
`;

export const Input = styled.input<{ theme: DesignTheme; error?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-family: ${props => props.theme.typography.fontFamily};
  font-size: ${props => props.theme.typography.fontSize.base};
  border: 1px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  transition: ${props => props.theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

export const Container = styled.div<{ theme: DesignTheme; maxWidth?: string }>`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.lg};
`;

export const Stack = styled.div<{ 
  theme: DesignTheme; 
  direction?: 'row' | 'column';
  gap?: keyof DesignTheme['spacing'];
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'column'};
  gap: ${props => props.theme.spacing[props.gap || 'md']};
  align-items: ${props => {
    switch (props.align) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'center': return 'center';
      default: return 'stretch';
    }
  }};
  justify-content: ${props => {
    switch (props.justify) {
      case 'start': return 'flex-start';
      case 'end': return 'flex-end';
      case 'center': return 'center';
      case 'between': return 'space-between';
      default: return 'flex-start';
    }
  }};
`;