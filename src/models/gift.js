const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({ 
    fileName: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true,
        trim: true
    },
    isPrimary: {
        type: Boolean,
        required: true,
        default: false
    }
});

const giftSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    subCategory: {
        type: String,
        trim: true,
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    isPercentageDiscount: { //Discount type is either flat or percentage
        type: Boolean
    },
    costPrice: {
        type: Number
    },
    stockQuantity: {
        type: Number
    },
    minOrderQuantity: {
        type: Number
    },
    primaryImage: { 
        type: {
            fileName: {
                type: String,
                required: true,
                trim: true
            },
            path: {
                type: String,
                required: true,
                trim: true
            },
            isPrimary: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    },
    additionalImages: {
        type: [ { 
            fileName: {
                type: String,
                required: true,
                trim: true
            },
            path: {
                type: String,
                required: true,
                trim: true
            },
            isPrimary: {
                type: Boolean,
                required: true,
                default: false
            }
        } ],
        validate(value) {
            if (value.length > 5) {
                throw new Error('A gift can have maximum of 5 additional images')
            }
        }
    },
    video: {
        type: String
    },
    weight: {
        type: String
    },
    dimensions: {
        type: String
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    material: {
        type: String
    },
    customization: {
        type: Boolean
    },
    tags: [{
        type: String,
    }],
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    returnPolicy: {
        type: String
    },
    careInstructions: {
        type: String
    },
    supplierName: {
        type: String
    },
    supplierPrice: {
        type: Number
    },
    featuredProduct: {
        type: Boolean
    },
    specialDeals: {
        type: String
    },
    taxCategory: {
        type: String
    },
    hsnCode: {
        type: String
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Studio"
    }
})

const Gift = mongoose.model("Gift", giftSchema);

module.exports = Gift;