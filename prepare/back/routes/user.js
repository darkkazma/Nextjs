const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User, Post } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

router.get('/', async (req, res, next) => {
    try{
        if( req.user ) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: Post, attributes: ['id'] },
                    { model: User , as: 'Followings', attributes: ['id'] },
                    { model: User , as: 'Followers', attributes: ['id'] },
                ]
            })

            return res.status(200).json(fullUserWithoutPassword);
        }else{
            res.status(200).json(null);
        }
    }catch(err){
        console.error(err);
        next(err);
    }
})

router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            console.error('err => ', err);
            return next(err);
        }
        if(info){
            console.error('info => ', info);
            return res.status(401).send(info.reason);
        }
        return req.login(user, async(loginErr) => {
            if(loginErr){
                console.error('loginErr ->', loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id:user.id },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: Post },
                    { model: User , as: 'Followings'},
                    { model: User , as: 'Followers'},
                ]
            })
            return res.status(200).json(fullUserWithoutPassword);
        });
    }, null)(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
    try{
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });

        if( exUser ){
            return res.status(403).send('이미 사용중인 아이디 입니다.');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        res.status(200).send("ok");

    }catch(error){
        console.error(error);
        next(error);
    }
});

router.post('/logout', isLoggedIn,  async (req, res, next)=> {
    try{
        await req.logout();
        req.session.destroy();
        res.send('ok');
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;
