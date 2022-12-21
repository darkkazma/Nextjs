module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', { // MySQL 에는 users 테이블 생성
            // id가 기본적으로 들어가 있다.
            name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci', // 한글 저장
        });
    Hashtag.associate = (db) => {

        // Hash Tag의 경우 Post 와 N:N의 관계를 갖기 때문에 서로 belongsToMay
        db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
    };
    return Hashtag;
}