const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  country: {
    type: String,
  },
  cityState: {
    type: String,
  },
  linkedinUrl: {
    type: String,
  },
  profession: {
    type: String,
  },
  location: {
    type: String,
  },
  notifications: {
    type: Boolean,
    default: true,
  },
  monthlyBudget: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    if (this.name) {
      const [firstName, ...lastName] = this.name.split(' ');
      this.firstName = firstName;
      this.lastName = lastName.join(' ') || '';
      this.name = undefined; // Remove the name field if it exists
    }
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
