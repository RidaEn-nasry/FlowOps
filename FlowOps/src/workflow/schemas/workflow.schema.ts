import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Column } from '../../memory/schemas/database-definition.schema';

/**
 * Mongoose document for Workflow
 */
export type WorkflowDocument = Workflow & Document;

/**
 * Mongoose schema for Workflow
 */
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
export class Workflow {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  script: string;

  @Prop({ type: [{ 
    id: String,
    name: String,
    type: String,
    required: Boolean,
    options: [{ id: String, label: String, color: String }],
    description: String
  }] })
  databaseColumns?: Column[];
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow); 