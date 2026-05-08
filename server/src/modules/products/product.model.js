const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide the product name"],
      maxlength: [100, "Name can not be more that 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please provide the product price"],
    },

    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more that 1000 characters"],
    },

    image: {
      type: String,
      default: "/uploads/examples.jpeg",
    },

    company: {
      type: String,
      required: true,
      enum: ["liddy", "marcos", "ikea"],
    },

    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["office", "kitchen", "bedroom"],
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    inventory: {
      type: Number,
      default: 14,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    numOfReviews: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

module.exports = mongoose.model("Product", productSchema);
