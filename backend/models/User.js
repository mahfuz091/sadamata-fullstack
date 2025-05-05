const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
  

    email: {
        type: String,
        unique: true,
        sparse: true, 
      },
  
      phone: {
        type: String,
        unique: true,
        sparse: true, 
      },
    googleId: { type: String, unique: true, sparse: true }, 
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    
    isSuperAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },

    
  },

  {
    timestamps: true,
  }
);

// Require at least one of email or phone
userSchema.pre("validate", function (next) {
    if (!this.email && !this.phone) {
      this.invalidate("email", "Email or phone number is required.");
    }
    next();
  });

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check if password matches
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(enteredPassword, this.password);
  console.log(await bcrypt.compare(enteredPassword, this.password));

  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;