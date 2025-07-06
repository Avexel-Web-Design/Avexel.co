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
    price: 47.79, 
    description: 'Google Analytics and Cloudflare tracking',
    category: 'Essential'
  },
  { 
    id: 'contact', 
    name: 'Contact Forms', 
    price: 27.79, 
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

// The multiplier property in each page range is used to scale the base price according to the number of pages selected.
// These multipliers are chosen to approximate the increased development effort and complexity for larger websites.
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
    customFeatures: ['base', 'responsive', 'seo', 'security'], // Always include all required features
    numberOfPages: ''
  });

  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Essential': true, // Keep Essential expanded by default since it has required features
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

    // Calculate custom build price
    formData.customFeatures.forEach(featureId => {
      const feature = customFeatures.find(f => f.id === featureId);
      if (feature) {
        basePrice += feature.price;
      }
    });

    // Apply page multiplier and target exact prices
    if (formData.numberOfPages) {
      const pageRange = pageRanges.find(range => range.value === formData.numberOfPages);
      if (pageRange) {
        // Custom build target prices
        const customTargetPrices = {
          '1-5': 3277.90,
          '6-15': 3477.90,
          '16-30': 3767.79,
          '31-50': 7377.90,
          '50+': 7790.00
        };
        
        // Calculate the multiplier needed to reach target price
        const targetPrice = customTargetPrices[formData.numberOfPages as keyof typeof customTargetPrices];
        if (targetPrice) {
          basePrice = targetPrice * (basePrice / 3066.18); // Scale proportionally from base price
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
    if (feature?.required) return; // Can't remove any required features

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
    // Scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Log quote details for analytics or debugging
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
    <section
      id="quote"
      className="py-32 bg-gradient-to-b from-black to-dark relative overflow-hidden scroll-mt-24"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary-500/5 to-transparent opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-secondary-500/5 to-transparent opacity-60"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16" data-reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Build Your Website
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Build a custom solution that perfectly fits your needs.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-dark/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 lg:p-12" data-reveal>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
              {/* Build Type Selection */}
              <div className="xl:col-span-2 space-y-8">
                {/* Custom Feature Selection */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-semibold text-white">Select Your Features</h3>
                    <div className="text-sm text-gray-400">
                      {formData.customFeatures.length} feature{formData.customFeatures.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>
                  {['Essential', 'Content', 'E-commerce', 'Business Tools', 'Marketing', 'Advanced'].map(category => {
                    const categoryFeatures = customFeatures.filter(f => f.category === category);
                    if (categoryFeatures.length === 0) return null;
                    
                    const isExpanded = expandedSections[category];
                    const selectedCount = categoryFeatures.filter(f => formData.customFeatures.includes(f.id)).length;
                    
                    return (
                      <div key={category} className="border border-white/10 rounded-lg overflow-hidden bg-dark/20">
                        <button
                          onClick={() => toggleSection(category)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-medium text-white">
                              {category}
                            </h4>
                            {selectedCount > 0 && (
                              <span className="bg-primary-500/20 text-primary-400 text-xs px-2 py-1 rounded-full">
                                {selectedCount} selected
                              </span>
                            )}
                          </div>
                          <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}></i>
                        </button>
                        
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <div className="p-4 pt-0 space-y-3 border-t border-white/10">
                            {categoryFeatures.map(feature => (
                              <label
                                key={feature.id}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  feature.required
                                    ? 'border-primary-500/50 bg-primary-500/5 cursor-not-allowed'
                                    : formData.customFeatures.includes(feature.id)
                                    ? 'border-primary-500 bg-primary-500/10'
                                    : 'border-white/10 bg-dark/20 hover:border-white/30 hover:bg-dark/40'
                                }`}
                              >
                                <div className="flex items-center space-x-3 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={formData.customFeatures.includes(feature.id)}
                                    onChange={() => handleCustomFeatureToggle(feature.id)}
                                    disabled={feature.required}
                                    className="w-4 h-4 text-primary-500 bg-dark/50 border-white/20 rounded focus:ring-primary-500 focus:ring-2"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-white font-medium">{feature.name}</span>
                                      {feature.required && (
                                        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-400 mt-1">{feature.description}</p>
                                  </div>
                                </div>
                                <span className="text-sm font-medium text-gray-300 ml-4">
                                  {feature.price === 0 ? 'Free' : `+$${feature.price.toFixed(2)}`}
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
                <div className="space-y-6 pt-6 border-t border-white/10">
                  <h3 className="text-2xl font-semibold text-white">Project Details</h3>
                  
                  <div>
                    {/* Number of Pages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Number of Pages *
                      </label>
                      <select
                        value={formData.numberOfPages}
                        onChange={(e) => handleInputChange('numberOfPages', e.target.value)}
                        className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 text-white"
                      >
                        <option value="">Select page range</option>
                        {pageRanges.map(range => (
                          <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Display Section */}
              <div className="lg:pl-8">
                <div className="sticky top-8">
                  <h3 className="text-2xl font-semibold text-white mb-6">Your Quote</h3>
                  
                  {showQuote ? (
                    <div className="bg-gradient-to-br from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-xl p-6 space-y-4 animate-fade-in">
                      <div className="text-center">
                        <div className="text-sm text-gray-400 mb-2">Estimated Price</div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent animate-pulse-price">
                          ${estimatedPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 mt-2">*Starting estimate</div>
                      </div>
                      
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="text-lg font-semibold text-white mb-3">Includes:</h4>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {getSelectedFeatures().map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <i className="fas fa-check text-primary-400 mr-2"></i>
                              {feature}
                            </li>
                          ))}
                          {formData.numberOfPages && (
                            <li className="flex items-center">
                              <i className="fas fa-check text-primary-400 mr-2"></i>
                              {pageRanges.find(p => p.value === formData.numberOfPages)?.label}
                            </li>
                          )}
                        </ul>
                      </div>
                      
                      <button
                        onClick={handleGetQuote}
                        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Contact Us About This Quote
                      </button>
                    </div>
                  ) : (
                    <div className="bg-dark/30 border border-white/10 rounded-xl p-6 text-center">
                      <i className="fas fa-calculator text-4xl text-gray-500 mb-4"></i>
                      <p className="text-gray-400">
                        Select features to see pricing
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6 text-xs text-gray-500 text-center">
                    <p>This is an estimate. Final pricing may vary based on specific requirements and complexity. This also does not include 3rd Party fees and payments required to host your website, the domain, and fees for larger than usual databases and higher than usual user interaction with the website. This can include, large levels of user accounts, lots of contacting via email, or other things. The payment processing has a 2.9% + 30 cents fee that is pretty typical of that service. All web hosting and database storage is done exclusively through CloudFlare unless you want to pay more, have a lower quality product, and annoy the developers. These are not all of the ways you could end up paying more, but these are the most likely. Also keep in mind that while it seems like you are more likely to end up paying more, there is also a rather high probability that you pay much less than the automated quote says. If you are genuinely interested in our services, we encourage you to reach out for a more accurate quote, and so that we can do whats best for you.</p>
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
