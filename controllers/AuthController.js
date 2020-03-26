const { User } = require('../models');
const { Op } = require('sequelize');
const hash = require('../helpers/bcrypt');
const check = require('../helpers/checkPass')

class AuthController {
  static goToLogInPage(req, res) {
    let error = req.query.err
    res.render('login', { error: error });
  }

  static login(req, res) {
    User.findOne(
      {
        where: {
          [Op.and]: [
            { username: req.body.username }
          ]
        }
      })
      .then(data => {
        if (data) {
          if (check(req.body.password, data.password)) {
            req.session.user = data.username;
            req.session.userId = data.id;
            res.redirect('/home')
          } else {
            res.redirect('/login?err=wrong password')
          }
        } else {
          res.redirect(`/login/?err=account not found`)
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/')
      }
    })
  }

  static goToSignUpPage(req, res) {
    res.render('signup');
  }

  static signUp(req, res) {
    User.create({
      username: req.body.username,
      password: hash(req.body.password)
    })
      .then(data => {
        res.redirect('/')
      })
      .catch(err => {
        res.send(err)
      })

    // console.log('test')
    // User.create(newUser)
    //   .then(() => {
    //     return User.findAll({ where: { username: newUser.username } })
    //       .then((user) => {
    //         //automatically redirects to libary after sign-up
    //         res.redirect('/gallery?userid=' + user[0].id)

    //       })
    //   })
    //   .then(user => {
    //     res.redirect('/')
    //   })
    //   .catch((err) => {
    //     throw err;
    //   });
  }
}

module.exports = AuthController