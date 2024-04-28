export interface Feature {
  name: string;
  definition: FeatureDefinition;
}

export interface FeatureDefinition {
  fields: FeatureDefinitionField[];
}

type FeatureDefinitionField =
  | StringField
  | BooleanField
  | ChooseField
  | NumberField;

export interface GenericField {
  name: string;
  description: string;
}

export interface StringField extends GenericField {
  type: "string";
  value: string;
}

export interface BooleanField extends GenericField {
  type: "boolean";
  value: boolean;
}

export interface ChooseField extends GenericField {
  type: "choose";
  value: string;
  acceptedValues: string[];
}

export interface NumberField extends GenericField {
  type: "number";
  value: number;
  min: number;
  max: number;
  float: boolean;
}
