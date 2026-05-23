import { 
    AfterInsert, 
    AfterRemove, 
    AfterUpdate, 
    Entity, 
    Column, 
    PrimaryGeneratedColumn 
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
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