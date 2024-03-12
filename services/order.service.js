const Address = require("../models/address.model.js");
const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItems.js");
const cartService = require("./cart.service.js");
import Prisma from "../prisma";

async function createOrder(user, shippAddress) {
  let address;
  if (shippAddress._id) {
    let existedAddress = await Prisma.address.findUnique({
      where:{
        id:shippAddress._id
      }
    })
    address = existedAddress;
  } else {
    address = await Prisma.address.create({
      data:{
       streetAddress,
       city,
       state,
       zipCode,
       user,
       userId:user.id
      }
    })

  }

  const cart = await cartService.findUserCart(user._id);
  const orderItems = [];

  for (const item of cart.cartItems) {

    const orderItem = await Prisma.orderItem.create({
      data:{
        price: item.price,
        product: item.product,
        quantity: item.quantity,
        size: item.size,
        userId: item.userId,
        discountedPrice: item.discountedPrice,
      }
    })
    
    orderItems.push(orderItem);
   
  }

const createdOrder = await Prisma.order.create({
  data:{
    user,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discounte: cart.discounte,
    totalItem: cart.totalItem,
    shippingAddress: address,
    orderDate: new Date(),
    orderStatus: "PENDING", // Assuming OrderStatus is a string enum or a valid string value
    "paymentDetails.status": "PENDING", // Assuming PaymentStatus is nested under 'paymentDetails'
  }
})

  // for (const item of orderItems) {
  //   item.order = savedOrder;
  //   await item.save();
  // }

  return createdOrder;
}

async function placedOrder(orderId) {
  const order = await Prisma.order.update({
    where:{
      id:orderId
    },
    data:{
      orderStatus:"DELIVERED",
      paymentDetails:"COMPLETED"
    }
  })
  return  order
}

async function confirmedOrder(orderId) {
  const order = await Prisma.order.update({
    where:{
      id:orderId
    },
    data:{
      orderStatus:"CONFIRMED"
    }
  })
  return  order
}

async function shipOrder(orderId) {
  const order = await Prisma.order.update({
    where:{
      id:orderId
    },
    data:{
      orderStatus:"SHIPPED"
    }
  })
  return  order
}

async function deliveredOrder(orderId) {
  const order = await Prisma.order.update({
    where:{
      id:orderId
    },
    data:{
      orderStatus:"DELIVERED"
    }
  })
  return  order
}

async function cancelledOrder(orderId) {
  const order = await Prisma.order.update({
    where:{
      id:orderId
    },
    data:{
      orderStatus:"CANCELLED"
    }
  })
  return order
}

async function findOrderById(orderId) {

  const order = await Prisma.order.findUnique({
    where:{
      id:orderId
    },
    include:{
      user:true,
      orderItems:true,
      shippingAddress:true
    }
  })
  return order;
}

async function usersOrderHistory(userId) {
  try {

      const orders = await Prisma.order.findMany({
        where:{
          id:userId,
          createdAt:"desc",
          orderStatus:"PLACED"
        },
        include:{
               orderItems:true,
               paymentDetails:true
        }
      }
      ) 

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getAllOrders() {
  return await Prisma.order.findMany({
    where:{
      createdAt:"desc"
    }
  })
}

async function deleteOrder(orderId) {
  const order = await Prisma.order.delete(orderId)
  if(!order)throw new Error("order not found with id ",orderId)

  await Order.findByIdAndDelete(orderId);
}

module.exports = {
  createOrder,
  placedOrder,
  confirmedOrder,
  shipOrder,
  deliveredOrder,
  cancelledOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
