import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Arg, InputType, Field, Mutation, Ctx } from "type-graphql";
import argon2 from 'argon2';

// similar to a TS interface
@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    async register(
        @Arg('options') options: UsernamePasswordInput
        @Ctx() { em }: MyContext
    ) {
        // hash pw using argon2 library
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, { username: options.username, password: hashedPassword })
        // add user to DB
        await em.persistAndFlush(user);
        return user
    }
}