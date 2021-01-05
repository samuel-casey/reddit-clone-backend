import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

// entity = dbTable
@Entity()
export class Post {
    // primary key
    @PrimaryKey()
    id!: number;

    // property = decorator for creating a column
    @Property({ type: 'date' })
    createdAt = new Date();

    // hook that creates a date every time post updated
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();

    @Property({ type: 'text' })
    title!: string;
}