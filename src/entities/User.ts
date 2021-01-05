import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

// ObjectType = graph-ql type
@ObjectType()
// entity = dbTable
@Entity()
export class User {
    @Field(() => Int)
    // primary key
    @PrimaryKey()
    id!: number;

    @Field(() => String)
    // property = decorator for creating a column
    @Property({ type: 'date' })
    createdAt = new Date();

    @Field(() => String)
    // hook that creates a date every time User updated
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    // remove @Field() to make it so you can't access a given field from the API -- makes it hidden
    @Field(() => String)
    @Property({ type: 'text', unique: true })
    username!: string;

    @Property({ type: 'text' })
    password!: string;
}