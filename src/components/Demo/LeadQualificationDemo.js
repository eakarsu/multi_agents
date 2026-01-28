import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Chip,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Assessment as AssessmentIcon, TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AgentAPI, { demoResponses } from '../../utils/agentApi';

const LeadQualificationDemo = () => {
  const [leadData, setLeadData] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    revenue: '',
    contactRole: '',
    painPoints: '',
    budget: '',
    timeline: ''
  });
  const [qualification, setQualification] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);

  const agentAPI = new AgentAPI();

  const industries = [
    'Financial Services', 'Healthcare', 'Retail', 'Manufacturing', 
    'Technology', 'Insurance', 'Real Estate', 'Education', 'Legal'
  ];

  const companySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-1000 employees', '1000-5000 employees', '5000+ employees'
  ];

  const budgetRanges = [
    'Under $10K', '$10K-$50K', '$50K-$100K', 
    '$100K-$500K', '$500K-$1M', '$1M+'
  ];

  const timelines = [
    'Immediate (0-1 month)', 'Short-term (1-3 months)', 
    'Medium-term (3-6 months)', 'Long-term (6-12 months)', 
    'Exploring (12+ months)'
  ];

  const sampleLeads = [
    {
      companyName: 'TechCorp Financial',
      industry: 'Financial Services',
      companySize: '1000-5000 employees',
      revenue: '$400M',
      contactRole: 'CFO',
      painPoints: 'Manual loan processing taking 14 days, need automation',
      budget: '$500K-$1M',
      timeline: 'Immediate (0-1 month)'
    },
    {
      companyName: 'HealthPlus Systems',
      industry: 'Healthcare',
      companySize: '201-1000 employees',
      revenue: '$50M',
      contactRole: 'Operations Manager',
      painPoints: 'Patient data entry consuming 40% of staff time',
      budget: '$50K-$100K',
      timeline: 'Short-term (1-3 months)'
    },
    {
      companyName: 'StartupCo',
      industry: 'Technology',
      companySize: '11-50 employees',
      revenue: '$2M',
      contactRole: 'Founder',
      painPoints: 'Need to scale customer support without hiring',
      budget: '$10K-$50K',
      timeline: 'Medium-term (3-6 months)'
    }
  ];

  const handleSampleLead = (sample) => {
    setLeadData(sample);
    qualifyLead(sample);
  };

  const qualifyLead = async (data = leadData) => {
    setLoading(true);
    setQualification('');

    try {
      let result;
      
      if (demoMode) {
        // Demo mode with realistic responses
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (data.budget?.includes('$500K') || data.companySize?.includes('1000+')) {
          result = demoResponses.leadQualification['enterprise'];
        } else {
          result = demoResponses.leadQualification['default'];
        }
      } else {
        // Real Agent API call
        result = await agentAPI.leadQualificationAgent(data);
      }

      setQualification(result);
    } catch (error) {
      console.error('Lead Qualification Demo Error:', error);
      setQualification('Error processing lead qualification. Please check your API configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    qualifyLead();
  };

  const handleInputChange = (field, value) => {
    setLeadData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          Lead Qualification Agent Demo
        </Typography>
        <Chip 
          label={demoMode ? 'Demo Mode' : 'Live API'} 
          color={demoMode ? 'default' : 'success'}
          size="small"
          onClick={() => setDemoMode(!demoMode)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {/* API Key Notice */}
      {!demoMode && (
        <Alert severity="info" sx={{ mb: 2, fontSize: '0.875rem' }}>
          To use live API, set REACT_APP_ANTHROPIC_API_KEY in your .env file
        </Alert>
      )}

      {/* Sample Leads */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Try these sample leads:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sampleLeads.map((lead, index) => (
            <Chip
              key={index}
              label={`${lead.companyName} (${lead.industry})`}
              variant="outlined"
              size="small"
              onClick={() => handleSampleLead(lead)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'primary.light' }
              }}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Lead Input Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
              Lead Information
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Company Name"
                    value={leadData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Industry</InputLabel>
                    <Select
                      value={leadData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      label="Industry"
                    >
                      {industries.map((industry) => (
                        <MenuItem key={industry} value={industry}>
                          {industry}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Company Size</InputLabel>
                    <Select
                      value={leadData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      label="Company Size"
                    >
                      {companySizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Annual Revenue"
                    value={leadData.revenue}
                    onChange={(e) => handleInputChange('revenue', e.target.value)}
                    placeholder="e.g., $50M"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Contact Role"
                    value={leadData.contactRole}
                    onChange={(e) => handleInputChange('contactRole', e.target.value)}
                    placeholder="e.g., CTO, Operations Manager"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Pain Points"
                    value={leadData.painPoints}
                    onChange={(e) => handleInputChange('painPoints', e.target.value)}
                    multiline
                    rows={3}
                    placeholder="Describe their main challenges..."
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Budget Range</InputLabel>
                    <Select
                      value={leadData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      label="Budget Range"
                    >
                      {budgetRanges.map((budget) => (
                        <MenuItem key={budget} value={budget}>
                          {budget}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Timeline</InputLabel>
                    <Select
                      value={leadData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      label="Timeline"
                    >
                      {timelines.map((timeline) => (
                        <MenuItem key={timeline} value={timeline}>
                          {timeline}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading || !leadData.companyName.trim()}
                    startIcon={loading ? <CircularProgress size={16} /> : <AssessmentIcon />}
                    sx={{ mt: 2 }}
                  >
                    {loading ? 'Qualifying Lead...' : 'Qualify Lead'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Qualification Results */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              height: '100%',
              backgroundColor: '#fafafa',
              overflow: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Qualification Analysis
              </Typography>
            </Box>
            
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary">
                  AI agent is analyzing lead data...
                </Typography>
              </Box>
            ) : qualification ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-line',
                    lineHeight: 1.6,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  {qualification}
                </Typography>
                
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Generated by CraftAgent Pro Lead Qualification Agent • {new Date().toLocaleString()}
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <AssessmentIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Enter lead information and click &quot;Qualify Lead&quot; to see the AI analysis
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadQualificationDemo;