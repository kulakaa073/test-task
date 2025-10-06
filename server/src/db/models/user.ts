import { model, Schema } from 'mongoose';

export type UserDocument = InstanceType<
  typeof UsersCollection.prototype.constructor
>;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', userSchema);
