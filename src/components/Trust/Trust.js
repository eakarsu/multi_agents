import React from 'react';
import {
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Security as SecurityIcon,
  BusinessCenter as BusinessIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const trustCategories = [
  {
    icon: SecurityIcon,
    title: 'Security & Compliance',
    items: [
      'SOC 2 Type II Certified',
      'GDPR Compliant',
      'Enterprise-grade encryption'
    ],
    color: '#6750A4'
  },
  {
    icon: BusinessIcon,
    title: 'Technology Partners',
    items: [
      'Official Anthropic Partner',
      'OpenAI API Integration',
      'AWS Infrastructure'
    ],
    color: '#625B71'
  },
  {
    icon: GroupIcon,
    title: 'Early Adopters',
    items: [
      '500+ Enterprise Customers',
      '99.9% Uptime SLA',
      '24/7 Expert Support'
    ],
    color: '#7D5260'
  }
];

const Trust = () => {
  const [ref, inView] = useScrollAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <Section id="about" sx={{ py: { xs: 8, md: 12 } }}>
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <MotionTypography
          variant="h2"
          component="h2"
          align="center"
          gutterBottom
          variants={itemVariants}
          sx={{
            mb: 6,
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          Built by AI Experts, Trusted by Enterprises
        </MotionTypography>

        <Grid container spacing={4}>
          {trustCategories.map((category, _index) => {
            const IconComponent = category.icon;
            
            return (
              <Grid item xs={12} md={4} key={category.title}>
                <MotionBox
                  variants={itemVariants}
                  sx={{
                    p: 4,
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    height: '100%',
                    border: '2px solid',
                    borderColor: category.color,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 16px ${category.color}30`
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${category.color}10 0%, transparent 50%)`,
                      zIndex: 0
                    }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 3,
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: `${category.color}20`,
                        mr: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <IconComponent
                        sx={{
                          fontSize: 32,
                          color: category.color
                        }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color: category.color
                      }}
                    >
                      {category.title}
                    </Typography>
                  </Box>

                  <List sx={{ position: 'relative', zIndex: 1 }}>
                    {category.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              backgroundColor: category.color,
                              borderRadius: '50%'
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontWeight: 500,
                              color: 'text.secondary',
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </MotionBox>
              </Grid>
            );
          })}
        </Grid>
      </motion.div>
    </Section>
  );
};

export default Trust;