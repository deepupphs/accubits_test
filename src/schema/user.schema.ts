import { Prop, Schema, raw, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, index: true })
  age: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);