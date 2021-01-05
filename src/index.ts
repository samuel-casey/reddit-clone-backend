import "reflect-metadata"
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async (): Promise<void> => {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);

        // run/update migrations
        orm.getMigrator().up();

        const app = express()

        const apolloServer = new ApolloServer({
            schema: await buildSchema({
                resolvers: [HelloResolver, PostResolver, UserResolver],
                validate: false
            }),
            // special fn that returns object accessible to all resolvers
            context: () => ({ em: orm.em })
        });

        apolloServer.applyMiddleware({ app })

        app.get('/', (_req: express.Request, res: express.Response) => {
            res.send('hello')
        })

        app.listen(4000, () => {
            console.log('server running on localhost:4000')
        })
    } catch (err) {
        console.log(err)
    }

}

main()