const express = require('express');
const router = express.Router();
const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares')
const multer = require('multer');
const path = require('path');
const fs = require('fs');

try{
    fs.accessSync('uploads');
}catch(err){
    console.log('uploads 폴더가 없으므로 생성합니다');
    fs.mkdirSync('uploads');
}

const upload = multer({

    // 저장 위치 (local 스토리지에 저장..)
    // 추후에는 cloud에 저장 대체 예정...
    storage: multer.diskStorage({
        destination(req, file, done){
            done(null, 'uploads');
        },
        filename(req, file, done){  // darkkazma.png
            // 중복을 막기 위해서 파일명 뒤에 날짜 삽입..
            const ext = path.extname(file.originalname);   // 확장자 추출 (.png)
            const basename = path.basename(file.originalname, ext); // darkkazma
            done(null, basename + '_' + new Date().getTime() + ext); // darkkazma15123123.png
        },
    }),
    limits: { fileSize : 20 * 1024 * 1024 },    // 20MB 제한
});


// 게시글 작성
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try{
        const hashtags = req.body.content.match(/#[^\s#]+/g);

        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });

        if(hashtags){
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                where: {name: tag.slice(1).toLowerCase()},
            })));   // [[#노드, true], [#리엑트, true]] 형태로 반환 되기 때문에 아래 구문이 다르다.
            await post.addHashtags(result.map((v) => v[0]));
        }

        if(req.body.image){
            if( Array.isArray(req.body.image)){ // 이미지를 여러 개 올리면 image: [darkkazma.png, godti.png]
              const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
              await post.addImages(images);
            }else{  // 이미지를 하나만 올리면 image: darkkazma.png
              const image = await Image.create({ src: req.body.image });
              await post.addImages(image);
            }
        }

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

// 여러장 일 경우 (array)
// 한장 일 경우 (single)
// json 형태 일 경우 (none)
// File Input이 두개 이상 일 경우 (fields)
router.post('/images', isLoggedIn, upload.array('image'), async(req, res, next) => {
    console.log( req.files );
    res.json(req.files.map((v) => v.filename));
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

// Retweet 작성
router.post('/:postId/retweet',isLoggedIn,  async(req, res, next) => {
    try{

        const post = await Post.findOne({
            where : { id: req.params.postId },
            include: [{
                model: Post,
                as: 'Retweet',
            }]
        });
        if(!post){
            return res.status(403).send('존재하지 않는 게시글 입니다.');
        }

        if( req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)) {
            return res.status(403).send('자신의 글은 리트윗 할 수 없습니다.')
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId : req.user.id ,
                RetweetId: retweetTargetId,
            }
        });
        if(exPost){
            return res.status(403).send('이미 리트윗 했습니다.');
        }
        const retweet = await Post.create({
            UserId : req.user.id,
            RetweetId: retweetTargetId,
            content: 'retweet',
        });

        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                },{
                    model: Image,
                }]
            },{
                model: User,
                attributes: ['id', 'nickname']
            },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            },{ model: User, as: 'Likers', attributes: ['id'] },]
        });

        res.status(201).json(retweetWithPrevPost);
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
router.delete('/:postId',  isLoggedIn, async (req, res, next) => {
    try{
        await Post.destroy({
            where : {
                id: req.params.postId,
                userId : req.user.id,
            },
        });
        res.json({ PostId: parseInt(req.params.postId) });
    }catch(err){
        console.error(err);
        next(err);
    }
});

// router.delete('/:postId',  isLoggedIn, async (req, res, next) => {
//     try{
//         await Post.destroy({
//             where : { id: req.params.postId },
//         });
//         res.json({ PostId: req.params.postId });
//     }catch(err){
//         console.error(err);
//         next(err);
//     }
// });


router.get('/:postId', async(req, res, next) => {
    try{
        const post = await Post.findOne({
            where: { id: parseInt(req.params.postId, 10) },
        });
        if(!post){
            return res.status(404).json('존재하지 않는 게시글 입니다.');
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                },{
                    model: Image,
                }]
            },{
                model: User,
                attributes: ['id', 'nickname'],
            },{
              model :User,
              as : 'Likers',
              attributes : ['id', 'nickname'],
            },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }]
            },{ model: User, as: 'Likers', attributes: ['id'] },]
        });
        res.status(200).json(fullPost);
    }catch(err){
        console.error(err);
        next(err);
    }
});
module.exports = router;

