import Prisma from "../prisma";

const Cart = require("../models/cart.model.js");
const CartItem = require("../models/cartItem.model.js");
const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");


// Create a new cart for a user
async function createCart(user) {

  const createdCart= await Prisma.cart.create({
    data:{
      user,
      userId:user._id
    }
  })
 
  return createdCart;
}

// Find a user's cart and update cart details
async function findUserCart(userId) {

 var cart = await Prisma.cart.findUnique({
    where:{
      userId
    }
  })
  
 let cartItems = await Prisma.cartItem.findMany({
    where:{
      cart:cart.id
    },
    include:{
      product:true
    }
  })
  

  

  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItem = 0;

  for (const cartItem of cartItems) {
    totalPrice += cartItem.price;
    totalDiscountedPrice += cartItem.discountedPrice;
    totalItem += cartItem.quantity;
  }

 var cart= await Prisma.cart.update({
    where:{
      userId,
    },
    data:{
       totalDiscountedPrice,
       totalItem,
       totalPrice,
       discount : Math.round(totalItem - totalDiscountedPrice)
    }
  })

  // const updatedCart = await cart.save();
  return cart;
}

// Add an item to the user's cart
async function addCartItem(userId, req) {

let Product=  await Prisma.product.findUnique({
    where:{
      id:req.productId,
      AND:{
        quantity:{gte:0}
      }
    }
  })
 
  if(!Product){
    return "product not found"
  }
  if(Product.quantity == 0){
    return "product is out of stock"
  }
const isPresent = await Prisma.cart.update({
  where:{
    userId
  },
  data:{
    userId,
    cartItems:{
      create:{
        productId:req.productId,
        product:Product, 
        
      }
    }
  }
})
   

  if (!isPresent) {
    const cartItem = await Prisma.cart.create({

      where:{
        userId,
      },
      data:{
        cartItems:{
          create:{
            productId:req.productId,
            product: Product,
            quantity: 1,
            userId,
            price: Product.discountedPrice,
            size: req.size,
            discountedPrice:Product.discountedPrice
          }
        }
      }
    })
}
  return 'Item added to cart';
}

module.exports = { createCart, findUserCart, addCartItem };
