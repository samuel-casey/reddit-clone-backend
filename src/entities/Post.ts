import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

// entity = dbTable
@Entity()
export class Post {
    // primary key
    @PrimaryKey()
    id!: number;

    // property = decorator for creating a column
    @Property()
    createdAt = new Date();

    // hook that creates a date every time post updated
    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    @Property()
    title!: string;
}