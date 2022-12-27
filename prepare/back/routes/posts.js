const express = require('express');
const {Post, User, Image, Comment} = require("../models");
const router = express.Router();
const { isLoggedIn } = require('./middlewares');
const { Op } = require('sequelize');


// 게시글 조회
router.get('/', async (req, res, next) => {
    try{
        const where = {};
        if( parseInt(req.query.lastId, 10)){    // 초기 로딩이 아닌 때
            where.id = { [Op.lt] : parseInt(req.query.lastId, 10) }
        }
        const post = await Post.findAll({
            where,
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
                { model: Post, as: 'Retweet', include: [{ model: User, attributes: ['id', 'nickname'], },{ model: Image, }] },
            ]
        });
        res.status(200).json(post);
    }catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;
