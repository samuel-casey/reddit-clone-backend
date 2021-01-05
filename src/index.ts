import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async (): Promise<void> => {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);

        // run migrations
        orm.getMigrator().up();

        // // creates an instance of Post
        // const post = orm.em.create(Post, { title: 'first post' });
        // // insert post into DB
        // await orm.em.persistAndFlush(post)

        // find all posts
        // const posts = await orm.em.find(Post, {})
        // console.log(posts)

    } catch (err) {
        console.log(err)
    }

}

main()