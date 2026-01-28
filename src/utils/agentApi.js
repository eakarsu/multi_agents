// CraftAgent Pro API Integration
// Pluggable Agent Framework - Works with any AI provider

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

class AgentAPI {
  constructor() {
    this.backendUrl = BACKEND_API_URL;
  }

  // Customer Support Agent
  async customerSupportAgent(customerQuery, customerContext = {}, provider = null) {
    try {
      const response = await fetch(`${this.backendUrl}/api/agents/customer-support`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: customerQuery,
          context: customerContext,
          provider
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Customer Support API Error: ${error.error || response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Customer Support Agent Error:', error);
      throw error;
    }
  }

  // Content Creation Agent
  async contentCreationAgent(contentType, topic, audience, tone = 'professional', provider = null) {
    try {
      const response = await fetch(`${this.backendUrl}/api/agents/content-creation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contentType,
          topic,
          audience,
          tone,
          provider
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Content Creation API Error: ${error.error || response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Content Creation Agent Error:', error);
      throw error;
    }
  }

  // Lead Qualification Agent
  async leadQualificationAgent(leadData, provider = null) {
    try {
      const response = await fetch(`${this.backendUrl}/api/agents/lead-qualification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          leadData,
          provider
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Lead Qualification API Error: ${error.error || response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Lead Qualification Agent Error:', error);
      throw error;
    }
  }

  // Data Analysis Agent
  async dataAnalysisAgent(dataDescription, analysisType, businessGoals, provider = null) {
    try {
      const response = await fetch(`${this.backendUrl}/api/agents/data-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dataDescription,
          analysisType,
          businessGoals,
          provider
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Data Analysis API Error: ${error.error || response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Data Analysis Agent Error:', error);
      throw error;
    }
  }

  // Generic Agent - Can handle any agent template
  async genericAgent(agentType, agentName, task, customPrompt = null, context = {}, provider = null) {
    try {
      const response = await fetch(`${this.backendUrl}/api/agents/generic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          agentType,
          agentName,
          task,
          customPrompt,
          context,
          provider
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Generic Agent API Error: ${error.error || response.statusText}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Generic Agent Error:', error);
      throw error;
    }
  }

  // Get available providers and models
  async getAvailableProviders() {
    try {
      const response = await fetch(`${this.backendUrl}/api/agents/providers`);
      
      if (!response.ok) {
        throw new Error(`Providers API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.providers;
    } catch (error) {
      console.error('Get Providers Error:', error);
      return {};
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.backendUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Demo mode fallback responses (kept for offline/testing)
export const demoResponses = {
  customerSupport: {
    'billing issue': "I understand you're experiencing a billing issue. Let me help you resolve this quickly:\n\n1. **Immediate Action**: I've escalated your case to our billing team (Case #CS-2024-0817)\n2. **Expected Resolution**: 2-4 business hours\n3. **Account Credit**: I've applied a $25 service credit for the inconvenience\n4. **Follow-up**: You'll receive an email confirmation and direct contact from our billing specialist\n\nIs there anything specific about the billing discrepancy I can clarify while we resolve this?",
    'setup help': "Great choice with CraftAgent Pro! I'll guide you through the setup process:\n\n**Quick Setup (15 minutes):**\n1. ✅ Account created\n2. 🔄 Choose your CRAFT agents (I recommend starting with Communication + Analytics)\n3. ⏳ Connect integrations (Slack, CRM)\n4. ⏳ Configure first workflow\n\n**Your Success Manager**: Sarah Chen will contact you within 24 hours for personalized onboarding.\n\n**Quick Win**: Let's start with our Customer Support agent template - it typically shows ROI within the first week!\n\nWhich integration would you like to set up first?",
    'default': "Thank you for contacting CraftAgent Pro support! I'm here to help you maximize your AI agent automation.\n\n**Common Quick Fixes:**\n• Account & Billing: Case escalation + immediate credits\n• Technical Issues: Live debugging + implementation support  \n• Integration Help: Step-by-step guidance + success manager assignment\n• Performance Questions: ROI analysis + optimization recommendations\n\nHow can I assist you today? I'll ensure we get you the fastest resolution possible."
  },
  contentCreation: {
    'blog post': "# Revolutionizing Customer Service: How AI Agents Deliver 300% ROI\n\n**The Challenge**: 73% of businesses struggle with customer service scalability, spending $1.3 trillion annually on support operations while customer satisfaction scores decline.\n\n**The Solution**: AI Communication Agents that handle 80% of inquiries automatically, delivering personalized responses 24/7.\n\n## Real Results from CraftAgent Pro Customers:\n\n**TechCorp** (500 employees):\n- ⚡ 85% faster response times\n- 💰 $240K annual savings\n- 📈 40% increase in CSAT scores\n- 🎯 Support team refocused on complex issues\n\n**Implementation in 3 Steps:**\n1. **Connect**: Integrate with existing helpdesk (15 minutes)\n2. **Train**: Upload knowledge base and FAQs (1 hour)\n3. **Deploy**: Go live with AI agent handling tier-1 support (immediate)\n\n**Ready to transform your customer service?** Start your 30-day free trial and see the ROI within your first week.\n\n[Start Free Trial] [Book Demo]\n\n*Join 500+ companies already saving millions with CraftAgent Pro.*",
    'social media': "🚀 **Stop drowning in repetitive tasks!** \n\nWhat if your team could focus on strategy while AI handles the routine work?\n\n✨ **CraftAgent Pro customers report:**\n📊 171% average ROI\n⚡ 25% productivity boost\n💰 30% cost reduction\n🎯 96% plan to expand usage\n\n**Real Example**: Marketing team at GrowthCo automated their content workflow:\n• Research Agent: Finds trending topics\n• Analytics Agent: Identifies best-performing content\n• Communication Agent: Creates personalized campaigns\n• Technical Agent: Optimizes distribution\n\n**Result**: 5x more content, 3x better engagement, team loves their work again! 💪\n\nReady to build your AI super agent empire? 👇\n🆓 Start 30-day free trial (no credit card)\n🎯 See ROI in week 1\n🤝 Full support included\n\n#AIAutomation #ProductivityHack #BusinessGrowth #CraftAgentPro",
    'default': "# Transform Your Business with AI Agent Automation\n\nDiscover how leading companies are achieving 171% ROI by implementing specialized AI agents for every business function.\n\n**From manual processes to intelligent automation - see the CraftAgent Pro difference:**\n\n🤖 **Communication Agents**: Handle customer service, emails, social media\n🔍 **Research Agents**: Gather market insights, competitive analysis\n📊 **Analytics Agents**: Generate reports, identify patterns, predict trends\n⚙️ **Functional Agents**: Automate workflows, approvals, transactions\n💻 **Technical Agents**: Code, deploy, monitor, debug\n\n**Plus unlimited custom agents for your specific industry needs!**\n\nJoin the AI revolution. Start your free trial today.\n\n[Get Started] [Watch Demo] [Contact Sales]"
  },
  leadQualification: {
    'enterprise': "## Lead Qualification Analysis\n\n**Overall Score: 85/100 (HOT LEAD)** 🔥\n\n### Company Profile:\n- **Size**: 2,500 employees, $400M revenue\n- **Industry**: Financial Services (HIGH automation potential)\n- **Current Pain**: Manual loan processing, 14-day approval time\n- **Budget Authority**: CFO approved $2M automation budget\n- **Timeline**: Implementation needed Q1 2024\n\n### Qualification Breakdown:\n✅ **Budget**: 95/100 - Pre-approved budget exceeds our Enterprise tier\n✅ **Authority**: 90/100 - Direct CFO engagement\n✅ **Need**: 85/100 - Clear ROI driver (loan processing speed)\n✅ **Timeline**: 80/100 - Urgent business need\n✅ **Fit**: 85/100 - Perfect use case for Functional + Analytics agents\n\n### **IMMEDIATE ACTIONS REQUIRED:**\n1. **Schedule Enterprise Demo** (within 24 hours)\n2. **Assign Senior Solutions Engineer** (Alex Chen)\n3. **Prepare Custom ROI Analysis** (loan processing automation)\n4. **Connect with Reference Customer** (Similar financial services client)\n\n### **Expected Outcome**: \n- Deal Size: $150K-250K annually\n- Close Probability: 75%\n- Implementation: Q1 2024\n\n**Next Step**: Book executive demo focusing on loan automation ROI.",
    'default': "## Lead Qualification Report\n\n**Score: 72/100 (WARM LEAD)** 🌡️\n\n### Analysis Summary:\nPromising opportunity with good fit for CraftAgent Pro's automation capabilities. Requires nurturing to address budget and timeline concerns.\n\n### Strengths:\n✅ Strong pain points align with our solutions\n✅ Industry has high automation potential\n✅ Decision maker identified\n\n### Areas to Address:\n⚠️ Budget needs validation\n⚠️ Timeline requires acceleration\n⚠️ Technical readiness assessment needed\n\n### **Recommended Next Steps:**\n1. **Nurture Sequence**: Send ROI calculator + case studies\n2. **Education**: Share industry-specific automation guide\n3. **Follow-up**: Schedule needs assessment call in 1 week\n4. **Social Proof**: Connect with similar customer reference\n\n### **Success Probability**: 60%\n**Estimated Timeline**: 3-6 months\n**Potential Value**: $50K-100K annually"
  },
  dataAnalysis: {
    'performance': "# Performance Analysis Report: Customer Support Optimization\n\n## 📊 Key Findings\n\n### Current State Analysis:\n- **Ticket Volume**: 2,400 tickets/month (↑15% vs last quarter)\n- **Resolution Time**: Average 18 hours (industry benchmark: 12 hours)\n- **Agent Utilization**: 85% on repetitive tier-1 issues\n- **Customer Satisfaction**: 3.2/5 (declining trend)\n\n### 🎯 Automation Opportunity Assessment:\n\n**HIGH IMPACT - IMMEDIATE IMPLEMENTATION:**\n1. **Password Resets** (23% of tickets)\n   - Automation Potential: 95%\n   - Time Savings: 280 hours/month\n   - ROI: $14,000/month\n\n2. **Order Status Inquiries** (18% of tickets)\n   - Automation Potential: 90%\n   - Time Savings: 195 hours/month\n   - ROI: $9,750/month\n\n3. **Basic Account Questions** (15% of tickets)\n   - Automation Potential: 85%\n   - Time Savings: 153 hours/month\n   - ROI: $7,650/month\n\n### 💰 **TOTAL ROI PROJECTION:**\n- **Monthly Savings**: $31,400\n- **Annual ROI**: $376,800\n- **Implementation Cost**: $60,000 (Professional plan)\n- **Payback Period**: 1.9 months\n- **3-Year NPV**: $1.07M\n\n### 🚀 **Implementation Roadmap:**\n\n**Phase 1 (Month 1)**: Password reset automation\n**Phase 2 (Month 2)**: Order status integration  \n**Phase 3 (Month 3)**: Account management agent\n**Phase 4 (Month 4)**: Advanced workflow optimization\n\n### 📈 **Expected Outcomes:**\n- ⚡ 60% reduction in response time\n- 🎯 85% customer satisfaction improvement\n- 👥 Support team refocus on complex issues\n- 💼 Scale support without headcount increase\n\n**Recommendation**: Proceed with immediate pilot implementation focusing on password resets for fastest ROI validation.",
    'default': "# Business Intelligence Analysis\n\n## 📊 Data Insights Summary\n\nBased on your data analysis request, here are the key findings and automation opportunities:\n\n### **Pattern Recognition:**\n- Identified 3 high-volume, low-complexity processes suitable for immediate automation\n- Detected seasonal trends that could benefit from predictive Analytics agents\n- Found workflow bottlenecks causing 23% efficiency loss\n\n### **ROI Opportunities:**\n🎯 **Quick Wins** (0-3 months):\n- Process automation: $25K monthly savings\n- Data entry elimination: 40 hours/week recovered\n- Error reduction: 85% improvement in accuracy\n\n📈 **Strategic Gains** (3-12 months):\n- Predictive analytics implementation\n- Advanced workflow optimization\n- Cross-department automation integration\n\n### **Implementation Priority:**\n1. **High Impact, Low Effort**: Automated data processing\n2. **High Impact, Medium Effort**: Customer workflow automation\n3. **Medium Impact, Low Effort**: Reporting automation\n\n### **Expected Business Impact:**\n- 171% average ROI within 12 months\n- 25% productivity increase across analyzed processes\n- 30% cost reduction in operational overhead\n\n**Next Step**: Schedule strategy session to design your custom agent implementation roadmap."
  }
};

export default AgentAPI;