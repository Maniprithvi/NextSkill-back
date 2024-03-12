import Prisma from "../prisma";

const Category = require("../models/category.model");
const Product = require("../models/product.model");

// Create a new product
async function createProduct(reqData) {

let category = await Prisma.category.findUnique({
  where:{
    name:reqData.categoryName
  }
});

if(!category){
  category=  await Prisma.category.create({
    data:{
      name:reqData.categoryName
    }
   })
}


const Product = await Prisma.product.create({
  data:{
    title: reqData.title,
    color: reqData.color,
    description: reqData.description,
    discountedPrice: reqData.discountedPrice,
    discountPersent: reqData.discountPersent,
    imageUrl: reqData.imageUrl,
    brand: reqData.brand,
    price: reqData.price,
    sizes: reqData.size,
    quantity: reqData.quantity,
    category
  }
})
 
  return Product;
}
// Delete a product by ID
async function deleteProduct(productId) {
  const product = await Prisma.product.delete({
    id:productId
  })

  if (!product) {
    throw new Error("product not found with id - : ", productId);
  }

  return "Product deleted Successfully";
}

// Update a product by ID
async function updateProduct(productId, reqData) {

  const updatedProduct = await Prisma.product.update({
    where:{
      id:productId
    },
    data:{
      title: reqData.title ,
      color: reqData.color,
      description: reqData.description,
      discountedPrice: reqData.discountedPrice,
      discountPersent: reqData.discountPersent,
      imageUrl: reqData.imageUrl,
      brand: reqData.brand,
      price: reqData.price,
      sizes: reqData.size,
      quantity: reqData.quantity,
      Category:reqData.categoryName
    }
  })
  return updatedProduct;
}

// Find a product by ID
async function findProductById(id) {
  const product = await Prisma.product.findUnique({
    where:{
      id:id
    }
  })

  if (!product) {
    throw new Error("Product not found with id " + id);
  }
  return product;
}

// Get all products with filtering and pagination
async function getAllProducts(reqQuery) {
  let {
    category,
    color,
    size,
    minPrice,
    maxPrice,
    minDiscount,
    sort,
    stock,
    pageNumber,
    pageSize,
  } = reqQuery;
  // (pageSize = pageSize || 10), (pageNumber = pageNumber || 1);
 
  if(category){
  const categoryProduct = await Prisma.category.findUnique({
    where:{
      name:category
    }
  })
}  
// if (category) {
  //   const existCategory = await Prisma.category.findMany({
  //     where:{
  //       name:category
  //     }
  //   })
  //   if (existCategory)
  //     query = query.where("category").equals(existCategory._id);
  //   else return { content: [], currentPage: 1, totalPages:1 };
  // }

  if (color) {
 return await Prisma.product.findMany({
      where:{
        color:color
      }
    })
    // query = query.where("color").in([...colorSet]);
  }

  if (size) {
return await Prisma.size.findMany({
    where:{
      name:size
    }
  })

    // const sizesSet = new Set(sizes);
    
    // query = query.where("sizes.name").in([...sizesSet]);
  }

  if (minPrice && maxPrice) {
return await Prisma.product.findMany({
    where:{
      AND:{
       discountedPrice:{lte:minPrice,gte:maxPrice}
      }
    } 
})

    // query = query.where("discountedPrice").gte(minPrice).lte(maxPrice);
  }

  if (minDiscount) {
   return await Prisma.product.findMany({
     where:{
    AND:{
      discountedPrice:{lte:minDiscount}
    }
     }
    })
    // query = query.where("discountPersent").gt(minDiscount);
  }



  if (stock) {
    let productsStock
    if (stock === "in_stock") {
     return productsStock = await Prisma.product.findMany({
        where:{
          AND:{
            quantity:{gt:0}
          }
        }
      })
     
    } else if (stock === "out_of_stock") {
     return productsStock = await Prisma.product.findMany({
        where:{
          AND:{
            quantity:{lte:0}
          }
        }
      })
    }
  }

  if (sort) {
    const sortDirection = sort === "price_high" ? "asc" : "desc";
    const  productSort = await Prisma.product.findMany({
        where:{
          AND:{
            price:sortDirection
          }
        }
      })
      return productSort
  }

  // Apply pagination
  // const totalProducts = await Product.countDocuments(query);
  // const skip = (pageNumber - 1) * pageSize;
  // query = query.skip(skip).limit(pageSize);
  // const products = await query.exec();
  // const totalPages = Math.ceil(totalProducts / pageSize);
  // return { content: products, currentPage: pageNumber, totalPages:totalPages };
}



module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getAllProducts,
  findProductById,
};
