const fetch = require('node-fetch');

async function test() {
  // First login
  const loginRes = await fetch('http://localhost:5001/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'amaira12345' })
  });
  const { token } = await loginRes.json();
  if (!token) throw new Error("Login failed");
  
  // Now add product
  const payload = {
    title: "Test Local Product",
    name: "Test Local Product",
    description: "Testing local backend",
    pricePerKg: 500,
    price_per_kg: 500,
    basePrice: 500,
    daysLeftForPrice: 10,
    originalPrice: 10,
    category: "Combo Package",
    inStock: true
  };
  
  const res = await fetch('http://localhost:5001/api/products', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Response:", data);
}
test().catch(console.error);
