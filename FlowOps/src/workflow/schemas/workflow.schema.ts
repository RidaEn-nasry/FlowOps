import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const WorkflowSchema = SchemaFactory.createForClass(Workflow); 