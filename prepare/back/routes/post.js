const express = require('express');
const router = express.Router();
const { Post, Comment, Image, User } = require('../models');
const { isLoggedIn } = require('./middlewares')



// 게시글 작성
router.post('/', isLoggedIn, async (req, res, next) => {
    try{
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [
                { model : Image },
                { model : Comment, include: [{ model : User, attributes: ['id', 'nickname']}] },    // 댓글 작성자
                { model : User, attributes: ['id', 'nickname'] },       // 게시글 작성자
                { model : User, as: 'Likers', attributes: ['id'] },     // 종아요 누른 사람
            ]
        });
        res.status(201).json(fullPost);
    }catch(err){
        console.log(err);
        next(err);
    }
});

// 댓글 작성
router.post('/:postId/comment',isLoggedIn,  async(req, res, next) => {
    try{

        const post = await Post.findOne({
            where : { id: req.params.postId },
        });
        if(!post){
            return res.status(403).send('존재하지 않는 게시글 입니다.');
        }

        const comment = await Comment.create({
            content: req.body.content,
            PostId : parseInt(req.params.postId, 10),
            UserId : req.body.userId,
        });

        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [
                { model: User, attributes: ['id', 'nickname']}
            ]
        });

        res.status(201).json(fullComment);
    }catch(err){
        console.log(err);
        next(err);
    }
});

router.patch('/:postId/like', async(req, res, next) => {
    try{

        const post = await Post.findOne({ where: { id: req.params.postId }});
        if(!Post){
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.addLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });

    }catch(err){
        console.log(err);
        next(err);
    }
});

router.delete('/:postId/like', async(req, res, next) => {
    try{
        const post = await Post.findOne({ where: { id: req.params.postId }});
        if(!Post){
            return res.status(403).send('게시글이 존재하지 않습니다.');
        }
        await post.removeLikers(req.user.id);
        res.json({ PostId: post.id, UserId: req.user.id });

    }catch(err){
        console.log(err);
        next(err);
    }
});

// 게시글 삭제
router.delete('/', isLoggedIn, (req, res, next) => {

});

module.exports = router;

