const express = require("express");
const { Op } = require("sequelize");
const { Post, Comment, User, Image, Hashtag } = require("../models");
const router = express.Router();

router.get("/:hashtag", async (req, res, next) => {
  //GET /hashtag/노드
  try {
    const where = {};
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닌 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    }
    const post = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"]
      ],
      include: [
        { model: Hashtag, where : {name: decodeURIComponent(req.params.hashtag) }, },
        { model: User, attributes: ["id", "nickname"] },
        { model: Image },
        {
          model: Comment,
          include: [{ model: User, attributes: ["id", "nickname"], order: [['createdAt', 'DESC']]
          }],
        },
        { model: User, as: "Likers", attributes: ["id"] },
        {
          model: Post,
          as: "Retweet",
          include: [
            { model: User, attributes: ["id", "nickname"] },
            { model: Image },
          ],
        },
      ],
    });
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
