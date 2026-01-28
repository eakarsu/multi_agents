import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);

const GradientButton = ({ 
  children, 
  variant = 'contained',
  size = 'large',
  sx = {},
  ...props 
}) => {
  const gradientStyles = {
    background: variant === 'contained' 
      ? 'linear-gradient(135deg, #6750A4 0%, #7D5260 100%)'
      : 'transparent',
    border: variant === 'outlined' 
      ? '2px solid #6750A4' 
      : 'none',
    color: variant === 'contained' ? 'white' : '#6750A4',
    '&:hover': {
      background: variant === 'contained'
        ? 'linear-gradient(135deg, #4F378B 0%, #633B48 100%)'
        : 'rgba(103, 80, 164, 0.1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 16px rgba(103, 80, 164, 0.3)',
    },
    transition: 'all 0.3s ease',
    ...sx
  };

  const buttonVariants = {
    tap: { scale: 0.95 },
    hover: { scale: 1.02 }
  };

  return (
    <MotionButton
      variant={variant}
      size={size}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      sx={gradientStyles}
      {...props}
    >
      {children}
    </MotionButton>
  );
};

export default GradientButton;