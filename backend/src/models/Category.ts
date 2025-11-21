import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Todo } from './Todo';

@Table({
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class Category extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING(7),
    defaultValue: '#3B82F6',
  })
  color!: string;

  @HasMany(() => Todo)
  todos!: Todo[];
}