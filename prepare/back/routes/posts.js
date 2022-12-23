const express = require('express');
const {Post, User, Image, Comment} = require("../models");
const router = express.Router();
const { isLoggedIn } = require('./middlewares')


// 게시글 조회
router.get('/', async (req, res, next) => {
    try{
        const post = await Post.findAll({
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC']
            ],
            include: [
                { model: User, attributes: ['id', 'nickname'] },
                { model: Image },
                { model: Comment, include: [{model : User, attributes: ['id', 'nickname']}] },
                { model: User, as: 'Likers', attributes: ['id'] },
            ]
        });
        res.status(200).json(post);
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;
