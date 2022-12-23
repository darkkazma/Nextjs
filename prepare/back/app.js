const express = require('express');
const db = require('./models');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const morgan = require('morgan');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const passportConfig = require('./passport');
const passport = require("passport");

dotenv.config();

const app = express();
db.sequelize.sync()
    .then(() => {
        console.log('db 연결 성공!!');
    })
    .catch(console.error);

passportConfig();

app.use(morgan('dev'));

app.use(cors({
    //origin: '*',
    origin: 'http://localhost:3000',
    credentials: true,
}));

// JSON형태로 Reqeust Body를 받기 위함.
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(cookieParser('nodebirdsecret'));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET    // secret을 기반으로 암호화 (key)
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);


app.listen(3065, () => {
    console.log('서버 실행 중!');
});