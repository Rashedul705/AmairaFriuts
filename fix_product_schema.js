const fs = require('fs');

const path = './Server/models/Product.js';
let content = fs.readFileSync(path, 'utf8');

// Add new fields
content = content.replace(
  "inStock: { type: Boolean }",
  "inStock: { type: Boolean },\n  price_validity_days: { type: Number },\n  price_updated_at: { type: Date, default: Date.now }"
);

// Add virtual property before module.exports
const virtualCode = `
productSchema.virtual('daysLeftForPrice').get(function() {
  if (this.price_validity_days == null) return null;
  const start = this.price_updated_at ? this.price_updated_at.getTime() : this.created_at.getTime();
  const msPassed = Date.now() - start;
  const daysPassed = Math.floor(msPassed / (1000 * 60 * 60 * 24));
  const left = this.price_validity_days - daysPassed;
  return left > 0 ? left : 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
`;

content = content.replace("module.exports = mongoose.model('Product', productSchema);", virtualCode);

fs.writeFileSync(path, content);
console.log('Fixed Product.js schema');
