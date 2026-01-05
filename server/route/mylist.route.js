import { Router } from 'express';

import auth from '../middlewares/auth.js';
import { addToMyListController, deleteToMyListController, getToMyListController } from '../controllers/mylist.controller.js';

const myListRouter = Router()
// Test API Postman
myListRouter.post('/add', auth, addToMyListController);
myListRouter.delete('/remove/:id', auth, deleteToMyListController);
myListRouter.get('/get', auth, getToMyListController);



// export default myListRouter
export default myListRouter;