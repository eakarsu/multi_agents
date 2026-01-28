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
import { CheckCircle as CheckIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const enterpriseFeatures = [
  'Anthropic Claude & OpenAI GPT-4 for complex reasoning',
  'Production-ready reliability and support',
  'Enterprise compliance and security'
];

const openSourceFeatures = [
  'Cost-optimized infrastructure',
  'Custom integrations and workflows',
  'Vendor independence and scalability'
];

const Hybrid = () => {
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <Section background="variant" sx={{ py: { xs: 8, md: 12 } }}>
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
          Best of Both Worlds: Hybrid AI Architecture
        </MotionTypography>

        <Grid container spacing={6} alignItems="stretch">
          <Grid item xs={12} md={6}>
            <MotionBox
              variants={itemVariants}
              sx={{
                p: 4,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                height: '100%',
                border: '2px solid',
                borderColor: 'primary.main',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(103, 80, 164, 0.05) 0%, transparent 50%)',
                  zIndex: 0
                }}
              />
              
              <Typography
                variant="h4"
                component="h3"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Enterprise AI Core
              </Typography>

              <List sx={{ position: 'relative', zIndex: 1 }}>
                {enterpriseFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckIcon sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 500,
                          color: 'text.primary'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </MotionBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionBox
              variants={{
                ...itemVariants,
                hidden: { opacity: 0, x: 30 }
              }}
              sx={{
                p: 4,
                backgroundColor: 'background.paper',
                borderRadius: 3,
                height: '100%',
                border: '2px solid',
                borderColor: 'secondary.main',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(98, 91, 113, 0.05) 0%, transparent 50%)',
                  zIndex: 0
                }}
              />

              <Typography
                variant="h4"
                component="h3"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'secondary.main',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                Open-Source Flexibility
              </Typography>

              <List sx={{ position: 'relative', zIndex: 1 }}>
                {openSourceFeatures.map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckIcon sx={{ color: 'secondary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={feature}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 500,
                          color: 'text.primary'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </MotionBox>
          </Grid>
        </Grid>
      </motion.div>
    </Section>
  );
};

export default Hybrid;