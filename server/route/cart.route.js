import { Router } from 'express';

import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { addToCartItemController, deleteCartItemQtyController, getToCartItemController, updateCartItemQtyController } from '../controllers/cart.controller.js';

const cartRouter = Router()

cartRouter.post('/add', auth, addToCartItemController);
cartRouter.get('/get', auth, getToCartItemController);
cartRouter.put('/update-qty', auth, updateCartItemQtyController);
cartRouter.delete('/delete-cart-item', auth, deleteCartItemQtyController);




export default cartRouter;