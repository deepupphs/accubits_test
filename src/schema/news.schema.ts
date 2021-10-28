import { Prop, Schema, raw, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type NewsDocument = News & Document;

@Schema()
export class News extends Document {

  @Prop({ required: true, index: true })
    email: string;

  @Prop({ required: true })
  newsletter_name: string;

  @Prop({ required: true })
  newsletter_content: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

}

export const NewsSchema = SchemaFactory.createForClass(News);