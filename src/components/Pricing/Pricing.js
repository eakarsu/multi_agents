import React from 'react';
import {
  Typography,
  Grid,
  Box,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import AnimatedCard from '../common/AnimatedCard';
import GradientButton from '../common/GradientButton';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);

const pricingPlans = [
  {
    title: 'Starter',
    price: '$99',
    period: '/month',
    features: [
      'Pre-configured CRAFT agents',
      'Basic integrations (Email, CRM)',
      'Up to 10,000 agent interactions',
      'Email support'
    ],
    buttonText: 'Get Started',
    popular: false
  },
  {
    title: 'Professional',
    price: '$499',
    period: '/month',
    features: [
      'Custom agent creation',
      'Advanced integrations (20+ tools)',
      'Up to 100,000 interactions',
      'Multi-agent workflows',
      'Priority support'
    ],
    buttonText: 'Start Free Trial',
    popular: true
  },
  {
    title: 'Enterprise',
    price: 'Custom',
    period: 'Pricing',
    features: [
      'Unlimited custom agents',
      'White-label solutions',
      'On-premise deployment',
      'Dedicated success manager',
      'SLA guarantees'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
];

const Pricing = () => {
  const [ref, inView] = useScrollAnimation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
    <Section id="pricing" background="variant" sx={{ py: { xs: 8, md: 12 } }}>
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
          Choose Your CRAFT Agent Plan
        </MotionTypography>

        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan, index) => (
            <Grid item xs={12} md={4} key={plan.title}>
              <AnimatedCard
                delay={index * 0.1}
                sx={{
                  height: '100%',
                  position: 'relative',
                  border: plan.popular ? '2px solid' : '1px solid',
                  borderColor: plan.popular ? 'primary.main' : 'divider',
                  transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                  '&:hover': {
                    transform: plan.popular ? 'scale(1.08) translateY(-4px)' : 'scale(1.02) translateY(-4px)',
                    boxShadow: plan.popular 
                      ? '0 16px 32px rgba(103, 80, 164, 0.3)' 
                      : '0 8px 16px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                {plan.popular && (
                  <Chip
                    label="MOST POPULAR"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                )}

                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      textAlign: 'center',
                      mb: 2
                    }}
                  >
                    {plan.title}
                  </Typography>

                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography
                      variant="h3"
                      component="div"
                      sx={{
                        fontWeight: 700,
                        color: 'primary.main',
                        display: 'inline'
                      }}
                    >
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="span"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {plan.period}
                    </Typography>
                  </Box>

                  <List sx={{ flexGrow: 1, mb: 3 }}>
                    {plan.features.map((feature, featureIndex) => (
                      <ListItem key={featureIndex} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon 
                            sx={{ 
                              color: 'primary.main',
                              fontSize: 20
                            }} 
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '0.875rem',
                              color: 'text.secondary'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <GradientButton
                    fullWidth
                    variant={plan.popular ? 'contained' : 'outlined'}
                    size="large"
                    sx={{ mt: 'auto' }}
                  >
                    {plan.buttonText}
                  </GradientButton>
                </CardContent>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Section>
  );
};

export default Pricing;