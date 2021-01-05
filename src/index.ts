import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";

const main = async () => {

    const orm = await MikroORM.init(mikroOrmConfig);

    // creates an instance of Post
    const post = orm.em.create(Post, { title: 'first post' });
    // insert post into DB
    await orm.em.persistAndFlush(post)
}

main().catch(err => console.log(err))