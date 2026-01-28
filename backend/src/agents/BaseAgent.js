/**
 * Base Agent Interface
 * All agent providers must implement this interface
 */
class BaseAgent {
  constructor(config) {
    this.config = config;
    this.provider = config.provider;
    this.model = config.model;
    this.apiKey = config.apiKey;
  }

  /**
   * Send a message to the agent
   * @param {Array} messages - Array of message objects
   * @param {string} systemPrompt - System prompt for the agent
   * @param {Object} options - Additional options (temperature, max_tokens, etc.)
   * @returns {Promise<string>} - Agent response
   */
  async sendMessage(messages, systemPrompt = '', options = {}) {
    throw new Error('sendMessage method must be implemented by provider');
  }

  /**
   * Get provider-specific configuration
   * @returns {Object} - Provider configuration
   */
  getConfig() {
    return {
      provider: this.provider,
      model: this.model,
      ...this.config
    };
  }

  /**
   * Validate agent configuration
   * @returns {boolean} - Whether configuration is valid
   */
  isConfigValid() {
    return !!(this.apiKey && this.model && this.provider);
  }
}

module.exports = BaseAgent;