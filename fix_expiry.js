const fs = require('fs');

const path = './Server/models/Product.js';
let content = fs.readFileSync(path, 'utf8');

const virtualCode = `
productSchema.virtual('daysLeftForPrice').get(function() {
  if (this.price_validity_days == null) return null;
  const start = this.price_updated_at ? this.price_updated_at.getTime() : this.created_at.getTime();
  const msPassed = Date.now() - start;
  const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));
  const left = this.price_validity_days - daysPassed;
  return left > 0 ? left : 0;
});

productSchema.virtual('price_expiry_date').get(function() {
  if (this.price_validity_days == null) return null;
  const start = this.price_updated_at ? this.price_updated_at.getTime() : this.created_at.getTime();
  const expiry = start + (this.price_validity_days * 24 * 60 * 60 * 1000);
  return new Date(expiry);
});
`;

content = content.replace(/productSchema\.virtual\('daysLeftForPrice'\)\.get\(function\(\) \{[\s\S]*?\}\);/, virtualCode.trim());

fs.writeFileSync(path, content);
console.log('Added price_expiry_date virtual');
