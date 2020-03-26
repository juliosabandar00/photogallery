const { Router } = require('express');
const indexRouter = Router();
// controller
const Controller = require('../controllers/Controller');
indexRouter.get('/home', Controller.showGallery);
indexRouter.get('/upload', Controller.showUpload)
indexRouter.post('/upload', Controller.uploadImage)                 //with multer
indexRouter.post('/gallery/image/add', Controller.addImage);        //with url
indexRouter.get('/gallery/image/:id', Controller.showImage);        //DISPLAY IMAGE WITH OPTION TO LIKE/DISLKE
indexRouter.post('/gallery/image/vote/:id', Controller.rateImage);  //LIKE/DISLIKE IMAGE
indexRouter.get('/profile', Controller.showProfile);
//profile
indexRouter.get('/changeUsername', Controller.toChangeUsername);
indexRouter.post('/changeUsername', Controller.changeUsername);
indexRouter.get('/changePassword', Controller.toChangePassword);
indexRouter.post('/changePassword', Controller.changePassword);
indexRouter.get('/deleteAccount', Controller.deleteAccount);

module.exports = indexRouter;