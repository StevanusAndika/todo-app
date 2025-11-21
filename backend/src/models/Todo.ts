import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Category } from './Category';

@Table({
  tableName: 'todos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Todo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  completed!: boolean;

  @ForeignKey(() => Category)
  @Column(DataType.INTEGER)
  category_id!: number;

  @BelongsTo(() => Category)
  category!: Category;

  @Column({
    type: DataType.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  })
  priority!: string;

  @Column(DataType.DATE)
  due_date!: Date;
}