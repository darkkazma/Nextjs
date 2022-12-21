module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { // MySQL 에는 users 테이블 생성
        // id가 기본적으로 들어가 있다.
        email: {
            type: DataTypes.STRING(30),
            allowNull: false, // 필수
            unique: true,   //고유한 값
        },
        nickname: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
     charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장
    });
    User.associate = (db) => {
        /* 사용자가 게시글을 여러개 작성 할수 있는가? yes
        *  한 게시글은 사용자가 여려명 일 수 있는가? no
        * => 1:N 관계 성립.
        *  N:N 관계 일 때는 중간 테이블이 생성된다.
        * */
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);

        // 좋아요를 누른 게시글 (
        db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });

        /*
           Foreignkey를 사용하는 이유는
           User와 User 테이블 사잉에 Follow 라는 중간 테이블이 생성되는데 UserId, UserId 이름이 같기 때문에
           Foreignkey를 이용하여 FollowingId, FollowerId로 이름을 변경 해 준다.
        */
        db.User.belongsToMany(db.User, { through: 'Follow', as : 'Followers', foreignKey: 'FollowingId' });
        db.User.belongsToMany(db.User, { through: 'Follow', as : 'Followings', foreignKey: 'FollowerId' });
    };
    return User;
}