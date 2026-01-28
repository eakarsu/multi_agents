import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Alert
} from '@mui/material';
import { Send as SendIcon, Person as PersonIcon, SupportAgent as SupportIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AgentAPI, { demoResponses } from '../../utils/agentApi';

const CustomerSupportDemo = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  const agentAPI = new AgentAPI();

  const quickQuestions = [
    'I have a billing issue with my account',
    'How do I set up my first AI agent?',
    'My integration with Slack is not working',
    'What is included in the Professional plan?'
  ];

  const handleQuickQuestion = (question) => {
    setQuery(question);
    handleSubmit(null, question);
  };

  const handleSubmit = async (e, quickQuestion = null) => {
    if (e) e.preventDefault();
    
    const currentQuery = quickQuestion || query;
    if (!currentQuery.trim()) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      content: currentQuery,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, newMessage]);
    setQuery('');
    setLoading(true);

    try {
      let response;
      
      if (demoMode) {
        // Enhanced demo mode with real API calls for realistic responses
        try {
          const demoCustomerContext = {
            plan: 'Professional',
            accountAge: '3 months',
            previousTickets: 2,
            integrations: ['Slack', 'Salesforce'],
            isDemo: true
          };
          
          response = await agentAPI.customerSupportAgent(currentQuery, demoCustomerContext);
        } catch (apiError) {
          console.log('API unavailable, using fallback responses');
          // Fallback to static responses if API fails
          if (currentQuery.toLowerCase().includes('billing')) {
            response = demoResponses.customerSupport['billing issue'];
          } else if (currentQuery.toLowerCase().includes('setup') || currentQuery.toLowerCase().includes('first')) {
            response = demoResponses.customerSupport['setup help'];
          } else {
            response = demoResponses.customerSupport['default'];
          }
        }
      } else {
        // Live API mode
        const customerContext = {
          plan: 'Professional',
          accountAge: '3 months',
          previousTickets: 2,
          integrations: ['Slack', 'Salesforce']
        };
        
        response = await agentAPI.customerSupportAgent(currentQuery, customerContext);
      }

      const agentMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: response,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Customer Support Demo Error:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'agent',
        content: 'I apologize for the technical difficulty. Our support team will be with you shortly. In the meantime, you can reach us at support@craftagentpro.com or call 1-800-CRAFT-AI.',
        timestamp: new Date(),
        isError: true
      };

      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Demo Mode Toggle */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Customer Support Agent Demo
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip 
            label={demoMode ? 'Demo Mode (AI Powered)' : 'Live API'} 
            color={demoMode ? 'secondary' : 'success'}
            size="small"
            onClick={() => setDemoMode(!demoMode)}
            sx={{ cursor: 'pointer' }}
          />
          <Button size="small" onClick={clearConversation} disabled={conversation.length === 0}>
            Clear
          </Button>
        </Box>
      </Box>

      {/* API Key Notice */}
      {!demoMode && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Live API Mode: Using your Anthropic API key for real-time responses
        </Alert>
      )}
      
      {demoMode && (
        <Alert severity="success" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Demo Mode: Powered by real Anthropic AI with demo-optimized responses
        </Alert>
      )}

      {/* Quick Questions */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Try these common questions:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickQuestions.map((question, index) => (
            <Chip
              key={index}
              label={question}
              variant="outlined"
              size="small"
              onClick={() => handleQuickQuestion(question)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'primary.light' }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Conversation Area */}
      <Paper 
        elevation={1} 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          mb: 2, 
          maxHeight: 400, 
          overflow: 'auto',
          backgroundColor: '#fafafa'
        }}
      >
        {conversation.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <SupportIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body2">
              Start a conversation with our AI Customer Support Agent
            </Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {conversation.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    mb: 2,
                    flexDirection: message.type === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: message.type === 'user' ? 'primary.main' : 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 1
                    }}
                  >
                    {message.type === 'user' ? (
                      <PersonIcon sx={{ color: 'white', fontSize: 18 }} />
                    ) : (
                      <SupportIcon sx={{ color: 'white', fontSize: 18 }} />
                    )}
                  </Box>
                  
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      backgroundColor: message.type === 'user' 
                        ? 'primary.main' 
                        : message.isError 
                        ? 'error.light' 
                        : 'background.paper',
                      color: message.type === 'user' ? 'white' : 'text.primary'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        whiteSpace: 'pre-line',
                        lineHeight: 1.4
                      }}
                    >
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 1, 
                        opacity: 0.7,
                        fontSize: '0.75rem'
                      }}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 2 }}>
            <Box
              sx={{
                minWidth: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 1
              }}
            >
              <SupportIcon sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Paper elevation={1} sx={{ p: 2, backgroundColor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Agent is typing...
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Input Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your question here..."
          disabled={loading}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !query.trim()}
          endIcon={<SendIcon />}
          sx={{ minWidth: 100 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default CustomerSupportDemo;