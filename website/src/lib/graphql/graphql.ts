/* eslint-disable */
import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDateTime: { input: any; output: any };
};

export type Mutation = {
  __typename?: "Mutation";
  createNote?: Maybe<Note>;
};

export type MutationCreateNoteArgs = {
  sentiment: Sentiment;
  text: Scalars["String"]["input"];
};

export type Note = {
  __typename?: "Note";
  dateCreated: Scalars["AWSDateTime"]["output"];
  id: Scalars["ID"]["output"];
  sentiment: Sentiment;
  text: Scalars["String"]["output"];
};

export type NoteQueryResults = {
  __typename?: "NoteQueryResults";
  items?: Maybe<Array<Maybe<Note>>>;
  nextToken?: Maybe<Scalars["String"]["output"]>;
  scannedCount?: Maybe<Scalars["Int"]["output"]>;
};

export type Query = {
  __typename?: "Query";
  getNotes?: Maybe<NoteQueryResults>;
};

export type QueryGetNotesArgs = {
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  nextToken?: InputMaybe<Scalars["String"]["input"]>;
  sentiment?: InputMaybe<Sentiment>;
};

export enum Sentiment {
  Angry = "angry",
  Happy = "happy",
  Neutral = "neutral",
  Sad = "sad",
}

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<
    DocumentTypeDecoration<TResult, TVariables>["__apiType"]
  >;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
