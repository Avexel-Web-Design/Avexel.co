import React, { useState, useEffect } from "react";
import useScrollReveal from "../hooks/useScrollReveal";

interface QuoteFormData {
  customFeatures: string[];
  numberOfPages: string;
}

// Individual features for custom builds
const customFeatures = [
  {
    id: 'base',
    name: 'Base Website Creation',
    price: 77.90,
    description: 'The basic setup for your website including hosting, domain setup, and content',
    category: 'Essential',
    required: true
  },
  {
    id: 'responsive',
    name: 'Mobile Responsive Design',
    price: 0,
    description: 'Make your website look great on all devices',
    category: 'Essential',
    required: true
  },
  {
    id: 'seo',
    name: 'SEO Optimization',
    price: 0,
    description: 'Make your website show up in searches',
    category: 'Essential',
    required: true
  },
  {
    id: 'security',
    name: 'Security Features',
    price: 0,
    description: 'SSL certificates and basic security protection',
    category: 'Essential',
    required: true
  },
  {
    id: 'analytics',
    name: 'Analytics Setup',
    price: 27.79,
    description: 'Google Analytics and Cloudflare tracking',
    category: 'Essential'
  },
  {
    id: 'contact',
    name: 'Contact Forms',
    price: 47.79,
    description: 'Let your customers contact you',
    category: 'Essential'
  },
  {
    id: 'blog',
    name: 'Blog/News System',
    price: 377.90,
    description: 'Platform for your blog including a no code way to write content',
    category: 'Content'
  },
  {
    id: 'booking',
    name: 'Booking System',
    price: 177.90,
    description: 'Online appointment/reservation system',
    category: 'Content'
  },
  {
    id: 'crm',
    name: 'Customer Relationship Management',
    price: 277.90,
    description: 'Customer data management and tracking',
    category: 'Content'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    price: 377.90,
    description: 'Online store with product catalog and shopping cart',
    category: 'E-commerce'
  },
  {
    id: 'payments',
    name: 'Payment Processing',
    price: 177.90,
    description: 'Accept payments from customers (required for e-commerce)',
    category: 'E-commerce'
  },
  {
    id: 'subscription',
    name: 'Subscription Management',
    price: 77.90,
    description: 'Manage recurring payments and subscriptions',
    category: 'E-commerce'
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    price: 177.90,
    description: 'Stock tracking and product management',
    category: 'E-commerce'
  },
  {
    id: 'accounts',
    name: 'User Accounts',
    price: 377.90,
    description: 'Customer registration and login',
    category: 'E-commerce'
  },
  {
    id: 'newsletter',
    name: 'Email Marketing',
    price: 77.90,
    description: 'Newsletter signup and automation',
    category: 'Marketing'
  },
  {
    id: 'social',
    name: 'Social Media Integration',
    price: 177.90,
    description: 'Social feeds and sharing buttons',
    category: 'Marketing'
  },
  {
    id: 'database',
    name: 'Custom Database & Admin Panel',
    price: 77.90,
    description: 'Store information and manage it with an admin panel',
    category: 'Advanced'
  },
  {
    id: 'api',
    name: 'API Integrations',
    price: 377.90,
    description: 'Provide real time information from other platforms',
    category: 'Advanced'
  },
  {
    id: 'multilang',
    name: 'Multi-language Support',
    price: 177.90,
    description: 'Support for multiple languages (Spanish only. Unless you\'re okay with questionable translations)',
    category: 'Advanced'
  },
];

const pageRanges = [
  { value: '1-5', label: '1-5 Pages', multiplier: 1.14 },
  { value: '6-15', label: '6-15 Pages', multiplier: 1.25 },
  { value: '16-30', label: '16-30 Pages', multiplier: 1.40 },
  { value: '31-50', label: '31-50 Pages', multiplier: 2.74 },
  { value: '50+', label: '50+ Pages', multiplier: 2.89 }
];

const GetQuote: React.FC = () => {
  useScrollReveal();
  const [formData, setFormData] = useState<QuoteFormData>({
    customFeatures: ['base', 'responsive', 'seo', 'security'],
    numberOfPages: ''
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Essential': true,
    'Content': false,
    'E-commerce': false,
    'Business Tools': false,
    'Marketing': false,
    'Advanced': false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculatePrice = () => {
    let basePrice = 0;

    formData.customFeatures.forEach(featureId => {
      const feature = customFeatures.find(f => f.id === featureId);
      if (feature) {
        basePrice += feature.price;
      }
    });

    if (formData.numberOfPages) {
      const pageRange = pageRanges.find(range => range.value === formData.numberOfPages);
      if (pageRange) {
        const customTargetPrices = {
          '1-5': 3277.90,
          '6-15': 3477.90,
          '16-30': 3767.79,
          '31-50': 7377.90,
          '50+': 7790.00
        };

        const targetPrice = customTargetPrices[formData.numberOfPages as keyof typeof customTargetPrices];
        if (targetPrice) {
          basePrice = targetPrice * (basePrice / 3066.18);
        } else {
          basePrice = basePrice * pageRange.multiplier;
        }
      }
    }

    return basePrice;
  };

  useEffect(() => {
    const price = calculatePrice();
    setEstimatedPrice(price);
    setShowQuote(price > 0);
  }, [formData]);

  const handleCustomFeatureToggle = (featureId: string) => {
    const feature = customFeatures.find(f => f.id === featureId);
    if (feature?.required) return;

    setFormData(prev => ({
      ...prev,
      customFeatures: prev.customFeatures.includes(featureId)
        ? prev.customFeatures.filter(f => f !== featureId)
        : [...prev.customFeatures, featureId]
    }));
  };

  const handleInputChange = (field: keyof QuoteFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSelectedFeatures = () => {
    return formData.customFeatures.map(featureId => {
      const feature = customFeatures.find(f => f.id === featureId);
      return feature ? feature.name : '';
    }).filter(Boolean);
  };

  const handleGetQuote = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }

    const selectedFeatures = getSelectedFeatures();
    const quoteDetails = {
      ...formData,
      estimatedPrice,
      features: selectedFeatures,
      timestamp: new Date().toISOString()
    };

    console.log('Quote Request:', quoteDetails);
  };

  return (
    <section id="quote" className="py-32 bg-[#050505] relative overflow-hidden snap-start">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[120px] animate-pulse-glow pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20 reveal">
          <span className="inline-block text-sm font-bold text-neon-purple tracking-[0.2em] uppercase mb-4 animate-float">
            Pricing
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-outfit">
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
              Custom Solution
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Select the features you need and get an instant estimate for your project.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 reveal">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
              {/* Build Type Selection */}
              <div className="xl:col-span-2 space-y-8">
                {/* Custom Feature Selection */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white font-outfit">Select Features</h3>
                    <div className="text-sm text-neon-blue font-medium">
                      {formData.customFeatures.length} selected
                    </div>
                  </div>

                  {['Essential', 'Content', 'E-commerce', 'Business Tools', 'Marketing', 'Advanced'].map(category => {
                    const categoryFeatures = customFeatures.filter(f => f.category === category);
                    if (categoryFeatures.length === 0) return null;

                    const isExpanded = expandedSections[category];
                    const selectedCount = categoryFeatures.filter(f => formData.customFeatures.includes(f.id)).length;

                    return (
                      <div key={category} className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
                        <button
                          onClick={() => toggleSection(category)}
                          className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <h4 className="text-lg font-bold text-white font-outfit">
                              {category}
                            </h4>
                            {selectedCount > 0 && (
                              <span className="bg-neon-purple/20 text-neon-purple text-xs px-3 py-1 rounded-full font-medium">
                                {selectedCount} active
                              </span>
                            )}
                          </div>
                          <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                            }`}></i>
                        </button>

                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}>
                          <div className="p-5 pt-4 space-y-3 border-t border-white/5">
                            {categoryFeatures.map(feature => (
                              <label
                                key={feature.id}
                                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${feature.required
                                  ? 'border-neon-blue/30 bg-neon-blue/5 cursor-not-allowed'
                                  : formData.customFeatures.includes(feature.id)
                                    ? 'border-neon-purple/50 bg-neon-purple/10'
                                    : 'border-white/5 bg-black/20 hover:border-white/20 hover:bg-white/5'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.customFeatures.includes(feature.id)}
                                  onChange={() => !feature.required && handleCustomFeatureToggle(feature.id)}
                                  disabled={feature.required}
                                  className="sr-only"
                                />
                                <div className="flex items-center space-x-4 flex-1">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors duration-300 ${formData.customFeatures.includes(feature.id)
                                    ? 'bg-neon-purple border-neon-purple'
                                    : 'border-gray-500 bg-transparent'
                                    }`}>
                                    {formData.customFeatures.includes(feature.id) && (
                                      <i className="fas fa-check text-xs text-white"></i>
                                    )}
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <span className="text-white font-bold font-outfit">{feature.name}</span>
                                      {feature.required && (
                                        <span className="text-[10px] uppercase tracking-wider bg-neon-blue/20 text-neon-blue px-2 py-1 rounded">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">{feature.description}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-bold text-white ml-4 font-outfit">
                                  {feature.price === 0 ? 'Included' : `+$${feature.price.toFixed(2)}`}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Project Details */}
                <div className="space-y-6 pt-8 border-t border-white/10">
                  <h3 className="text-2xl font-bold text-white font-outfit">Project Details</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Number of Pages *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.numberOfPages}
                        onChange={(e) => handleInputChange('numberOfPages', e.target.value)}
                        className="w-full px-6 py-4 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-neon-purple text-white appearance-none cursor-pointer transition-colors duration-300"
                      >
                        <option value="">Select page range</option>
                        {pageRanges.map(range => (
                          <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <i className="fas fa-chevron-down"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Display Section */}
              <div className="lg:pl-8">
                <div className="sticky top-32">
                  <div className="glass-card p-8 rounded-2xl border border-neon-purple/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 rounded-full blur-2xl -mr-16 -mt-16"></div>

                    <h3 className="text-2xl font-bold text-white mb-6 font-outfit relative z-10">Your Estimate</h3>

                    {showQuote ? (
                      <div className="space-y-6 relative z-10">
                        <div className="text-center py-6 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">Estimated Total</div>
                          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue font-outfit">
                            ${estimatedPrice.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">*Starting estimate</div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Includes:</h4>
                          <ul className="space-y-3 text-sm text-gray-300 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {getSelectedFeatures().map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <i className="fas fa-check text-neon-green mt-1"></i>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {formData.numberOfPages && (
                              <li className="flex items-start gap-3">
                                <i className="fas fa-check text-neon-green mt-1"></i>
                                <span>{pageRanges.find(p => p.value === formData.numberOfPages)?.label}</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        <button
                          onClick={handleGetQuote}
                          className="w-full py-4 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl text-white font-bold hover:shadow-lg hover:shadow-neon-purple/25 transition-all duration-300 transform hover:-translate-y-1"
                        >
                          Proceed With Quote
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-12 relative z-10">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                          <i className="fas fa-calculator text-2xl text-gray-500"></i>
                        </div>
                        <p className="text-gray-400">
                          Select features to see pricing
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 space-y-6">
                    {/* Payment Structure */}
                    <div className="glass-panel p-6 rounded-xl border border-white/5">
                      <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <i className="fas fa-credit-card text-neon-blue"></i>
                        Payment Structure
                      </h4>
                      <div className="text-xs text-gray-400 space-y-2 leading-relaxed">
                        <p>• <strong>Initial website development:</strong> One-time payment upon project completion</p>
                        <p>• <strong>Content updates:</strong> Billed hourly at $25/hour for future modifications</p>
                        <p>• <strong>Bug fixes:</strong> Provided at no additional cost as part of our quality guarantee</p>
                      </div>
                    </div>

                    {/* Pricing Disclaimer */}
                    <div className="text-[10px] text-gray-600 text-center leading-relaxed">
                      <p>This is an estimate. Final pricing may vary based on specific requirements and complexity. Does not include 3rd party fees (hosting, domain, etc.).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetQuote;
