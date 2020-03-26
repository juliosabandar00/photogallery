const { Image, User, ImageUser } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer')
const path = require('path')
const check = require('../helpers/checkPass')
const hash = require('../helpers/bcrypt');
const checkFileType = require('../helpers/checkFileType');

class Controller {
    //after login/sign-up
    static showGallery(req, res) {
        // let id = Number(req.query.userid);
        Image.findAll().then( images =>{
            //sort the images based on score
            return images.sort((a,b)=>{
                return b.score - a.score;
            });
        }).then( images =>{
            res.render('home', {
                images : images
            });
        }).catch( err => {
            res.send(err);
        });
    }
    //when url is submited on gallery
    static addImage(req, res) {
        let newImage = {
            url: req.body.url,
        }
        Image.create(newImage).then(()=>{
            res.redirect('/home');
        });
    }
    static showUpload(req, res) {
        res.render('upload')
    }
    static uploadImage(req, res) {
        //can be moved to helper
        const storage = multer.diskStorage({
            destination: './public/uploads/',
            filename: (req, file, cb) => {
              cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        })
        const upload = multer({
            storage: storage,
            // size limit 10 mb
            limits: { fileSize: 10000000 },
            fileFilter: (req, file, cb) => {
              checkFileType(file, cb)
            }
        }).single('image') 
        
        upload(req, res, (err) => {
            if (err) {
              res.send(err)
            } else {
                console.log(req.file)
                let newImage = {
                    url: req.file.path.substring(6),
                }
                console.log(newImage.url)
                Image.create(newImage).then(()=>{
                    res.redirect('/home');
                });
            }
        });
    }
    //when the image is cliked
    static showImage(req, res) {
        let imageId = Number(req.params.id);
        Image.findByPk(imageId).then((image) => {
            res.render('image', {
                image: image
            });
        }).catch(err => {
            res.send(err);
        });
    }
    //after like/dislike button selected
    static rateImage(req, res) {
        let vote = req.body.vote;
        let imageId = Number(req.params.id);
        let userId = req.session.userId;
        //find the vote that relate to the user and image
        ImageUser.findOne({
            where: {
                [Op.and]: [
                    {ImageId : imageId},
                    { UserId : userId }     
                ]
            }
        })
        .then(imageuser => {
            //if the vote already exist, update the vote, else, make a new vote
            return imageuser ? ImageUser.update({ImageId : imageId, UserId : userId, Vote : vote}, {where: {
                [Op.and]: [
                    {ImageId : imageId},
                    { UserId : userId }     
                ]
            }}) : ImageUser.create({ImageId : imageId, UserId : userId, Vote : vote});
        }).then(()=>{
            //count the number of total likes of the image
            return ImageUser.count({
                where: {
                    ImageId : imageId,
                    Vote: 'TRUE'
                }
            });
        }).then(likes =>{
            //update the no. of likes of the image
            return Image.update({likes : likes}, {where : {id : imageId}})
        }).then(()=>{
            //count the number of total dislikes of the image
            return ImageUser.count({
                where: {
                    ImageId : imageId,
                    Vote: 'FALSE'
                }
            });
        }).then(dislikes =>{
            //update the no. of dislikes of the image
            return Image.update({dislikes : dislikes}, {where : {id : imageId}})
        }).then(()=>{
            //go back to gallery view
            res.redirect('/home');
        }).catch(err =>{
            res.send(err);
        });
    }
    static showProfile(req, res){
        res.render('profile')
    }
    static toChangeUsername(req, res){
        res.render('editUser', {error : null})
    }
    static toChangePassword(req, res){
        res.render('editPass', {error : null})
    }
    static changeUsername(req, res){
        if(req.body.username == req.session.user){
            User.update({username : req.body.newUser}, {where: {username : req.body.username}}).then(()=>{
                res.redirect('/home')
            }).catch( err => {
                res.render('editUser', {error : 'Something Went Wrong'})
            })
        }else{
            res.render('editUser', {error : 'Incorrect Username'})
        }
    }
    static changePassword(req, res){
        User.findOne({where : { username: req.session.user }})
        .then((data)=> {    

            console.log('current password logged by user:')        
            console.log(req.body.password)

            console.log('hashed password logged by user:')        
            // console.log(hash(req.body.newUser));

            console.log('hashed password retrieved from database:')        
            console.log(data.password)

            if (check(req.body.password, data.password)){
                console.log('passed')
                User.update({password : hash(req.body.newPass)}, {where: {username : req.session.user}})
                res.redirect('/home')
            }else{
                res.render('editPass', {error : 'Incorrect Password'})
            }
        }).catch(err=>{
            res.send(err)
        })
    }
    static deleteAccount(req, res){
        let username = req.session.user;
        req.session.destroy(err => {
            if (err) {
              res.send(err)
            } else {
              res.redirect('/')
              User.destroy({where: {username : username}})
            }
        })
    }
}
module.exports = Controller;