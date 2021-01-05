import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Resolver, Arg, InputType, Field, Mutation, Ctx, ObjectType, emitSchemaDefinitionFile } from "type-graphql";
import argon2 from 'argon2';

// similar to a TS interface
@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

// object that returns either a user or an error if there's an error
@ObjectType(
    class UserResponse {
        @Field(() => [FieldError], { nullable: true })
        errors?: FieldError[];

        @Field(() => User, { nullable: true })
        user?: User;
    }


@ObjectType()

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {

        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: 'username',
                    message: 'username must be at least 3 characters long'
                }]
            }
        }

        if (options.password.length <= 3) {
            return {
                errors: [{
                    field: 'username',
                    message: 'password must be at least 4 characters long'
                }]
            }
        }
        // hash pw using argon2 library
        const hashedPassword = await argon2.hash(options.password)
        const user = em.create(User, { username: options.username, password: hashedPassword })

        try {
            // add user to DB
            await em.persistAndFlush(user);
            return { user }
        } catch (error) {
            if (error.code = '23505') {
                return {
                    errors: [{
                        field: 'username',
                        message: `username ${options.username} already exists`
                    }]
                }
            }
        }


        console.log('\nERROR WHILE REGISTERING: \n\n', error)

    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {

        const user = await em.findOne(User, { username: options.username });

        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: `username ${options.username} doesn't exist`
                }]
            }
        }

        const validPassword = await argon2.verify(user.password, options.password)
        if (!validPassword) {
            return {
                errors: [{
                    field: 'password',
                    message: `password incorrect`
                }]
            }
        }

        return { user }
    }
}