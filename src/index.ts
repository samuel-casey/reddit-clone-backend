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
import cors from 'cors';
import redis, { RedisClient } from 'redis';
import connectRedis from 'connect-redis'
import session from 'express-session';

const main = async (): Promise<void> => {
    try {
        const orm = await MikroORM.init(mikroOrmConfig);

        // run/update migrations
        orm.getMigrator().up();

        const app = express()

        const RedisStore = connectRedis(session);
        const redisClient = redis.createClient();


        app.set("trust proxy", 1);
        app.use(
            cors({
                origin: process.env.CORS_ORIGIN,
                credentials: true,
            })
        );

        app.use(
            session({
                name: 'qid',
                store: new RedisStore({ client: redisClient, disableTouch: true }),
                // @dev docs on settings here: 
                cookie: {
                    maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                    httpOnly: true,
                    secure: __prod__,
                    sameSite: "lax"
                },
                secret: 'secretsarenofun',
                resave: false,
            })
        )

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