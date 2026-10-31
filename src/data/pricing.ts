// Existing published prices, preserved during the Astro migration.
export const features = [
  { id:'base', name:'Base website creation', price:77.90, description:'Website setup, content, and hosting configuration.', category:'Essentials', required:true },
  { id:'responsive', name:'Mobile-responsive design', price:0, description:'A layout that works across phones, tablets, and desktops.', category:'Essentials', required:true },
  { id:'seo', name:'SEO foundations', price:0, description:'Search-friendly structure and page metadata.', category:'Essentials', required:true },
  { id:'security', name:'Security foundations', price:0, description:'HTTPS and basic security configuration.', category:'Essentials', required:true },
  { id:'analytics', name:'Analytics setup', price:27.79, description:'Understand how visitors use your website.', category:'Essentials', required:false },
  { id:'contact', name:'Contact forms', price:47.79, description:'Give your visitors a way to get in touch.', category:'Essentials', required:false },
  { id:'blog', name:'Blog or news system', price:377.90, description:'Publish updates with a no-code content editor.', category:'Content & bookings', required:false },
  { id:'booking', name:'Booking system', price:177.90, description:'Online appointments or reservations.', category:'Content & bookings', required:false },
  { id:'crm', name:'Customer management', price:277.90, description:'Keep track of customer details and relationships.', category:'Content & bookings', required:false },
  { id:'ecommerce', name:'Online store', price:377.90, description:'Product catalog and shopping cart. Requires payment processing.', category:'Commerce', required:false },
  { id:'payments', name:'Payment processing', price:177.90, description:'Accept payments through a third-party provider.', category:'Commerce', required:false },
  { id:'subscription', name:'Subscription management', price:77.90, description:'Manage recurring payments and subscriptions.', category:'Commerce', required:false },
  { id:'inventory', name:'Inventory management', price:177.90, description:'Track stock and manage products.', category:'Commerce', required:false },
  { id:'accounts', name:'User accounts', price:377.90, description:'Customer registration and sign-in.', category:'Commerce', required:false },
  { id:'newsletter', name:'Email marketing', price:77.90, description:'Newsletter signup and email automation.', category:'Marketing', required:false },
  { id:'social', name:'Social media integration', price:177.90, description:'Connect social feeds and sharing tools.', category:'Marketing', required:false },
  { id:'database', name:'Custom database & admin', price:77.90, description:'Store information and manage it through an admin interface.', category:'Custom functionality', required:false },
  { id:'api', name:'API integrations', price:377.90, description:'Connect information from other platforms.', category:'Custom functionality', required:false },
  { id:'multilang', name:'Spanish-language support', price:177.90, description:'Additional Spanish-language content and navigation.', category:'Custom functionality', required:false },
] as const;
export const pageRanges = [
  { value:'1-5', label:'1–5 pages', target:3277.90 },
  { value:'6-15', label:'6–15 pages', target:3477.90 },
  { value:'16-30', label:'16–30 pages', target:3767.79 },
  { value:'31-50', label:'31–50 pages', target:7377.90 },
  { value:'50+', label:'More than 50 pages', target:7790 },
] as const;
export const money = (value:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
export function calculateEstimate(ids: string[], pageRange: string) {
  const selected = features.filter(feature => feature.required || ids.includes(feature.id));
  const subtotal = selected.reduce((total, feature) => total + feature.price, 0);
  const range = pageRanges.find(range => range.value === pageRange);
  return { total: range ? range.target * (subtotal / 3066.18) : subtotal, selected, range };
}
