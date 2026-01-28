const fs = require('fs');
const path = require('path');

/**
 * Agent Factory - Dynamically loads and creates agents
 */
class AgentFactory {
  static supportedProviders = {};
  static initialized = false;

  /**
   * Initialize factory by discovering available agent providers
   */
  static initialize() {
    if (this.initialized) return;

    try {
      // Dynamically discover agent providers
      const agentsDir = path.join(__dirname);
      const files = fs.readdirSync(agentsDir);
      
      files.forEach(file => {
        if (file.endsWith('Agent.js') && file !== 'BaseAgent.js') {
          const agentName = file.replace('Agent.js', '').toLowerCase();
          try {
            const AgentClass = require(path.join(agentsDir, file));
            this.supportedProviders[agentName] = AgentClass;
          } catch (error) {
            console.warn(`Failed to load agent provider: ${file}`, error.message);
          }
        }
      });

      this.initialized = true;
      console.log(`🤖 Loaded ${Object.keys(this.supportedProviders).length} agent providers:`, Object.keys(this.supportedProviders));
    } catch (error) {
      console.error('Failed to initialize AgentFactory:', error);
    }
  }

  /**
   * Create an agent instance
   * @param {string} provider - Provider name 
   * @param {Object} config - Agent configuration
   * @returns {BaseAgent} - Agent instance
   */
  static createAgent(provider, config) {
    this.initialize();
    
    const AgentClass = this.supportedProviders[provider.toLowerCase()];
    
    if (!AgentClass) {
      throw new Error(`Unsupported agent provider: ${provider}. Available providers: ${Object.keys(this.supportedProviders).join(', ')}`);
    }

    return new AgentClass(config);
  }

  /**
   * Get list of supported providers
   * @returns {Array} - List of provider names
   */
  static getSupportedProviders() {
    this.initialize();
    return Object.keys(this.supportedProviders);
  }

  /**
   * Get available models for a provider
   * @param {string} provider - Provider name
   * @returns {Array} - List of available models
   */
  static getAvailableModels(provider) {
    this.initialize();
    
    const AgentClass = this.supportedProviders[provider.toLowerCase()];
    
    if (!AgentClass || !AgentClass.getAvailableModels) {
      return [];
    }

    return AgentClass.getAvailableModels();
  }

  /**
   * Create agent from environment configuration
   * @param {string} provider - Provider name
   * @returns {BaseAgent} - Configured agent instance
   */
  static createFromEnv(provider) {
    const config = this.getConfigFromEnv(provider);
    return this.createAgent(provider, config);
  }

  /**
   * Get configuration from environment variables (abstract approach)
   * @param {string} provider - Provider name
   * @returns {Object} - Configuration object
   */
  static getConfigFromEnv(provider) {
    this.initialize();
    
    const providerUpper = provider.toUpperCase();
    
    // Generic environment variable pattern
    const config = {
      apiKey: process.env[`${providerUpper}_API_KEY`],
      model: process.env[`${providerUpper}_MODEL`],
      organizationId: process.env[`${providerUpper}_ORG_ID`],
      apiVersion: process.env[`${providerUpper}_API_VERSION`],
      baseUrl: process.env[`${providerUpper}_BASE_URL`],
      temperature: process.env[`${providerUpper}_TEMPERATURE`] ? parseFloat(process.env[`${providerUpper}_TEMPERATURE`]) : undefined,
      maxTokens: process.env[`${providerUpper}_MAX_TOKENS`] ? parseInt(process.env[`${providerUpper}_MAX_TOKENS`]) : undefined
    };

    // Remove undefined values
    Object.keys(config).forEach(key => {
      if (config[key] === undefined) {
        delete config[key];
      }
    });

    // Get default model from agent class if not specified
    if (!config.model) {
      const AgentClass = this.supportedProviders[provider.toLowerCase()];
      if (AgentClass && AgentClass.getAvailableModels) {
        const models = AgentClass.getAvailableModels();
        if (models.length > 0) {
          config.model = models[0]; // Use first available model as default
        }
      }
    }

    if (!config.apiKey) {
      console.warn(`No API key found for provider: ${provider}. Set ${providerUpper}_API_KEY environment variable.`);
    }

    return config;
  }
}

module.exports = AgentFactory;