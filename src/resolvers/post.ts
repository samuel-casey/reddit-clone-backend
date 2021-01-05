import { Post } from "../entities/Post";
import { MyContext } from "src/types";
import { Resolver, Query, Ctx, Arg, Int, Mutation } from "type-graphql";
@Resolver()
export class PostResolver {
    // return array of Posts
    @Query(() => [Post])
    posts(@Ctx() { em }: MyContext): Promise<Post[]> {
        return em.find(Post, {})
    }

    // find Post by id
    // return Post or null type
    @Query(() => Post, { nullable: true })
    post(
        // take an argument named ID that is an integer
        @Arg("id") id: number,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        // find Post in Posts table (entity) where id = id arg
        return em.findOne(Post, { id })
    }
    )

    // Queries are for R, Mutations are for CUD
    @Mutation(() => Post)
    async createPost(
        // take an argument named title that is a String
        @Arg("title") title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post> {
        // find Post in Posts table (entity) where id = id arg
        const newPost = em.create(Post, { title })
        await em.persistAndFlush(newPost)
        return newPost
    }

    // UPDATE SINGLE POST TITLE BY ID
    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg("id") id: number,
        @Arg("title") title: string,
        @Ctx() { em }: MyContext
    ): Promise<Post | null> {
        // find Post in Posts table (entity) where id = id arg
        const postToUpdate = await em.findOne(Post, { id })
        if (!postToUpdate) return null;
        if (typeof title !== "undefined") {
            postToUpdate.title = title;
            await em.persistAndFlush(postToUpdate)
        }
        return postToUpdate
    }

    // DELETE SINGLE POST BY ID
    @Mutation(() => Boolean)
    async deletePost(
        @Arg("id") id: number,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(Post, { id })
            return true
        } catch (error) {
            return false

        }
    }
    )

}