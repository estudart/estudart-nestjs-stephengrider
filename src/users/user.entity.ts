import { 
    AfterInsert, 
    AfterRemove, 
    AfterUpdate, 
    Entity, 
    Column, 
    PrimaryGeneratedColumn 
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @AfterInsert()
    log_insert() {
        console.log('Inserted User with id', this.id);
    };

    @AfterUpdate()
    log_update() {
        console.log('Updated User with id', this.id);
    };

    @AfterRemove()
    log_remove() {
        console.log('Removed User with id', this.id);
    };
}