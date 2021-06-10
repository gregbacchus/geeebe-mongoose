import { Document, Model, model, Schema, SchemaType, SchemaTypeOpts } from 'mongoose';

type DataDocument<Data extends { _id: unknown }> = Document<Data['_id']> & Omit<Data, '_id'>;

type DataModel<Data extends { _id: unknown }, Statics> = Model<DataDocument<Data>> & Statics;

type SchemaDefinition<K extends keyof Data, Data extends { _id: unknown }> = {
  [P in K]: SchemaTypeOpts<Data[P]> | Schema<Document<Data[P]>, Model<Document<Data[P], unknown>>> | SchemaType;
}

export const createModel = <
  Data extends { _id: unknown },
  Statics
>(
  name: string,
  schemaDefinition: SchemaDefinition<keyof Data, Data>,
  statics: Statics
): DataModel<Data, Statics> => {
  const schema = new Schema<DataDocument<Data>, DataModel<Data, Statics>>(
    schemaDefinition,
    { versionKey: false, minimize: false }
  );

  Object.assign(schema.statics, statics);
  return model<DataDocument<Data>, DataModel<Data, Statics>>(name, schema, name);
};
