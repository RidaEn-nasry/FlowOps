import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ColumnType = 
  'text' | 
  'long_text' | 
  'number' | 
  'date' | 
  'select' | 
  'multi_select' | 
  'boolean' | 
  'url' | 
  'file';

export class SelectOption {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  label: string;

  @Prop()
  color?: string;
}

export class Column {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['text', 'long_text', 'number', 'date', 'select', 'multi_select', 'boolean', 'url', 'file'] })
  type: ColumnType;

  @Prop({ default: false })
  required: boolean;

  @Prop({ type: [{ id: String, label: String, color: String }] })
  options?: SelectOption[];

  @Prop()
  description?: string;
}

export type DatabaseDefinitionDocument = DatabaseDefinition & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})
export class DatabaseDefinition {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: String, ref: 'Workflow' })
  workflowId: string;

  @Prop({ type: [{ 
    id: String,
    name: String,
    type: String,
    required: Boolean,
    options: [{ id: String, label: String, color: String }],
    description: String
  }] })
  columns: Column[];
}

export const DatabaseDefinitionSchema = SchemaFactory.createForClass(DatabaseDefinition); 