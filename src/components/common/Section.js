import React from 'react';
import { Box, Container } from '@mui/material';

const Section = ({ 
  children, 
  sx = {}, 
  containerSx = {},
  background = 'default',
  id,
  ...props 
}) => {
  const backgroundColors = {
    default: 'background.default',
    paper: 'background.paper',
    primary: 'primary.light',
    secondary: 'secondary.light',
    variant: '#E7E0EC'
  };

  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: backgroundColors[background] || background,
        ...sx
      }}
      {...props}
    >
      <Container maxWidth="lg" sx={containerSx}>
        {children}
      </Container>
    </Box>
  );
};

export default Section;