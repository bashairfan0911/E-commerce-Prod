#!/bin/bash

echo "Creating test user..."

kubectl exec -n ekomart deployment/backend-deployment -- node -e "
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.DBURI).then(async () => {
  console.log('Connected to MongoDB');
  
  const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    address: Array
  });
  
  const User = mongoose.model('User', userSchema);
  
  // Check if user exists
  const existingUser = await User.findOne({ email: 'test@example.com' });
  
  if (existingUser) {
    console.log('Test user already exists');
  } else {
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      phone: '1234567890',
      address: []
    });
    
    console.log('Test user created successfully');
    console.log('Email: test@example.com');
    console.log('Password: test123');
  }
  
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
"

echo ""
echo "Test user credentials:"
echo "Email: test@example.com"
echo "Password: test123"
