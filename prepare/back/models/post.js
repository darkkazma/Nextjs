module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // 이모티콘 저장
    });
    Post.associate = (db) => {
        db.Post.belongsTo(db.User);
        db.Post.hasMany(db.Comment);
        db.Post.hasMany(db.Image);

        // Hash Tag의 경우 Post 와 N:N의 관계를 갖기 때문에 서로 belongsToMay
         db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

        // Post에 좋아요를 누른 유저정
        db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });

        // 어떤 게시글의  retweet 게시글 확인
        db.Post.belongsTo(db.Post, { as: 'Retweet'});
    };
    return Post;
}