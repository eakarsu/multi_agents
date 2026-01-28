# CraftAgent Pro Demo Setup Guide

## Quick Start with Live Anthropic API

### 1. Get Your Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

### 2. Configure Environment
1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API key:
```
REACT_APP_ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### 3. Run the Application
```bash
npm start
```

### 4. Test the Demos
Navigate to the Demo section and try:

1. **Customer Support Demo**: Ask questions like "I have a billing issue"
2. **Content Creation Demo**: Generate blog posts, social media content
3. **Lead Qualification Demo**: Test with sample company data
4. **Data Analysis Demo**: Analyze business metrics and get automation recommendations
5. **Agent Templates**: Browse 40+ pre-configured agent types

## Demo Features

### Interactive AI Agents
- **Real Anthropic Claude API integration**
- **Demo mode** with realistic responses (no API key required)
- **Live API mode** for actual Claude responses
- **Conversation history** and **typing indicators**

### Agent Templates
- **50+ pre-configured agents** across industries
- **Healthcare**: Patient care, medical records
- **Finance**: Risk assessment, fraud detection  
- **Retail**: Inventory optimization, personal shopping
- **Legal**: Contract analysis, legal research
- **Education**: Learning personalization, assessment
- **HR**: Recruitment, employee onboarding
- **Marketing**: Campaign optimization, content strategy
- **Creative**: Design assistance, copywriting

### API Configuration
- Uses **Claude 3 Sonnet** model by default
- Configurable model selection
- Error handling and fallback responses
- Rate limiting awareness

## Usage Examples

### Customer Support Agent
```javascript
// Example API call structure
await anthropicAPI.customerSupportAgent(
  "I'm having trouble with my billing", 
  { plan: 'Professional', accountAge: '3 months' }
);
```

### Content Creation Agent
```javascript
await anthropicAPI.contentCreationAgent(
  'blog post', 
  'AI automation ROI', 
  'business executives', 
  'professional'
);
```

### Lead Qualification Agent
```javascript
await anthropicAPI.leadQualificationAgent({
  companyName: 'TechCorp',
  industry: 'Financial Services',
  budget: '$500K-$1M',
  timeline: 'Immediate'
});
```

## API Costs

**Anthropic Claude 3 Sonnet Pricing** (as of 2024):
- Input: $3 per million tokens
- Output: $15 per million tokens

**Estimated demo costs**:
- Customer Support: ~$0.02-0.05 per conversation
- Content Creation: ~$0.10-0.20 per article
- Lead Qualification: ~$0.02-0.03 per analysis
- Data Analysis: ~$0.05-0.10 per report

## Security Notes

- API keys are processed client-side (demo purposes)
- For production: Use server-side API calls
- Never commit API keys to version control
- Use environment variables for configuration

## Troubleshooting

### "API key not configured" error
- Ensure `.env` file exists with correct API key
- Restart development server after adding API key

### "Rate limit exceeded"
- Claude API has rate limits (varies by plan)
- Demo mode provides unlimited testing without API calls

### Build errors
- Run `npm run build` to check for issues
- All ESLint warnings have been resolved

## Next Steps

1. **Customize Agent Templates**: Modify prompts in `src/utils/agentTemplates.js`
2. **Add New Agent Types**: Create new templates for your specific industry
3. **Integrate with Backend**: Move API calls to server-side for production
4. **Add Authentication**: Implement user accounts and API key management
5. **Deployment**: Deploy to Vercel, Netlify, or AWS for live demos

The demo showcases the platform's capability to create **any type of AI agent** for **any industry or use case** using the flexible CRAFT framework foundation.