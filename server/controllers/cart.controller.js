import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";

export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId
        const { productId, quantity = 1 } = request.body

        if (!productId) {
            return response.status(402).json({
                message: "Provide productId",
                error: true,
                success: false
            })
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })

        // Nếu đã có trong giỏ -> tăng số lượng
        if (checkItemCart) {
            const updatedCart = await CartProductModel.findByIdAndUpdate(
                checkItemCart._id,
                { quantity: checkItemCart.quantity + quantity },
                { new: true }
            )

            return response.status(200).json({
                data: updatedCart,
                message: "Cart updated successfully",
                error: false,
                success: true
            })
        }

        // Nếu chưa có -> thêm mới
        const cartItem = new CartProductModel({
            quantity: quantity,
            userId: userId,
            productId: productId
        })

        const save = await cartItem.save();

        const updateCartUser = await UserModel.updateOne(
            { _id: userId },
            {
                $push: {
                    shopping_cart: productId
                }
            }
        )

        return response.status(200).json({
            data: save,
            message: "Item added to cart successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const getToCartItemController = async (request, response) => {
    try {
        const userId = request.userId;

        const cartItem = await CartProductModel.find({
            userId: userId
        }).populate('productId')

        return response.json({
            data: cartItem,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const updateCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId
        const { _id, qty } = request.body

        if (!_id || !qty) {
            return response.status(400).json({
                message: "provide _id, qty"
            })
        }

        const updateCartitem = await CartProductModel.updateOne(
            {
                _id: _id,
                userId: userId
            },
            {
                quantity: qty
            }
        )

        return response.json({
            message: "Update cart",
            success: true,
            error: false,
            data: updateCartitem
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const deleteCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId
        const { _id, productId } = request.body

        if (!_id) {
            return response.status(400).json({
                message: "provide _id",
                error: true,
                success: false
            })
        }

        const deleteCartitem = await CartProductModel.deleteOne(
            {
                _id: _id,
                userId: userId
            }
        )

        if (!deleteCartitem) {
            return response.status(400).json({
                message: "The product in the cart is not found",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({
            _id: userId
        })

        const cartItems = user?.shopping_cart;

        const updatedUserCart = [...cartItems.slice(0, cartItems.indexOf(productId)), ...cartItems.slice(cartItems.indexOf(productId) + 1)];

        user.shopping_cart = updatedUserCart;

        await user.save();


        return response.json({
            message: "Item remove",
            success: true,
            error: false,
            data: deleteCartitem
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}