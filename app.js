const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const session = require('express-session')
const indexRouter = require('./routes/index.js')
const authRouter = require('./routes/authRouter');

let config = {
    secret: 'rahasia'
}

app.set('view engine', 'ejs');
app.use(session(config))
app.use(express.urlencoded({ extended: true }))
app.use( express.static( "public" ) );

app.use(authRouter)
app.use(indexRouter);
app.listen(port, () => {
    console.log('Listening on port ', port);
});