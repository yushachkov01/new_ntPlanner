import type { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';

import type * as Types from '../../types/graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  date: { input: any; output: any };
  time: { input: any; output: any };
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>;
  _gt?: InputMaybe<Scalars['Boolean']['input']>;
  _gte?: InputMaybe<Scalars['Boolean']['input']>;
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Boolean']['input']>;
  _lte?: InputMaybe<Scalars['Boolean']['input']>;
  _neq?: InputMaybe<Scalars['Boolean']['input']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>;
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>;
  _gt?: InputMaybe<Scalars['Int']['input']>;
  _gte?: InputMaybe<Scalars['Int']['input']>;
  _in?: InputMaybe<Array<Scalars['Int']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['Int']['input']>;
  _lte?: InputMaybe<Scalars['Int']['input']>;
  _neq?: InputMaybe<Scalars['Int']['input']>;
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>;
  _gt?: InputMaybe<Scalars['String']['input']>;
  _gte?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>;
  _in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>;
  _lt?: InputMaybe<Scalars['String']['input']>;
  _lte?: InputMaybe<Scalars['String']['input']>;
  _neq?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>;
  _nin?: InputMaybe<Array<Scalars['String']['input']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** Boolean expression to compare columns of type "date". All fields are combined with logical 'AND'. */
export type Date_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['date']['input']>;
  _gt?: InputMaybe<Scalars['date']['input']>;
  _gte?: InputMaybe<Scalars['date']['input']>;
  _in?: InputMaybe<Array<Scalars['date']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['date']['input']>;
  _lte?: InputMaybe<Scalars['date']['input']>;
  _neq?: InputMaybe<Scalars['date']['input']>;
  _nin?: InputMaybe<Array<Scalars['date']['input']>>;
};

/** columns and relationships of "executor" */
export type Executor = {
  __typename?: 'executor';
  author: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "executor" */
export type Executor_Aggregate = {
  __typename?: 'executor_aggregate';
  aggregate?: Maybe<Executor_Aggregate_Fields>;
  nodes: Array<Executor>;
};

/** aggregate fields of "executor" */
export type Executor_Aggregate_Fields = {
  __typename?: 'executor_aggregate_fields';
  avg?: Maybe<Executor_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Executor_Max_Fields>;
  min?: Maybe<Executor_Min_Fields>;
  stddev?: Maybe<Executor_Stddev_Fields>;
  stddev_pop?: Maybe<Executor_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Executor_Stddev_Samp_Fields>;
  sum?: Maybe<Executor_Sum_Fields>;
  var_pop?: Maybe<Executor_Var_Pop_Fields>;
  var_samp?: Maybe<Executor_Var_Samp_Fields>;
  variance?: Maybe<Executor_Variance_Fields>;
};

/** aggregate fields of "executor" */
export type Executor_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Executor_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Executor_Avg_Fields = {
  __typename?: 'executor_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "executor". All fields are combined with a logical 'AND'. */
export type Executor_Bool_Exp = {
  _and?: InputMaybe<Array<Executor_Bool_Exp>>;
  _not?: InputMaybe<Executor_Bool_Exp>;
  _or?: InputMaybe<Array<Executor_Bool_Exp>>;
  author?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "executor" */
export enum Executor_Constraint {
  /** unique or primary key constraint on columns "id" */
  ExecutorPkey = 'executor_pkey',
}

/** input type for incrementing numeric columns in table "executor" */
export type Executor_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "executor" */
export type Executor_Insert_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Executor_Max_Fields = {
  __typename?: 'executor_max_fields';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Executor_Min_Fields = {
  __typename?: 'executor_min_fields';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "executor" */
export type Executor_Mutation_Response = {
  __typename?: 'executor_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Executor>;
};

/** on_conflict condition type for table "executor" */
export type Executor_On_Conflict = {
  constraint: Executor_Constraint;
  update_columns?: Array<Executor_Update_Column>;
  where?: InputMaybe<Executor_Bool_Exp>;
};

/** Ordering options when selecting data from "executor". */
export type Executor_Order_By = {
  author?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: executor */
export type Executor_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "executor" */
export enum Executor_Select_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

/** input type for updating data in table "executor" */
export type Executor_Set_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Executor_Stddev_Fields = {
  __typename?: 'executor_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Executor_Stddev_Pop_Fields = {
  __typename?: 'executor_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Executor_Stddev_Samp_Fields = {
  __typename?: 'executor_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "executor" */
export type Executor_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Executor_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Executor_Stream_Cursor_Value_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Executor_Sum_Fields = {
  __typename?: 'executor_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "executor" */
export enum Executor_Update_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

export type Executor_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Executor_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Executor_Set_Input>;
  /** filter the rows which have to be updated */
  where: Executor_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Executor_Var_Pop_Fields = {
  __typename?: 'executor_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Executor_Var_Samp_Fields = {
  __typename?: 'executor_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Executor_Variance_Fields = {
  __typename?: 'executor_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "job_sheet_devices" */
export type Job_Sheet_Devices = {
  __typename?: 'job_sheet_devices';
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  sheet_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregated selection of "job_sheet_devices" */
export type Job_Sheet_Devices_Aggregate = {
  __typename?: 'job_sheet_devices_aggregate';
  aggregate?: Maybe<Job_Sheet_Devices_Aggregate_Fields>;
  nodes: Array<Job_Sheet_Devices>;
};

/** aggregate fields of "job_sheet_devices" */
export type Job_Sheet_Devices_Aggregate_Fields = {
  __typename?: 'job_sheet_devices_aggregate_fields';
  avg?: Maybe<Job_Sheet_Devices_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Job_Sheet_Devices_Max_Fields>;
  min?: Maybe<Job_Sheet_Devices_Min_Fields>;
  stddev?: Maybe<Job_Sheet_Devices_Stddev_Fields>;
  stddev_pop?: Maybe<Job_Sheet_Devices_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Job_Sheet_Devices_Stddev_Samp_Fields>;
  sum?: Maybe<Job_Sheet_Devices_Sum_Fields>;
  var_pop?: Maybe<Job_Sheet_Devices_Var_Pop_Fields>;
  var_samp?: Maybe<Job_Sheet_Devices_Var_Samp_Fields>;
  variance?: Maybe<Job_Sheet_Devices_Variance_Fields>;
};

/** aggregate fields of "job_sheet_devices" */
export type Job_Sheet_Devices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Job_Sheet_Devices_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Job_Sheet_Devices_Avg_Fields = {
  __typename?: 'job_sheet_devices_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  sheet_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "job_sheet_devices". All fields are combined with a logical 'AND'. */
export type Job_Sheet_Devices_Bool_Exp = {
  _and?: InputMaybe<Array<Job_Sheet_Devices_Bool_Exp>>;
  _not?: InputMaybe<Job_Sheet_Devices_Bool_Exp>;
  _or?: InputMaybe<Array<Job_Sheet_Devices_Bool_Exp>>;
  enabled?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  sheet_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "job_sheet_devices" */
export enum Job_Sheet_Devices_Constraint {
  /** unique or primary key constraint on columns "id" */
  JobSheetDevicesPkey = 'job_sheet_devices_pkey',
}

/** input type for incrementing numeric columns in table "job_sheet_devices" */
export type Job_Sheet_Devices_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  sheet_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "job_sheet_devices" */
export type Job_Sheet_Devices_Insert_Input = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sheet_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Job_Sheet_Devices_Max_Fields = {
  __typename?: 'job_sheet_devices_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sheet_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Job_Sheet_Devices_Min_Fields = {
  __typename?: 'job_sheet_devices_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sheet_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "job_sheet_devices" */
export type Job_Sheet_Devices_Mutation_Response = {
  __typename?: 'job_sheet_devices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Job_Sheet_Devices>;
};

/** on_conflict condition type for table "job_sheet_devices" */
export type Job_Sheet_Devices_On_Conflict = {
  constraint: Job_Sheet_Devices_Constraint;
  update_columns?: Array<Job_Sheet_Devices_Update_Column>;
  where?: InputMaybe<Job_Sheet_Devices_Bool_Exp>;
};

/** Ordering options when selecting data from "job_sheet_devices". */
export type Job_Sheet_Devices_Order_By = {
  enabled?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  sheet_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: job_sheet_devices */
export type Job_Sheet_Devices_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "job_sheet_devices" */
export enum Job_Sheet_Devices_Select_Column {
  /** column name */
  Enabled = 'enabled',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  SheetId = 'sheet_id',
}

/** input type for updating data in table "job_sheet_devices" */
export type Job_Sheet_Devices_Set_Input = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sheet_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Job_Sheet_Devices_Stddev_Fields = {
  __typename?: 'job_sheet_devices_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  sheet_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Job_Sheet_Devices_Stddev_Pop_Fields = {
  __typename?: 'job_sheet_devices_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  sheet_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Job_Sheet_Devices_Stddev_Samp_Fields = {
  __typename?: 'job_sheet_devices_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  sheet_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "job_sheet_devices" */
export type Job_Sheet_Devices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Job_Sheet_Devices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Job_Sheet_Devices_Stream_Cursor_Value_Input = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  sheet_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Job_Sheet_Devices_Sum_Fields = {
  __typename?: 'job_sheet_devices_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  sheet_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "job_sheet_devices" */
export enum Job_Sheet_Devices_Update_Column {
  /** column name */
  Enabled = 'enabled',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  SheetId = 'sheet_id',
}

export type Job_Sheet_Devices_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Job_Sheet_Devices_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Job_Sheet_Devices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Job_Sheet_Devices_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Job_Sheet_Devices_Var_Pop_Fields = {
  __typename?: 'job_sheet_devices_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  sheet_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Job_Sheet_Devices_Var_Samp_Fields = {
  __typename?: 'job_sheet_devices_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  sheet_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Job_Sheet_Devices_Variance_Fields = {
  __typename?: 'job_sheet_devices_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  sheet_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "job_sheets" */
export type Job_Sheets = {
  __typename?: 'job_sheets';
  id: Scalars['Int']['output'];
  project: Scalars['String']['output'];
  rd_url?: Maybe<Scalars['String']['output']>;
  redmine_url?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  window_end: Scalars['time']['output'];
  window_start: Scalars['time']['output'];
};

/** aggregated selection of "job_sheets" */
export type Job_Sheets_Aggregate = {
  __typename?: 'job_sheets_aggregate';
  aggregate?: Maybe<Job_Sheets_Aggregate_Fields>;
  nodes: Array<Job_Sheets>;
};

/** aggregate fields of "job_sheets" */
export type Job_Sheets_Aggregate_Fields = {
  __typename?: 'job_sheets_aggregate_fields';
  avg?: Maybe<Job_Sheets_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Job_Sheets_Max_Fields>;
  min?: Maybe<Job_Sheets_Min_Fields>;
  stddev?: Maybe<Job_Sheets_Stddev_Fields>;
  stddev_pop?: Maybe<Job_Sheets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Job_Sheets_Stddev_Samp_Fields>;
  sum?: Maybe<Job_Sheets_Sum_Fields>;
  var_pop?: Maybe<Job_Sheets_Var_Pop_Fields>;
  var_samp?: Maybe<Job_Sheets_Var_Samp_Fields>;
  variance?: Maybe<Job_Sheets_Variance_Fields>;
};

/** aggregate fields of "job_sheets" */
export type Job_Sheets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Job_Sheets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Job_Sheets_Avg_Fields = {
  __typename?: 'job_sheets_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "job_sheets". All fields are combined with a logical 'AND'. */
export type Job_Sheets_Bool_Exp = {
  _and?: InputMaybe<Array<Job_Sheets_Bool_Exp>>;
  _not?: InputMaybe<Job_Sheets_Bool_Exp>;
  _or?: InputMaybe<Array<Job_Sheets_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  rd_url?: InputMaybe<String_Comparison_Exp>;
  redmine_url?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  window_end?: InputMaybe<Time_Comparison_Exp>;
  window_start?: InputMaybe<Time_Comparison_Exp>;
};

/** unique or primary key constraints on table "job_sheets" */
export enum Job_Sheets_Constraint {
  /** unique or primary key constraint on columns "id" */
  JobSheetsPkey = 'job_sheets_pkey',
}

/** input type for incrementing numeric columns in table "job_sheets" */
export type Job_Sheets_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "job_sheets" */
export type Job_Sheets_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd_url?: InputMaybe<Scalars['String']['input']>;
  redmine_url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  window_end?: InputMaybe<Scalars['time']['input']>;
  window_start?: InputMaybe<Scalars['time']['input']>;
};

/** aggregate max on columns */
export type Job_Sheets_Max_Fields = {
  __typename?: 'job_sheets_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd_url?: Maybe<Scalars['String']['output']>;
  redmine_url?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Job_Sheets_Min_Fields = {
  __typename?: 'job_sheets_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd_url?: Maybe<Scalars['String']['output']>;
  redmine_url?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "job_sheets" */
export type Job_Sheets_Mutation_Response = {
  __typename?: 'job_sheets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Job_Sheets>;
};

/** on_conflict condition type for table "job_sheets" */
export type Job_Sheets_On_Conflict = {
  constraint: Job_Sheets_Constraint;
  update_columns?: Array<Job_Sheets_Update_Column>;
  where?: InputMaybe<Job_Sheets_Bool_Exp>;
};

/** Ordering options when selecting data from "job_sheets". */
export type Job_Sheets_Order_By = {
  id?: InputMaybe<Order_By>;
  project?: InputMaybe<Order_By>;
  rd_url?: InputMaybe<Order_By>;
  redmine_url?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  window_end?: InputMaybe<Order_By>;
  window_start?: InputMaybe<Order_By>;
};

/** primary key columns input for table: job_sheets */
export type Job_Sheets_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "job_sheets" */
export enum Job_Sheets_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Project = 'project',
  /** column name */
  RdUrl = 'rd_url',
  /** column name */
  RedmineUrl = 'redmine_url',
  /** column name */
  Title = 'title',
  /** column name */
  WindowEnd = 'window_end',
  /** column name */
  WindowStart = 'window_start',
}

/** input type for updating data in table "job_sheets" */
export type Job_Sheets_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd_url?: InputMaybe<Scalars['String']['input']>;
  redmine_url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  window_end?: InputMaybe<Scalars['time']['input']>;
  window_start?: InputMaybe<Scalars['time']['input']>;
};

/** aggregate stddev on columns */
export type Job_Sheets_Stddev_Fields = {
  __typename?: 'job_sheets_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Job_Sheets_Stddev_Pop_Fields = {
  __typename?: 'job_sheets_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Job_Sheets_Stddev_Samp_Fields = {
  __typename?: 'job_sheets_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "job_sheets" */
export type Job_Sheets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Job_Sheets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Job_Sheets_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd_url?: InputMaybe<Scalars['String']['input']>;
  redmine_url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  window_end?: InputMaybe<Scalars['time']['input']>;
  window_start?: InputMaybe<Scalars['time']['input']>;
};

/** aggregate sum on columns */
export type Job_Sheets_Sum_Fields = {
  __typename?: 'job_sheets_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "job_sheets" */
export enum Job_Sheets_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Project = 'project',
  /** column name */
  RdUrl = 'rd_url',
  /** column name */
  RedmineUrl = 'redmine_url',
  /** column name */
  Title = 'title',
  /** column name */
  WindowEnd = 'window_end',
  /** column name */
  WindowStart = 'window_start',
}

export type Job_Sheets_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Job_Sheets_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Job_Sheets_Set_Input>;
  /** filter the rows which have to be updated */
  where: Job_Sheets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Job_Sheets_Var_Pop_Fields = {
  __typename?: 'job_sheets_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Job_Sheets_Var_Samp_Fields = {
  __typename?: 'job_sheets_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Job_Sheets_Variance_Fields = {
  __typename?: 'job_sheets_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "locations" */
export type Locations = {
  __typename?: 'locations';
  branch: Scalars['String']['output'];
  city: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  provider: Scalars['String']['output'];
  street: Scalars['String']['output'];
};

/** aggregated selection of "locations" */
export type Locations_Aggregate = {
  __typename?: 'locations_aggregate';
  aggregate?: Maybe<Locations_Aggregate_Fields>;
  nodes: Array<Locations>;
};

/** aggregate fields of "locations" */
export type Locations_Aggregate_Fields = {
  __typename?: 'locations_aggregate_fields';
  avg?: Maybe<Locations_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Locations_Max_Fields>;
  min?: Maybe<Locations_Min_Fields>;
  stddev?: Maybe<Locations_Stddev_Fields>;
  stddev_pop?: Maybe<Locations_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Locations_Stddev_Samp_Fields>;
  sum?: Maybe<Locations_Sum_Fields>;
  var_pop?: Maybe<Locations_Var_Pop_Fields>;
  var_samp?: Maybe<Locations_Var_Samp_Fields>;
  variance?: Maybe<Locations_Variance_Fields>;
};

/** aggregate fields of "locations" */
export type Locations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Locations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Locations_Avg_Fields = {
  __typename?: 'locations_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "locations". All fields are combined with a logical 'AND'. */
export type Locations_Bool_Exp = {
  _and?: InputMaybe<Array<Locations_Bool_Exp>>;
  _not?: InputMaybe<Locations_Bool_Exp>;
  _or?: InputMaybe<Array<Locations_Bool_Exp>>;
  branch?: InputMaybe<String_Comparison_Exp>;
  city?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  provider?: InputMaybe<String_Comparison_Exp>;
  street?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "locations" */
export enum Locations_Constraint {
  /** unique or primary key constraint on columns "id" */
  LocationsPkey = 'locations_pkey',
}

/** input type for incrementing numeric columns in table "locations" */
export type Locations_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "locations" */
export type Locations_Insert_Input = {
  branch?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Locations_Max_Fields = {
  __typename?: 'locations_max_fields';
  branch?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Locations_Min_Fields = {
  __typename?: 'locations_min_fields';
  branch?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  provider?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "locations" */
export type Locations_Mutation_Response = {
  __typename?: 'locations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Locations>;
};

/** on_conflict condition type for table "locations" */
export type Locations_On_Conflict = {
  constraint: Locations_Constraint;
  update_columns?: Array<Locations_Update_Column>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

/** Ordering options when selecting data from "locations". */
export type Locations_Order_By = {
  branch?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  provider?: InputMaybe<Order_By>;
  street?: InputMaybe<Order_By>;
};

/** primary key columns input for table: locations */
export type Locations_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "locations" */
export enum Locations_Select_Column {
  /** column name */
  Branch = 'branch',
  /** column name */
  City = 'city',
  /** column name */
  Id = 'id',
  /** column name */
  Provider = 'provider',
  /** column name */
  Street = 'street',
}

/** input type for updating data in table "locations" */
export type Locations_Set_Input = {
  branch?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Locations_Stddev_Fields = {
  __typename?: 'locations_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Locations_Stddev_Pop_Fields = {
  __typename?: 'locations_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Locations_Stddev_Samp_Fields = {
  __typename?: 'locations_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "locations" */
export type Locations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Locations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Locations_Stream_Cursor_Value_Input = {
  branch?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Locations_Sum_Fields = {
  __typename?: 'locations_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "locations" */
export enum Locations_Update_Column {
  /** column name */
  Branch = 'branch',
  /** column name */
  City = 'city',
  /** column name */
  Id = 'id',
  /** column name */
  Provider = 'provider',
  /** column name */
  Street = 'street',
}

export type Locations_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Locations_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Locations_Set_Input>;
  /** filter the rows which have to be updated */
  where: Locations_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Locations_Var_Pop_Fields = {
  __typename?: 'locations_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Locations_Var_Samp_Fields = {
  __typename?: 'locations_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Locations_Variance_Fields = {
  __typename?: 'locations_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "executor" */
  delete_executor?: Maybe<Executor_Mutation_Response>;
  /** delete single row from the table: "executor" */
  delete_executor_by_pk?: Maybe<Executor>;
  /** delete data from the table: "job_sheet_devices" */
  delete_job_sheet_devices?: Maybe<Job_Sheet_Devices_Mutation_Response>;
  /** delete single row from the table: "job_sheet_devices" */
  delete_job_sheet_devices_by_pk?: Maybe<Job_Sheet_Devices>;
  /** delete data from the table: "job_sheets" */
  delete_job_sheets?: Maybe<Job_Sheets_Mutation_Response>;
  /** delete single row from the table: "job_sheets" */
  delete_job_sheets_by_pk?: Maybe<Job_Sheets>;
  /** delete data from the table: "locations" */
  delete_locations?: Maybe<Locations_Mutation_Response>;
  /** delete single row from the table: "locations" */
  delete_locations_by_pk?: Maybe<Locations>;
  /** delete data from the table: "planned_tasks" */
  delete_planned_tasks?: Maybe<Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "planned_tasks" */
  delete_planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** delete data from the table: "work_cards" */
  delete_work_cards?: Maybe<Work_Cards_Mutation_Response>;
  /** delete single row from the table: "work_cards" */
  delete_work_cards_by_pk?: Maybe<Work_Cards>;
  /** delete data from the table: "works" */
  delete_works?: Maybe<Works_Mutation_Response>;
  /** delete single row from the table: "works" */
  delete_works_by_pk?: Maybe<Works>;
  /** insert data into the table: "executor" */
  insert_executor?: Maybe<Executor_Mutation_Response>;
  /** insert a single row into the table: "executor" */
  insert_executor_one?: Maybe<Executor>;
  /** insert data into the table: "job_sheet_devices" */
  insert_job_sheet_devices?: Maybe<Job_Sheet_Devices_Mutation_Response>;
  /** insert a single row into the table: "job_sheet_devices" */
  insert_job_sheet_devices_one?: Maybe<Job_Sheet_Devices>;
  /** insert data into the table: "job_sheets" */
  insert_job_sheets?: Maybe<Job_Sheets_Mutation_Response>;
  /** insert a single row into the table: "job_sheets" */
  insert_job_sheets_one?: Maybe<Job_Sheets>;
  /** insert data into the table: "locations" */
  insert_locations?: Maybe<Locations_Mutation_Response>;
  /** insert a single row into the table: "locations" */
  insert_locations_one?: Maybe<Locations>;
  /** insert data into the table: "planned_tasks" */
  insert_planned_tasks?: Maybe<Planned_Tasks_Mutation_Response>;
  /** insert a single row into the table: "planned_tasks" */
  insert_planned_tasks_one?: Maybe<Planned_Tasks>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** insert data into the table: "work_cards" */
  insert_work_cards?: Maybe<Work_Cards_Mutation_Response>;
  /** insert a single row into the table: "work_cards" */
  insert_work_cards_one?: Maybe<Work_Cards>;
  /** insert data into the table: "works" */
  insert_works?: Maybe<Works_Mutation_Response>;
  /** insert a single row into the table: "works" */
  insert_works_one?: Maybe<Works>;
  /** update data of the table: "executor" */
  update_executor?: Maybe<Executor_Mutation_Response>;
  /** update single row of the table: "executor" */
  update_executor_by_pk?: Maybe<Executor>;
  /** update multiples rows of table: "executor" */
  update_executor_many?: Maybe<Array<Maybe<Executor_Mutation_Response>>>;
  /** update data of the table: "job_sheet_devices" */
  update_job_sheet_devices?: Maybe<Job_Sheet_Devices_Mutation_Response>;
  /** update single row of the table: "job_sheet_devices" */
  update_job_sheet_devices_by_pk?: Maybe<Job_Sheet_Devices>;
  /** update multiples rows of table: "job_sheet_devices" */
  update_job_sheet_devices_many?: Maybe<Array<Maybe<Job_Sheet_Devices_Mutation_Response>>>;
  /** update data of the table: "job_sheets" */
  update_job_sheets?: Maybe<Job_Sheets_Mutation_Response>;
  /** update single row of the table: "job_sheets" */
  update_job_sheets_by_pk?: Maybe<Job_Sheets>;
  /** update multiples rows of table: "job_sheets" */
  update_job_sheets_many?: Maybe<Array<Maybe<Job_Sheets_Mutation_Response>>>;
  /** update data of the table: "locations" */
  update_locations?: Maybe<Locations_Mutation_Response>;
  /** update single row of the table: "locations" */
  update_locations_by_pk?: Maybe<Locations>;
  /** update multiples rows of table: "locations" */
  update_locations_many?: Maybe<Array<Maybe<Locations_Mutation_Response>>>;
  /** update data of the table: "planned_tasks" */
  update_planned_tasks?: Maybe<Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "planned_tasks" */
  update_planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** update multiples rows of table: "planned_tasks" */
  update_planned_tasks_many?: Maybe<Array<Maybe<Planned_Tasks_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
  /** update data of the table: "work_cards" */
  update_work_cards?: Maybe<Work_Cards_Mutation_Response>;
  /** update single row of the table: "work_cards" */
  update_work_cards_by_pk?: Maybe<Work_Cards>;
  /** update multiples rows of table: "work_cards" */
  update_work_cards_many?: Maybe<Array<Maybe<Work_Cards_Mutation_Response>>>;
  /** update data of the table: "works" */
  update_works?: Maybe<Works_Mutation_Response>;
  /** update single row of the table: "works" */
  update_works_by_pk?: Maybe<Works>;
  /** update multiples rows of table: "works" */
  update_works_many?: Maybe<Array<Maybe<Works_Mutation_Response>>>;
};

/** mutation root */
export type Mutation_RootDelete_ExecutorArgs = {
  where: Executor_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Executor_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Job_Sheet_DevicesArgs = {
  where: Job_Sheet_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Job_Sheet_Devices_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Job_SheetsArgs = {
  where: Job_Sheets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Job_Sheets_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_LocationsArgs = {
  where: Locations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Locations_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Planned_TasksArgs = {
  where: Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Planned_Tasks_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Work_CardsArgs = {
  where: Work_Cards_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Work_Cards_By_PkArgs = {
  id: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootDelete_WorksArgs = {
  where: Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Works_By_PkArgs = {
  idInt: Scalars['Int']['input'];
};

/** mutation root */
export type Mutation_RootInsert_ExecutorArgs = {
  objects: Array<Executor_Insert_Input>;
  on_conflict?: InputMaybe<Executor_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Executor_OneArgs = {
  object: Executor_Insert_Input;
  on_conflict?: InputMaybe<Executor_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Job_Sheet_DevicesArgs = {
  objects: Array<Job_Sheet_Devices_Insert_Input>;
  on_conflict?: InputMaybe<Job_Sheet_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Job_Sheet_Devices_OneArgs = {
  object: Job_Sheet_Devices_Insert_Input;
  on_conflict?: InputMaybe<Job_Sheet_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Job_SheetsArgs = {
  objects: Array<Job_Sheets_Insert_Input>;
  on_conflict?: InputMaybe<Job_Sheets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Job_Sheets_OneArgs = {
  object: Job_Sheets_Insert_Input;
  on_conflict?: InputMaybe<Job_Sheets_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_LocationsArgs = {
  objects: Array<Locations_Insert_Input>;
  on_conflict?: InputMaybe<Locations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Locations_OneArgs = {
  object: Locations_Insert_Input;
  on_conflict?: InputMaybe<Locations_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Planned_TasksArgs = {
  objects: Array<Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Planned_Tasks_OneArgs = {
  object: Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_UsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Users_OneArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Work_CardsArgs = {
  objects: Array<Work_Cards_Insert_Input>;
  on_conflict?: InputMaybe<Work_Cards_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Work_Cards_OneArgs = {
  object: Work_Cards_Insert_Input;
  on_conflict?: InputMaybe<Work_Cards_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_WorksArgs = {
  objects: Array<Works_Insert_Input>;
  on_conflict?: InputMaybe<Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Works_OneArgs = {
  object: Works_Insert_Input;
  on_conflict?: InputMaybe<Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootUpdate_ExecutorArgs = {
  _inc?: InputMaybe<Executor_Inc_Input>;
  _set?: InputMaybe<Executor_Set_Input>;
  where: Executor_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Executor_By_PkArgs = {
  _inc?: InputMaybe<Executor_Inc_Input>;
  _set?: InputMaybe<Executor_Set_Input>;
  pk_columns: Executor_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Executor_ManyArgs = {
  updates: Array<Executor_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Job_Sheet_DevicesArgs = {
  _inc?: InputMaybe<Job_Sheet_Devices_Inc_Input>;
  _set?: InputMaybe<Job_Sheet_Devices_Set_Input>;
  where: Job_Sheet_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Job_Sheet_Devices_By_PkArgs = {
  _inc?: InputMaybe<Job_Sheet_Devices_Inc_Input>;
  _set?: InputMaybe<Job_Sheet_Devices_Set_Input>;
  pk_columns: Job_Sheet_Devices_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Job_Sheet_Devices_ManyArgs = {
  updates: Array<Job_Sheet_Devices_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Job_SheetsArgs = {
  _inc?: InputMaybe<Job_Sheets_Inc_Input>;
  _set?: InputMaybe<Job_Sheets_Set_Input>;
  where: Job_Sheets_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Job_Sheets_By_PkArgs = {
  _inc?: InputMaybe<Job_Sheets_Inc_Input>;
  _set?: InputMaybe<Job_Sheets_Set_Input>;
  pk_columns: Job_Sheets_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Job_Sheets_ManyArgs = {
  updates: Array<Job_Sheets_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_LocationsArgs = {
  _inc?: InputMaybe<Locations_Inc_Input>;
  _set?: InputMaybe<Locations_Set_Input>;
  where: Locations_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Locations_By_PkArgs = {
  _inc?: InputMaybe<Locations_Inc_Input>;
  _set?: InputMaybe<Locations_Set_Input>;
  pk_columns: Locations_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Locations_ManyArgs = {
  updates: Array<Locations_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Planned_TasksArgs = {
  _inc?: InputMaybe<Planned_Tasks_Inc_Input>;
  _set?: InputMaybe<Planned_Tasks_Set_Input>;
  where: Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Planned_Tasks_By_PkArgs = {
  _inc?: InputMaybe<Planned_Tasks_Inc_Input>;
  _set?: InputMaybe<Planned_Tasks_Set_Input>;
  pk_columns: Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Planned_Tasks_ManyArgs = {
  updates: Array<Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _inc?: InputMaybe<Users_Inc_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Work_CardsArgs = {
  _inc?: InputMaybe<Work_Cards_Inc_Input>;
  _set?: InputMaybe<Work_Cards_Set_Input>;
  where: Work_Cards_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Work_Cards_By_PkArgs = {
  _inc?: InputMaybe<Work_Cards_Inc_Input>;
  _set?: InputMaybe<Work_Cards_Set_Input>;
  pk_columns: Work_Cards_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Work_Cards_ManyArgs = {
  updates: Array<Work_Cards_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_WorksArgs = {
  _inc?: InputMaybe<Works_Inc_Input>;
  _set?: InputMaybe<Works_Set_Input>;
  where: Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Works_By_PkArgs = {
  _inc?: InputMaybe<Works_Inc_Input>;
  _set?: InputMaybe<Works_Set_Input>;
  pk_columns: Works_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Works_ManyArgs = {
  updates: Array<Works_Updates>;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

/** columns and relationships of "planned_tasks" */
export type Planned_Tasks = {
  __typename?: 'planned_tasks';
  author?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  equipment?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  time_work?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "planned_tasks" */
export type Planned_Tasks_Aggregate = {
  __typename?: 'planned_tasks_aggregate';
  aggregate?: Maybe<Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Planned_Tasks>;
};

/** aggregate fields of "planned_tasks" */
export type Planned_Tasks_Aggregate_Fields = {
  __typename?: 'planned_tasks_aggregate_fields';
  avg?: Maybe<Planned_Tasks_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Planned_Tasks_Max_Fields>;
  min?: Maybe<Planned_Tasks_Min_Fields>;
  stddev?: Maybe<Planned_Tasks_Stddev_Fields>;
  stddev_pop?: Maybe<Planned_Tasks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Planned_Tasks_Stddev_Samp_Fields>;
  sum?: Maybe<Planned_Tasks_Sum_Fields>;
  var_pop?: Maybe<Planned_Tasks_Var_Pop_Fields>;
  var_samp?: Maybe<Planned_Tasks_Var_Samp_Fields>;
  variance?: Maybe<Planned_Tasks_Variance_Fields>;
};

/** aggregate fields of "planned_tasks" */
export type Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Planned_Tasks_Avg_Fields = {
  __typename?: 'planned_tasks_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "planned_tasks". All fields are combined with a logical 'AND'. */
export type Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Planned_Tasks_Bool_Exp>>;
  author?: InputMaybe<String_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  equipment?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  rd?: InputMaybe<String_Comparison_Exp>;
  rm?: InputMaybe<String_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  time_work?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "planned_tasks" */
export enum Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "id" */
  PlannedTasksPkey = 'planned_tasks_pkey',
}

/** input type for incrementing numeric columns in table "planned_tasks" */
export type Planned_Tasks_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "planned_tasks" */
export type Planned_Tasks_Insert_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equipment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  time_work?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Planned_Tasks_Max_Fields = {
  __typename?: 'planned_tasks_max_fields';
  author?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  equipment?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  time_work?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Planned_Tasks_Min_Fields = {
  __typename?: 'planned_tasks_min_fields';
  author?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  equipment?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  time_work?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "planned_tasks" */
export type Planned_Tasks_Mutation_Response = {
  __typename?: 'planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Planned_Tasks>;
};

/** on_conflict condition type for table "planned_tasks" */
export type Planned_Tasks_On_Conflict = {
  constraint: Planned_Tasks_Constraint;
  update_columns?: Array<Planned_Tasks_Update_Column>;
  where?: InputMaybe<Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "planned_tasks". */
export type Planned_Tasks_Order_By = {
  author?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  equipment?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project?: InputMaybe<Order_By>;
  rd?: InputMaybe<Order_By>;
  rm?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  time_work?: InputMaybe<Order_By>;
};

/** primary key columns input for table: planned_tasks */
export type Planned_Tasks_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "planned_tasks" */
export enum Planned_Tasks_Select_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Description = 'description',
  /** column name */
  Equipment = 'equipment',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Project = 'project',
  /** column name */
  Rd = 'rd',
  /** column name */
  Rm = 'rm',
  /** column name */
  Role = 'role',
  /** column name */
  TimeWork = 'time_work',
}

/** input type for updating data in table "planned_tasks" */
export type Planned_Tasks_Set_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equipment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  time_work?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Planned_Tasks_Stddev_Fields = {
  __typename?: 'planned_tasks_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Planned_Tasks_Stddev_Pop_Fields = {
  __typename?: 'planned_tasks_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Planned_Tasks_Stddev_Samp_Fields = {
  __typename?: 'planned_tasks_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "planned_tasks" */
export type Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Planned_Tasks_Stream_Cursor_Value_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  equipment?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  time_work?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Planned_Tasks_Sum_Fields = {
  __typename?: 'planned_tasks_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "planned_tasks" */
export enum Planned_Tasks_Update_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Description = 'description',
  /** column name */
  Equipment = 'equipment',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Project = 'project',
  /** column name */
  Rd = 'rd',
  /** column name */
  Rm = 'rm',
  /** column name */
  Role = 'role',
  /** column name */
  TimeWork = 'time_work',
}

export type Planned_Tasks_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Planned_Tasks_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Planned_Tasks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Planned_Tasks_Var_Pop_Fields = {
  __typename?: 'planned_tasks_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Planned_Tasks_Var_Samp_Fields = {
  __typename?: 'planned_tasks_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Planned_Tasks_Variance_Fields = {
  __typename?: 'planned_tasks_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "executor" */
  executor: Array<Executor>;
  /** fetch aggregated fields from the table: "executor" */
  executor_aggregate: Executor_Aggregate;
  /** fetch data from the table: "executor" using primary key columns */
  executor_by_pk?: Maybe<Executor>;
  /** fetch data from the table: "job_sheet_devices" */
  job_sheet_devices: Array<Job_Sheet_Devices>;
  /** fetch aggregated fields from the table: "job_sheet_devices" */
  job_sheet_devices_aggregate: Job_Sheet_Devices_Aggregate;
  /** fetch data from the table: "job_sheet_devices" using primary key columns */
  job_sheet_devices_by_pk?: Maybe<Job_Sheet_Devices>;
  /** fetch data from the table: "job_sheets" */
  job_sheets: Array<Job_Sheets>;
  /** fetch aggregated fields from the table: "job_sheets" */
  job_sheets_aggregate: Job_Sheets_Aggregate;
  /** fetch data from the table: "job_sheets" using primary key columns */
  job_sheets_by_pk?: Maybe<Job_Sheets>;
  /** fetch data from the table: "locations" */
  locations: Array<Locations>;
  /** fetch aggregated fields from the table: "locations" */
  locations_aggregate: Locations_Aggregate;
  /** fetch data from the table: "locations" using primary key columns */
  locations_by_pk?: Maybe<Locations>;
  /** fetch data from the table: "planned_tasks" */
  planned_tasks: Array<Planned_Tasks>;
  /** fetch aggregated fields from the table: "planned_tasks" */
  planned_tasks_aggregate: Planned_Tasks_Aggregate;
  /** fetch data from the table: "planned_tasks" using primary key columns */
  planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table: "work_cards" */
  work_cards: Array<Work_Cards>;
  /** fetch aggregated fields from the table: "work_cards" */
  work_cards_aggregate: Work_Cards_Aggregate;
  /** fetch data from the table: "work_cards" using primary key columns */
  work_cards_by_pk?: Maybe<Work_Cards>;
  /** fetch data from the table: "works" */
  works: Array<Works>;
  /** fetch aggregated fields from the table: "works" */
  works_aggregate: Works_Aggregate;
  /** fetch data from the table: "works" using primary key columns */
  works_by_pk?: Maybe<Works>;
};

export type Query_RootExecutorArgs = {
  distinct_on?: InputMaybe<Array<Executor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Executor_Order_By>>;
  where?: InputMaybe<Executor_Bool_Exp>;
};

export type Query_RootExecutor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Executor_Order_By>>;
  where?: InputMaybe<Executor_Bool_Exp>;
};

export type Query_RootExecutor_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootJob_Sheet_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheet_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheet_Devices_Order_By>>;
  where?: InputMaybe<Job_Sheet_Devices_Bool_Exp>;
};

export type Query_RootJob_Sheet_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheet_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheet_Devices_Order_By>>;
  where?: InputMaybe<Job_Sheet_Devices_Bool_Exp>;
};

export type Query_RootJob_Sheet_Devices_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootJob_SheetsArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheets_Order_By>>;
  where?: InputMaybe<Job_Sheets_Bool_Exp>;
};

export type Query_RootJob_Sheets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheets_Order_By>>;
  where?: InputMaybe<Job_Sheets_Bool_Exp>;
};

export type Query_RootJob_Sheets_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootLocationsArgs = {
  distinct_on?: InputMaybe<Array<Locations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Locations_Order_By>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Query_RootLocations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Locations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Locations_Order_By>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Query_RootLocations_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootPlanned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Bool_Exp>;
};

export type Query_RootPlanned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Bool_Exp>;
};

export type Query_RootPlanned_Tasks_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Query_RootUsers_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootWork_CardsArgs = {
  distinct_on?: InputMaybe<Array<Work_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Work_Cards_Order_By>>;
  where?: InputMaybe<Work_Cards_Bool_Exp>;
};

export type Query_RootWork_Cards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Work_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Work_Cards_Order_By>>;
  where?: InputMaybe<Work_Cards_Bool_Exp>;
};

export type Query_RootWork_Cards_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Query_RootWorksArgs = {
  distinct_on?: InputMaybe<Array<Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Works_Order_By>>;
  where?: InputMaybe<Works_Bool_Exp>;
};

export type Query_RootWorks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Works_Order_By>>;
  where?: InputMaybe<Works_Bool_Exp>;
};

export type Query_RootWorks_By_PkArgs = {
  idInt: Scalars['Int']['input'];
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "executor" */
  executor: Array<Executor>;
  /** fetch aggregated fields from the table: "executor" */
  executor_aggregate: Executor_Aggregate;
  /** fetch data from the table: "executor" using primary key columns */
  executor_by_pk?: Maybe<Executor>;
  /** fetch data from the table in a streaming manner: "executor" */
  executor_stream: Array<Executor>;
  /** fetch data from the table: "job_sheet_devices" */
  job_sheet_devices: Array<Job_Sheet_Devices>;
  /** fetch aggregated fields from the table: "job_sheet_devices" */
  job_sheet_devices_aggregate: Job_Sheet_Devices_Aggregate;
  /** fetch data from the table: "job_sheet_devices" using primary key columns */
  job_sheet_devices_by_pk?: Maybe<Job_Sheet_Devices>;
  /** fetch data from the table in a streaming manner: "job_sheet_devices" */
  job_sheet_devices_stream: Array<Job_Sheet_Devices>;
  /** fetch data from the table: "job_sheets" */
  job_sheets: Array<Job_Sheets>;
  /** fetch aggregated fields from the table: "job_sheets" */
  job_sheets_aggregate: Job_Sheets_Aggregate;
  /** fetch data from the table: "job_sheets" using primary key columns */
  job_sheets_by_pk?: Maybe<Job_Sheets>;
  /** fetch data from the table in a streaming manner: "job_sheets" */
  job_sheets_stream: Array<Job_Sheets>;
  /** fetch data from the table: "locations" */
  locations: Array<Locations>;
  /** fetch aggregated fields from the table: "locations" */
  locations_aggregate: Locations_Aggregate;
  /** fetch data from the table: "locations" using primary key columns */
  locations_by_pk?: Maybe<Locations>;
  /** fetch data from the table in a streaming manner: "locations" */
  locations_stream: Array<Locations>;
  /** fetch data from the table: "planned_tasks" */
  planned_tasks: Array<Planned_Tasks>;
  /** fetch aggregated fields from the table: "planned_tasks" */
  planned_tasks_aggregate: Planned_Tasks_Aggregate;
  /** fetch data from the table: "planned_tasks" using primary key columns */
  planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** fetch data from the table in a streaming manner: "planned_tasks" */
  planned_tasks_stream: Array<Planned_Tasks>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "work_cards" */
  work_cards: Array<Work_Cards>;
  /** fetch aggregated fields from the table: "work_cards" */
  work_cards_aggregate: Work_Cards_Aggregate;
  /** fetch data from the table: "work_cards" using primary key columns */
  work_cards_by_pk?: Maybe<Work_Cards>;
  /** fetch data from the table in a streaming manner: "work_cards" */
  work_cards_stream: Array<Work_Cards>;
  /** fetch data from the table: "works" */
  works: Array<Works>;
  /** fetch aggregated fields from the table: "works" */
  works_aggregate: Works_Aggregate;
  /** fetch data from the table: "works" using primary key columns */
  works_by_pk?: Maybe<Works>;
  /** fetch data from the table in a streaming manner: "works" */
  works_stream: Array<Works>;
};

export type Subscription_RootExecutorArgs = {
  distinct_on?: InputMaybe<Array<Executor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Executor_Order_By>>;
  where?: InputMaybe<Executor_Bool_Exp>;
};

export type Subscription_RootExecutor_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Executor_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Executor_Order_By>>;
  where?: InputMaybe<Executor_Bool_Exp>;
};

export type Subscription_RootExecutor_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootExecutor_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Executor_Stream_Cursor_Input>>;
  where?: InputMaybe<Executor_Bool_Exp>;
};

export type Subscription_RootJob_Sheet_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheet_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheet_Devices_Order_By>>;
  where?: InputMaybe<Job_Sheet_Devices_Bool_Exp>;
};

export type Subscription_RootJob_Sheet_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheet_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheet_Devices_Order_By>>;
  where?: InputMaybe<Job_Sheet_Devices_Bool_Exp>;
};

export type Subscription_RootJob_Sheet_Devices_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootJob_Sheet_Devices_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Job_Sheet_Devices_Stream_Cursor_Input>>;
  where?: InputMaybe<Job_Sheet_Devices_Bool_Exp>;
};

export type Subscription_RootJob_SheetsArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheets_Order_By>>;
  where?: InputMaybe<Job_Sheets_Bool_Exp>;
};

export type Subscription_RootJob_Sheets_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Job_Sheets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Job_Sheets_Order_By>>;
  where?: InputMaybe<Job_Sheets_Bool_Exp>;
};

export type Subscription_RootJob_Sheets_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootJob_Sheets_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Job_Sheets_Stream_Cursor_Input>>;
  where?: InputMaybe<Job_Sheets_Bool_Exp>;
};

export type Subscription_RootLocationsArgs = {
  distinct_on?: InputMaybe<Array<Locations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Locations_Order_By>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Subscription_RootLocations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Locations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Locations_Order_By>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Subscription_RootLocations_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootLocations_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Locations_Stream_Cursor_Input>>;
  where?: InputMaybe<Locations_Bool_Exp>;
};

export type Subscription_RootPlanned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPlanned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPlanned_Tasks_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootPlanned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootUsers_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

export type Subscription_RootWork_CardsArgs = {
  distinct_on?: InputMaybe<Array<Work_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Work_Cards_Order_By>>;
  where?: InputMaybe<Work_Cards_Bool_Exp>;
};

export type Subscription_RootWork_Cards_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Work_Cards_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Work_Cards_Order_By>>;
  where?: InputMaybe<Work_Cards_Bool_Exp>;
};

export type Subscription_RootWork_Cards_By_PkArgs = {
  id: Scalars['Int']['input'];
};

export type Subscription_RootWork_Cards_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Work_Cards_Stream_Cursor_Input>>;
  where?: InputMaybe<Work_Cards_Bool_Exp>;
};

export type Subscription_RootWorksArgs = {
  distinct_on?: InputMaybe<Array<Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Works_Order_By>>;
  where?: InputMaybe<Works_Bool_Exp>;
};

export type Subscription_RootWorks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Works_Order_By>>;
  where?: InputMaybe<Works_Bool_Exp>;
};

export type Subscription_RootWorks_By_PkArgs = {
  idInt: Scalars['Int']['input'];
};

export type Subscription_RootWorks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Works_Stream_Cursor_Input>>;
  where?: InputMaybe<Works_Bool_Exp>;
};

/** Boolean expression to compare columns of type "time". All fields are combined with logical 'AND'. */
export type Time_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['time']['input']>;
  _gt?: InputMaybe<Scalars['time']['input']>;
  _gte?: InputMaybe<Scalars['time']['input']>;
  _in?: InputMaybe<Array<Scalars['time']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['time']['input']>;
  _lte?: InputMaybe<Scalars['time']['input']>;
  _neq?: InputMaybe<Scalars['time']['input']>;
  _nin?: InputMaybe<Array<Scalars['time']['input']>>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  author: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  avg?: Maybe<Users_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
  stddev?: Maybe<Users_Stddev_Fields>;
  stddev_pop?: Maybe<Users_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Users_Stddev_Samp_Fields>;
  sum?: Maybe<Users_Sum_Fields>;
  var_pop?: Maybe<Users_Var_Pop_Fields>;
  var_samp?: Maybe<Users_Var_Samp_Fields>;
  variance?: Maybe<Users_Variance_Fields>;
};

/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Users_Avg_Fields = {
  __typename?: 'users_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  author?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey',
}

/** input type for incrementing numeric columns in table "users" */
export type Users_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** on_conflict condition type for table "users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "users". */
export type Users_Order_By = {
  author?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Users_Stddev_Fields = {
  __typename?: 'users_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Users_Stddev_Pop_Fields = {
  __typename?: 'users_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Users_Stddev_Samp_Fields = {
  __typename?: 'users_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Users_Sum_Fields = {
  __typename?: 'users_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

export type Users_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Users_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Users_Var_Pop_Fields = {
  __typename?: 'users_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Users_Var_Samp_Fields = {
  __typename?: 'users_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Users_Variance_Fields = {
  __typename?: 'users_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "work_cards" */
export type Work_Cards = {
  __typename?: 'work_cards';
  id: Scalars['Int']['output'];
  project: Scalars['String']['output'];
  rd_url?: Maybe<Scalars['String']['output']>;
  redmine_url?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  window_end: Scalars['time']['output'];
  window_start: Scalars['time']['output'];
};

/** aggregated selection of "work_cards" */
export type Work_Cards_Aggregate = {
  __typename?: 'work_cards_aggregate';
  aggregate?: Maybe<Work_Cards_Aggregate_Fields>;
  nodes: Array<Work_Cards>;
};

/** aggregate fields of "work_cards" */
export type Work_Cards_Aggregate_Fields = {
  __typename?: 'work_cards_aggregate_fields';
  avg?: Maybe<Work_Cards_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Work_Cards_Max_Fields>;
  min?: Maybe<Work_Cards_Min_Fields>;
  stddev?: Maybe<Work_Cards_Stddev_Fields>;
  stddev_pop?: Maybe<Work_Cards_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Work_Cards_Stddev_Samp_Fields>;
  sum?: Maybe<Work_Cards_Sum_Fields>;
  var_pop?: Maybe<Work_Cards_Var_Pop_Fields>;
  var_samp?: Maybe<Work_Cards_Var_Samp_Fields>;
  variance?: Maybe<Work_Cards_Variance_Fields>;
};

/** aggregate fields of "work_cards" */
export type Work_Cards_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Work_Cards_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Work_Cards_Avg_Fields = {
  __typename?: 'work_cards_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "work_cards". All fields are combined with a logical 'AND'. */
export type Work_Cards_Bool_Exp = {
  _and?: InputMaybe<Array<Work_Cards_Bool_Exp>>;
  _not?: InputMaybe<Work_Cards_Bool_Exp>;
  _or?: InputMaybe<Array<Work_Cards_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  rd_url?: InputMaybe<String_Comparison_Exp>;
  redmine_url?: InputMaybe<String_Comparison_Exp>;
  title?: InputMaybe<String_Comparison_Exp>;
  window_end?: InputMaybe<Time_Comparison_Exp>;
  window_start?: InputMaybe<Time_Comparison_Exp>;
};

/** unique or primary key constraints on table "work_cards" */
export enum Work_Cards_Constraint {
  /** unique or primary key constraint on columns "id" */
  WorkCardsPkey = 'work_cards_pkey',
}

/** input type for incrementing numeric columns in table "work_cards" */
export type Work_Cards_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "work_cards" */
export type Work_Cards_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd_url?: InputMaybe<Scalars['String']['input']>;
  redmine_url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  window_end?: InputMaybe<Scalars['time']['input']>;
  window_start?: InputMaybe<Scalars['time']['input']>;
};

/** aggregate max on columns */
export type Work_Cards_Max_Fields = {
  __typename?: 'work_cards_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd_url?: Maybe<Scalars['String']['output']>;
  redmine_url?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Work_Cards_Min_Fields = {
  __typename?: 'work_cards_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd_url?: Maybe<Scalars['String']['output']>;
  redmine_url?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "work_cards" */
export type Work_Cards_Mutation_Response = {
  __typename?: 'work_cards_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Work_Cards>;
};

/** on_conflict condition type for table "work_cards" */
export type Work_Cards_On_Conflict = {
  constraint: Work_Cards_Constraint;
  update_columns?: Array<Work_Cards_Update_Column>;
  where?: InputMaybe<Work_Cards_Bool_Exp>;
};

/** Ordering options when selecting data from "work_cards". */
export type Work_Cards_Order_By = {
  id?: InputMaybe<Order_By>;
  project?: InputMaybe<Order_By>;
  rd_url?: InputMaybe<Order_By>;
  redmine_url?: InputMaybe<Order_By>;
  title?: InputMaybe<Order_By>;
  window_end?: InputMaybe<Order_By>;
  window_start?: InputMaybe<Order_By>;
};

/** primary key columns input for table: work_cards */
export type Work_Cards_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** select columns of table "work_cards" */
export enum Work_Cards_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Project = 'project',
  /** column name */
  RdUrl = 'rd_url',
  /** column name */
  RedmineUrl = 'redmine_url',
  /** column name */
  Title = 'title',
  /** column name */
  WindowEnd = 'window_end',
  /** column name */
  WindowStart = 'window_start',
}

/** input type for updating data in table "work_cards" */
export type Work_Cards_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd_url?: InputMaybe<Scalars['String']['input']>;
  redmine_url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  window_end?: InputMaybe<Scalars['time']['input']>;
  window_start?: InputMaybe<Scalars['time']['input']>;
};

/** aggregate stddev on columns */
export type Work_Cards_Stddev_Fields = {
  __typename?: 'work_cards_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Work_Cards_Stddev_Pop_Fields = {
  __typename?: 'work_cards_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Work_Cards_Stddev_Samp_Fields = {
  __typename?: 'work_cards_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "work_cards" */
export type Work_Cards_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Work_Cards_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Work_Cards_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd_url?: InputMaybe<Scalars['String']['input']>;
  redmine_url?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  window_end?: InputMaybe<Scalars['time']['input']>;
  window_start?: InputMaybe<Scalars['time']['input']>;
};

/** aggregate sum on columns */
export type Work_Cards_Sum_Fields = {
  __typename?: 'work_cards_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "work_cards" */
export enum Work_Cards_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Project = 'project',
  /** column name */
  RdUrl = 'rd_url',
  /** column name */
  RedmineUrl = 'redmine_url',
  /** column name */
  Title = 'title',
  /** column name */
  WindowEnd = 'window_end',
  /** column name */
  WindowStart = 'window_start',
}

export type Work_Cards_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Work_Cards_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Work_Cards_Set_Input>;
  /** filter the rows which have to be updated */
  where: Work_Cards_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Work_Cards_Var_Pop_Fields = {
  __typename?: 'work_cards_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Work_Cards_Var_Samp_Fields = {
  __typename?: 'work_cards_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Work_Cards_Variance_Fields = {
  __typename?: 'work_cards_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "works" */
export type Works = {
  __typename?: 'works';
  date: Scalars['date']['output'];
  description: Scalars['String']['output'];
  id?: Maybe<Scalars['String']['output']>;
  idInt: Scalars['Int']['output'];
  overtime_hours: Scalars['Int']['output'];
  ppr_hours: Scalars['Int']['output'];
  project: Scalars['String']['output'];
  site: Scalars['String']['output'];
  status: Scalars['String']['output'];
  time_range: Scalars['String']['output'];
  work_hours: Scalars['Int']['output'];
};

/** aggregated selection of "works" */
export type Works_Aggregate = {
  __typename?: 'works_aggregate';
  aggregate?: Maybe<Works_Aggregate_Fields>;
  nodes: Array<Works>;
};

/** aggregate fields of "works" */
export type Works_Aggregate_Fields = {
  __typename?: 'works_aggregate_fields';
  avg?: Maybe<Works_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Works_Max_Fields>;
  min?: Maybe<Works_Min_Fields>;
  stddev?: Maybe<Works_Stddev_Fields>;
  stddev_pop?: Maybe<Works_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Works_Stddev_Samp_Fields>;
  sum?: Maybe<Works_Sum_Fields>;
  var_pop?: Maybe<Works_Var_Pop_Fields>;
  var_samp?: Maybe<Works_Var_Samp_Fields>;
  variance?: Maybe<Works_Variance_Fields>;
};

/** aggregate fields of "works" */
export type Works_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Works_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Works_Avg_Fields = {
  __typename?: 'works_avg_fields';
  idInt?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "works". All fields are combined with a logical 'AND'. */
export type Works_Bool_Exp = {
  _and?: InputMaybe<Array<Works_Bool_Exp>>;
  _not?: InputMaybe<Works_Bool_Exp>;
  _or?: InputMaybe<Array<Works_Bool_Exp>>;
  date?: InputMaybe<Date_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  idInt?: InputMaybe<Int_Comparison_Exp>;
  overtime_hours?: InputMaybe<Int_Comparison_Exp>;
  ppr_hours?: InputMaybe<Int_Comparison_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  site?: InputMaybe<String_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  time_range?: InputMaybe<String_Comparison_Exp>;
  work_hours?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "works" */
export enum Works_Constraint {
  /** unique or primary key constraint on columns "id" */
  WorksPkey = 'works_pkey',
}

/** input type for incrementing numeric columns in table "works" */
export type Works_Inc_Input = {
  idInt?: InputMaybe<Scalars['Int']['input']>;
  overtime_hours?: InputMaybe<Scalars['Int']['input']>;
  ppr_hours?: InputMaybe<Scalars['Int']['input']>;
  work_hours?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "works" */
export type Works_Insert_Input = {
  date?: InputMaybe<Scalars['date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  idInt?: InputMaybe<Scalars['Int']['input']>;
  overtime_hours?: InputMaybe<Scalars['Int']['input']>;
  ppr_hours?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  site?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  time_range?: InputMaybe<Scalars['String']['input']>;
  work_hours?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Works_Max_Fields = {
  __typename?: 'works_max_fields';
  date?: Maybe<Scalars['date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  idInt?: Maybe<Scalars['Int']['output']>;
  overtime_hours?: Maybe<Scalars['Int']['output']>;
  ppr_hours?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  site?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  time_range?: Maybe<Scalars['String']['output']>;
  work_hours?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Works_Min_Fields = {
  __typename?: 'works_min_fields';
  date?: Maybe<Scalars['date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  idInt?: Maybe<Scalars['Int']['output']>;
  overtime_hours?: Maybe<Scalars['Int']['output']>;
  ppr_hours?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  site?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  time_range?: Maybe<Scalars['String']['output']>;
  work_hours?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "works" */
export type Works_Mutation_Response = {
  __typename?: 'works_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Works>;
};

/** on_conflict condition type for table "works" */
export type Works_On_Conflict = {
  constraint: Works_Constraint;
  update_columns?: Array<Works_Update_Column>;
  where?: InputMaybe<Works_Bool_Exp>;
};

/** Ordering options when selecting data from "works". */
export type Works_Order_By = {
  date?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  idInt?: InputMaybe<Order_By>;
  overtime_hours?: InputMaybe<Order_By>;
  ppr_hours?: InputMaybe<Order_By>;
  project?: InputMaybe<Order_By>;
  site?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_range?: InputMaybe<Order_By>;
  work_hours?: InputMaybe<Order_By>;
};

/** primary key columns input for table: works */
export type Works_Pk_Columns_Input = {
  idInt: Scalars['Int']['input'];
};

/** select columns of table "works" */
export enum Works_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  IdInt = 'idInt',
  /** column name */
  OvertimeHours = 'overtime_hours',
  /** column name */
  PprHours = 'ppr_hours',
  /** column name */
  Project = 'project',
  /** column name */
  Site = 'site',
  /** column name */
  Status = 'status',
  /** column name */
  TimeRange = 'time_range',
  /** column name */
  WorkHours = 'work_hours',
}

/** input type for updating data in table "works" */
export type Works_Set_Input = {
  date?: InputMaybe<Scalars['date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  idInt?: InputMaybe<Scalars['Int']['input']>;
  overtime_hours?: InputMaybe<Scalars['Int']['input']>;
  ppr_hours?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  site?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  time_range?: InputMaybe<Scalars['String']['input']>;
  work_hours?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Works_Stddev_Fields = {
  __typename?: 'works_stddev_fields';
  idInt?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Works_Stddev_Pop_Fields = {
  __typename?: 'works_stddev_pop_fields';
  idInt?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Works_Stddev_Samp_Fields = {
  __typename?: 'works_stddev_samp_fields';
  idInt?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "works" */
export type Works_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Works_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Works_Stream_Cursor_Value_Input = {
  date?: InputMaybe<Scalars['date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  idInt?: InputMaybe<Scalars['Int']['input']>;
  overtime_hours?: InputMaybe<Scalars['Int']['input']>;
  ppr_hours?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  site?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  time_range?: InputMaybe<Scalars['String']['input']>;
  work_hours?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Works_Sum_Fields = {
  __typename?: 'works_sum_fields';
  idInt?: Maybe<Scalars['Int']['output']>;
  overtime_hours?: Maybe<Scalars['Int']['output']>;
  ppr_hours?: Maybe<Scalars['Int']['output']>;
  work_hours?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "works" */
export enum Works_Update_Column {
  /** column name */
  Date = 'date',
  /** column name */
  Description = 'description',
  /** column name */
  IdInt = 'idInt',
  /** column name */
  OvertimeHours = 'overtime_hours',
  /** column name */
  PprHours = 'ppr_hours',
  /** column name */
  Project = 'project',
  /** column name */
  Site = 'site',
  /** column name */
  Status = 'status',
  /** column name */
  TimeRange = 'time_range',
  /** column name */
  WorkHours = 'work_hours',
}

export type Works_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Works_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Works_Set_Input>;
  /** filter the rows which have to be updated */
  where: Works_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Works_Var_Pop_Fields = {
  __typename?: 'works_var_pop_fields';
  idInt?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Works_Var_Samp_Fields = {
  __typename?: 'works_var_samp_fields';
  idInt?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Works_Variance_Fields = {
  __typename?: 'works_variance_fields';
  idInt?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

export type FetchExecutorsByRoleQueryVariables = Types.Exact<{
  role: Types.Scalars['String']['input'];
}>;

export type FetchExecutorsByRoleQuery = {
  __typename?: 'query_root';
  executor: Array<{ __typename?: 'executor'; id: number; author: string; role: string }>;
};

export const FetchExecutorsByRoleDocument = gql`
  query FetchExecutorsByRole($role: String!) {
    executor(where: { role: { _eq: $role } }) {
      id
      author
      role
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) =>
  action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    FetchExecutorsByRole(
      variables: FetchExecutorsByRoleQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<FetchExecutorsByRoleQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FetchExecutorsByRoleQuery>({
            document: FetchExecutorsByRoleDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'FetchExecutorsByRole',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
