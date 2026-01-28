const AgentFactory = require('../agents/AgentFactory');

/**
 * Agent Service - Handles different types of agent interactions
 */
class AgentService {
  constructor() {
    this.defaultProvider = process.env.DEFAULT_AGENT_PROVIDER || 'anthropic';
    this.agents = new Map();
  }

  /**
   * Get or create an agent instance
   * @param {string} provider - Provider name
   * @returns {BaseAgent} - Agent instance
   */
  getAgent(provider = this.defaultProvider) {
    if (!this.agents.has(provider)) {
      const agent = AgentFactory.createFromEnv(provider);
      this.agents.set(provider, agent);
    }
    return this.agents.get(provider);
  }

  /**
   * Customer Support Agent
   * @param {string} query - Customer query
   * @param {Object} context - Customer context
   * @param {string} provider - AI provider to use
   * @returns {Promise<string>} - Agent response
   */
  async customerSupport(query, context = {}, provider = this.defaultProvider) {
    const actualProvider = provider || this.defaultProvider;
    const agent = this.getAgent(actualProvider);
    const isDemo = context.isDemo || false;
    
    const systemPrompt = `You are an expert customer support agent for CraftAgent Pro, an AI super agent platform. You help customers with technical issues, billing questions, and platform guidance.

Company Context:
- CraftAgent Pro offers CRAFT framework (Communication, Research, Analytics, Functional, Technical agents)
- Plans: Starter ($99/month), Professional ($499/month), Enterprise (custom pricing)
- Powered by multiple AI providers (Anthropic Claude, OpenAI GPT-4, etc.)
- Guarantees 171% average ROI

${isDemo ? `
DEMO MODE INSTRUCTIONS:
- This is a demonstration for potential customers
- Provide impressive, detailed responses that showcase AI capabilities
- Include specific case numbers, timelines, and actionable steps
- Show proactive problem-solving and value-added service
- Mention relevant features and benefits naturally
- Keep responses professional but engaging
- Always provide concrete next steps and follow-up actions
` : ''}

Always be helpful, professional, and solution-oriented. Provide specific actionable steps when possible.`;

    const messages = [
      {
        role: 'user',
        content: `Customer Context: ${JSON.stringify(context)}\n\nCustomer Query: ${query}`
      }
    ];

    return await agent.sendMessage(messages, systemPrompt, { maxTokens: 1000 });
  }

  /**
   * Content Creation Agent
   * @param {string} contentType - Type of content to create
   * @param {string} topic - Content topic
   * @param {string} audience - Target audience
   * @param {string} tone - Content tone
   * @param {string} provider - AI provider to use
   * @returns {Promise<string>} - Generated content
   */
  async contentCreation(contentType, topic, audience, tone = 'professional', provider = this.defaultProvider) {
    const actualProvider = provider || this.defaultProvider;
    const agent = this.getAgent(actualProvider);
    
    const systemPrompt = `You are a content creation specialist for CraftAgent Pro. You create high-quality, engaging content for various marketing channels and audiences.

Your expertise includes:
- Blog posts, social media, email campaigns, whitepapers
- Technical content about AI and automation
- Business-focused messaging with ROI emphasis
- SEO-optimized content

Always create content that:
1. Addresses the target audience's pain points
2. Highlights CraftAgent Pro's unique value proposition
3. Includes specific benefits and use cases
4. Has a clear call-to-action`;

    const messages = [
      {
        role: 'user',
        content: `Create ${contentType} content about "${topic}" for ${audience} audience in a ${tone} tone. Include specific examples and benefits related to AI agent automation.`
      }
    ];

    return await agent.sendMessage(messages, systemPrompt, { maxTokens: 1500 });
  }

  /**
   * Lead Qualification Agent
   * @param {Object} leadData - Lead information
   * @param {string} provider - AI provider to use
   * @returns {Promise<string>} - Qualification analysis
   */
  async leadQualification(leadData, provider = this.defaultProvider) {
    const actualProvider = provider || this.defaultProvider;
    const agent = this.getAgent(actualProvider);
    
    const systemPrompt = `You are a lead qualification specialist for CraftAgent Pro. You analyze leads and provide qualification scores, recommendations, and next steps.

Qualification Criteria:
- Company size (employees, revenue)
- Industry fit (high automation potential)
- Current pain points with manual processes
- Budget authority and timeline
- Technical readiness for AI implementation

Scoring: 1-100 scale
- 80-100: Hot lead (immediate follow-up)
- 60-79: Warm lead (nurture sequence)
- 40-59: Cold lead (educational content)
- Below 40: Unqualified

Provide specific reasoning and recommended actions.`;

    const messages = [
      {
        role: 'user',
        content: `Qualify this lead: ${JSON.stringify(leadData, null, 2)}`
      }
    ];

    return await agent.sendMessage(messages, systemPrompt, { maxTokens: 1000 });
  }

  /**
   * Data Analysis Agent
   * @param {string} dataDescription - Description of data to analyze
   * @param {string} analysisType - Type of analysis needed
   * @param {string} businessGoals - Business goals and objectives
   * @param {string} provider - AI provider to use
   * @returns {Promise<string>} - Analysis results
   */
  async dataAnalysis(dataDescription, analysisType, businessGoals, provider = this.defaultProvider) {
    const actualProvider = provider || this.defaultProvider;
    const agent = this.getAgent(actualProvider);
    
    const systemPrompt = `You are a data analysis expert specializing in business intelligence and AI automation insights. You analyze data patterns, identify opportunities, and provide actionable recommendations.

Your capabilities:
- Statistical analysis and pattern recognition
- ROI calculations and business impact assessment
- Automation opportunity identification
- Performance metric optimization
- Predictive insights and recommendations

Always provide:
1. Clear findings with supporting evidence
2. Business impact assessment
3. Specific recommendations with priority levels
4. Expected ROI and implementation timeline`;

    const messages = [
      {
        role: 'user',
        content: `Analyze the following data:
        
Data Description: ${dataDescription}
Analysis Type: ${analysisType}
Business Goals: ${businessGoals}

Provide insights, patterns, and actionable recommendations for implementing AI agent automation.`
      }
    ];

    return await agent.sendMessage(messages, systemPrompt, { maxTokens: 1500 });
  }

  /**
   * Generic Agent - Can execute any agent template or custom prompt
   * @param {string} agentType - Type/category of agent
   * @param {string} agentName - Specific agent name
   * @param {string} task - Task description
   * @param {string} customPrompt - Custom system prompt (optional)
   * @param {Object} context - Additional context (optional)
   * @param {string} provider - AI provider to use
   * @returns {Promise<string>} - Agent response
   */
  async genericAgent(agentType, agentName, task, customPrompt = null, context = {}, provider = this.defaultProvider) {
    const actualProvider = provider || this.defaultProvider;
    const agent = this.getAgent(actualProvider);
    
    // Build system prompt
    let systemPrompt;
    
    if (customPrompt) {
      // Use custom prompt if provided
      systemPrompt = customPrompt;
    } else {
      // Generate system prompt based on agent type and name
      systemPrompt = this.buildAgentSystemPrompt(agentType, agentName);
    }
    
    // Build user message with context
    let userMessage = task;
    if (Object.keys(context).length > 0) {
      userMessage += `\n\nAdditional Context: ${JSON.stringify(context, null, 2)}`;
    }
    
    const messages = [
      {
        role: 'user',
        content: userMessage
      }
    ];

    return await agent.sendMessage(messages, systemPrompt, { maxTokens: 1500 });
  }

  /**
   * Build system prompt for agent based on type and name
   * @param {string} agentType - Agent category (craft, industries, departments, etc.)
   * @param {string} agentName - Specific agent name
   * @returns {string} - System prompt
   */
  buildAgentSystemPrompt(agentType, agentName) {
    const basePrompt = `You are a specialized AI agent for CraftAgent Pro. `;
    
    // Agent type specific prompts
    const typePrompts = {
      craft: {
        communication: "You are a Communication Agent expert in customer support, email management, and social media. Handle interactions professionally and efficiently.",
        research: "You are a Research Agent specializing in market research, competitive analysis, and data gathering. Provide thorough, accurate insights.",
        analytics: "You are an Analytics Agent expert in data analysis, reporting, and business intelligence. Transform data into actionable insights.",
        functional: "You are a Functional Agent specializing in workflow automation, process optimization, and operational efficiency.",
        technical: "You are a Technical Agent expert in software development, system integration, and technical problem-solving."
      },
      departments: {
        marketing: "You are a Marketing specialist focused on campaign optimization, content strategy, and brand management.",
        sales: "You are a Sales expert specializing in lead management, customer relations, and revenue optimization.",
        hr: "You are an HR specialist focused on recruitment, employee engagement, and organizational development.",
        finance: "You are a Finance expert specializing in financial analysis, budgeting, and fiscal management.",
        operations: "You are an Operations specialist focused on process improvement, quality assurance, and efficiency optimization.",
        legal: "You are a Legal expert specializing in compliance, contract management, and regulatory guidance."
      },
      industries: {
        healthcare: "You are a Healthcare industry specialist understanding medical workflows, patient care, and regulatory requirements.",
        finance: "You are a Financial Services specialist expert in banking, investment, and regulatory compliance.",
        retail: "You are a Retail industry specialist focused on customer experience, inventory management, and sales optimization.",
        manufacturing: "You are a Manufacturing specialist expert in production processes, quality control, and supply chain management.",
        technology: "You are a Technology industry specialist focused on software development, innovation, and digital transformation.",
        education: "You are an Education specialist expert in learning systems, curriculum development, and student engagement."
      }
    };
    
    // Get specific prompt or use generic
    let specificPrompt = typePrompts[agentType]?.[agentName] || 
                        `You are a ${agentName} specialist with expertise in ${agentType} domain.`;
    
    return basePrompt + specificPrompt + "\n\nProvide detailed, actionable responses that deliver real business value. Focus on practical solutions and specific recommendations.";
  }

  /**
   * Get available providers and models
   * @returns {Object} - Providers and their available models
   */
  getAvailableProviders() {
    const providers = AgentFactory.getSupportedProviders();
    const result = {};
    
    providers.forEach(provider => {
      result[provider] = {
        models: AgentFactory.getAvailableModels(provider),
        configured: this.isProviderConfigured(provider)
      };
    });
    
    return result;
  }

  /**
   * Check if a provider is configured
   * @param {string} provider - Provider name
   * @returns {boolean} - Whether provider is configured
   */
  isProviderConfigured(provider) {
    try {
      const config = AgentFactory.getConfigFromEnv(provider);
      return !!(config.apiKey);
    } catch {
      return false;
    }
  }
}

module.exports = AgentService;