import { Sequelize } from "sequelize";

export default class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            mb_id:{
                type:Sequelize.VARCHAR(45),
                allowNull: false,
                unique: true,
            },
            mb_pw:{
                type:Sequelize.VARCHAR(45),
                allowNull: false,
            },
            socialOnly:{
                type:Sequelize.BOOLEAN,
                allowNull: false,
            },
            comment:{
                type:Sequelize.VARCHAR(100),
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        })
    }
}