import React from 'react';
import {
  Typography,
  Grid,
  Box,
  CardContent,
  Chip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Code as CodeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Section from '../common/Section';
import AnimatedCard from '../common/AnimatedCard';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const craftAgents = [
  {
    icon: ChatIcon,
    title: 'Communication Agents',
    description: 'Handle customer support, email management, social media interactions with human-like responses',
    example: 'Reduce support costs by 80% like Parloa',
    color: '#6750A4'
  },
  {
    icon: SearchIcon,
    title: 'Research Agents',
    description: 'Conduct market research, competitive analysis, data gathering with enterprise accuracy',
    example: 'Legal research automation like Harvey AI',
    color: '#625B71'
  },
  {
    icon: AnalyticsIcon,
    title: 'Analytics Agents',
    description: 'Pattern recognition, predictive modeling, performance insights for data-driven decisions',
    example: 'Personalized recommendations like Starbucks',
    color: '#7D5260'
  },
  {
    icon: SettingsIcon,
    title: 'Functional Agents',
    description: 'Workflow automation, approvals, transaction processing with enterprise reliability',
    example: '80% faster loan approvals',
    color: '#6750A4'
  },
  {
    icon: CodeIcon,
    title: 'Technical Agents',
    description: 'Software development, infrastructure management, debugging with autonomous capabilities',
    example: 'Autonomous coding and deployment',
    color: '#625B71'
  }
];

const customAgentTypes = [
  'Marketing Agents',
  'Sales Agents', 
  'HR Agents',
  'Finance Agents',
  'Legal Agents',
  'Healthcare Agents',
  'Education Agents',
  'Gaming Agents',
  'Creative Agents',
  'Your Custom Agent'
];

const CraftAgents = () => {
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
    <Section id="features" sx={{ py: { xs: 8, md: 12 } }}>
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
            mb: 3,
            color: 'text.primary',
            fontWeight: 600
          }}
        >
          The CRAFT Framework: 5 Core Agent Types + Unlimited Custom Agents
        </MotionTypography>

        <MotionTypography
          variant="subtitle1"
          align="center"
          variants={itemVariants}
          sx={{
            mb: 6,
            color: 'text.secondary',
            maxWidth: 800,
            mx: 'auto',
            lineHeight: 1.6
          }}
        >
          Start with our proven CRAFT framework, then create any custom agent type your business needs. 
          Marketing agents, Sales agents, HR agents, Finance agents, Legal agents - the possibilities are limitless.
        </MotionTypography>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {craftAgents.map((agent, index) => {
            const IconComponent = agent.icon;
            
            return (
              <Grid item xs={12} md={6} lg={4} key={agent.title}>
                <AnimatedCard
                  delay={index * 0.1}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: agent.color,
                      boxShadow: `0 8px 16px ${agent.color}30`
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          backgroundColor: `${agent.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <IconComponent
                          sx={{
                            fontSize: 40,
                            color: agent.color
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        textAlign: 'center',
                        mb: 2
                      }}
                    >
                      {agent.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        flexGrow: 1,
                        lineHeight: 1.6
                      }}
                    >
                      {agent.description}
                    </Typography>

                    <Box
                      sx={{
                        backgroundColor: 'primary.light',
                        p: 2,
                        borderRadius: 2,
                        mt: 'auto'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'text.primary'
                        }}
                      >
                        <strong>Success Story:</strong> {agent.example}
                      </Typography>
                    </Box>
                  </CardContent>
                </AnimatedCard>
              </Grid>
            );
          })}
        </Grid>

        {/* Custom Agents Section */}
        <MotionBox
          variants={itemVariants}
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: 'primary.light',
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h4"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 2
            }}
          >
            Create Any Agent Type You Need
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              mb: 4,
              color: 'text.secondary'
            }}
          >
            Beyond CRAFT, build specialized agents for any industry or use case
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: 'center',
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            {customAgentTypes.map((agentType, index) => (
              <motion.div
                key={agentType}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              >
                <Chip
                  label={agentType}
                  sx={{
                    backgroundColor: agentType === 'Your Custom Agent' 
                      ? 'linear-gradient(135deg, #6750A4, #7D5260)'
                      : 'background.paper',
                    color: agentType === 'Your Custom Agent' 
                      ? 'white' 
                      : 'primary.main',
                    border: agentType === 'Your Custom Agent' 
                      ? 'none'
                      : '2px solid',
                    borderColor: 'primary.main',
                    fontWeight: agentType === 'Your Custom Agent' ? 600 : 500,
                    fontSize: '0.875rem',
                    height: 40,
                    '&:hover': {
                      backgroundColor: agentType === 'Your Custom Agent' 
                        ? 'linear-gradient(135deg, #4F378B, #633B48)'
                        : 'primary.main',
                      color: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(103, 80, 164, 0.3)'
                    },
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </MotionBox>
      </motion.div>
    </Section>
  );
};

export default CraftAgents;