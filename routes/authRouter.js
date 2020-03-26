const authRouter = require('express').Router();
const AuthController = require('../controllers/AuthController');

// SIGN UP
authRouter.get('/signUp', AuthController.goToSignUpPage);
authRouter.post('/signUp', AuthController.signUp);

// SIGN IN
authRouter.get('/', AuthController.goToLogInPage);
authRouter.get('/login', AuthController.goToLogInPage);
authRouter.post('/login', AuthController.login);
authRouter.use((req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login/?err=you have to log in')
  }
})
// authRouter.get('/home', (req, res) => {
//   res.render('home')
// })

// LOG OUT
authRouter.get('/logout', AuthController.logout)


module.exports = authRouter;