import ProductModel from '../models/product.model.js';

import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});


// image upload
var imagesArr = [];

export async function uploadImages(request, response) {
    try {
        imagesArr = [];

        const image = request.files;

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < image?.length; i++) {

            const img = await cloudinary.uploader.upload(
                image[i].path,
                options,
                function (error, result) {
                    imagesArr.push(result.secure_url);
                    fs.unlinkSync(`uploads/${request.files[i].filename}`);
                }
            );
        }

        return response.status(200).json({
            images: imagesArr
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// create product
export async function createProduct(request, response) {
    try {
        let product = new ProductModel({
            name: request.body.name,
            description: request.body.description,
            images: imagesArr,
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            catName: request.body.catName,
            catId: request.body.catId,
            subCatId: request.body.subCatId,
            subCat: request.body.subCat,
            thirdsubCat: request.body.thirdsubCat,
            thirdsubCatId: request.body.thirdsubCatId,
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productRam: request.body.productRam,
            size: request.body.size,
            productWeight: request.body.productWeight,
        });

        product = await product.save();

        if (!product) {
            return response.status(500).json({
                message: "Product not created",
                error: true,
                success: false
            });
        }

        imagesArr = [];

        return response.status(200).json({
            error: false,
            success: true,
            message: "Product created successfully",
            product: product
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all product
export async function getAllProducts(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage);
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find().populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all product by category id
export async function getAllProductsByCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            catId: request.params.id
        }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all product by category name
export async function getAllProductsByCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            catName: request.query.catName
        }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all product by sub category id
export async function getAllProductsBySubCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            subCatId: request.params.id
        }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all product by sub category name
export async function getAllProductsBySubCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            subCat: request.query.subCat
        }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function getAllProductsByThirdLavelCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            thirdsubCatId: request.params.id
        }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function getAllProductsByThirdLavelCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({
            thirdsubCat: request.query.thirdsubCat
        }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all product by price
export async function getAllProductsByPrice(request, response) {
    try {
        let productList = [];

        if (request.query.catId !== "" && request.query.catId !== undefined) {
            const productListArr = await ProductModel.find({
                catId: request.query.catId,
            }).populate("category");

            productList = productListArr;
        }

        if (request.query.subCatId !== "" && request.query.subCatId !== undefined) {
            const productListArr = await ProductModel.find({
                subCatId: request.query.subCatId,
            }).populate("category");

            productList = productListArr;
        }

        if (request.query.thirdsubCatId !== "" && request.query.thirdsubCatId !== undefined) {
            const productListArr = await ProductModel.find({
                thirdsubCatId: request.query.thirdsubCatId,
            }).populate("category");

            productList = productListArr;
        }

        const filteredProducts = productList.filter((product) => {
            if (request.query.minPrice && product.price < parseInt(+request.query.minPrice)) {
                return false;
            }
            if (request.query.maxPrice && product.price > parseInt(+request.query.maxPrice)) {
                return false;
            }
            return true;
        });

        return response.status(200).json({
            error: false,
            success: true,
            products: filteredProducts,
            totalPages: 0,
            page: 0
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all product by rating
export async function getAllProductsByRating(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        let products = [];

        if (request.query.catId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                catId: request.query.catId
                //    subCatId: request.query.subCatId,
                //    thirdsubCatId: request.query.thirdsubCatId
            }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        }

        if (request.query.subCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                subCatId: request.query.subCatId
            }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        }

        if (request.query.thirdsubCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                thirdsubCatId: request.query.thirdsubCatId
            }).populate("category").skip((page - 1) * perPage).limit(perPage).exec();

        }

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
            totalPages: totalPages,
            page: page
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all products count
export async function getProductsCount(request, response) {
    try {
        const productsCount = await ProductModel.countDocuments();

        if (!productsCount) {
            response.status(500).json({
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            productCount: productsCount
        })


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// get all features product
export async function getAllFeaturedProducts(request, response) {
    try {
        const products = await ProductModel.find({
            isFeatured: true
        }).populate("category");

        if (!products) {
            return response.status(500).json({
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            products: products,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// delete product
export async function deleteProduct(request, response) {
    try {
        const product = await ProductModel.findById(request.params.id).populate("category");

        if (!product) {
            return response.status(404).json({
                error: true,
                success: false,
                message: "Product not found"
            });
        }

        const images = product.images;

        for (img of images) {
            const imgUrl = img;
            const urlArr = imgUrl.split("/");
            const image = urlArr[urlArr.length - 1];

            const imageName = image.split(".")[0];

            if (imageName) {
                cloudinary.uploader.destroy(imageName, (error, result) => {
                    // console.log(error, result);
                });
            }
        }

        const deleteProduct = await ProductModel.findByIdAndDelete(request.params.id);

        if (!deleteProduct) {
            return response.status(404).json({
                message: "Product not deleted",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            message: "Product deleted",
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


//get single product
export async function getProduct(request, response) {
    try {
        const product = await ProductModel.findById(
            request.params.id
        ).populate("category");

        if (!product) {
            return response.status(404).json({
                error: false,
                success: true,
                message: "Product not found",
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            product: product
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
// chua test]


// delete images
export async function removeImageFromCloudinary(request, response) {
    const imgUrl = request.query.img;

    const urlArr = imgUrl.split("/");
    const image = urlArr[urlArr.length - 1];

    const imageName = image.split(".")[0];

    if (imageName) {
        const res = await cloudinary.uploader.destroy(
            imageName,
            (error, result) => {
                // console.log(error, result)
            }
        );

        if (res) {
            response.status(200).send(res);
        }
    }
}


// update product 
export async function updateProduct(request, response) {
    try {
        const product = await ProductModel.findByIdAndUpdate(
            request.params.id,
            {
                name: request.body.name,
                description: request.body.description,
                images: imagesArr,
                brand: request.body.brand,
                price: request.body.price,
                oldPrice: request.body.oldPrice,
                catName: request.body.catName,
                catId: request.body.catId,
                subCatId: request.body.subCatId,
                subCat: request.body.subCat,
                thirdsubCat: request.body.thirdsubCat,
                thirdsubCatId: request.body.thirdsubCatId,
                countInStock: request.body.countInStock,
                rating: request.body.rating,
                isFeatured: request.body.isFeatured,
                discount: request.body.discount,
                productRam: request.body.productRam,
                size: request.body.size,
                productWeight: request.body.productWeight,
            },
            { new: true }
        );


        if (!product) {
            return response.status(404).json({
                message: "Product can not be updated",
                error: true,
                success: false
            });
        }

        imagesArr = [];

        return response.status(200).json({
            error: false,
            success: true,
            message: "Product updated successfully",
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }

}

// Done !!!