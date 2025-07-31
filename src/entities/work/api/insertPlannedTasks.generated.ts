import type { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';

import type * as Types from '../../../shared/api/graphql';
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
  interval: { input: any; output: any };
  time: { input: any; output: any };
  timestamptz: { input: any; output: any };
  uuid: { input: any; output: any };
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

/** Boolean expression to compare columns of type "interval". All fields are combined with logical 'AND'. */
export type Interval_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['interval']['input']>;
  _gt?: InputMaybe<Scalars['interval']['input']>;
  _gte?: InputMaybe<Scalars['interval']['input']>;
  _in?: InputMaybe<Array<Scalars['interval']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['interval']['input']>;
  _lte?: InputMaybe<Scalars['interval']['input']>;
  _neq?: InputMaybe<Scalars['interval']['input']>;
  _nin?: InputMaybe<Array<Scalars['interval']['input']>>;
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
  /** delete data from the table: "public2.apartment" */
  delete_public2_apartment?: Maybe<Public2_Apartment_Mutation_Response>;
  /** delete single row from the table: "public2.apartment" */
  delete_public2_apartment_by_pk?: Maybe<Public2_Apartment>;
  /** delete data from the table: "public2.branch" */
  delete_public2_branch?: Maybe<Public2_Branch_Mutation_Response>;
  /** delete single row from the table: "public2.branch" */
  delete_public2_branch_by_pk?: Maybe<Public2_Branch>;
  /** delete data from the table: "public2.city" */
  delete_public2_city?: Maybe<Public2_City_Mutation_Response>;
  /** delete single row from the table: "public2.city" */
  delete_public2_city_by_pk?: Maybe<Public2_City>;
  /** delete data from the table: "public2.equipment" */
  delete_public2_equipment?: Maybe<Public2_Equipment_Mutation_Response>;
  /** delete single row from the table: "public2.equipment" */
  delete_public2_equipment_by_pk?: Maybe<Public2_Equipment>;
  /** delete data from the table: "public2.house" */
  delete_public2_house?: Maybe<Public2_House_Mutation_Response>;
  /** delete single row from the table: "public2.house" */
  delete_public2_house_by_pk?: Maybe<Public2_House>;
  /** delete data from the table: "public2.planned_task" */
  delete_public2_planned_task?: Maybe<Public2_Planned_Task_Mutation_Response>;
  /** delete single row from the table: "public2.planned_task" */
  delete_public2_planned_task_by_pk?: Maybe<Public2_Planned_Task>;
  /** delete data from the table: "public2.planned_tasks" */
  delete_public2_planned_tasks?: Maybe<Public2_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "public2.planned_tasks" */
  delete_public2_planned_tasks_by_pk?: Maybe<Public2_Planned_Tasks>;
  /** delete data from the table: "public2.provider" */
  delete_public2_provider?: Maybe<Public2_Provider_Mutation_Response>;
  /** delete single row from the table: "public2.provider" */
  delete_public2_provider_by_pk?: Maybe<Public2_Provider>;
  /** delete data from the table: "public2.role" */
  delete_public2_role?: Maybe<Public2_Role_Mutation_Response>;
  /** delete single row from the table: "public2.role" */
  delete_public2_role_by_pk?: Maybe<Public2_Role>;
  /** delete data from the table: "public2.street" */
  delete_public2_street?: Maybe<Public2_Street_Mutation_Response>;
  /** delete single row from the table: "public2.street" */
  delete_public2_street_by_pk?: Maybe<Public2_Street>;
  /** delete data from the table: "public2.time_work" */
  delete_public2_time_work?: Maybe<Public2_Time_Work_Mutation_Response>;
  /** delete single row from the table: "public2.time_work" */
  delete_public2_time_work_by_pk?: Maybe<Public2_Time_Work>;
  /** delete data from the table: "public2.user" */
  delete_public2_user?: Maybe<Public2_User_Mutation_Response>;
  /** delete single row from the table: "public2.user" */
  delete_public2_user_by_pk?: Maybe<Public2_User>;
  /** delete data from the table: "public3.branches" */
  delete_public3_branches?: Maybe<Public3_Branches_Mutation_Response>;
  /** delete single row from the table: "public3.branches" */
  delete_public3_branches_by_pk?: Maybe<Public3_Branches>;
  /** delete data from the table: "public3.cities" */
  delete_public3_cities?: Maybe<Public3_Cities_Mutation_Response>;
  /** delete single row from the table: "public3.cities" */
  delete_public3_cities_by_pk?: Maybe<Public3_Cities>;
  /** delete data from the table: "public3.equipments" */
  delete_public3_equipments?: Maybe<Public3_Equipments_Mutation_Response>;
  /** delete single row from the table: "public3.equipments" */
  delete_public3_equipments_by_pk?: Maybe<Public3_Equipments>;
  /** delete data from the table: "public3.nodes" */
  delete_public3_nodes?: Maybe<Public3_Nodes_Mutation_Response>;
  /** delete single row from the table: "public3.nodes" */
  delete_public3_nodes_by_pk?: Maybe<Public3_Nodes>;
  /** delete data from the table: "public3.planned_tasks" */
  delete_public3_planned_tasks?: Maybe<Public3_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "public3.planned_tasks" */
  delete_public3_planned_tasks_by_pk?: Maybe<Public3_Planned_Tasks>;
  /** delete data from the table: "public3.planned_tasks_equipments" */
  delete_public3_planned_tasks_equipments?: Maybe<Public3_Planned_Tasks_Equipments_Mutation_Response>;
  /** delete single row from the table: "public3.planned_tasks_equipments" */
  delete_public3_planned_tasks_equipments_by_pk?: Maybe<Public3_Planned_Tasks_Equipments>;
  /** delete data from the table: "public3.providers" */
  delete_public3_providers?: Maybe<Public3_Providers_Mutation_Response>;
  /** delete single row from the table: "public3.providers" */
  delete_public3_providers_by_pk?: Maybe<Public3_Providers>;
  /** delete data from the table: "public3.roles" */
  delete_public3_roles?: Maybe<Public3_Roles_Mutation_Response>;
  /** delete single row from the table: "public3.roles" */
  delete_public3_roles_by_pk?: Maybe<Public3_Roles>;
  /** delete data from the table: "public3.time_works" */
  delete_public3_time_works?: Maybe<Public3_Time_Works_Mutation_Response>;
  /** delete single row from the table: "public3.time_works" */
  delete_public3_time_works_by_pk?: Maybe<Public3_Time_Works>;
  /** delete data from the table: "public3.user_planned_tasks" */
  delete_public3_user_planned_tasks?: Maybe<Public3_User_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "public3.user_planned_tasks" */
  delete_public3_user_planned_tasks_by_pk?: Maybe<Public3_User_Planned_Tasks>;
  /** delete data from the table: "public3.users" */
  delete_public3_users?: Maybe<Public3_Users_Mutation_Response>;
  /** delete single row from the table: "public3.users" */
  delete_public3_users_by_pk?: Maybe<Public3_Users>;
  /** delete data from the table: "public6.branches" */
  delete_public6_branches?: Maybe<Public6_Branches_Mutation_Response>;
  /** delete single row from the table: "public6.branches" */
  delete_public6_branches_by_pk?: Maybe<Public6_Branches>;
  /** delete data from the table: "public6.cities" */
  delete_public6_cities?: Maybe<Public6_Cities_Mutation_Response>;
  /** delete single row from the table: "public6.cities" */
  delete_public6_cities_by_pk?: Maybe<Public6_Cities>;
  /** delete data from the table: "public6.device_models" */
  delete_public6_device_models?: Maybe<Public6_Device_Models_Mutation_Response>;
  /** delete single row from the table: "public6.device_models" */
  delete_public6_device_models_by_pk?: Maybe<Public6_Device_Models>;
  /** delete data from the table: "public6.device_roles" */
  delete_public6_device_roles?: Maybe<Public6_Device_Roles_Mutation_Response>;
  /** delete single row from the table: "public6.device_roles" */
  delete_public6_device_roles_by_pk?: Maybe<Public6_Device_Roles>;
  /** delete data from the table: "public6.devices" */
  delete_public6_devices?: Maybe<Public6_Devices_Mutation_Response>;
  /** delete single row from the table: "public6.devices" */
  delete_public6_devices_by_pk?: Maybe<Public6_Devices>;
  /** delete data from the table: "public6.nodes" */
  delete_public6_nodes?: Maybe<Public6_Nodes_Mutation_Response>;
  /** delete single row from the table: "public6.nodes" */
  delete_public6_nodes_by_pk?: Maybe<Public6_Nodes>;
  /** delete data from the table: "public6.planned_tasks" */
  delete_public6_planned_tasks?: Maybe<Public6_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "public6.planned_tasks" */
  delete_public6_planned_tasks_by_pk?: Maybe<Public6_Planned_Tasks>;
  /** delete data from the table: "public6.planned_tasks_devices" */
  delete_public6_planned_tasks_devices?: Maybe<Public6_Planned_Tasks_Devices_Mutation_Response>;
  /** delete single row from the table: "public6.planned_tasks_devices" */
  delete_public6_planned_tasks_devices_by_pk?: Maybe<Public6_Planned_Tasks_Devices>;
  /** delete data from the table: "public6.providers" */
  delete_public6_providers?: Maybe<Public6_Providers_Mutation_Response>;
  /** delete single row from the table: "public6.providers" */
  delete_public6_providers_by_pk?: Maybe<Public6_Providers>;
  /** delete data from the table: "public6.rm_projects" */
  delete_public6_rm_projects?: Maybe<Public6_Rm_Projects_Mutation_Response>;
  /** delete single row from the table: "public6.rm_projects" */
  delete_public6_rm_projects_by_pk?: Maybe<Public6_Rm_Projects>;
  /** delete data from the table: "public6.rm_tasks" */
  delete_public6_rm_tasks?: Maybe<Public6_Rm_Tasks_Mutation_Response>;
  /** delete single row from the table: "public6.rm_tasks" */
  delete_public6_rm_tasks_by_pk?: Maybe<Public6_Rm_Tasks>;
  /** delete data from the table: "public6.roles" */
  delete_public6_roles?: Maybe<Public6_Roles_Mutation_Response>;
  /** delete single row from the table: "public6.roles" */
  delete_public6_roles_by_pk?: Maybe<Public6_Roles>;
  /** delete data from the table: "public6.time_works" */
  delete_public6_time_works?: Maybe<Public6_Time_Works_Mutation_Response>;
  /** delete single row from the table: "public6.time_works" */
  delete_public6_time_works_by_pk?: Maybe<Public6_Time_Works>;
  /** delete data from the table: "public6.user_groups" */
  delete_public6_user_groups?: Maybe<Public6_User_Groups_Mutation_Response>;
  /** delete single row from the table: "public6.user_groups" */
  delete_public6_user_groups_by_pk?: Maybe<Public6_User_Groups>;
  /** delete data from the table: "public6.user_planned_tasks" */
  delete_public6_user_planned_tasks?: Maybe<Public6_User_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "public6.user_planned_tasks" */
  delete_public6_user_planned_tasks_by_pk?: Maybe<Public6_User_Planned_Tasks>;
  /** delete data from the table: "public6.users" */
  delete_public6_users?: Maybe<Public6_Users_Mutation_Response>;
  /** delete single row from the table: "public6.users" */
  delete_public6_users_by_pk?: Maybe<Public6_Users>;
  /** delete data from the table: "public6.vendors" */
  delete_public6_vendors?: Maybe<Public6_Vendors_Mutation_Response>;
  /** delete single row from the table: "public6.vendors" */
  delete_public6_vendors_by_pk?: Maybe<Public6_Vendors>;
  /** delete data from the table: "public7.branches" */
  delete_public7_branches?: Maybe<Public7_Branches_Mutation_Response>;
  /** delete single row from the table: "public7.branches" */
  delete_public7_branches_by_pk?: Maybe<Public7_Branches>;
  /** delete data from the table: "public7.cities" */
  delete_public7_cities?: Maybe<Public7_Cities_Mutation_Response>;
  /** delete single row from the table: "public7.cities" */
  delete_public7_cities_by_pk?: Maybe<Public7_Cities>;
  /** delete data from the table: "public7.device_models" */
  delete_public7_device_models?: Maybe<Public7_Device_Models_Mutation_Response>;
  /** delete single row from the table: "public7.device_models" */
  delete_public7_device_models_by_pk?: Maybe<Public7_Device_Models>;
  /** delete data from the table: "public7.device_roles" */
  delete_public7_device_roles?: Maybe<Public7_Device_Roles_Mutation_Response>;
  /** delete single row from the table: "public7.device_roles" */
  delete_public7_device_roles_by_pk?: Maybe<Public7_Device_Roles>;
  /** delete data from the table: "public7.devices" */
  delete_public7_devices?: Maybe<Public7_Devices_Mutation_Response>;
  /** delete single row from the table: "public7.devices" */
  delete_public7_devices_by_pk?: Maybe<Public7_Devices>;
  /** delete data from the table: "public7.nodes" */
  delete_public7_nodes?: Maybe<Public7_Nodes_Mutation_Response>;
  /** delete single row from the table: "public7.nodes" */
  delete_public7_nodes_by_pk?: Maybe<Public7_Nodes>;
  /** delete data from the table: "public7.planned_tasks" */
  delete_public7_planned_tasks?: Maybe<Public7_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "public7.planned_tasks" */
  delete_public7_planned_tasks_by_pk?: Maybe<Public7_Planned_Tasks>;
  /** delete data from the table: "public7.planned_tasks_devices" */
  delete_public7_planned_tasks_devices?: Maybe<Public7_Planned_Tasks_Devices_Mutation_Response>;
  /** delete single row from the table: "public7.planned_tasks_devices" */
  delete_public7_planned_tasks_devices_by_pk?: Maybe<Public7_Planned_Tasks_Devices>;
  /** delete data from the table: "public7.providers" */
  delete_public7_providers?: Maybe<Public7_Providers_Mutation_Response>;
  /** delete single row from the table: "public7.providers" */
  delete_public7_providers_by_pk?: Maybe<Public7_Providers>;
  /** delete data from the table: "public7.rm_projects" */
  delete_public7_rm_projects?: Maybe<Public7_Rm_Projects_Mutation_Response>;
  /** delete single row from the table: "public7.rm_projects" */
  delete_public7_rm_projects_by_pk?: Maybe<Public7_Rm_Projects>;
  /** delete data from the table: "public7.rm_tasks" */
  delete_public7_rm_tasks?: Maybe<Public7_Rm_Tasks_Mutation_Response>;
  /** delete single row from the table: "public7.rm_tasks" */
  delete_public7_rm_tasks_by_pk?: Maybe<Public7_Rm_Tasks>;
  /** delete data from the table: "public7.roles" */
  delete_public7_roles?: Maybe<Public7_Roles_Mutation_Response>;
  /** delete single row from the table: "public7.roles" */
  delete_public7_roles_by_pk?: Maybe<Public7_Roles>;
  /** delete data from the table: "public7.time_works" */
  delete_public7_time_works?: Maybe<Public7_Time_Works_Mutation_Response>;
  /** delete single row from the table: "public7.time_works" */
  delete_public7_time_works_by_pk?: Maybe<Public7_Time_Works>;
  /** delete data from the table: "public7.user_groups" */
  delete_public7_user_groups?: Maybe<Public7_User_Groups_Mutation_Response>;
  /** delete single row from the table: "public7.user_groups" */
  delete_public7_user_groups_by_pk?: Maybe<Public7_User_Groups>;
  /** delete data from the table: "public7.user_planned_tasks" */
  delete_public7_user_planned_tasks?: Maybe<Public7_User_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "public7.user_planned_tasks" */
  delete_public7_user_planned_tasks_by_pk?: Maybe<Public7_User_Planned_Tasks>;
  /** delete data from the table: "public7.users" */
  delete_public7_users?: Maybe<Public7_Users_Mutation_Response>;
  /** delete single row from the table: "public7.users" */
  delete_public7_users_by_pk?: Maybe<Public7_Users>;
  /** delete data from the table: "public7.vendors" */
  delete_public7_vendors?: Maybe<Public7_Vendors_Mutation_Response>;
  /** delete single row from the table: "public7.vendors" */
  delete_public7_vendors_by_pk?: Maybe<Public7_Vendors>;
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
  /** insert data into the table: "public2.apartment" */
  insert_public2_apartment?: Maybe<Public2_Apartment_Mutation_Response>;
  /** insert a single row into the table: "public2.apartment" */
  insert_public2_apartment_one?: Maybe<Public2_Apartment>;
  /** insert data into the table: "public2.branch" */
  insert_public2_branch?: Maybe<Public2_Branch_Mutation_Response>;
  /** insert a single row into the table: "public2.branch" */
  insert_public2_branch_one?: Maybe<Public2_Branch>;
  /** insert data into the table: "public2.city" */
  insert_public2_city?: Maybe<Public2_City_Mutation_Response>;
  /** insert a single row into the table: "public2.city" */
  insert_public2_city_one?: Maybe<Public2_City>;
  /** insert data into the table: "public2.equipment" */
  insert_public2_equipment?: Maybe<Public2_Equipment_Mutation_Response>;
  /** insert a single row into the table: "public2.equipment" */
  insert_public2_equipment_one?: Maybe<Public2_Equipment>;
  /** insert data into the table: "public2.house" */
  insert_public2_house?: Maybe<Public2_House_Mutation_Response>;
  /** insert a single row into the table: "public2.house" */
  insert_public2_house_one?: Maybe<Public2_House>;
  /** insert data into the table: "public2.planned_task" */
  insert_public2_planned_task?: Maybe<Public2_Planned_Task_Mutation_Response>;
  /** insert a single row into the table: "public2.planned_task" */
  insert_public2_planned_task_one?: Maybe<Public2_Planned_Task>;
  /** insert data into the table: "public2.planned_tasks" */
  insert_public2_planned_tasks?: Maybe<Public2_Planned_Tasks_Mutation_Response>;
  /** insert a single row into the table: "public2.planned_tasks" */
  insert_public2_planned_tasks_one?: Maybe<Public2_Planned_Tasks>;
  /** insert data into the table: "public2.provider" */
  insert_public2_provider?: Maybe<Public2_Provider_Mutation_Response>;
  /** insert a single row into the table: "public2.provider" */
  insert_public2_provider_one?: Maybe<Public2_Provider>;
  /** insert data into the table: "public2.role" */
  insert_public2_role?: Maybe<Public2_Role_Mutation_Response>;
  /** insert a single row into the table: "public2.role" */
  insert_public2_role_one?: Maybe<Public2_Role>;
  /** insert data into the table: "public2.street" */
  insert_public2_street?: Maybe<Public2_Street_Mutation_Response>;
  /** insert a single row into the table: "public2.street" */
  insert_public2_street_one?: Maybe<Public2_Street>;
  /** insert data into the table: "public2.time_work" */
  insert_public2_time_work?: Maybe<Public2_Time_Work_Mutation_Response>;
  /** insert a single row into the table: "public2.time_work" */
  insert_public2_time_work_one?: Maybe<Public2_Time_Work>;
  /** insert data into the table: "public2.user" */
  insert_public2_user?: Maybe<Public2_User_Mutation_Response>;
  /** insert a single row into the table: "public2.user" */
  insert_public2_user_one?: Maybe<Public2_User>;
  /** insert data into the table: "public3.branches" */
  insert_public3_branches?: Maybe<Public3_Branches_Mutation_Response>;
  /** insert a single row into the table: "public3.branches" */
  insert_public3_branches_one?: Maybe<Public3_Branches>;
  /** insert data into the table: "public3.cities" */
  insert_public3_cities?: Maybe<Public3_Cities_Mutation_Response>;
  /** insert a single row into the table: "public3.cities" */
  insert_public3_cities_one?: Maybe<Public3_Cities>;
  /** insert data into the table: "public3.equipments" */
  insert_public3_equipments?: Maybe<Public3_Equipments_Mutation_Response>;
  /** insert a single row into the table: "public3.equipments" */
  insert_public3_equipments_one?: Maybe<Public3_Equipments>;
  /** insert data into the table: "public3.nodes" */
  insert_public3_nodes?: Maybe<Public3_Nodes_Mutation_Response>;
  /** insert a single row into the table: "public3.nodes" */
  insert_public3_nodes_one?: Maybe<Public3_Nodes>;
  /** insert data into the table: "public3.planned_tasks" */
  insert_public3_planned_tasks?: Maybe<Public3_Planned_Tasks_Mutation_Response>;
  /** insert data into the table: "public3.planned_tasks_equipments" */
  insert_public3_planned_tasks_equipments?: Maybe<Public3_Planned_Tasks_Equipments_Mutation_Response>;
  /** insert a single row into the table: "public3.planned_tasks_equipments" */
  insert_public3_planned_tasks_equipments_one?: Maybe<Public3_Planned_Tasks_Equipments>;
  /** insert a single row into the table: "public3.planned_tasks" */
  insert_public3_planned_tasks_one?: Maybe<Public3_Planned_Tasks>;
  /** insert data into the table: "public3.providers" */
  insert_public3_providers?: Maybe<Public3_Providers_Mutation_Response>;
  /** insert a single row into the table: "public3.providers" */
  insert_public3_providers_one?: Maybe<Public3_Providers>;
  /** insert data into the table: "public3.roles" */
  insert_public3_roles?: Maybe<Public3_Roles_Mutation_Response>;
  /** insert a single row into the table: "public3.roles" */
  insert_public3_roles_one?: Maybe<Public3_Roles>;
  /** insert data into the table: "public3.time_works" */
  insert_public3_time_works?: Maybe<Public3_Time_Works_Mutation_Response>;
  /** insert a single row into the table: "public3.time_works" */
  insert_public3_time_works_one?: Maybe<Public3_Time_Works>;
  /** insert data into the table: "public3.user_planned_tasks" */
  insert_public3_user_planned_tasks?: Maybe<Public3_User_Planned_Tasks_Mutation_Response>;
  /** insert a single row into the table: "public3.user_planned_tasks" */
  insert_public3_user_planned_tasks_one?: Maybe<Public3_User_Planned_Tasks>;
  /** insert data into the table: "public3.users" */
  insert_public3_users?: Maybe<Public3_Users_Mutation_Response>;
  /** insert a single row into the table: "public3.users" */
  insert_public3_users_one?: Maybe<Public3_Users>;
  /** insert data into the table: "public6.branches" */
  insert_public6_branches?: Maybe<Public6_Branches_Mutation_Response>;
  /** insert a single row into the table: "public6.branches" */
  insert_public6_branches_one?: Maybe<Public6_Branches>;
  /** insert data into the table: "public6.cities" */
  insert_public6_cities?: Maybe<Public6_Cities_Mutation_Response>;
  /** insert a single row into the table: "public6.cities" */
  insert_public6_cities_one?: Maybe<Public6_Cities>;
  /** insert data into the table: "public6.device_models" */
  insert_public6_device_models?: Maybe<Public6_Device_Models_Mutation_Response>;
  /** insert a single row into the table: "public6.device_models" */
  insert_public6_device_models_one?: Maybe<Public6_Device_Models>;
  /** insert data into the table: "public6.device_roles" */
  insert_public6_device_roles?: Maybe<Public6_Device_Roles_Mutation_Response>;
  /** insert a single row into the table: "public6.device_roles" */
  insert_public6_device_roles_one?: Maybe<Public6_Device_Roles>;
  /** insert data into the table: "public6.devices" */
  insert_public6_devices?: Maybe<Public6_Devices_Mutation_Response>;
  /** insert a single row into the table: "public6.devices" */
  insert_public6_devices_one?: Maybe<Public6_Devices>;
  /** insert data into the table: "public6.nodes" */
  insert_public6_nodes?: Maybe<Public6_Nodes_Mutation_Response>;
  /** insert a single row into the table: "public6.nodes" */
  insert_public6_nodes_one?: Maybe<Public6_Nodes>;
  /** insert data into the table: "public6.planned_tasks" */
  insert_public6_planned_tasks?: Maybe<Public6_Planned_Tasks_Mutation_Response>;
  /** insert data into the table: "public6.planned_tasks_devices" */
  insert_public6_planned_tasks_devices?: Maybe<Public6_Planned_Tasks_Devices_Mutation_Response>;
  /** insert a single row into the table: "public6.planned_tasks_devices" */
  insert_public6_planned_tasks_devices_one?: Maybe<Public6_Planned_Tasks_Devices>;
  /** insert a single row into the table: "public6.planned_tasks" */
  insert_public6_planned_tasks_one?: Maybe<Public6_Planned_Tasks>;
  /** insert data into the table: "public6.providers" */
  insert_public6_providers?: Maybe<Public6_Providers_Mutation_Response>;
  /** insert a single row into the table: "public6.providers" */
  insert_public6_providers_one?: Maybe<Public6_Providers>;
  /** insert data into the table: "public6.rm_projects" */
  insert_public6_rm_projects?: Maybe<Public6_Rm_Projects_Mutation_Response>;
  /** insert a single row into the table: "public6.rm_projects" */
  insert_public6_rm_projects_one?: Maybe<Public6_Rm_Projects>;
  /** insert data into the table: "public6.rm_tasks" */
  insert_public6_rm_tasks?: Maybe<Public6_Rm_Tasks_Mutation_Response>;
  /** insert a single row into the table: "public6.rm_tasks" */
  insert_public6_rm_tasks_one?: Maybe<Public6_Rm_Tasks>;
  /** insert data into the table: "public6.roles" */
  insert_public6_roles?: Maybe<Public6_Roles_Mutation_Response>;
  /** insert a single row into the table: "public6.roles" */
  insert_public6_roles_one?: Maybe<Public6_Roles>;
  /** insert data into the table: "public6.time_works" */
  insert_public6_time_works?: Maybe<Public6_Time_Works_Mutation_Response>;
  /** insert a single row into the table: "public6.time_works" */
  insert_public6_time_works_one?: Maybe<Public6_Time_Works>;
  /** insert data into the table: "public6.user_groups" */
  insert_public6_user_groups?: Maybe<Public6_User_Groups_Mutation_Response>;
  /** insert a single row into the table: "public6.user_groups" */
  insert_public6_user_groups_one?: Maybe<Public6_User_Groups>;
  /** insert data into the table: "public6.user_planned_tasks" */
  insert_public6_user_planned_tasks?: Maybe<Public6_User_Planned_Tasks_Mutation_Response>;
  /** insert a single row into the table: "public6.user_planned_tasks" */
  insert_public6_user_planned_tasks_one?: Maybe<Public6_User_Planned_Tasks>;
  /** insert data into the table: "public6.users" */
  insert_public6_users?: Maybe<Public6_Users_Mutation_Response>;
  /** insert a single row into the table: "public6.users" */
  insert_public6_users_one?: Maybe<Public6_Users>;
  /** insert data into the table: "public6.vendors" */
  insert_public6_vendors?: Maybe<Public6_Vendors_Mutation_Response>;
  /** insert a single row into the table: "public6.vendors" */
  insert_public6_vendors_one?: Maybe<Public6_Vendors>;
  /** insert data into the table: "public7.branches" */
  insert_public7_branches?: Maybe<Public7_Branches_Mutation_Response>;
  /** insert a single row into the table: "public7.branches" */
  insert_public7_branches_one?: Maybe<Public7_Branches>;
  /** insert data into the table: "public7.cities" */
  insert_public7_cities?: Maybe<Public7_Cities_Mutation_Response>;
  /** insert a single row into the table: "public7.cities" */
  insert_public7_cities_one?: Maybe<Public7_Cities>;
  /** insert data into the table: "public7.device_models" */
  insert_public7_device_models?: Maybe<Public7_Device_Models_Mutation_Response>;
  /** insert a single row into the table: "public7.device_models" */
  insert_public7_device_models_one?: Maybe<Public7_Device_Models>;
  /** insert data into the table: "public7.device_roles" */
  insert_public7_device_roles?: Maybe<Public7_Device_Roles_Mutation_Response>;
  /** insert a single row into the table: "public7.device_roles" */
  insert_public7_device_roles_one?: Maybe<Public7_Device_Roles>;
  /** insert data into the table: "public7.devices" */
  insert_public7_devices?: Maybe<Public7_Devices_Mutation_Response>;
  /** insert a single row into the table: "public7.devices" */
  insert_public7_devices_one?: Maybe<Public7_Devices>;
  /** insert data into the table: "public7.nodes" */
  insert_public7_nodes?: Maybe<Public7_Nodes_Mutation_Response>;
  /** insert a single row into the table: "public7.nodes" */
  insert_public7_nodes_one?: Maybe<Public7_Nodes>;
  /** insert data into the table: "public7.planned_tasks" */
  insert_public7_planned_tasks?: Maybe<Public7_Planned_Tasks_Mutation_Response>;
  /** insert data into the table: "public7.planned_tasks_devices" */
  insert_public7_planned_tasks_devices?: Maybe<Public7_Planned_Tasks_Devices_Mutation_Response>;
  /** insert a single row into the table: "public7.planned_tasks_devices" */
  insert_public7_planned_tasks_devices_one?: Maybe<Public7_Planned_Tasks_Devices>;
  /** insert a single row into the table: "public7.planned_tasks" */
  insert_public7_planned_tasks_one?: Maybe<Public7_Planned_Tasks>;
  /** insert data into the table: "public7.providers" */
  insert_public7_providers?: Maybe<Public7_Providers_Mutation_Response>;
  /** insert a single row into the table: "public7.providers" */
  insert_public7_providers_one?: Maybe<Public7_Providers>;
  /** insert data into the table: "public7.rm_projects" */
  insert_public7_rm_projects?: Maybe<Public7_Rm_Projects_Mutation_Response>;
  /** insert a single row into the table: "public7.rm_projects" */
  insert_public7_rm_projects_one?: Maybe<Public7_Rm_Projects>;
  /** insert data into the table: "public7.rm_tasks" */
  insert_public7_rm_tasks?: Maybe<Public7_Rm_Tasks_Mutation_Response>;
  /** insert a single row into the table: "public7.rm_tasks" */
  insert_public7_rm_tasks_one?: Maybe<Public7_Rm_Tasks>;
  /** insert data into the table: "public7.roles" */
  insert_public7_roles?: Maybe<Public7_Roles_Mutation_Response>;
  /** insert a single row into the table: "public7.roles" */
  insert_public7_roles_one?: Maybe<Public7_Roles>;
  /** insert data into the table: "public7.time_works" */
  insert_public7_time_works?: Maybe<Public7_Time_Works_Mutation_Response>;
  /** insert a single row into the table: "public7.time_works" */
  insert_public7_time_works_one?: Maybe<Public7_Time_Works>;
  /** insert data into the table: "public7.user_groups" */
  insert_public7_user_groups?: Maybe<Public7_User_Groups_Mutation_Response>;
  /** insert a single row into the table: "public7.user_groups" */
  insert_public7_user_groups_one?: Maybe<Public7_User_Groups>;
  /** insert data into the table: "public7.user_planned_tasks" */
  insert_public7_user_planned_tasks?: Maybe<Public7_User_Planned_Tasks_Mutation_Response>;
  /** insert a single row into the table: "public7.user_planned_tasks" */
  insert_public7_user_planned_tasks_one?: Maybe<Public7_User_Planned_Tasks>;
  /** insert data into the table: "public7.users" */
  insert_public7_users?: Maybe<Public7_Users_Mutation_Response>;
  /** insert a single row into the table: "public7.users" */
  insert_public7_users_one?: Maybe<Public7_Users>;
  /** insert data into the table: "public7.vendors" */
  insert_public7_vendors?: Maybe<Public7_Vendors_Mutation_Response>;
  /** insert a single row into the table: "public7.vendors" */
  insert_public7_vendors_one?: Maybe<Public7_Vendors>;
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
  /** update data of the table: "public2.apartment" */
  update_public2_apartment?: Maybe<Public2_Apartment_Mutation_Response>;
  /** update single row of the table: "public2.apartment" */
  update_public2_apartment_by_pk?: Maybe<Public2_Apartment>;
  /** update multiples rows of table: "public2.apartment" */
  update_public2_apartment_many?: Maybe<Array<Maybe<Public2_Apartment_Mutation_Response>>>;
  /** update data of the table: "public2.branch" */
  update_public2_branch?: Maybe<Public2_Branch_Mutation_Response>;
  /** update single row of the table: "public2.branch" */
  update_public2_branch_by_pk?: Maybe<Public2_Branch>;
  /** update multiples rows of table: "public2.branch" */
  update_public2_branch_many?: Maybe<Array<Maybe<Public2_Branch_Mutation_Response>>>;
  /** update data of the table: "public2.city" */
  update_public2_city?: Maybe<Public2_City_Mutation_Response>;
  /** update single row of the table: "public2.city" */
  update_public2_city_by_pk?: Maybe<Public2_City>;
  /** update multiples rows of table: "public2.city" */
  update_public2_city_many?: Maybe<Array<Maybe<Public2_City_Mutation_Response>>>;
  /** update data of the table: "public2.equipment" */
  update_public2_equipment?: Maybe<Public2_Equipment_Mutation_Response>;
  /** update single row of the table: "public2.equipment" */
  update_public2_equipment_by_pk?: Maybe<Public2_Equipment>;
  /** update multiples rows of table: "public2.equipment" */
  update_public2_equipment_many?: Maybe<Array<Maybe<Public2_Equipment_Mutation_Response>>>;
  /** update data of the table: "public2.house" */
  update_public2_house?: Maybe<Public2_House_Mutation_Response>;
  /** update single row of the table: "public2.house" */
  update_public2_house_by_pk?: Maybe<Public2_House>;
  /** update multiples rows of table: "public2.house" */
  update_public2_house_many?: Maybe<Array<Maybe<Public2_House_Mutation_Response>>>;
  /** update data of the table: "public2.planned_task" */
  update_public2_planned_task?: Maybe<Public2_Planned_Task_Mutation_Response>;
  /** update single row of the table: "public2.planned_task" */
  update_public2_planned_task_by_pk?: Maybe<Public2_Planned_Task>;
  /** update multiples rows of table: "public2.planned_task" */
  update_public2_planned_task_many?: Maybe<Array<Maybe<Public2_Planned_Task_Mutation_Response>>>;
  /** update data of the table: "public2.planned_tasks" */
  update_public2_planned_tasks?: Maybe<Public2_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "public2.planned_tasks" */
  update_public2_planned_tasks_by_pk?: Maybe<Public2_Planned_Tasks>;
  /** update multiples rows of table: "public2.planned_tasks" */
  update_public2_planned_tasks_many?: Maybe<Array<Maybe<Public2_Planned_Tasks_Mutation_Response>>>;
  /** update data of the table: "public2.provider" */
  update_public2_provider?: Maybe<Public2_Provider_Mutation_Response>;
  /** update single row of the table: "public2.provider" */
  update_public2_provider_by_pk?: Maybe<Public2_Provider>;
  /** update multiples rows of table: "public2.provider" */
  update_public2_provider_many?: Maybe<Array<Maybe<Public2_Provider_Mutation_Response>>>;
  /** update data of the table: "public2.role" */
  update_public2_role?: Maybe<Public2_Role_Mutation_Response>;
  /** update single row of the table: "public2.role" */
  update_public2_role_by_pk?: Maybe<Public2_Role>;
  /** update multiples rows of table: "public2.role" */
  update_public2_role_many?: Maybe<Array<Maybe<Public2_Role_Mutation_Response>>>;
  /** update data of the table: "public2.street" */
  update_public2_street?: Maybe<Public2_Street_Mutation_Response>;
  /** update single row of the table: "public2.street" */
  update_public2_street_by_pk?: Maybe<Public2_Street>;
  /** update multiples rows of table: "public2.street" */
  update_public2_street_many?: Maybe<Array<Maybe<Public2_Street_Mutation_Response>>>;
  /** update data of the table: "public2.time_work" */
  update_public2_time_work?: Maybe<Public2_Time_Work_Mutation_Response>;
  /** update single row of the table: "public2.time_work" */
  update_public2_time_work_by_pk?: Maybe<Public2_Time_Work>;
  /** update multiples rows of table: "public2.time_work" */
  update_public2_time_work_many?: Maybe<Array<Maybe<Public2_Time_Work_Mutation_Response>>>;
  /** update data of the table: "public2.user" */
  update_public2_user?: Maybe<Public2_User_Mutation_Response>;
  /** update single row of the table: "public2.user" */
  update_public2_user_by_pk?: Maybe<Public2_User>;
  /** update multiples rows of table: "public2.user" */
  update_public2_user_many?: Maybe<Array<Maybe<Public2_User_Mutation_Response>>>;
  /** update data of the table: "public3.branches" */
  update_public3_branches?: Maybe<Public3_Branches_Mutation_Response>;
  /** update single row of the table: "public3.branches" */
  update_public3_branches_by_pk?: Maybe<Public3_Branches>;
  /** update multiples rows of table: "public3.branches" */
  update_public3_branches_many?: Maybe<Array<Maybe<Public3_Branches_Mutation_Response>>>;
  /** update data of the table: "public3.cities" */
  update_public3_cities?: Maybe<Public3_Cities_Mutation_Response>;
  /** update single row of the table: "public3.cities" */
  update_public3_cities_by_pk?: Maybe<Public3_Cities>;
  /** update multiples rows of table: "public3.cities" */
  update_public3_cities_many?: Maybe<Array<Maybe<Public3_Cities_Mutation_Response>>>;
  /** update data of the table: "public3.equipments" */
  update_public3_equipments?: Maybe<Public3_Equipments_Mutation_Response>;
  /** update single row of the table: "public3.equipments" */
  update_public3_equipments_by_pk?: Maybe<Public3_Equipments>;
  /** update multiples rows of table: "public3.equipments" */
  update_public3_equipments_many?: Maybe<Array<Maybe<Public3_Equipments_Mutation_Response>>>;
  /** update data of the table: "public3.nodes" */
  update_public3_nodes?: Maybe<Public3_Nodes_Mutation_Response>;
  /** update single row of the table: "public3.nodes" */
  update_public3_nodes_by_pk?: Maybe<Public3_Nodes>;
  /** update multiples rows of table: "public3.nodes" */
  update_public3_nodes_many?: Maybe<Array<Maybe<Public3_Nodes_Mutation_Response>>>;
  /** update data of the table: "public3.planned_tasks" */
  update_public3_planned_tasks?: Maybe<Public3_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "public3.planned_tasks" */
  update_public3_planned_tasks_by_pk?: Maybe<Public3_Planned_Tasks>;
  /** update data of the table: "public3.planned_tasks_equipments" */
  update_public3_planned_tasks_equipments?: Maybe<Public3_Planned_Tasks_Equipments_Mutation_Response>;
  /** update single row of the table: "public3.planned_tasks_equipments" */
  update_public3_planned_tasks_equipments_by_pk?: Maybe<Public3_Planned_Tasks_Equipments>;
  /** update multiples rows of table: "public3.planned_tasks_equipments" */
  update_public3_planned_tasks_equipments_many?: Maybe<
    Array<Maybe<Public3_Planned_Tasks_Equipments_Mutation_Response>>
  >;
  /** update multiples rows of table: "public3.planned_tasks" */
  update_public3_planned_tasks_many?: Maybe<Array<Maybe<Public3_Planned_Tasks_Mutation_Response>>>;
  /** update data of the table: "public3.providers" */
  update_public3_providers?: Maybe<Public3_Providers_Mutation_Response>;
  /** update single row of the table: "public3.providers" */
  update_public3_providers_by_pk?: Maybe<Public3_Providers>;
  /** update multiples rows of table: "public3.providers" */
  update_public3_providers_many?: Maybe<Array<Maybe<Public3_Providers_Mutation_Response>>>;
  /** update data of the table: "public3.roles" */
  update_public3_roles?: Maybe<Public3_Roles_Mutation_Response>;
  /** update single row of the table: "public3.roles" */
  update_public3_roles_by_pk?: Maybe<Public3_Roles>;
  /** update multiples rows of table: "public3.roles" */
  update_public3_roles_many?: Maybe<Array<Maybe<Public3_Roles_Mutation_Response>>>;
  /** update data of the table: "public3.time_works" */
  update_public3_time_works?: Maybe<Public3_Time_Works_Mutation_Response>;
  /** update single row of the table: "public3.time_works" */
  update_public3_time_works_by_pk?: Maybe<Public3_Time_Works>;
  /** update multiples rows of table: "public3.time_works" */
  update_public3_time_works_many?: Maybe<Array<Maybe<Public3_Time_Works_Mutation_Response>>>;
  /** update data of the table: "public3.user_planned_tasks" */
  update_public3_user_planned_tasks?: Maybe<Public3_User_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "public3.user_planned_tasks" */
  update_public3_user_planned_tasks_by_pk?: Maybe<Public3_User_Planned_Tasks>;
  /** update multiples rows of table: "public3.user_planned_tasks" */
  update_public3_user_planned_tasks_many?: Maybe<
    Array<Maybe<Public3_User_Planned_Tasks_Mutation_Response>>
  >;
  /** update data of the table: "public3.users" */
  update_public3_users?: Maybe<Public3_Users_Mutation_Response>;
  /** update single row of the table: "public3.users" */
  update_public3_users_by_pk?: Maybe<Public3_Users>;
  /** update multiples rows of table: "public3.users" */
  update_public3_users_many?: Maybe<Array<Maybe<Public3_Users_Mutation_Response>>>;
  /** update data of the table: "public6.branches" */
  update_public6_branches?: Maybe<Public6_Branches_Mutation_Response>;
  /** update single row of the table: "public6.branches" */
  update_public6_branches_by_pk?: Maybe<Public6_Branches>;
  /** update multiples rows of table: "public6.branches" */
  update_public6_branches_many?: Maybe<Array<Maybe<Public6_Branches_Mutation_Response>>>;
  /** update data of the table: "public6.cities" */
  update_public6_cities?: Maybe<Public6_Cities_Mutation_Response>;
  /** update single row of the table: "public6.cities" */
  update_public6_cities_by_pk?: Maybe<Public6_Cities>;
  /** update multiples rows of table: "public6.cities" */
  update_public6_cities_many?: Maybe<Array<Maybe<Public6_Cities_Mutation_Response>>>;
  /** update data of the table: "public6.device_models" */
  update_public6_device_models?: Maybe<Public6_Device_Models_Mutation_Response>;
  /** update single row of the table: "public6.device_models" */
  update_public6_device_models_by_pk?: Maybe<Public6_Device_Models>;
  /** update multiples rows of table: "public6.device_models" */
  update_public6_device_models_many?: Maybe<Array<Maybe<Public6_Device_Models_Mutation_Response>>>;
  /** update data of the table: "public6.device_roles" */
  update_public6_device_roles?: Maybe<Public6_Device_Roles_Mutation_Response>;
  /** update single row of the table: "public6.device_roles" */
  update_public6_device_roles_by_pk?: Maybe<Public6_Device_Roles>;
  /** update multiples rows of table: "public6.device_roles" */
  update_public6_device_roles_many?: Maybe<Array<Maybe<Public6_Device_Roles_Mutation_Response>>>;
  /** update data of the table: "public6.devices" */
  update_public6_devices?: Maybe<Public6_Devices_Mutation_Response>;
  /** update single row of the table: "public6.devices" */
  update_public6_devices_by_pk?: Maybe<Public6_Devices>;
  /** update multiples rows of table: "public6.devices" */
  update_public6_devices_many?: Maybe<Array<Maybe<Public6_Devices_Mutation_Response>>>;
  /** update data of the table: "public6.nodes" */
  update_public6_nodes?: Maybe<Public6_Nodes_Mutation_Response>;
  /** update single row of the table: "public6.nodes" */
  update_public6_nodes_by_pk?: Maybe<Public6_Nodes>;
  /** update multiples rows of table: "public6.nodes" */
  update_public6_nodes_many?: Maybe<Array<Maybe<Public6_Nodes_Mutation_Response>>>;
  /** update data of the table: "public6.planned_tasks" */
  update_public6_planned_tasks?: Maybe<Public6_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "public6.planned_tasks" */
  update_public6_planned_tasks_by_pk?: Maybe<Public6_Planned_Tasks>;
  /** update data of the table: "public6.planned_tasks_devices" */
  update_public6_planned_tasks_devices?: Maybe<Public6_Planned_Tasks_Devices_Mutation_Response>;
  /** update single row of the table: "public6.planned_tasks_devices" */
  update_public6_planned_tasks_devices_by_pk?: Maybe<Public6_Planned_Tasks_Devices>;
  /** update multiples rows of table: "public6.planned_tasks_devices" */
  update_public6_planned_tasks_devices_many?: Maybe<
    Array<Maybe<Public6_Planned_Tasks_Devices_Mutation_Response>>
  >;
  /** update multiples rows of table: "public6.planned_tasks" */
  update_public6_planned_tasks_many?: Maybe<Array<Maybe<Public6_Planned_Tasks_Mutation_Response>>>;
  /** update data of the table: "public6.providers" */
  update_public6_providers?: Maybe<Public6_Providers_Mutation_Response>;
  /** update single row of the table: "public6.providers" */
  update_public6_providers_by_pk?: Maybe<Public6_Providers>;
  /** update multiples rows of table: "public6.providers" */
  update_public6_providers_many?: Maybe<Array<Maybe<Public6_Providers_Mutation_Response>>>;
  /** update data of the table: "public6.rm_projects" */
  update_public6_rm_projects?: Maybe<Public6_Rm_Projects_Mutation_Response>;
  /** update single row of the table: "public6.rm_projects" */
  update_public6_rm_projects_by_pk?: Maybe<Public6_Rm_Projects>;
  /** update multiples rows of table: "public6.rm_projects" */
  update_public6_rm_projects_many?: Maybe<Array<Maybe<Public6_Rm_Projects_Mutation_Response>>>;
  /** update data of the table: "public6.rm_tasks" */
  update_public6_rm_tasks?: Maybe<Public6_Rm_Tasks_Mutation_Response>;
  /** update single row of the table: "public6.rm_tasks" */
  update_public6_rm_tasks_by_pk?: Maybe<Public6_Rm_Tasks>;
  /** update multiples rows of table: "public6.rm_tasks" */
  update_public6_rm_tasks_many?: Maybe<Array<Maybe<Public6_Rm_Tasks_Mutation_Response>>>;
  /** update data of the table: "public6.roles" */
  update_public6_roles?: Maybe<Public6_Roles_Mutation_Response>;
  /** update single row of the table: "public6.roles" */
  update_public6_roles_by_pk?: Maybe<Public6_Roles>;
  /** update multiples rows of table: "public6.roles" */
  update_public6_roles_many?: Maybe<Array<Maybe<Public6_Roles_Mutation_Response>>>;
  /** update data of the table: "public6.time_works" */
  update_public6_time_works?: Maybe<Public6_Time_Works_Mutation_Response>;
  /** update single row of the table: "public6.time_works" */
  update_public6_time_works_by_pk?: Maybe<Public6_Time_Works>;
  /** update multiples rows of table: "public6.time_works" */
  update_public6_time_works_many?: Maybe<Array<Maybe<Public6_Time_Works_Mutation_Response>>>;
  /** update data of the table: "public6.user_groups" */
  update_public6_user_groups?: Maybe<Public6_User_Groups_Mutation_Response>;
  /** update single row of the table: "public6.user_groups" */
  update_public6_user_groups_by_pk?: Maybe<Public6_User_Groups>;
  /** update multiples rows of table: "public6.user_groups" */
  update_public6_user_groups_many?: Maybe<Array<Maybe<Public6_User_Groups_Mutation_Response>>>;
  /** update data of the table: "public6.user_planned_tasks" */
  update_public6_user_planned_tasks?: Maybe<Public6_User_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "public6.user_planned_tasks" */
  update_public6_user_planned_tasks_by_pk?: Maybe<Public6_User_Planned_Tasks>;
  /** update multiples rows of table: "public6.user_planned_tasks" */
  update_public6_user_planned_tasks_many?: Maybe<
    Array<Maybe<Public6_User_Planned_Tasks_Mutation_Response>>
  >;
  /** update data of the table: "public6.users" */
  update_public6_users?: Maybe<Public6_Users_Mutation_Response>;
  /** update single row of the table: "public6.users" */
  update_public6_users_by_pk?: Maybe<Public6_Users>;
  /** update multiples rows of table: "public6.users" */
  update_public6_users_many?: Maybe<Array<Maybe<Public6_Users_Mutation_Response>>>;
  /** update data of the table: "public6.vendors" */
  update_public6_vendors?: Maybe<Public6_Vendors_Mutation_Response>;
  /** update single row of the table: "public6.vendors" */
  update_public6_vendors_by_pk?: Maybe<Public6_Vendors>;
  /** update multiples rows of table: "public6.vendors" */
  update_public6_vendors_many?: Maybe<Array<Maybe<Public6_Vendors_Mutation_Response>>>;
  /** update data of the table: "public7.branches" */
  update_public7_branches?: Maybe<Public7_Branches_Mutation_Response>;
  /** update single row of the table: "public7.branches" */
  update_public7_branches_by_pk?: Maybe<Public7_Branches>;
  /** update multiples rows of table: "public7.branches" */
  update_public7_branches_many?: Maybe<Array<Maybe<Public7_Branches_Mutation_Response>>>;
  /** update data of the table: "public7.cities" */
  update_public7_cities?: Maybe<Public7_Cities_Mutation_Response>;
  /** update single row of the table: "public7.cities" */
  update_public7_cities_by_pk?: Maybe<Public7_Cities>;
  /** update multiples rows of table: "public7.cities" */
  update_public7_cities_many?: Maybe<Array<Maybe<Public7_Cities_Mutation_Response>>>;
  /** update data of the table: "public7.device_models" */
  update_public7_device_models?: Maybe<Public7_Device_Models_Mutation_Response>;
  /** update single row of the table: "public7.device_models" */
  update_public7_device_models_by_pk?: Maybe<Public7_Device_Models>;
  /** update multiples rows of table: "public7.device_models" */
  update_public7_device_models_many?: Maybe<Array<Maybe<Public7_Device_Models_Mutation_Response>>>;
  /** update data of the table: "public7.device_roles" */
  update_public7_device_roles?: Maybe<Public7_Device_Roles_Mutation_Response>;
  /** update single row of the table: "public7.device_roles" */
  update_public7_device_roles_by_pk?: Maybe<Public7_Device_Roles>;
  /** update multiples rows of table: "public7.device_roles" */
  update_public7_device_roles_many?: Maybe<Array<Maybe<Public7_Device_Roles_Mutation_Response>>>;
  /** update data of the table: "public7.devices" */
  update_public7_devices?: Maybe<Public7_Devices_Mutation_Response>;
  /** update single row of the table: "public7.devices" */
  update_public7_devices_by_pk?: Maybe<Public7_Devices>;
  /** update multiples rows of table: "public7.devices" */
  update_public7_devices_many?: Maybe<Array<Maybe<Public7_Devices_Mutation_Response>>>;
  /** update data of the table: "public7.nodes" */
  update_public7_nodes?: Maybe<Public7_Nodes_Mutation_Response>;
  /** update single row of the table: "public7.nodes" */
  update_public7_nodes_by_pk?: Maybe<Public7_Nodes>;
  /** update multiples rows of table: "public7.nodes" */
  update_public7_nodes_many?: Maybe<Array<Maybe<Public7_Nodes_Mutation_Response>>>;
  /** update data of the table: "public7.planned_tasks" */
  update_public7_planned_tasks?: Maybe<Public7_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "public7.planned_tasks" */
  update_public7_planned_tasks_by_pk?: Maybe<Public7_Planned_Tasks>;
  /** update data of the table: "public7.planned_tasks_devices" */
  update_public7_planned_tasks_devices?: Maybe<Public7_Planned_Tasks_Devices_Mutation_Response>;
  /** update single row of the table: "public7.planned_tasks_devices" */
  update_public7_planned_tasks_devices_by_pk?: Maybe<Public7_Planned_Tasks_Devices>;
  /** update multiples rows of table: "public7.planned_tasks_devices" */
  update_public7_planned_tasks_devices_many?: Maybe<
    Array<Maybe<Public7_Planned_Tasks_Devices_Mutation_Response>>
  >;
  /** update multiples rows of table: "public7.planned_tasks" */
  update_public7_planned_tasks_many?: Maybe<Array<Maybe<Public7_Planned_Tasks_Mutation_Response>>>;
  /** update data of the table: "public7.providers" */
  update_public7_providers?: Maybe<Public7_Providers_Mutation_Response>;
  /** update single row of the table: "public7.providers" */
  update_public7_providers_by_pk?: Maybe<Public7_Providers>;
  /** update multiples rows of table: "public7.providers" */
  update_public7_providers_many?: Maybe<Array<Maybe<Public7_Providers_Mutation_Response>>>;
  /** update data of the table: "public7.rm_projects" */
  update_public7_rm_projects?: Maybe<Public7_Rm_Projects_Mutation_Response>;
  /** update single row of the table: "public7.rm_projects" */
  update_public7_rm_projects_by_pk?: Maybe<Public7_Rm_Projects>;
  /** update multiples rows of table: "public7.rm_projects" */
  update_public7_rm_projects_many?: Maybe<Array<Maybe<Public7_Rm_Projects_Mutation_Response>>>;
  /** update data of the table: "public7.rm_tasks" */
  update_public7_rm_tasks?: Maybe<Public7_Rm_Tasks_Mutation_Response>;
  /** update single row of the table: "public7.rm_tasks" */
  update_public7_rm_tasks_by_pk?: Maybe<Public7_Rm_Tasks>;
  /** update multiples rows of table: "public7.rm_tasks" */
  update_public7_rm_tasks_many?: Maybe<Array<Maybe<Public7_Rm_Tasks_Mutation_Response>>>;
  /** update data of the table: "public7.roles" */
  update_public7_roles?: Maybe<Public7_Roles_Mutation_Response>;
  /** update single row of the table: "public7.roles" */
  update_public7_roles_by_pk?: Maybe<Public7_Roles>;
  /** update multiples rows of table: "public7.roles" */
  update_public7_roles_many?: Maybe<Array<Maybe<Public7_Roles_Mutation_Response>>>;
  /** update data of the table: "public7.time_works" */
  update_public7_time_works?: Maybe<Public7_Time_Works_Mutation_Response>;
  /** update single row of the table: "public7.time_works" */
  update_public7_time_works_by_pk?: Maybe<Public7_Time_Works>;
  /** update multiples rows of table: "public7.time_works" */
  update_public7_time_works_many?: Maybe<Array<Maybe<Public7_Time_Works_Mutation_Response>>>;
  /** update data of the table: "public7.user_groups" */
  update_public7_user_groups?: Maybe<Public7_User_Groups_Mutation_Response>;
  /** update single row of the table: "public7.user_groups" */
  update_public7_user_groups_by_pk?: Maybe<Public7_User_Groups>;
  /** update multiples rows of table: "public7.user_groups" */
  update_public7_user_groups_many?: Maybe<Array<Maybe<Public7_User_Groups_Mutation_Response>>>;
  /** update data of the table: "public7.user_planned_tasks" */
  update_public7_user_planned_tasks?: Maybe<Public7_User_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "public7.user_planned_tasks" */
  update_public7_user_planned_tasks_by_pk?: Maybe<Public7_User_Planned_Tasks>;
  /** update multiples rows of table: "public7.user_planned_tasks" */
  update_public7_user_planned_tasks_many?: Maybe<
    Array<Maybe<Public7_User_Planned_Tasks_Mutation_Response>>
  >;
  /** update data of the table: "public7.users" */
  update_public7_users?: Maybe<Public7_Users_Mutation_Response>;
  /** update single row of the table: "public7.users" */
  update_public7_users_by_pk?: Maybe<Public7_Users>;
  /** update multiples rows of table: "public7.users" */
  update_public7_users_many?: Maybe<Array<Maybe<Public7_Users_Mutation_Response>>>;
  /** update data of the table: "public7.vendors" */
  update_public7_vendors?: Maybe<Public7_Vendors_Mutation_Response>;
  /** update single row of the table: "public7.vendors" */
  update_public7_vendors_by_pk?: Maybe<Public7_Vendors>;
  /** update multiples rows of table: "public7.vendors" */
  update_public7_vendors_many?: Maybe<Array<Maybe<Public7_Vendors_Mutation_Response>>>;
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
export type Mutation_RootDelete_Public2_ApartmentArgs = {
  where: Public2_Apartment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Apartment_By_PkArgs = {
  apartment_id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_BranchArgs = {
  where: Public2_Branch_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Branch_By_PkArgs = {
  branch: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_CityArgs = {
  where: Public2_City_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_City_By_PkArgs = {
  city: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_EquipmentArgs = {
  where: Public2_Equipment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Equipment_By_PkArgs = {
  equipment_id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_HouseArgs = {
  where: Public2_House_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_House_By_PkArgs = {
  house_number: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_Planned_TaskArgs = {
  where: Public2_Planned_Task_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Planned_Task_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_Planned_TasksArgs = {
  where: Public2_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_ProviderArgs = {
  where: Public2_Provider_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Provider_By_PkArgs = {
  provider: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_RoleArgs = {
  where: Public2_Role_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Role_By_PkArgs = {
  role: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_StreetArgs = {
  where: Public2_Street_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Street_By_PkArgs = {
  street_id: Scalars['String']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_Time_WorkArgs = {
  where: Public2_Time_Work_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_Time_Work_By_PkArgs = {
  time_work_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public2_UserArgs = {
  where: Public2_User_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public2_User_By_PkArgs = {
  number: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_BranchesArgs = {
  where: Public3_Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_CitiesArgs = {
  where: Public3_Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_EquipmentsArgs = {
  where: Public3_Equipments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Equipments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_NodesArgs = {
  where: Public3_Nodes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_Planned_TasksArgs = {
  where: Public3_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_Planned_Tasks_EquipmentsArgs = {
  where: Public3_Planned_Tasks_Equipments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Planned_Tasks_Equipments_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_ProvidersArgs = {
  where: Public3_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_RolesArgs = {
  where: Public3_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_Time_WorksArgs = {
  where: Public3_Time_Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_User_Planned_TasksArgs = {
  where: Public3_User_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public3_UsersArgs = {
  where: Public3_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public3_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_BranchesArgs = {
  where: Public6_Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_CitiesArgs = {
  where: Public6_Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_Device_ModelsArgs = {
  where: Public6_Device_Models_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Device_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_Device_RolesArgs = {
  where: Public6_Device_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Device_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_DevicesArgs = {
  where: Public6_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Devices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_NodesArgs = {
  where: Public6_Nodes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_Planned_TasksArgs = {
  where: Public6_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_Planned_Tasks_DevicesArgs = {
  where: Public6_Planned_Tasks_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Planned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_ProvidersArgs = {
  where: Public6_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_Rm_ProjectsArgs = {
  where: Public6_Rm_Projects_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Rm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_Rm_TasksArgs = {
  where: Public6_Rm_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Rm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_RolesArgs = {
  where: Public6_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_Time_WorksArgs = {
  where: Public6_Time_Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_User_GroupsArgs = {
  where: Public6_User_Groups_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_User_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_User_Planned_TasksArgs = {
  where: Public6_User_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_UsersArgs = {
  where: Public6_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public6_VendorsArgs = {
  where: Public6_Vendors_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public6_Vendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_BranchesArgs = {
  where: Public7_Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_CitiesArgs = {
  where: Public7_Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_Device_ModelsArgs = {
  where: Public7_Device_Models_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Device_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_Device_RolesArgs = {
  where: Public7_Device_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Device_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_DevicesArgs = {
  where: Public7_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Devices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_NodesArgs = {
  where: Public7_Nodes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_Planned_TasksArgs = {
  where: Public7_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_Planned_Tasks_DevicesArgs = {
  where: Public7_Planned_Tasks_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Planned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_ProvidersArgs = {
  where: Public7_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_Rm_ProjectsArgs = {
  where: Public7_Rm_Projects_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Rm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_Rm_TasksArgs = {
  where: Public7_Rm_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Rm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_RolesArgs = {
  where: Public7_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_Time_WorksArgs = {
  where: Public7_Time_Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_User_GroupsArgs = {
  where: Public7_User_Groups_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_User_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_User_Planned_TasksArgs = {
  where: Public7_User_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_UsersArgs = {
  where: Public7_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

/** mutation root */
export type Mutation_RootDelete_Public7_VendorsArgs = {
  where: Public7_Vendors_Bool_Exp;
};

/** mutation root */
export type Mutation_RootDelete_Public7_Vendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
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
export type Mutation_RootInsert_Public2_ApartmentArgs = {
  objects: Array<Public2_Apartment_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Apartment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Apartment_OneArgs = {
  object: Public2_Apartment_Insert_Input;
  on_conflict?: InputMaybe<Public2_Apartment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_BranchArgs = {
  objects: Array<Public2_Branch_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Branch_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Branch_OneArgs = {
  object: Public2_Branch_Insert_Input;
  on_conflict?: InputMaybe<Public2_Branch_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_CityArgs = {
  objects: Array<Public2_City_Insert_Input>;
  on_conflict?: InputMaybe<Public2_City_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_City_OneArgs = {
  object: Public2_City_Insert_Input;
  on_conflict?: InputMaybe<Public2_City_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_EquipmentArgs = {
  objects: Array<Public2_Equipment_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Equipment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Equipment_OneArgs = {
  object: Public2_Equipment_Insert_Input;
  on_conflict?: InputMaybe<Public2_Equipment_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_HouseArgs = {
  objects: Array<Public2_House_Insert_Input>;
  on_conflict?: InputMaybe<Public2_House_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_House_OneArgs = {
  object: Public2_House_Insert_Input;
  on_conflict?: InputMaybe<Public2_House_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Planned_TaskArgs = {
  objects: Array<Public2_Planned_Task_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Planned_Task_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Planned_Task_OneArgs = {
  object: Public2_Planned_Task_Insert_Input;
  on_conflict?: InputMaybe<Public2_Planned_Task_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Planned_TasksArgs = {
  objects: Array<Public2_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Planned_Tasks_OneArgs = {
  object: Public2_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public2_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_ProviderArgs = {
  objects: Array<Public2_Provider_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Provider_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Provider_OneArgs = {
  object: Public2_Provider_Insert_Input;
  on_conflict?: InputMaybe<Public2_Provider_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_RoleArgs = {
  objects: Array<Public2_Role_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Role_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Role_OneArgs = {
  object: Public2_Role_Insert_Input;
  on_conflict?: InputMaybe<Public2_Role_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_StreetArgs = {
  objects: Array<Public2_Street_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Street_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Street_OneArgs = {
  object: Public2_Street_Insert_Input;
  on_conflict?: InputMaybe<Public2_Street_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Time_WorkArgs = {
  objects: Array<Public2_Time_Work_Insert_Input>;
  on_conflict?: InputMaybe<Public2_Time_Work_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_Time_Work_OneArgs = {
  object: Public2_Time_Work_Insert_Input;
  on_conflict?: InputMaybe<Public2_Time_Work_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_UserArgs = {
  objects: Array<Public2_User_Insert_Input>;
  on_conflict?: InputMaybe<Public2_User_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public2_User_OneArgs = {
  object: Public2_User_Insert_Input;
  on_conflict?: InputMaybe<Public2_User_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_BranchesArgs = {
  objects: Array<Public3_Branches_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Branches_OneArgs = {
  object: Public3_Branches_Insert_Input;
  on_conflict?: InputMaybe<Public3_Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_CitiesArgs = {
  objects: Array<Public3_Cities_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Cities_OneArgs = {
  object: Public3_Cities_Insert_Input;
  on_conflict?: InputMaybe<Public3_Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_EquipmentsArgs = {
  objects: Array<Public3_Equipments_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Equipments_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Equipments_OneArgs = {
  object: Public3_Equipments_Insert_Input;
  on_conflict?: InputMaybe<Public3_Equipments_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_NodesArgs = {
  objects: Array<Public3_Nodes_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Nodes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Nodes_OneArgs = {
  object: Public3_Nodes_Insert_Input;
  on_conflict?: InputMaybe<Public3_Nodes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Planned_TasksArgs = {
  objects: Array<Public3_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Planned_Tasks_EquipmentsArgs = {
  objects: Array<Public3_Planned_Tasks_Equipments_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Planned_Tasks_Equipments_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Planned_Tasks_Equipments_OneArgs = {
  object: Public3_Planned_Tasks_Equipments_Insert_Input;
  on_conflict?: InputMaybe<Public3_Planned_Tasks_Equipments_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Planned_Tasks_OneArgs = {
  object: Public3_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public3_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_ProvidersArgs = {
  objects: Array<Public3_Providers_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Providers_OneArgs = {
  object: Public3_Providers_Insert_Input;
  on_conflict?: InputMaybe<Public3_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_RolesArgs = {
  objects: Array<Public3_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Roles_OneArgs = {
  object: Public3_Roles_Insert_Input;
  on_conflict?: InputMaybe<Public3_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Time_WorksArgs = {
  objects: Array<Public3_Time_Works_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Time_Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Time_Works_OneArgs = {
  object: Public3_Time_Works_Insert_Input;
  on_conflict?: InputMaybe<Public3_Time_Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_User_Planned_TasksArgs = {
  objects: Array<Public3_User_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public3_User_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_User_Planned_Tasks_OneArgs = {
  object: Public3_User_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public3_User_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_UsersArgs = {
  objects: Array<Public3_Users_Insert_Input>;
  on_conflict?: InputMaybe<Public3_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public3_Users_OneArgs = {
  object: Public3_Users_Insert_Input;
  on_conflict?: InputMaybe<Public3_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_BranchesArgs = {
  objects: Array<Public6_Branches_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Branches_OneArgs = {
  object: Public6_Branches_Insert_Input;
  on_conflict?: InputMaybe<Public6_Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_CitiesArgs = {
  objects: Array<Public6_Cities_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Cities_OneArgs = {
  object: Public6_Cities_Insert_Input;
  on_conflict?: InputMaybe<Public6_Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Device_ModelsArgs = {
  objects: Array<Public6_Device_Models_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Device_Models_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Device_Models_OneArgs = {
  object: Public6_Device_Models_Insert_Input;
  on_conflict?: InputMaybe<Public6_Device_Models_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Device_RolesArgs = {
  objects: Array<Public6_Device_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Device_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Device_Roles_OneArgs = {
  object: Public6_Device_Roles_Insert_Input;
  on_conflict?: InputMaybe<Public6_Device_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_DevicesArgs = {
  objects: Array<Public6_Devices_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Devices_OneArgs = {
  object: Public6_Devices_Insert_Input;
  on_conflict?: InputMaybe<Public6_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_NodesArgs = {
  objects: Array<Public6_Nodes_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Nodes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Nodes_OneArgs = {
  object: Public6_Nodes_Insert_Input;
  on_conflict?: InputMaybe<Public6_Nodes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Planned_TasksArgs = {
  objects: Array<Public6_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Planned_Tasks_DevicesArgs = {
  objects: Array<Public6_Planned_Tasks_Devices_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Planned_Tasks_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Planned_Tasks_Devices_OneArgs = {
  object: Public6_Planned_Tasks_Devices_Insert_Input;
  on_conflict?: InputMaybe<Public6_Planned_Tasks_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Planned_Tasks_OneArgs = {
  object: Public6_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public6_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_ProvidersArgs = {
  objects: Array<Public6_Providers_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Providers_OneArgs = {
  object: Public6_Providers_Insert_Input;
  on_conflict?: InputMaybe<Public6_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Rm_ProjectsArgs = {
  objects: Array<Public6_Rm_Projects_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Rm_Projects_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Rm_Projects_OneArgs = {
  object: Public6_Rm_Projects_Insert_Input;
  on_conflict?: InputMaybe<Public6_Rm_Projects_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Rm_TasksArgs = {
  objects: Array<Public6_Rm_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Rm_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Rm_Tasks_OneArgs = {
  object: Public6_Rm_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public6_Rm_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_RolesArgs = {
  objects: Array<Public6_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Roles_OneArgs = {
  object: Public6_Roles_Insert_Input;
  on_conflict?: InputMaybe<Public6_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Time_WorksArgs = {
  objects: Array<Public6_Time_Works_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Time_Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Time_Works_OneArgs = {
  object: Public6_Time_Works_Insert_Input;
  on_conflict?: InputMaybe<Public6_Time_Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_User_GroupsArgs = {
  objects: Array<Public6_User_Groups_Insert_Input>;
  on_conflict?: InputMaybe<Public6_User_Groups_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_User_Groups_OneArgs = {
  object: Public6_User_Groups_Insert_Input;
  on_conflict?: InputMaybe<Public6_User_Groups_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_User_Planned_TasksArgs = {
  objects: Array<Public6_User_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public6_User_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_User_Planned_Tasks_OneArgs = {
  object: Public6_User_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public6_User_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_UsersArgs = {
  objects: Array<Public6_Users_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Users_OneArgs = {
  object: Public6_Users_Insert_Input;
  on_conflict?: InputMaybe<Public6_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_VendorsArgs = {
  objects: Array<Public6_Vendors_Insert_Input>;
  on_conflict?: InputMaybe<Public6_Vendors_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public6_Vendors_OneArgs = {
  object: Public6_Vendors_Insert_Input;
  on_conflict?: InputMaybe<Public6_Vendors_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_BranchesArgs = {
  objects: Array<Public7_Branches_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Branches_OneArgs = {
  object: Public7_Branches_Insert_Input;
  on_conflict?: InputMaybe<Public7_Branches_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_CitiesArgs = {
  objects: Array<Public7_Cities_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Cities_OneArgs = {
  object: Public7_Cities_Insert_Input;
  on_conflict?: InputMaybe<Public7_Cities_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Device_ModelsArgs = {
  objects: Array<Public7_Device_Models_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Device_Models_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Device_Models_OneArgs = {
  object: Public7_Device_Models_Insert_Input;
  on_conflict?: InputMaybe<Public7_Device_Models_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Device_RolesArgs = {
  objects: Array<Public7_Device_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Device_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Device_Roles_OneArgs = {
  object: Public7_Device_Roles_Insert_Input;
  on_conflict?: InputMaybe<Public7_Device_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_DevicesArgs = {
  objects: Array<Public7_Devices_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Devices_OneArgs = {
  object: Public7_Devices_Insert_Input;
  on_conflict?: InputMaybe<Public7_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_NodesArgs = {
  objects: Array<Public7_Nodes_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Nodes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Nodes_OneArgs = {
  object: Public7_Nodes_Insert_Input;
  on_conflict?: InputMaybe<Public7_Nodes_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Planned_TasksArgs = {
  objects: Array<Public7_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Planned_Tasks_DevicesArgs = {
  objects: Array<Public7_Planned_Tasks_Devices_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Planned_Tasks_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Planned_Tasks_Devices_OneArgs = {
  object: Public7_Planned_Tasks_Devices_Insert_Input;
  on_conflict?: InputMaybe<Public7_Planned_Tasks_Devices_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Planned_Tasks_OneArgs = {
  object: Public7_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public7_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_ProvidersArgs = {
  objects: Array<Public7_Providers_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Providers_OneArgs = {
  object: Public7_Providers_Insert_Input;
  on_conflict?: InputMaybe<Public7_Providers_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Rm_ProjectsArgs = {
  objects: Array<Public7_Rm_Projects_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Rm_Projects_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Rm_Projects_OneArgs = {
  object: Public7_Rm_Projects_Insert_Input;
  on_conflict?: InputMaybe<Public7_Rm_Projects_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Rm_TasksArgs = {
  objects: Array<Public7_Rm_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Rm_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Rm_Tasks_OneArgs = {
  object: Public7_Rm_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public7_Rm_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_RolesArgs = {
  objects: Array<Public7_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Roles_OneArgs = {
  object: Public7_Roles_Insert_Input;
  on_conflict?: InputMaybe<Public7_Roles_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Time_WorksArgs = {
  objects: Array<Public7_Time_Works_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Time_Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Time_Works_OneArgs = {
  object: Public7_Time_Works_Insert_Input;
  on_conflict?: InputMaybe<Public7_Time_Works_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_User_GroupsArgs = {
  objects: Array<Public7_User_Groups_Insert_Input>;
  on_conflict?: InputMaybe<Public7_User_Groups_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_User_Groups_OneArgs = {
  object: Public7_User_Groups_Insert_Input;
  on_conflict?: InputMaybe<Public7_User_Groups_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_User_Planned_TasksArgs = {
  objects: Array<Public7_User_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Public7_User_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_User_Planned_Tasks_OneArgs = {
  object: Public7_User_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Public7_User_Planned_Tasks_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_UsersArgs = {
  objects: Array<Public7_Users_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Users_OneArgs = {
  object: Public7_Users_Insert_Input;
  on_conflict?: InputMaybe<Public7_Users_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_VendorsArgs = {
  objects: Array<Public7_Vendors_Insert_Input>;
  on_conflict?: InputMaybe<Public7_Vendors_On_Conflict>;
};

/** mutation root */
export type Mutation_RootInsert_Public7_Vendors_OneArgs = {
  object: Public7_Vendors_Insert_Input;
  on_conflict?: InputMaybe<Public7_Vendors_On_Conflict>;
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
export type Mutation_RootUpdate_Public2_ApartmentArgs = {
  _inc?: InputMaybe<Public2_Apartment_Inc_Input>;
  _set?: InputMaybe<Public2_Apartment_Set_Input>;
  where: Public2_Apartment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Apartment_By_PkArgs = {
  _inc?: InputMaybe<Public2_Apartment_Inc_Input>;
  _set?: InputMaybe<Public2_Apartment_Set_Input>;
  pk_columns: Public2_Apartment_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Apartment_ManyArgs = {
  updates: Array<Public2_Apartment_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_BranchArgs = {
  _inc?: InputMaybe<Public2_Branch_Inc_Input>;
  _set?: InputMaybe<Public2_Branch_Set_Input>;
  where: Public2_Branch_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Branch_By_PkArgs = {
  _inc?: InputMaybe<Public2_Branch_Inc_Input>;
  _set?: InputMaybe<Public2_Branch_Set_Input>;
  pk_columns: Public2_Branch_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Branch_ManyArgs = {
  updates: Array<Public2_Branch_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_CityArgs = {
  _inc?: InputMaybe<Public2_City_Inc_Input>;
  _set?: InputMaybe<Public2_City_Set_Input>;
  where: Public2_City_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_City_By_PkArgs = {
  _inc?: InputMaybe<Public2_City_Inc_Input>;
  _set?: InputMaybe<Public2_City_Set_Input>;
  pk_columns: Public2_City_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_City_ManyArgs = {
  updates: Array<Public2_City_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_EquipmentArgs = {
  _inc?: InputMaybe<Public2_Equipment_Inc_Input>;
  _set?: InputMaybe<Public2_Equipment_Set_Input>;
  where: Public2_Equipment_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Equipment_By_PkArgs = {
  _inc?: InputMaybe<Public2_Equipment_Inc_Input>;
  _set?: InputMaybe<Public2_Equipment_Set_Input>;
  pk_columns: Public2_Equipment_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Equipment_ManyArgs = {
  updates: Array<Public2_Equipment_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_HouseArgs = {
  _inc?: InputMaybe<Public2_House_Inc_Input>;
  _set?: InputMaybe<Public2_House_Set_Input>;
  where: Public2_House_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_House_By_PkArgs = {
  _inc?: InputMaybe<Public2_House_Inc_Input>;
  _set?: InputMaybe<Public2_House_Set_Input>;
  pk_columns: Public2_House_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_House_ManyArgs = {
  updates: Array<Public2_House_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Planned_TaskArgs = {
  _inc?: InputMaybe<Public2_Planned_Task_Inc_Input>;
  _set?: InputMaybe<Public2_Planned_Task_Set_Input>;
  where: Public2_Planned_Task_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Planned_Task_By_PkArgs = {
  _inc?: InputMaybe<Public2_Planned_Task_Inc_Input>;
  _set?: InputMaybe<Public2_Planned_Task_Set_Input>;
  pk_columns: Public2_Planned_Task_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Planned_Task_ManyArgs = {
  updates: Array<Public2_Planned_Task_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Planned_TasksArgs = {
  _set?: InputMaybe<Public2_Planned_Tasks_Set_Input>;
  where: Public2_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Public2_Planned_Tasks_Set_Input>;
  pk_columns: Public2_Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Planned_Tasks_ManyArgs = {
  updates: Array<Public2_Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_ProviderArgs = {
  _inc?: InputMaybe<Public2_Provider_Inc_Input>;
  _set?: InputMaybe<Public2_Provider_Set_Input>;
  where: Public2_Provider_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Provider_By_PkArgs = {
  _inc?: InputMaybe<Public2_Provider_Inc_Input>;
  _set?: InputMaybe<Public2_Provider_Set_Input>;
  pk_columns: Public2_Provider_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Provider_ManyArgs = {
  updates: Array<Public2_Provider_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_RoleArgs = {
  _inc?: InputMaybe<Public2_Role_Inc_Input>;
  _set?: InputMaybe<Public2_Role_Set_Input>;
  where: Public2_Role_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Role_By_PkArgs = {
  _inc?: InputMaybe<Public2_Role_Inc_Input>;
  _set?: InputMaybe<Public2_Role_Set_Input>;
  pk_columns: Public2_Role_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Role_ManyArgs = {
  updates: Array<Public2_Role_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_StreetArgs = {
  _inc?: InputMaybe<Public2_Street_Inc_Input>;
  _set?: InputMaybe<Public2_Street_Set_Input>;
  where: Public2_Street_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Street_By_PkArgs = {
  _inc?: InputMaybe<Public2_Street_Inc_Input>;
  _set?: InputMaybe<Public2_Street_Set_Input>;
  pk_columns: Public2_Street_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Street_ManyArgs = {
  updates: Array<Public2_Street_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Time_WorkArgs = {
  _inc?: InputMaybe<Public2_Time_Work_Inc_Input>;
  _set?: InputMaybe<Public2_Time_Work_Set_Input>;
  where: Public2_Time_Work_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Time_Work_By_PkArgs = {
  _inc?: InputMaybe<Public2_Time_Work_Inc_Input>;
  _set?: InputMaybe<Public2_Time_Work_Set_Input>;
  pk_columns: Public2_Time_Work_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_Time_Work_ManyArgs = {
  updates: Array<Public2_Time_Work_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_UserArgs = {
  _inc?: InputMaybe<Public2_User_Inc_Input>;
  _set?: InputMaybe<Public2_User_Set_Input>;
  where: Public2_User_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_User_By_PkArgs = {
  _inc?: InputMaybe<Public2_User_Inc_Input>;
  _set?: InputMaybe<Public2_User_Set_Input>;
  pk_columns: Public2_User_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public2_User_ManyArgs = {
  updates: Array<Public2_User_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_BranchesArgs = {
  _set?: InputMaybe<Public3_Branches_Set_Input>;
  where: Public3_Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Branches_By_PkArgs = {
  _set?: InputMaybe<Public3_Branches_Set_Input>;
  pk_columns: Public3_Branches_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Branches_ManyArgs = {
  updates: Array<Public3_Branches_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_CitiesArgs = {
  _set?: InputMaybe<Public3_Cities_Set_Input>;
  where: Public3_Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Cities_By_PkArgs = {
  _set?: InputMaybe<Public3_Cities_Set_Input>;
  pk_columns: Public3_Cities_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Cities_ManyArgs = {
  updates: Array<Public3_Cities_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_EquipmentsArgs = {
  _set?: InputMaybe<Public3_Equipments_Set_Input>;
  where: Public3_Equipments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Equipments_By_PkArgs = {
  _set?: InputMaybe<Public3_Equipments_Set_Input>;
  pk_columns: Public3_Equipments_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Equipments_ManyArgs = {
  updates: Array<Public3_Equipments_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_NodesArgs = {
  _set?: InputMaybe<Public3_Nodes_Set_Input>;
  where: Public3_Nodes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Nodes_By_PkArgs = {
  _set?: InputMaybe<Public3_Nodes_Set_Input>;
  pk_columns: Public3_Nodes_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Nodes_ManyArgs = {
  updates: Array<Public3_Nodes_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Planned_TasksArgs = {
  _set?: InputMaybe<Public3_Planned_Tasks_Set_Input>;
  where: Public3_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Public3_Planned_Tasks_Set_Input>;
  pk_columns: Public3_Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Planned_Tasks_EquipmentsArgs = {
  _set?: InputMaybe<Public3_Planned_Tasks_Equipments_Set_Input>;
  where: Public3_Planned_Tasks_Equipments_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Planned_Tasks_Equipments_By_PkArgs = {
  _set?: InputMaybe<Public3_Planned_Tasks_Equipments_Set_Input>;
  pk_columns: Public3_Planned_Tasks_Equipments_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Planned_Tasks_Equipments_ManyArgs = {
  updates: Array<Public3_Planned_Tasks_Equipments_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Planned_Tasks_ManyArgs = {
  updates: Array<Public3_Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_ProvidersArgs = {
  _set?: InputMaybe<Public3_Providers_Set_Input>;
  where: Public3_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Providers_By_PkArgs = {
  _set?: InputMaybe<Public3_Providers_Set_Input>;
  pk_columns: Public3_Providers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Providers_ManyArgs = {
  updates: Array<Public3_Providers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_RolesArgs = {
  _set?: InputMaybe<Public3_Roles_Set_Input>;
  where: Public3_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Roles_By_PkArgs = {
  _set?: InputMaybe<Public3_Roles_Set_Input>;
  pk_columns: Public3_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Roles_ManyArgs = {
  updates: Array<Public3_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Time_WorksArgs = {
  _set?: InputMaybe<Public3_Time_Works_Set_Input>;
  where: Public3_Time_Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Time_Works_By_PkArgs = {
  _set?: InputMaybe<Public3_Time_Works_Set_Input>;
  pk_columns: Public3_Time_Works_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Time_Works_ManyArgs = {
  updates: Array<Public3_Time_Works_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_User_Planned_TasksArgs = {
  _set?: InputMaybe<Public3_User_Planned_Tasks_Set_Input>;
  where: Public3_User_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_User_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Public3_User_Planned_Tasks_Set_Input>;
  pk_columns: Public3_User_Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_User_Planned_Tasks_ManyArgs = {
  updates: Array<Public3_User_Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_UsersArgs = {
  _set?: InputMaybe<Public3_Users_Set_Input>;
  where: Public3_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Users_By_PkArgs = {
  _set?: InputMaybe<Public3_Users_Set_Input>;
  pk_columns: Public3_Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public3_Users_ManyArgs = {
  updates: Array<Public3_Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_BranchesArgs = {
  _set?: InputMaybe<Public6_Branches_Set_Input>;
  where: Public6_Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Branches_By_PkArgs = {
  _set?: InputMaybe<Public6_Branches_Set_Input>;
  pk_columns: Public6_Branches_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Branches_ManyArgs = {
  updates: Array<Public6_Branches_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_CitiesArgs = {
  _set?: InputMaybe<Public6_Cities_Set_Input>;
  where: Public6_Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Cities_By_PkArgs = {
  _set?: InputMaybe<Public6_Cities_Set_Input>;
  pk_columns: Public6_Cities_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Cities_ManyArgs = {
  updates: Array<Public6_Cities_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Device_ModelsArgs = {
  _set?: InputMaybe<Public6_Device_Models_Set_Input>;
  where: Public6_Device_Models_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Device_Models_By_PkArgs = {
  _set?: InputMaybe<Public6_Device_Models_Set_Input>;
  pk_columns: Public6_Device_Models_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Device_Models_ManyArgs = {
  updates: Array<Public6_Device_Models_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Device_RolesArgs = {
  _set?: InputMaybe<Public6_Device_Roles_Set_Input>;
  where: Public6_Device_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Device_Roles_By_PkArgs = {
  _set?: InputMaybe<Public6_Device_Roles_Set_Input>;
  pk_columns: Public6_Device_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Device_Roles_ManyArgs = {
  updates: Array<Public6_Device_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_DevicesArgs = {
  _set?: InputMaybe<Public6_Devices_Set_Input>;
  where: Public6_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Devices_By_PkArgs = {
  _set?: InputMaybe<Public6_Devices_Set_Input>;
  pk_columns: Public6_Devices_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Devices_ManyArgs = {
  updates: Array<Public6_Devices_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_NodesArgs = {
  _set?: InputMaybe<Public6_Nodes_Set_Input>;
  where: Public6_Nodes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Nodes_By_PkArgs = {
  _set?: InputMaybe<Public6_Nodes_Set_Input>;
  pk_columns: Public6_Nodes_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Nodes_ManyArgs = {
  updates: Array<Public6_Nodes_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Planned_TasksArgs = {
  _set?: InputMaybe<Public6_Planned_Tasks_Set_Input>;
  where: Public6_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Public6_Planned_Tasks_Set_Input>;
  pk_columns: Public6_Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Planned_Tasks_DevicesArgs = {
  _set?: InputMaybe<Public6_Planned_Tasks_Devices_Set_Input>;
  where: Public6_Planned_Tasks_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Planned_Tasks_Devices_By_PkArgs = {
  _set?: InputMaybe<Public6_Planned_Tasks_Devices_Set_Input>;
  pk_columns: Public6_Planned_Tasks_Devices_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Planned_Tasks_Devices_ManyArgs = {
  updates: Array<Public6_Planned_Tasks_Devices_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Planned_Tasks_ManyArgs = {
  updates: Array<Public6_Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_ProvidersArgs = {
  _set?: InputMaybe<Public6_Providers_Set_Input>;
  where: Public6_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Providers_By_PkArgs = {
  _set?: InputMaybe<Public6_Providers_Set_Input>;
  pk_columns: Public6_Providers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Providers_ManyArgs = {
  updates: Array<Public6_Providers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Rm_ProjectsArgs = {
  _inc?: InputMaybe<Public6_Rm_Projects_Inc_Input>;
  _set?: InputMaybe<Public6_Rm_Projects_Set_Input>;
  where: Public6_Rm_Projects_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Rm_Projects_By_PkArgs = {
  _inc?: InputMaybe<Public6_Rm_Projects_Inc_Input>;
  _set?: InputMaybe<Public6_Rm_Projects_Set_Input>;
  pk_columns: Public6_Rm_Projects_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Rm_Projects_ManyArgs = {
  updates: Array<Public6_Rm_Projects_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Rm_TasksArgs = {
  _inc?: InputMaybe<Public6_Rm_Tasks_Inc_Input>;
  _set?: InputMaybe<Public6_Rm_Tasks_Set_Input>;
  where: Public6_Rm_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Rm_Tasks_By_PkArgs = {
  _inc?: InputMaybe<Public6_Rm_Tasks_Inc_Input>;
  _set?: InputMaybe<Public6_Rm_Tasks_Set_Input>;
  pk_columns: Public6_Rm_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Rm_Tasks_ManyArgs = {
  updates: Array<Public6_Rm_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_RolesArgs = {
  _set?: InputMaybe<Public6_Roles_Set_Input>;
  where: Public6_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Roles_By_PkArgs = {
  _set?: InputMaybe<Public6_Roles_Set_Input>;
  pk_columns: Public6_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Roles_ManyArgs = {
  updates: Array<Public6_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Time_WorksArgs = {
  _set?: InputMaybe<Public6_Time_Works_Set_Input>;
  where: Public6_Time_Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Time_Works_By_PkArgs = {
  _set?: InputMaybe<Public6_Time_Works_Set_Input>;
  pk_columns: Public6_Time_Works_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Time_Works_ManyArgs = {
  updates: Array<Public6_Time_Works_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_User_GroupsArgs = {
  _set?: InputMaybe<Public6_User_Groups_Set_Input>;
  where: Public6_User_Groups_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_User_Groups_By_PkArgs = {
  _set?: InputMaybe<Public6_User_Groups_Set_Input>;
  pk_columns: Public6_User_Groups_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_User_Groups_ManyArgs = {
  updates: Array<Public6_User_Groups_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_User_Planned_TasksArgs = {
  _set?: InputMaybe<Public6_User_Planned_Tasks_Set_Input>;
  where: Public6_User_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_User_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Public6_User_Planned_Tasks_Set_Input>;
  pk_columns: Public6_User_Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_User_Planned_Tasks_ManyArgs = {
  updates: Array<Public6_User_Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_UsersArgs = {
  _set?: InputMaybe<Public6_Users_Set_Input>;
  where: Public6_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Users_By_PkArgs = {
  _set?: InputMaybe<Public6_Users_Set_Input>;
  pk_columns: Public6_Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Users_ManyArgs = {
  updates: Array<Public6_Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_VendorsArgs = {
  _set?: InputMaybe<Public6_Vendors_Set_Input>;
  where: Public6_Vendors_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Vendors_By_PkArgs = {
  _set?: InputMaybe<Public6_Vendors_Set_Input>;
  pk_columns: Public6_Vendors_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public6_Vendors_ManyArgs = {
  updates: Array<Public6_Vendors_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_BranchesArgs = {
  _set?: InputMaybe<Public7_Branches_Set_Input>;
  where: Public7_Branches_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Branches_By_PkArgs = {
  _set?: InputMaybe<Public7_Branches_Set_Input>;
  pk_columns: Public7_Branches_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Branches_ManyArgs = {
  updates: Array<Public7_Branches_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_CitiesArgs = {
  _set?: InputMaybe<Public7_Cities_Set_Input>;
  where: Public7_Cities_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Cities_By_PkArgs = {
  _set?: InputMaybe<Public7_Cities_Set_Input>;
  pk_columns: Public7_Cities_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Cities_ManyArgs = {
  updates: Array<Public7_Cities_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Device_ModelsArgs = {
  _set?: InputMaybe<Public7_Device_Models_Set_Input>;
  where: Public7_Device_Models_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Device_Models_By_PkArgs = {
  _set?: InputMaybe<Public7_Device_Models_Set_Input>;
  pk_columns: Public7_Device_Models_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Device_Models_ManyArgs = {
  updates: Array<Public7_Device_Models_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Device_RolesArgs = {
  _set?: InputMaybe<Public7_Device_Roles_Set_Input>;
  where: Public7_Device_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Device_Roles_By_PkArgs = {
  _set?: InputMaybe<Public7_Device_Roles_Set_Input>;
  pk_columns: Public7_Device_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Device_Roles_ManyArgs = {
  updates: Array<Public7_Device_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_DevicesArgs = {
  _set?: InputMaybe<Public7_Devices_Set_Input>;
  where: Public7_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Devices_By_PkArgs = {
  _set?: InputMaybe<Public7_Devices_Set_Input>;
  pk_columns: Public7_Devices_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Devices_ManyArgs = {
  updates: Array<Public7_Devices_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_NodesArgs = {
  _set?: InputMaybe<Public7_Nodes_Set_Input>;
  where: Public7_Nodes_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Nodes_By_PkArgs = {
  _set?: InputMaybe<Public7_Nodes_Set_Input>;
  pk_columns: Public7_Nodes_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Nodes_ManyArgs = {
  updates: Array<Public7_Nodes_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Planned_TasksArgs = {
  _set?: InputMaybe<Public7_Planned_Tasks_Set_Input>;
  where: Public7_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Public7_Planned_Tasks_Set_Input>;
  pk_columns: Public7_Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Planned_Tasks_DevicesArgs = {
  _set?: InputMaybe<Public7_Planned_Tasks_Devices_Set_Input>;
  where: Public7_Planned_Tasks_Devices_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Planned_Tasks_Devices_By_PkArgs = {
  _set?: InputMaybe<Public7_Planned_Tasks_Devices_Set_Input>;
  pk_columns: Public7_Planned_Tasks_Devices_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Planned_Tasks_Devices_ManyArgs = {
  updates: Array<Public7_Planned_Tasks_Devices_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Planned_Tasks_ManyArgs = {
  updates: Array<Public7_Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_ProvidersArgs = {
  _set?: InputMaybe<Public7_Providers_Set_Input>;
  where: Public7_Providers_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Providers_By_PkArgs = {
  _set?: InputMaybe<Public7_Providers_Set_Input>;
  pk_columns: Public7_Providers_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Providers_ManyArgs = {
  updates: Array<Public7_Providers_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Rm_ProjectsArgs = {
  _inc?: InputMaybe<Public7_Rm_Projects_Inc_Input>;
  _set?: InputMaybe<Public7_Rm_Projects_Set_Input>;
  where: Public7_Rm_Projects_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Rm_Projects_By_PkArgs = {
  _inc?: InputMaybe<Public7_Rm_Projects_Inc_Input>;
  _set?: InputMaybe<Public7_Rm_Projects_Set_Input>;
  pk_columns: Public7_Rm_Projects_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Rm_Projects_ManyArgs = {
  updates: Array<Public7_Rm_Projects_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Rm_TasksArgs = {
  _inc?: InputMaybe<Public7_Rm_Tasks_Inc_Input>;
  _set?: InputMaybe<Public7_Rm_Tasks_Set_Input>;
  where: Public7_Rm_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Rm_Tasks_By_PkArgs = {
  _inc?: InputMaybe<Public7_Rm_Tasks_Inc_Input>;
  _set?: InputMaybe<Public7_Rm_Tasks_Set_Input>;
  pk_columns: Public7_Rm_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Rm_Tasks_ManyArgs = {
  updates: Array<Public7_Rm_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_RolesArgs = {
  _set?: InputMaybe<Public7_Roles_Set_Input>;
  where: Public7_Roles_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Roles_By_PkArgs = {
  _set?: InputMaybe<Public7_Roles_Set_Input>;
  pk_columns: Public7_Roles_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Roles_ManyArgs = {
  updates: Array<Public7_Roles_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Time_WorksArgs = {
  _set?: InputMaybe<Public7_Time_Works_Set_Input>;
  where: Public7_Time_Works_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Time_Works_By_PkArgs = {
  _set?: InputMaybe<Public7_Time_Works_Set_Input>;
  pk_columns: Public7_Time_Works_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Time_Works_ManyArgs = {
  updates: Array<Public7_Time_Works_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_User_GroupsArgs = {
  _set?: InputMaybe<Public7_User_Groups_Set_Input>;
  where: Public7_User_Groups_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_User_Groups_By_PkArgs = {
  _set?: InputMaybe<Public7_User_Groups_Set_Input>;
  pk_columns: Public7_User_Groups_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_User_Groups_ManyArgs = {
  updates: Array<Public7_User_Groups_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_User_Planned_TasksArgs = {
  _set?: InputMaybe<Public7_User_Planned_Tasks_Set_Input>;
  where: Public7_User_Planned_Tasks_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_User_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Public7_User_Planned_Tasks_Set_Input>;
  pk_columns: Public7_User_Planned_Tasks_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_User_Planned_Tasks_ManyArgs = {
  updates: Array<Public7_User_Planned_Tasks_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_UsersArgs = {
  _set?: InputMaybe<Public7_Users_Set_Input>;
  where: Public7_Users_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Users_By_PkArgs = {
  _set?: InputMaybe<Public7_Users_Set_Input>;
  pk_columns: Public7_Users_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Users_ManyArgs = {
  updates: Array<Public7_Users_Updates>;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_VendorsArgs = {
  _set?: InputMaybe<Public7_Vendors_Set_Input>;
  where: Public7_Vendors_Bool_Exp;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Vendors_By_PkArgs = {
  _set?: InputMaybe<Public7_Vendors_Set_Input>;
  pk_columns: Public7_Vendors_Pk_Columns_Input;
};

/** mutation root */
export type Mutation_RootUpdate_Public7_Vendors_ManyArgs = {
  updates: Array<Public7_Vendors_Updates>;
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

/** columns and relationships of "public2.apartment" */
export type Public2_Apartment = {
  __typename?: 'public2_apartment';
  apartment_id: Scalars['String']['output'];
  house_number: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

/** aggregated selection of "public2.apartment" */
export type Public2_Apartment_Aggregate = {
  __typename?: 'public2_apartment_aggregate';
  aggregate?: Maybe<Public2_Apartment_Aggregate_Fields>;
  nodes: Array<Public2_Apartment>;
};

/** aggregate fields of "public2.apartment" */
export type Public2_Apartment_Aggregate_Fields = {
  __typename?: 'public2_apartment_aggregate_fields';
  avg?: Maybe<Public2_Apartment_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Apartment_Max_Fields>;
  min?: Maybe<Public2_Apartment_Min_Fields>;
  stddev?: Maybe<Public2_Apartment_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Apartment_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Apartment_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Apartment_Sum_Fields>;
  var_pop?: Maybe<Public2_Apartment_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Apartment_Var_Samp_Fields>;
  variance?: Maybe<Public2_Apartment_Variance_Fields>;
};

/** aggregate fields of "public2.apartment" */
export type Public2_Apartment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Apartment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Apartment_Avg_Fields = {
  __typename?: 'public2_apartment_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.apartment". All fields are combined with a logical 'AND'. */
export type Public2_Apartment_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Apartment_Bool_Exp>>;
  _not?: InputMaybe<Public2_Apartment_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Apartment_Bool_Exp>>;
  apartment_id?: InputMaybe<String_Comparison_Exp>;
  house_number?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.apartment" */
export enum Public2_Apartment_Constraint {
  /** unique or primary key constraint on columns "apartment_id" */
  ApartmentPkey = 'apartment_pkey',
}

/** input type for incrementing numeric columns in table "public2.apartment" */
export type Public2_Apartment_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.apartment" */
export type Public2_Apartment_Insert_Input = {
  apartment_id?: InputMaybe<Scalars['String']['input']>;
  house_number?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Public2_Apartment_Max_Fields = {
  __typename?: 'public2_apartment_max_fields';
  apartment_id?: Maybe<Scalars['String']['output']>;
  house_number?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Public2_Apartment_Min_Fields = {
  __typename?: 'public2_apartment_min_fields';
  apartment_id?: Maybe<Scalars['String']['output']>;
  house_number?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "public2.apartment" */
export type Public2_Apartment_Mutation_Response = {
  __typename?: 'public2_apartment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Apartment>;
};

/** on_conflict condition type for table "public2.apartment" */
export type Public2_Apartment_On_Conflict = {
  constraint: Public2_Apartment_Constraint;
  update_columns?: Array<Public2_Apartment_Update_Column>;
  where?: InputMaybe<Public2_Apartment_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.apartment". */
export type Public2_Apartment_Order_By = {
  apartment_id?: InputMaybe<Order_By>;
  house_number?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.apartment */
export type Public2_Apartment_Pk_Columns_Input = {
  apartment_id: Scalars['String']['input'];
};

/** select columns of table "public2.apartment" */
export enum Public2_Apartment_Select_Column {
  /** column name */
  ApartmentId = 'apartment_id',
  /** column name */
  HouseNumber = 'house_number',
  /** column name */
  Id = 'id',
}

/** input type for updating data in table "public2.apartment" */
export type Public2_Apartment_Set_Input = {
  apartment_id?: InputMaybe<Scalars['String']['input']>;
  house_number?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Apartment_Stddev_Fields = {
  __typename?: 'public2_apartment_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Apartment_Stddev_Pop_Fields = {
  __typename?: 'public2_apartment_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Apartment_Stddev_Samp_Fields = {
  __typename?: 'public2_apartment_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_apartment" */
export type Public2_Apartment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Apartment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Apartment_Stream_Cursor_Value_Input = {
  apartment_id?: InputMaybe<Scalars['String']['input']>;
  house_number?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Public2_Apartment_Sum_Fields = {
  __typename?: 'public2_apartment_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.apartment" */
export enum Public2_Apartment_Update_Column {
  /** column name */
  ApartmentId = 'apartment_id',
  /** column name */
  HouseNumber = 'house_number',
  /** column name */
  Id = 'id',
}

export type Public2_Apartment_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Apartment_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Apartment_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Apartment_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Apartment_Var_Pop_Fields = {
  __typename?: 'public2_apartment_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Apartment_Var_Samp_Fields = {
  __typename?: 'public2_apartment_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Apartment_Variance_Fields = {
  __typename?: 'public2_apartment_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.branch" */
export type Public2_Branch = {
  __typename?: 'public2_branch';
  branch: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregated selection of "public2.branch" */
export type Public2_Branch_Aggregate = {
  __typename?: 'public2_branch_aggregate';
  aggregate?: Maybe<Public2_Branch_Aggregate_Fields>;
  nodes: Array<Public2_Branch>;
};

/** aggregate fields of "public2.branch" */
export type Public2_Branch_Aggregate_Fields = {
  __typename?: 'public2_branch_aggregate_fields';
  avg?: Maybe<Public2_Branch_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Branch_Max_Fields>;
  min?: Maybe<Public2_Branch_Min_Fields>;
  stddev?: Maybe<Public2_Branch_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Branch_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Branch_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Branch_Sum_Fields>;
  var_pop?: Maybe<Public2_Branch_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Branch_Var_Samp_Fields>;
  variance?: Maybe<Public2_Branch_Variance_Fields>;
};

/** aggregate fields of "public2.branch" */
export type Public2_Branch_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Branch_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Branch_Avg_Fields = {
  __typename?: 'public2_branch_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.branch". All fields are combined with a logical 'AND'. */
export type Public2_Branch_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Branch_Bool_Exp>>;
  _not?: InputMaybe<Public2_Branch_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Branch_Bool_Exp>>;
  branch?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  provider_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.branch" */
export enum Public2_Branch_Constraint {
  /** unique or primary key constraint on columns "branch" */
  BranchPkey = 'branch_pkey',
}

/** input type for incrementing numeric columns in table "public2.branch" */
export type Public2_Branch_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.branch" */
export type Public2_Branch_Insert_Input = {
  branch?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Public2_Branch_Max_Fields = {
  __typename?: 'public2_branch_max_fields';
  branch?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Public2_Branch_Min_Fields = {
  __typename?: 'public2_branch_min_fields';
  branch?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "public2.branch" */
export type Public2_Branch_Mutation_Response = {
  __typename?: 'public2_branch_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Branch>;
};

/** on_conflict condition type for table "public2.branch" */
export type Public2_Branch_On_Conflict = {
  constraint: Public2_Branch_Constraint;
  update_columns?: Array<Public2_Branch_Update_Column>;
  where?: InputMaybe<Public2_Branch_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.branch". */
export type Public2_Branch_Order_By = {
  branch?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.branch */
export type Public2_Branch_Pk_Columns_Input = {
  branch: Scalars['String']['input'];
};

/** select columns of table "public2.branch" */
export enum Public2_Branch_Select_Column {
  /** column name */
  Branch = 'branch',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'provider_id',
}

/** input type for updating data in table "public2.branch" */
export type Public2_Branch_Set_Input = {
  branch?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Branch_Stddev_Fields = {
  __typename?: 'public2_branch_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Branch_Stddev_Pop_Fields = {
  __typename?: 'public2_branch_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Branch_Stddev_Samp_Fields = {
  __typename?: 'public2_branch_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_branch" */
export type Public2_Branch_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Branch_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Branch_Stream_Cursor_Value_Input = {
  branch?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Public2_Branch_Sum_Fields = {
  __typename?: 'public2_branch_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.branch" */
export enum Public2_Branch_Update_Column {
  /** column name */
  Branch = 'branch',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'provider_id',
}

export type Public2_Branch_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Branch_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Branch_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Branch_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Branch_Var_Pop_Fields = {
  __typename?: 'public2_branch_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Branch_Var_Samp_Fields = {
  __typename?: 'public2_branch_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Branch_Variance_Fields = {
  __typename?: 'public2_branch_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.city" */
export type Public2_City = {
  __typename?: 'public2_city';
  branch_id?: Maybe<Scalars['Int']['output']>;
  city: Scalars['String']['output'];
  id: Scalars['Int']['output'];
};

/** aggregated selection of "public2.city" */
export type Public2_City_Aggregate = {
  __typename?: 'public2_city_aggregate';
  aggregate?: Maybe<Public2_City_Aggregate_Fields>;
  nodes: Array<Public2_City>;
};

/** aggregate fields of "public2.city" */
export type Public2_City_Aggregate_Fields = {
  __typename?: 'public2_city_aggregate_fields';
  avg?: Maybe<Public2_City_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_City_Max_Fields>;
  min?: Maybe<Public2_City_Min_Fields>;
  stddev?: Maybe<Public2_City_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_City_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_City_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_City_Sum_Fields>;
  var_pop?: Maybe<Public2_City_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_City_Var_Samp_Fields>;
  variance?: Maybe<Public2_City_Variance_Fields>;
};

/** aggregate fields of "public2.city" */
export type Public2_City_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_City_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_City_Avg_Fields = {
  __typename?: 'public2_city_avg_fields';
  branch_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.city". All fields are combined with a logical 'AND'. */
export type Public2_City_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_City_Bool_Exp>>;
  _not?: InputMaybe<Public2_City_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_City_Bool_Exp>>;
  branch_id?: InputMaybe<Int_Comparison_Exp>;
  city?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.city" */
export enum Public2_City_Constraint {
  /** unique or primary key constraint on columns "city" */
  CityPkey = 'city_pkey',
}

/** input type for incrementing numeric columns in table "public2.city" */
export type Public2_City_Inc_Input = {
  branch_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.city" */
export type Public2_City_Insert_Input = {
  branch_id?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Public2_City_Max_Fields = {
  __typename?: 'public2_city_max_fields';
  branch_id?: Maybe<Scalars['Int']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Public2_City_Min_Fields = {
  __typename?: 'public2_city_min_fields';
  branch_id?: Maybe<Scalars['Int']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "public2.city" */
export type Public2_City_Mutation_Response = {
  __typename?: 'public2_city_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_City>;
};

/** on_conflict condition type for table "public2.city" */
export type Public2_City_On_Conflict = {
  constraint: Public2_City_Constraint;
  update_columns?: Array<Public2_City_Update_Column>;
  where?: InputMaybe<Public2_City_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.city". */
export type Public2_City_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  city?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.city */
export type Public2_City_Pk_Columns_Input = {
  city: Scalars['String']['input'];
};

/** select columns of table "public2.city" */
export enum Public2_City_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  City = 'city',
  /** column name */
  Id = 'id',
}

/** input type for updating data in table "public2.city" */
export type Public2_City_Set_Input = {
  branch_id?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Public2_City_Stddev_Fields = {
  __typename?: 'public2_city_stddev_fields';
  branch_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_City_Stddev_Pop_Fields = {
  __typename?: 'public2_city_stddev_pop_fields';
  branch_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_City_Stddev_Samp_Fields = {
  __typename?: 'public2_city_stddev_samp_fields';
  branch_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_city" */
export type Public2_City_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_City_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_City_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['Int']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Public2_City_Sum_Fields = {
  __typename?: 'public2_city_sum_fields';
  branch_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.city" */
export enum Public2_City_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  City = 'city',
  /** column name */
  Id = 'id',
}

export type Public2_City_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_City_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_City_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_City_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_City_Var_Pop_Fields = {
  __typename?: 'public2_city_var_pop_fields';
  branch_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_City_Var_Samp_Fields = {
  __typename?: 'public2_city_var_samp_fields';
  branch_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_City_Variance_Fields = {
  __typename?: 'public2_city_variance_fields';
  branch_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.equipment" */
export type Public2_Equipment = {
  __typename?: 'public2_equipment';
  equipment_id: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  task_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public2.equipment" */
export type Public2_Equipment_Aggregate = {
  __typename?: 'public2_equipment_aggregate';
  aggregate?: Maybe<Public2_Equipment_Aggregate_Fields>;
  nodes: Array<Public2_Equipment>;
};

/** aggregate fields of "public2.equipment" */
export type Public2_Equipment_Aggregate_Fields = {
  __typename?: 'public2_equipment_aggregate_fields';
  avg?: Maybe<Public2_Equipment_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Equipment_Max_Fields>;
  min?: Maybe<Public2_Equipment_Min_Fields>;
  stddev?: Maybe<Public2_Equipment_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Equipment_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Equipment_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Equipment_Sum_Fields>;
  var_pop?: Maybe<Public2_Equipment_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Equipment_Var_Samp_Fields>;
  variance?: Maybe<Public2_Equipment_Variance_Fields>;
};

/** aggregate fields of "public2.equipment" */
export type Public2_Equipment_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Equipment_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Equipment_Avg_Fields = {
  __typename?: 'public2_equipment_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.equipment". All fields are combined with a logical 'AND'. */
export type Public2_Equipment_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Equipment_Bool_Exp>>;
  _not?: InputMaybe<Public2_Equipment_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Equipment_Bool_Exp>>;
  equipment_id?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.equipment" */
export enum Public2_Equipment_Constraint {
  /** unique or primary key constraint on columns "equipment_id" */
  EquipmentPkey = 'equipment_pkey',
}

/** input type for incrementing numeric columns in table "public2.equipment" */
export type Public2_Equipment_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.equipment" */
export type Public2_Equipment_Insert_Input = {
  equipment_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public2_Equipment_Max_Fields = {
  __typename?: 'public2_equipment_max_fields';
  equipment_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public2_Equipment_Min_Fields = {
  __typename?: 'public2_equipment_min_fields';
  equipment_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public2.equipment" */
export type Public2_Equipment_Mutation_Response = {
  __typename?: 'public2_equipment_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Equipment>;
};

/** on_conflict condition type for table "public2.equipment" */
export type Public2_Equipment_On_Conflict = {
  constraint: Public2_Equipment_Constraint;
  update_columns?: Array<Public2_Equipment_Update_Column>;
  where?: InputMaybe<Public2_Equipment_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.equipment". */
export type Public2_Equipment_Order_By = {
  equipment_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.equipment */
export type Public2_Equipment_Pk_Columns_Input = {
  equipment_id: Scalars['String']['input'];
};

/** select columns of table "public2.equipment" */
export enum Public2_Equipment_Select_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TaskId = 'task_id',
}

/** input type for updating data in table "public2.equipment" */
export type Public2_Equipment_Set_Input = {
  equipment_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Equipment_Stddev_Fields = {
  __typename?: 'public2_equipment_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Equipment_Stddev_Pop_Fields = {
  __typename?: 'public2_equipment_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Equipment_Stddev_Samp_Fields = {
  __typename?: 'public2_equipment_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_equipment" */
export type Public2_Equipment_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Equipment_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Equipment_Stream_Cursor_Value_Input = {
  equipment_id?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Public2_Equipment_Sum_Fields = {
  __typename?: 'public2_equipment_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.equipment" */
export enum Public2_Equipment_Update_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TaskId = 'task_id',
}

export type Public2_Equipment_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Equipment_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Equipment_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Equipment_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Equipment_Var_Pop_Fields = {
  __typename?: 'public2_equipment_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Equipment_Var_Samp_Fields = {
  __typename?: 'public2_equipment_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Equipment_Variance_Fields = {
  __typename?: 'public2_equipment_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.house" */
export type Public2_House = {
  __typename?: 'public2_house';
  house_number: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  street_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregated selection of "public2.house" */
export type Public2_House_Aggregate = {
  __typename?: 'public2_house_aggregate';
  aggregate?: Maybe<Public2_House_Aggregate_Fields>;
  nodes: Array<Public2_House>;
};

/** aggregate fields of "public2.house" */
export type Public2_House_Aggregate_Fields = {
  __typename?: 'public2_house_aggregate_fields';
  avg?: Maybe<Public2_House_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_House_Max_Fields>;
  min?: Maybe<Public2_House_Min_Fields>;
  stddev?: Maybe<Public2_House_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_House_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_House_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_House_Sum_Fields>;
  var_pop?: Maybe<Public2_House_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_House_Var_Samp_Fields>;
  variance?: Maybe<Public2_House_Variance_Fields>;
};

/** aggregate fields of "public2.house" */
export type Public2_House_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_House_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_House_Avg_Fields = {
  __typename?: 'public2_house_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
  street_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.house". All fields are combined with a logical 'AND'. */
export type Public2_House_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_House_Bool_Exp>>;
  _not?: InputMaybe<Public2_House_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_House_Bool_Exp>>;
  house_number?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  street_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.house" */
export enum Public2_House_Constraint {
  /** unique or primary key constraint on columns "house_number" */
  HousePkey = 'house_pkey',
}

/** input type for incrementing numeric columns in table "public2.house" */
export type Public2_House_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  street_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.house" */
export type Public2_House_Insert_Input = {
  house_number?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  street_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Public2_House_Max_Fields = {
  __typename?: 'public2_house_max_fields';
  house_number?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  street_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Public2_House_Min_Fields = {
  __typename?: 'public2_house_min_fields';
  house_number?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  street_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "public2.house" */
export type Public2_House_Mutation_Response = {
  __typename?: 'public2_house_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_House>;
};

/** on_conflict condition type for table "public2.house" */
export type Public2_House_On_Conflict = {
  constraint: Public2_House_Constraint;
  update_columns?: Array<Public2_House_Update_Column>;
  where?: InputMaybe<Public2_House_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.house". */
export type Public2_House_Order_By = {
  house_number?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  street_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.house */
export type Public2_House_Pk_Columns_Input = {
  house_number: Scalars['String']['input'];
};

/** select columns of table "public2.house" */
export enum Public2_House_Select_Column {
  /** column name */
  HouseNumber = 'house_number',
  /** column name */
  Id = 'id',
  /** column name */
  StreetId = 'street_id',
}

/** input type for updating data in table "public2.house" */
export type Public2_House_Set_Input = {
  house_number?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  street_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Public2_House_Stddev_Fields = {
  __typename?: 'public2_house_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
  street_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_House_Stddev_Pop_Fields = {
  __typename?: 'public2_house_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  street_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_House_Stddev_Samp_Fields = {
  __typename?: 'public2_house_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  street_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_house" */
export type Public2_House_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_House_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_House_Stream_Cursor_Value_Input = {
  house_number?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  street_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Public2_House_Sum_Fields = {
  __typename?: 'public2_house_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
  street_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.house" */
export enum Public2_House_Update_Column {
  /** column name */
  HouseNumber = 'house_number',
  /** column name */
  Id = 'id',
  /** column name */
  StreetId = 'street_id',
}

export type Public2_House_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_House_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_House_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_House_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_House_Var_Pop_Fields = {
  __typename?: 'public2_house_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  street_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_House_Var_Samp_Fields = {
  __typename?: 'public2_house_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  street_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_House_Variance_Fields = {
  __typename?: 'public2_house_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  street_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.planned_task" */
export type Public2_Planned_Task = {
  __typename?: 'public2_planned_task';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  task_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public2.planned_task" */
export type Public2_Planned_Task_Aggregate = {
  __typename?: 'public2_planned_task_aggregate';
  aggregate?: Maybe<Public2_Planned_Task_Aggregate_Fields>;
  nodes: Array<Public2_Planned_Task>;
};

/** aggregate fields of "public2.planned_task" */
export type Public2_Planned_Task_Aggregate_Fields = {
  __typename?: 'public2_planned_task_aggregate_fields';
  avg?: Maybe<Public2_Planned_Task_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Planned_Task_Max_Fields>;
  min?: Maybe<Public2_Planned_Task_Min_Fields>;
  stddev?: Maybe<Public2_Planned_Task_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Planned_Task_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Planned_Task_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Planned_Task_Sum_Fields>;
  var_pop?: Maybe<Public2_Planned_Task_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Planned_Task_Var_Samp_Fields>;
  variance?: Maybe<Public2_Planned_Task_Variance_Fields>;
};

/** aggregate fields of "public2.planned_task" */
export type Public2_Planned_Task_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Planned_Task_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Planned_Task_Avg_Fields = {
  __typename?: 'public2_planned_task_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.planned_task". All fields are combined with a logical 'AND'. */
export type Public2_Planned_Task_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Planned_Task_Bool_Exp>>;
  _not?: InputMaybe<Public2_Planned_Task_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Planned_Task_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  rd?: InputMaybe<String_Comparison_Exp>;
  rm?: InputMaybe<String_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.planned_task" */
export enum Public2_Planned_Task_Constraint {
  /** unique or primary key constraint on columns "task_id" */
  PlannedTaskPkey = 'planned_task_pkey',
}

/** input type for incrementing numeric columns in table "public2.planned_task" */
export type Public2_Planned_Task_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.planned_task" */
export type Public2_Planned_Task_Insert_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public2_Planned_Task_Max_Fields = {
  __typename?: 'public2_planned_task_max_fields';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public2_Planned_Task_Min_Fields = {
  __typename?: 'public2_planned_task_min_fields';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public2.planned_task" */
export type Public2_Planned_Task_Mutation_Response = {
  __typename?: 'public2_planned_task_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Planned_Task>;
};

/** on_conflict condition type for table "public2.planned_task" */
export type Public2_Planned_Task_On_Conflict = {
  constraint: Public2_Planned_Task_Constraint;
  update_columns?: Array<Public2_Planned_Task_Update_Column>;
  where?: InputMaybe<Public2_Planned_Task_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.planned_task". */
export type Public2_Planned_Task_Order_By = {
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project?: InputMaybe<Order_By>;
  rd?: InputMaybe<Order_By>;
  rm?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.planned_task */
export type Public2_Planned_Task_Pk_Columns_Input = {
  task_id: Scalars['uuid']['input'];
};

/** select columns of table "public2.planned_task" */
export enum Public2_Planned_Task_Select_Column {
  /** column name */
  Description = 'description',
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
  TaskId = 'task_id',
}

/** input type for updating data in table "public2.planned_task" */
export type Public2_Planned_Task_Set_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Planned_Task_Stddev_Fields = {
  __typename?: 'public2_planned_task_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Planned_Task_Stddev_Pop_Fields = {
  __typename?: 'public2_planned_task_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Planned_Task_Stddev_Samp_Fields = {
  __typename?: 'public2_planned_task_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_planned_task" */
export type Public2_Planned_Task_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Planned_Task_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Planned_Task_Stream_Cursor_Value_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Public2_Planned_Task_Sum_Fields = {
  __typename?: 'public2_planned_task_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.planned_task" */
export enum Public2_Planned_Task_Update_Column {
  /** column name */
  Description = 'description',
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
  TaskId = 'task_id',
}

export type Public2_Planned_Task_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Planned_Task_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Planned_Task_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Planned_Task_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Planned_Task_Var_Pop_Fields = {
  __typename?: 'public2_planned_task_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Planned_Task_Var_Samp_Fields = {
  __typename?: 'public2_planned_task_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Planned_Task_Variance_Fields = {
  __typename?: 'public2_planned_task_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.planned_tasks" */
export type Public2_Planned_Tasks = {
  __typename?: 'public2_planned_tasks';
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  task_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public2.planned_tasks" */
export type Public2_Planned_Tasks_Aggregate = {
  __typename?: 'public2_planned_tasks_aggregate';
  aggregate?: Maybe<Public2_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Public2_Planned_Tasks>;
};

/** aggregate fields of "public2.planned_tasks" */
export type Public2_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'public2_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Planned_Tasks_Max_Fields>;
  min?: Maybe<Public2_Planned_Tasks_Min_Fields>;
};

/** aggregate fields of "public2.planned_tasks" */
export type Public2_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public2.planned_tasks". All fields are combined with a logical 'AND'. */
export type Public2_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public2_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Planned_Tasks_Bool_Exp>>;
  description?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  rd?: InputMaybe<String_Comparison_Exp>;
  rm?: InputMaybe<String_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.planned_tasks" */
export enum Public2_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "task_id" */
  PlannedTasksPkey = 'planned_tasks_pkey',
}

/** input type for inserting data into table "public2.planned_tasks" */
export type Public2_Planned_Tasks_Insert_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public2_Planned_Tasks_Max_Fields = {
  __typename?: 'public2_planned_tasks_max_fields';
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public2_Planned_Tasks_Min_Fields = {
  __typename?: 'public2_planned_tasks_min_fields';
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public2.planned_tasks" */
export type Public2_Planned_Tasks_Mutation_Response = {
  __typename?: 'public2_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Planned_Tasks>;
};

/** on_conflict condition type for table "public2.planned_tasks" */
export type Public2_Planned_Tasks_On_Conflict = {
  constraint: Public2_Planned_Tasks_Constraint;
  update_columns?: Array<Public2_Planned_Tasks_Update_Column>;
  where?: InputMaybe<Public2_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.planned_tasks". */
export type Public2_Planned_Tasks_Order_By = {
  description?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project?: InputMaybe<Order_By>;
  rd?: InputMaybe<Order_By>;
  rm?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.planned_tasks */
export type Public2_Planned_Tasks_Pk_Columns_Input = {
  task_id: Scalars['uuid']['input'];
};

/** select columns of table "public2.planned_tasks" */
export enum Public2_Planned_Tasks_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name',
  /** column name */
  Project = 'project',
  /** column name */
  Rd = 'rd',
  /** column name */
  Rm = 'rm',
  /** column name */
  TaskId = 'task_id',
}

/** input type for updating data in table "public2.planned_tasks" */
export type Public2_Planned_Tasks_Set_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public2_planned_tasks" */
export type Public2_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Planned_Tasks_Stream_Cursor_Value_Input = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public2.planned_tasks" */
export enum Public2_Planned_Tasks_Update_Column {
  /** column name */
  Description = 'description',
  /** column name */
  Name = 'name',
  /** column name */
  Project = 'project',
  /** column name */
  Rd = 'rd',
  /** column name */
  Rm = 'rm',
  /** column name */
  TaskId = 'task_id',
}

export type Public2_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "public2.provider" */
export type Public2_Provider = {
  __typename?: 'public2_provider';
  provider: Scalars['String']['output'];
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregated selection of "public2.provider" */
export type Public2_Provider_Aggregate = {
  __typename?: 'public2_provider_aggregate';
  aggregate?: Maybe<Public2_Provider_Aggregate_Fields>;
  nodes: Array<Public2_Provider>;
};

/** aggregate fields of "public2.provider" */
export type Public2_Provider_Aggregate_Fields = {
  __typename?: 'public2_provider_aggregate_fields';
  avg?: Maybe<Public2_Provider_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Provider_Max_Fields>;
  min?: Maybe<Public2_Provider_Min_Fields>;
  stddev?: Maybe<Public2_Provider_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Provider_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Provider_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Provider_Sum_Fields>;
  var_pop?: Maybe<Public2_Provider_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Provider_Var_Samp_Fields>;
  variance?: Maybe<Public2_Provider_Variance_Fields>;
};

/** aggregate fields of "public2.provider" */
export type Public2_Provider_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Provider_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Provider_Avg_Fields = {
  __typename?: 'public2_provider_avg_fields';
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.provider". All fields are combined with a logical 'AND'. */
export type Public2_Provider_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Provider_Bool_Exp>>;
  _not?: InputMaybe<Public2_Provider_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Provider_Bool_Exp>>;
  provider?: InputMaybe<String_Comparison_Exp>;
  provider_id?: InputMaybe<Int_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.provider" */
export enum Public2_Provider_Constraint {
  /** unique or primary key constraint on columns "provider" */
  ProviderPkey = 'provider_pkey',
}

/** input type for incrementing numeric columns in table "public2.provider" */
export type Public2_Provider_Inc_Input = {
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.provider" */
export type Public2_Provider_Insert_Input = {
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate max on columns */
export type Public2_Provider_Max_Fields = {
  __typename?: 'public2_provider_max_fields';
  provider?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** aggregate min on columns */
export type Public2_Provider_Min_Fields = {
  __typename?: 'public2_provider_min_fields';
  provider?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** response of any mutation on the table "public2.provider" */
export type Public2_Provider_Mutation_Response = {
  __typename?: 'public2_provider_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Provider>;
};

/** on_conflict condition type for table "public2.provider" */
export type Public2_Provider_On_Conflict = {
  constraint: Public2_Provider_Constraint;
  update_columns?: Array<Public2_Provider_Update_Column>;
  where?: InputMaybe<Public2_Provider_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.provider". */
export type Public2_Provider_Order_By = {
  provider?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.provider */
export type Public2_Provider_Pk_Columns_Input = {
  provider: Scalars['String']['input'];
};

/** select columns of table "public2.provider" */
export enum Public2_Provider_Select_Column {
  /** column name */
  Provider = 'provider',
  /** column name */
  ProviderId = 'provider_id',
}

/** input type for updating data in table "public2.provider" */
export type Public2_Provider_Set_Input = {
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Provider_Stddev_Fields = {
  __typename?: 'public2_provider_stddev_fields';
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Provider_Stddev_Pop_Fields = {
  __typename?: 'public2_provider_stddev_pop_fields';
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Provider_Stddev_Samp_Fields = {
  __typename?: 'public2_provider_stddev_samp_fields';
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_provider" */
export type Public2_Provider_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Provider_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Provider_Stream_Cursor_Value_Input = {
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

/** aggregate sum on columns */
export type Public2_Provider_Sum_Fields = {
  __typename?: 'public2_provider_sum_fields';
  provider_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.provider" */
export enum Public2_Provider_Update_Column {
  /** column name */
  Provider = 'provider',
  /** column name */
  ProviderId = 'provider_id',
}

export type Public2_Provider_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Provider_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Provider_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Provider_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Provider_Var_Pop_Fields = {
  __typename?: 'public2_provider_var_pop_fields';
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Provider_Var_Samp_Fields = {
  __typename?: 'public2_provider_var_samp_fields';
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Provider_Variance_Fields = {
  __typename?: 'public2_provider_variance_fields';
  provider_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.role" */
export type Public2_Role = {
  __typename?: 'public2_role';
  id: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "public2.role" */
export type Public2_Role_Aggregate = {
  __typename?: 'public2_role_aggregate';
  aggregate?: Maybe<Public2_Role_Aggregate_Fields>;
  nodes: Array<Public2_Role>;
};

/** aggregate fields of "public2.role" */
export type Public2_Role_Aggregate_Fields = {
  __typename?: 'public2_role_aggregate_fields';
  avg?: Maybe<Public2_Role_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Role_Max_Fields>;
  min?: Maybe<Public2_Role_Min_Fields>;
  stddev?: Maybe<Public2_Role_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Role_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Role_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Role_Sum_Fields>;
  var_pop?: Maybe<Public2_Role_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Role_Var_Samp_Fields>;
  variance?: Maybe<Public2_Role_Variance_Fields>;
};

/** aggregate fields of "public2.role" */
export type Public2_Role_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Role_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Role_Avg_Fields = {
  __typename?: 'public2_role_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.role". All fields are combined with a logical 'AND'. */
export type Public2_Role_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Role_Bool_Exp>>;
  _not?: InputMaybe<Public2_Role_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Role_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.role" */
export enum Public2_Role_Constraint {
  /** unique or primary key constraint on columns "role" */
  RolePkey = 'role_pkey',
}

/** input type for incrementing numeric columns in table "public2.role" */
export type Public2_Role_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.role" */
export type Public2_Role_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public2_Role_Max_Fields = {
  __typename?: 'public2_role_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public2_Role_Min_Fields = {
  __typename?: 'public2_role_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public2.role" */
export type Public2_Role_Mutation_Response = {
  __typename?: 'public2_role_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Role>;
};

/** on_conflict condition type for table "public2.role" */
export type Public2_Role_On_Conflict = {
  constraint: Public2_Role_Constraint;
  update_columns?: Array<Public2_Role_Update_Column>;
  where?: InputMaybe<Public2_Role_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.role". */
export type Public2_Role_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.role */
export type Public2_Role_Pk_Columns_Input = {
  role: Scalars['String']['input'];
};

/** select columns of table "public2.role" */
export enum Public2_Role_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

/** input type for updating data in table "public2.role" */
export type Public2_Role_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Role_Stddev_Fields = {
  __typename?: 'public2_role_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Role_Stddev_Pop_Fields = {
  __typename?: 'public2_role_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Role_Stddev_Samp_Fields = {
  __typename?: 'public2_role_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_role" */
export type Public2_Role_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Role_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Role_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Public2_Role_Sum_Fields = {
  __typename?: 'public2_role_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.role" */
export enum Public2_Role_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

export type Public2_Role_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Role_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Role_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Role_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Role_Var_Pop_Fields = {
  __typename?: 'public2_role_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Role_Var_Samp_Fields = {
  __typename?: 'public2_role_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Role_Variance_Fields = {
  __typename?: 'public2_role_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.street" */
export type Public2_Street = {
  __typename?: 'public2_street';
  city_id?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  street_id: Scalars['String']['output'];
};

/** aggregated selection of "public2.street" */
export type Public2_Street_Aggregate = {
  __typename?: 'public2_street_aggregate';
  aggregate?: Maybe<Public2_Street_Aggregate_Fields>;
  nodes: Array<Public2_Street>;
};

/** aggregate fields of "public2.street" */
export type Public2_Street_Aggregate_Fields = {
  __typename?: 'public2_street_aggregate_fields';
  avg?: Maybe<Public2_Street_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Street_Max_Fields>;
  min?: Maybe<Public2_Street_Min_Fields>;
  stddev?: Maybe<Public2_Street_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Street_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Street_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Street_Sum_Fields>;
  var_pop?: Maybe<Public2_Street_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Street_Var_Samp_Fields>;
  variance?: Maybe<Public2_Street_Variance_Fields>;
};

/** aggregate fields of "public2.street" */
export type Public2_Street_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Street_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Street_Avg_Fields = {
  __typename?: 'public2_street_avg_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.street". All fields are combined with a logical 'AND'. */
export type Public2_Street_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Street_Bool_Exp>>;
  _not?: InputMaybe<Public2_Street_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Street_Bool_Exp>>;
  city_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  street_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.street" */
export enum Public2_Street_Constraint {
  /** unique or primary key constraint on columns "street_id" */
  StreetPkey = 'street_pkey',
}

/** input type for incrementing numeric columns in table "public2.street" */
export type Public2_Street_Inc_Input = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.street" */
export type Public2_Street_Insert_Input = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  street_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public2_Street_Max_Fields = {
  __typename?: 'public2_street_max_fields';
  city_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  street_id?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public2_Street_Min_Fields = {
  __typename?: 'public2_street_min_fields';
  city_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  street_id?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public2.street" */
export type Public2_Street_Mutation_Response = {
  __typename?: 'public2_street_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Street>;
};

/** on_conflict condition type for table "public2.street" */
export type Public2_Street_On_Conflict = {
  constraint: Public2_Street_Constraint;
  update_columns?: Array<Public2_Street_Update_Column>;
  where?: InputMaybe<Public2_Street_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.street". */
export type Public2_Street_Order_By = {
  city_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  street_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.street */
export type Public2_Street_Pk_Columns_Input = {
  street_id: Scalars['String']['input'];
};

/** select columns of table "public2.street" */
export enum Public2_Street_Select_Column {
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  StreetId = 'street_id',
}

/** input type for updating data in table "public2.street" */
export type Public2_Street_Set_Input = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  street_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Street_Stddev_Fields = {
  __typename?: 'public2_street_stddev_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Street_Stddev_Pop_Fields = {
  __typename?: 'public2_street_stddev_pop_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Street_Stddev_Samp_Fields = {
  __typename?: 'public2_street_stddev_samp_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_street" */
export type Public2_Street_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Street_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Street_Stream_Cursor_Value_Input = {
  city_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  street_id?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Public2_Street_Sum_Fields = {
  __typename?: 'public2_street_sum_fields';
  city_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.street" */
export enum Public2_Street_Update_Column {
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  StreetId = 'street_id',
}

export type Public2_Street_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Street_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Street_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Street_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Street_Var_Pop_Fields = {
  __typename?: 'public2_street_var_pop_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Street_Var_Samp_Fields = {
  __typename?: 'public2_street_var_samp_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Street_Variance_Fields = {
  __typename?: 'public2_street_variance_fields';
  city_id?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.time_work" */
export type Public2_Time_Work = {
  __typename?: 'public2_time_work';
  id: Scalars['Int']['output'];
  task_id: Scalars['uuid']['output'];
  time_work?: Maybe<Scalars['String']['output']>;
  time_work_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public2.time_work" */
export type Public2_Time_Work_Aggregate = {
  __typename?: 'public2_time_work_aggregate';
  aggregate?: Maybe<Public2_Time_Work_Aggregate_Fields>;
  nodes: Array<Public2_Time_Work>;
};

/** aggregate fields of "public2.time_work" */
export type Public2_Time_Work_Aggregate_Fields = {
  __typename?: 'public2_time_work_aggregate_fields';
  avg?: Maybe<Public2_Time_Work_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_Time_Work_Max_Fields>;
  min?: Maybe<Public2_Time_Work_Min_Fields>;
  stddev?: Maybe<Public2_Time_Work_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_Time_Work_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_Time_Work_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_Time_Work_Sum_Fields>;
  var_pop?: Maybe<Public2_Time_Work_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_Time_Work_Var_Samp_Fields>;
  variance?: Maybe<Public2_Time_Work_Variance_Fields>;
};

/** aggregate fields of "public2.time_work" */
export type Public2_Time_Work_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_Time_Work_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_Time_Work_Avg_Fields = {
  __typename?: 'public2_time_work_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.time_work". All fields are combined with a logical 'AND'. */
export type Public2_Time_Work_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_Time_Work_Bool_Exp>>;
  _not?: InputMaybe<Public2_Time_Work_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_Time_Work_Bool_Exp>>;
  id?: InputMaybe<Int_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
  time_work?: InputMaybe<String_Comparison_Exp>;
  time_work_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.time_work" */
export enum Public2_Time_Work_Constraint {
  /** unique or primary key constraint on columns "time_work_id" */
  TimeWorkPkey = 'time_work_pkey',
}

/** input type for incrementing numeric columns in table "public2.time_work" */
export type Public2_Time_Work_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.time_work" */
export type Public2_Time_Work_Insert_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work?: InputMaybe<Scalars['String']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public2_Time_Work_Max_Fields = {
  __typename?: 'public2_time_work_max_fields';
  id?: Maybe<Scalars['Int']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
  time_work?: Maybe<Scalars['String']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public2_Time_Work_Min_Fields = {
  __typename?: 'public2_time_work_min_fields';
  id?: Maybe<Scalars['Int']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
  time_work?: Maybe<Scalars['String']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public2.time_work" */
export type Public2_Time_Work_Mutation_Response = {
  __typename?: 'public2_time_work_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_Time_Work>;
};

/** on_conflict condition type for table "public2.time_work" */
export type Public2_Time_Work_On_Conflict = {
  constraint: Public2_Time_Work_Constraint;
  update_columns?: Array<Public2_Time_Work_Update_Column>;
  where?: InputMaybe<Public2_Time_Work_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.time_work". */
export type Public2_Time_Work_Order_By = {
  id?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
  time_work?: InputMaybe<Order_By>;
  time_work_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.time_work */
export type Public2_Time_Work_Pk_Columns_Input = {
  time_work_id: Scalars['uuid']['input'];
};

/** select columns of table "public2.time_work" */
export enum Public2_Time_Work_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TaskId = 'task_id',
  /** column name */
  TimeWork = 'time_work',
  /** column name */
  TimeWorkId = 'time_work_id',
}

/** input type for updating data in table "public2.time_work" */
export type Public2_Time_Work_Set_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work?: InputMaybe<Scalars['String']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate stddev on columns */
export type Public2_Time_Work_Stddev_Fields = {
  __typename?: 'public2_time_work_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_Time_Work_Stddev_Pop_Fields = {
  __typename?: 'public2_time_work_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_Time_Work_Stddev_Samp_Fields = {
  __typename?: 'public2_time_work_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_time_work" */
export type Public2_Time_Work_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_Time_Work_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_Time_Work_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work?: InputMaybe<Scalars['String']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate sum on columns */
export type Public2_Time_Work_Sum_Fields = {
  __typename?: 'public2_time_work_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.time_work" */
export enum Public2_Time_Work_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TaskId = 'task_id',
  /** column name */
  TimeWork = 'time_work',
  /** column name */
  TimeWorkId = 'time_work_id',
}

export type Public2_Time_Work_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_Time_Work_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_Time_Work_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_Time_Work_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_Time_Work_Var_Pop_Fields = {
  __typename?: 'public2_time_work_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_Time_Work_Var_Samp_Fields = {
  __typename?: 'public2_time_work_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_Time_Work_Variance_Fields = {
  __typename?: 'public2_time_work_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public2.user" */
export type Public2_User = {
  __typename?: 'public2_user';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  number: Scalars['uuid']['output'];
  role_name: Scalars['String']['output'];
};

/** aggregated selection of "public2.user" */
export type Public2_User_Aggregate = {
  __typename?: 'public2_user_aggregate';
  aggregate?: Maybe<Public2_User_Aggregate_Fields>;
  nodes: Array<Public2_User>;
};

/** aggregate fields of "public2.user" */
export type Public2_User_Aggregate_Fields = {
  __typename?: 'public2_user_aggregate_fields';
  avg?: Maybe<Public2_User_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public2_User_Max_Fields>;
  min?: Maybe<Public2_User_Min_Fields>;
  stddev?: Maybe<Public2_User_Stddev_Fields>;
  stddev_pop?: Maybe<Public2_User_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public2_User_Stddev_Samp_Fields>;
  sum?: Maybe<Public2_User_Sum_Fields>;
  var_pop?: Maybe<Public2_User_Var_Pop_Fields>;
  var_samp?: Maybe<Public2_User_Var_Samp_Fields>;
  variance?: Maybe<Public2_User_Variance_Fields>;
};

/** aggregate fields of "public2.user" */
export type Public2_User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public2_User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public2_User_Avg_Fields = {
  __typename?: 'public2_user_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public2.user". All fields are combined with a logical 'AND'. */
export type Public2_User_Bool_Exp = {
  _and?: InputMaybe<Array<Public2_User_Bool_Exp>>;
  _not?: InputMaybe<Public2_User_Bool_Exp>;
  _or?: InputMaybe<Array<Public2_User_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  number?: InputMaybe<Uuid_Comparison_Exp>;
  role_name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public2.user" */
export enum Public2_User_Constraint {
  /** unique or primary key constraint on columns "email" */
  UserEmailUnique = 'user_email_unique',
  /** unique or primary key constraint on columns "number" */
  UserPkey = 'user_pkey',
}

/** input type for incrementing numeric columns in table "public2.user" */
export type Public2_User_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public2.user" */
export type Public2_User_Insert_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['uuid']['input']>;
  role_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public2_User_Max_Fields = {
  __typename?: 'public2_user_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['uuid']['output']>;
  role_name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public2_User_Min_Fields = {
  __typename?: 'public2_user_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['uuid']['output']>;
  role_name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public2.user" */
export type Public2_User_Mutation_Response = {
  __typename?: 'public2_user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public2_User>;
};

/** on_conflict condition type for table "public2.user" */
export type Public2_User_On_Conflict = {
  constraint: Public2_User_Constraint;
  update_columns?: Array<Public2_User_Update_Column>;
  where?: InputMaybe<Public2_User_Bool_Exp>;
};

/** Ordering options when selecting data from "public2.user". */
export type Public2_User_Order_By = {
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  number?: InputMaybe<Order_By>;
  role_name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public2.user */
export type Public2_User_Pk_Columns_Input = {
  number: Scalars['uuid']['input'];
};

/** select columns of table "public2.user" */
export enum Public2_User_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Number = 'number',
  /** column name */
  RoleName = 'role_name',
}

/** input type for updating data in table "public2.user" */
export type Public2_User_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['uuid']['input']>;
  role_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Public2_User_Stddev_Fields = {
  __typename?: 'public2_user_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public2_User_Stddev_Pop_Fields = {
  __typename?: 'public2_user_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public2_User_Stddev_Samp_Fields = {
  __typename?: 'public2_user_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public2_user" */
export type Public2_User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public2_User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public2_User_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['uuid']['input']>;
  role_name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Public2_User_Sum_Fields = {
  __typename?: 'public2_user_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public2.user" */
export enum Public2_User_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Number = 'number',
  /** column name */
  RoleName = 'role_name',
}

export type Public2_User_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public2_User_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public2_User_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public2_User_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public2_User_Var_Pop_Fields = {
  __typename?: 'public2_user_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public2_User_Var_Samp_Fields = {
  __typename?: 'public2_user_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public2_User_Variance_Fields = {
  __typename?: 'public2_user_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public3.branches" */
export type Public3_Branches = {
  __typename?: 'public3_branches';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  provider_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public3.branches" */
export type Public3_Branches_Aggregate = {
  __typename?: 'public3_branches_aggregate';
  aggregate?: Maybe<Public3_Branches_Aggregate_Fields>;
  nodes: Array<Public3_Branches>;
};

/** aggregate fields of "public3.branches" */
export type Public3_Branches_Aggregate_Fields = {
  __typename?: 'public3_branches_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Branches_Max_Fields>;
  min?: Maybe<Public3_Branches_Min_Fields>;
};

/** aggregate fields of "public3.branches" */
export type Public3_Branches_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Branches_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.branches". All fields are combined with a logical 'AND'. */
export type Public3_Branches_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Branches_Bool_Exp>>;
  _not?: InputMaybe<Public3_Branches_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Branches_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.branches" */
export enum Public3_Branches_Constraint {
  /** unique or primary key constraint on columns "name", "provider_id" */
  BranchesNameProviderIdKey = 'branches_name_provider_id_key',
  /** unique or primary key constraint on columns "id" */
  BranchesPkey = 'branches_pkey',
}

/** input type for inserting data into table "public3.branches" */
export type Public3_Branches_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public3_Branches_Max_Fields = {
  __typename?: 'public3_branches_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public3_Branches_Min_Fields = {
  __typename?: 'public3_branches_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public3.branches" */
export type Public3_Branches_Mutation_Response = {
  __typename?: 'public3_branches_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Branches>;
};

/** on_conflict condition type for table "public3.branches" */
export type Public3_Branches_On_Conflict = {
  constraint: Public3_Branches_Constraint;
  update_columns?: Array<Public3_Branches_Update_Column>;
  where?: InputMaybe<Public3_Branches_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.branches". */
export type Public3_Branches_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.branches */
export type Public3_Branches_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.branches" */
export enum Public3_Branches_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id',
}

/** input type for updating data in table "public3.branches" */
export type Public3_Branches_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public3_branches" */
export type Public3_Branches_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Branches_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Branches_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public3.branches" */
export enum Public3_Branches_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id',
}

export type Public3_Branches_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Branches_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Branches_Bool_Exp;
};

/** columns and relationships of "public3.cities" */
export type Public3_Cities = {
  __typename?: 'public3_cities';
  branch_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public3.cities" */
export type Public3_Cities_Aggregate = {
  __typename?: 'public3_cities_aggregate';
  aggregate?: Maybe<Public3_Cities_Aggregate_Fields>;
  nodes: Array<Public3_Cities>;
};

/** aggregate fields of "public3.cities" */
export type Public3_Cities_Aggregate_Fields = {
  __typename?: 'public3_cities_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Cities_Max_Fields>;
  min?: Maybe<Public3_Cities_Min_Fields>;
};

/** aggregate fields of "public3.cities" */
export type Public3_Cities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Cities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.cities". All fields are combined with a logical 'AND'. */
export type Public3_Cities_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Cities_Bool_Exp>>;
  _not?: InputMaybe<Public3_Cities_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Cities_Bool_Exp>>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.cities" */
export enum Public3_Cities_Constraint {
  /** unique or primary key constraint on columns "branch_id", "name" */
  CitiesNameBranchIdKey = 'cities_name_branch_id_key',
  /** unique or primary key constraint on columns "id" */
  CitiesPkey = 'cities_pkey',
}

/** input type for inserting data into table "public3.cities" */
export type Public3_Cities_Insert_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public3_Cities_Max_Fields = {
  __typename?: 'public3_cities_max_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public3_Cities_Min_Fields = {
  __typename?: 'public3_cities_min_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public3.cities" */
export type Public3_Cities_Mutation_Response = {
  __typename?: 'public3_cities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Cities>;
};

/** on_conflict condition type for table "public3.cities" */
export type Public3_Cities_On_Conflict = {
  constraint: Public3_Cities_Constraint;
  update_columns?: Array<Public3_Cities_Update_Column>;
  where?: InputMaybe<Public3_Cities_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.cities". */
export type Public3_Cities_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.cities */
export type Public3_Cities_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.cities" */
export enum Public3_Cities_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public3.cities" */
export type Public3_Cities_Set_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public3_cities" */
export type Public3_Cities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Cities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Cities_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public3.cities" */
export enum Public3_Cities_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public3_Cities_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Cities_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Cities_Bool_Exp;
};

/** columns and relationships of "public3.equipments" */
export type Public3_Equipments = {
  __typename?: 'public3_equipments';
  hostname: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  node_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public3.equipments" */
export type Public3_Equipments_Aggregate = {
  __typename?: 'public3_equipments_aggregate';
  aggregate?: Maybe<Public3_Equipments_Aggregate_Fields>;
  nodes: Array<Public3_Equipments>;
};

/** aggregate fields of "public3.equipments" */
export type Public3_Equipments_Aggregate_Fields = {
  __typename?: 'public3_equipments_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Equipments_Max_Fields>;
  min?: Maybe<Public3_Equipments_Min_Fields>;
};

/** aggregate fields of "public3.equipments" */
export type Public3_Equipments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Equipments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.equipments". All fields are combined with a logical 'AND'. */
export type Public3_Equipments_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Equipments_Bool_Exp>>;
  _not?: InputMaybe<Public3_Equipments_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Equipments_Bool_Exp>>;
  hostname?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  node_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.equipments" */
export enum Public3_Equipments_Constraint {
  /** unique or primary key constraint on columns "node_id", "hostname" */
  EquipmentsHostnameNodeIdKey = 'equipments_hostname_node_id_key',
  /** unique or primary key constraint on columns "id" */
  EquipmentsPkey = 'equipments_pkey',
}

/** input type for inserting data into table "public3.equipments" */
export type Public3_Equipments_Insert_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public3_Equipments_Max_Fields = {
  __typename?: 'public3_equipments_max_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public3_Equipments_Min_Fields = {
  __typename?: 'public3_equipments_min_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public3.equipments" */
export type Public3_Equipments_Mutation_Response = {
  __typename?: 'public3_equipments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Equipments>;
};

/** on_conflict condition type for table "public3.equipments" */
export type Public3_Equipments_On_Conflict = {
  constraint: Public3_Equipments_Constraint;
  update_columns?: Array<Public3_Equipments_Update_Column>;
  where?: InputMaybe<Public3_Equipments_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.equipments". */
export type Public3_Equipments_Order_By = {
  hostname?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  node_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.equipments */
export type Public3_Equipments_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.equipments" */
export enum Public3_Equipments_Select_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  NodeId = 'node_id',
}

/** input type for updating data in table "public3.equipments" */
export type Public3_Equipments_Set_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public3_equipments" */
export type Public3_Equipments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Equipments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Equipments_Stream_Cursor_Value_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public3.equipments" */
export enum Public3_Equipments_Update_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  NodeId = 'node_id',
}

export type Public3_Equipments_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Equipments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Equipments_Bool_Exp;
};

/** columns and relationships of "public3.nodes" */
export type Public3_Nodes = {
  __typename?: 'public3_nodes';
  address?: Maybe<Scalars['String']['output']>;
  city_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public3.nodes" */
export type Public3_Nodes_Aggregate = {
  __typename?: 'public3_nodes_aggregate';
  aggregate?: Maybe<Public3_Nodes_Aggregate_Fields>;
  nodes: Array<Public3_Nodes>;
};

/** aggregate fields of "public3.nodes" */
export type Public3_Nodes_Aggregate_Fields = {
  __typename?: 'public3_nodes_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Nodes_Max_Fields>;
  min?: Maybe<Public3_Nodes_Min_Fields>;
};

/** aggregate fields of "public3.nodes" */
export type Public3_Nodes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Nodes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.nodes". All fields are combined with a logical 'AND'. */
export type Public3_Nodes_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Nodes_Bool_Exp>>;
  _not?: InputMaybe<Public3_Nodes_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Nodes_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  city_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.nodes" */
export enum Public3_Nodes_Constraint {
  /** unique or primary key constraint on columns "name", "city_id" */
  NodesNameCityIdKey = 'nodes_name_city_id_key',
  /** unique or primary key constraint on columns "id" */
  NodesPkey = 'nodes_pkey',
}

/** input type for inserting data into table "public3.nodes" */
export type Public3_Nodes_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public3_Nodes_Max_Fields = {
  __typename?: 'public3_nodes_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public3_Nodes_Min_Fields = {
  __typename?: 'public3_nodes_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public3.nodes" */
export type Public3_Nodes_Mutation_Response = {
  __typename?: 'public3_nodes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Nodes>;
};

/** on_conflict condition type for table "public3.nodes" */
export type Public3_Nodes_On_Conflict = {
  constraint: Public3_Nodes_Constraint;
  update_columns?: Array<Public3_Nodes_Update_Column>;
  where?: InputMaybe<Public3_Nodes_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.nodes". */
export type Public3_Nodes_Order_By = {
  address?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.nodes */
export type Public3_Nodes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.nodes" */
export enum Public3_Nodes_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public3.nodes" */
export type Public3_Nodes_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public3_nodes" */
export type Public3_Nodes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Nodes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Nodes_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public3.nodes" */
export enum Public3_Nodes_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public3_Nodes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Nodes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Nodes_Bool_Exp;
};

/** columns and relationships of "public3.planned_tasks" */
export type Public3_Planned_Tasks = {
  __typename?: 'public3_planned_tasks';
  author_id: Scalars['uuid']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "public3.planned_tasks" */
export type Public3_Planned_Tasks_Aggregate = {
  __typename?: 'public3_planned_tasks_aggregate';
  aggregate?: Maybe<Public3_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Public3_Planned_Tasks>;
};

/** aggregate fields of "public3.planned_tasks" */
export type Public3_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'public3_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Planned_Tasks_Max_Fields>;
  min?: Maybe<Public3_Planned_Tasks_Min_Fields>;
};

/** aggregate fields of "public3.planned_tasks" */
export type Public3_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.planned_tasks". All fields are combined with a logical 'AND'. */
export type Public3_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public3_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Planned_Tasks_Bool_Exp>>;
  author_id?: InputMaybe<Uuid_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project?: InputMaybe<String_Comparison_Exp>;
  rd?: InputMaybe<String_Comparison_Exp>;
  rm?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.planned_tasks" */
export enum Public3_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "name" */
  PlannedTasksNameKey = 'planned_tasks_name_key',
  /** unique or primary key constraint on columns "id" */
  PlannedTasksPkey = 'planned_tasks_pkey',
}

/** columns and relationships of "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments = {
  __typename?: 'public3_planned_tasks_equipments';
  equipment_id: Scalars['uuid']['output'];
  task_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_Aggregate = {
  __typename?: 'public3_planned_tasks_equipments_aggregate';
  aggregate?: Maybe<Public3_Planned_Tasks_Equipments_Aggregate_Fields>;
  nodes: Array<Public3_Planned_Tasks_Equipments>;
};

/** aggregate fields of "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_Aggregate_Fields = {
  __typename?: 'public3_planned_tasks_equipments_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Planned_Tasks_Equipments_Max_Fields>;
  min?: Maybe<Public3_Planned_Tasks_Equipments_Min_Fields>;
};

/** aggregate fields of "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.planned_tasks_equipments". All fields are combined with a logical 'AND'. */
export type Public3_Planned_Tasks_Equipments_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Bool_Exp>>;
  _not?: InputMaybe<Public3_Planned_Tasks_Equipments_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Bool_Exp>>;
  equipment_id?: InputMaybe<Uuid_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.planned_tasks_equipments" */
export enum Public3_Planned_Tasks_Equipments_Constraint {
  /** unique or primary key constraint on columns "task_id", "equipment_id" */
  PlannedTasksEquipmentsPkey = 'planned_tasks_equipments_pkey',
}

/** input type for inserting data into table "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_Insert_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public3_Planned_Tasks_Equipments_Max_Fields = {
  __typename?: 'public3_planned_tasks_equipments_max_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public3_Planned_Tasks_Equipments_Min_Fields = {
  __typename?: 'public3_planned_tasks_equipments_min_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_Mutation_Response = {
  __typename?: 'public3_planned_tasks_equipments_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Planned_Tasks_Equipments>;
};

/** on_conflict condition type for table "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_On_Conflict = {
  constraint: Public3_Planned_Tasks_Equipments_Constraint;
  update_columns?: Array<Public3_Planned_Tasks_Equipments_Update_Column>;
  where?: InputMaybe<Public3_Planned_Tasks_Equipments_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.planned_tasks_equipments". */
export type Public3_Planned_Tasks_Equipments_Order_By = {
  equipment_id?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.planned_tasks_equipments */
export type Public3_Planned_Tasks_Equipments_Pk_Columns_Input = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

/** select columns of table "public3.planned_tasks_equipments" */
export enum Public3_Planned_Tasks_Equipments_Select_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id',
}

/** input type for updating data in table "public3.planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_Set_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public3_planned_tasks_equipments" */
export type Public3_Planned_Tasks_Equipments_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Planned_Tasks_Equipments_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Planned_Tasks_Equipments_Stream_Cursor_Value_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public3.planned_tasks_equipments" */
export enum Public3_Planned_Tasks_Equipments_Update_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id',
}

export type Public3_Planned_Tasks_Equipments_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Planned_Tasks_Equipments_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Planned_Tasks_Equipments_Bool_Exp;
};

/** input type for inserting data into table "public3.planned_tasks" */
export type Public3_Planned_Tasks_Insert_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public3_Planned_Tasks_Max_Fields = {
  __typename?: 'public3_planned_tasks_max_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public3_Planned_Tasks_Min_Fields = {
  __typename?: 'public3_planned_tasks_min_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['String']['output']>;
  rd?: Maybe<Scalars['String']['output']>;
  rm?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public3.planned_tasks" */
export type Public3_Planned_Tasks_Mutation_Response = {
  __typename?: 'public3_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Planned_Tasks>;
};

/** on_conflict condition type for table "public3.planned_tasks" */
export type Public3_Planned_Tasks_On_Conflict = {
  constraint: Public3_Planned_Tasks_Constraint;
  update_columns?: Array<Public3_Planned_Tasks_Update_Column>;
  where?: InputMaybe<Public3_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.planned_tasks". */
export type Public3_Planned_Tasks_Order_By = {
  author_id?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project?: InputMaybe<Order_By>;
  rd?: InputMaybe<Order_By>;
  rm?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.planned_tasks */
export type Public3_Planned_Tasks_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.planned_tasks" */
export enum Public3_Planned_Tasks_Select_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
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
}

/** input type for updating data in table "public3.planned_tasks" */
export type Public3_Planned_Tasks_Set_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public3_planned_tasks" */
export type Public3_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Planned_Tasks_Stream_Cursor_Value_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['String']['input']>;
  rd?: InputMaybe<Scalars['String']['input']>;
  rm?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public3.planned_tasks" */
export enum Public3_Planned_Tasks_Update_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
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
}

export type Public3_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "public3.providers" */
export type Public3_Providers = {
  __typename?: 'public3_providers';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public3.providers" */
export type Public3_Providers_Aggregate = {
  __typename?: 'public3_providers_aggregate';
  aggregate?: Maybe<Public3_Providers_Aggregate_Fields>;
  nodes: Array<Public3_Providers>;
};

/** aggregate fields of "public3.providers" */
export type Public3_Providers_Aggregate_Fields = {
  __typename?: 'public3_providers_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Providers_Max_Fields>;
  min?: Maybe<Public3_Providers_Min_Fields>;
};

/** aggregate fields of "public3.providers" */
export type Public3_Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.providers". All fields are combined with a logical 'AND'. */
export type Public3_Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Providers_Bool_Exp>>;
  _not?: InputMaybe<Public3_Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Providers_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.providers" */
export enum Public3_Providers_Constraint {
  /** unique or primary key constraint on columns "name" */
  ProvidersNameKey = 'providers_name_key',
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = 'providers_pkey',
}

/** input type for inserting data into table "public3.providers" */
export type Public3_Providers_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public3_Providers_Max_Fields = {
  __typename?: 'public3_providers_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public3_Providers_Min_Fields = {
  __typename?: 'public3_providers_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public3.providers" */
export type Public3_Providers_Mutation_Response = {
  __typename?: 'public3_providers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Providers>;
};

/** on_conflict condition type for table "public3.providers" */
export type Public3_Providers_On_Conflict = {
  constraint: Public3_Providers_Constraint;
  update_columns?: Array<Public3_Providers_Update_Column>;
  where?: InputMaybe<Public3_Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.providers". */
export type Public3_Providers_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.providers */
export type Public3_Providers_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.providers" */
export enum Public3_Providers_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public3.providers" */
export type Public3_Providers_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public3_providers" */
export type Public3_Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Providers_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public3.providers" */
export enum Public3_Providers_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public3_Providers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Providers_Bool_Exp;
};

/** columns and relationships of "public3.roles" */
export type Public3_Roles = {
  __typename?: 'public3_roles';
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "public3.roles" */
export type Public3_Roles_Aggregate = {
  __typename?: 'public3_roles_aggregate';
  aggregate?: Maybe<Public3_Roles_Aggregate_Fields>;
  nodes: Array<Public3_Roles>;
};

/** aggregate fields of "public3.roles" */
export type Public3_Roles_Aggregate_Fields = {
  __typename?: 'public3_roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Roles_Max_Fields>;
  min?: Maybe<Public3_Roles_Min_Fields>;
};

/** aggregate fields of "public3.roles" */
export type Public3_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.roles". All fields are combined with a logical 'AND'. */
export type Public3_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Roles_Bool_Exp>>;
  _not?: InputMaybe<Public3_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.roles" */
export enum Public3_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  RolesPkey = 'roles_pkey',
  /** unique or primary key constraint on columns "role" */
  RolesRoleKey = 'roles_role_key',
}

/** input type for inserting data into table "public3.roles" */
export type Public3_Roles_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public3_Roles_Max_Fields = {
  __typename?: 'public3_roles_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public3_Roles_Min_Fields = {
  __typename?: 'public3_roles_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public3.roles" */
export type Public3_Roles_Mutation_Response = {
  __typename?: 'public3_roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Roles>;
};

/** on_conflict condition type for table "public3.roles" */
export type Public3_Roles_On_Conflict = {
  constraint: Public3_Roles_Constraint;
  update_columns?: Array<Public3_Roles_Update_Column>;
  where?: InputMaybe<Public3_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.roles". */
export type Public3_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.roles */
export type Public3_Roles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.roles" */
export enum Public3_Roles_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

/** input type for updating data in table "public3.roles" */
export type Public3_Roles_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public3_roles" */
export type Public3_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public3.roles" */
export enum Public3_Roles_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

export type Public3_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Roles_Bool_Exp;
};

/** columns and relationships of "public3.time_works" */
export type Public3_Time_Works = {
  __typename?: 'public3_time_works';
  id: Scalars['uuid']['output'];
  task_id: Scalars['uuid']['output'];
  time_work: Scalars['interval']['output'];
};

/** aggregated selection of "public3.time_works" */
export type Public3_Time_Works_Aggregate = {
  __typename?: 'public3_time_works_aggregate';
  aggregate?: Maybe<Public3_Time_Works_Aggregate_Fields>;
  nodes: Array<Public3_Time_Works>;
};

/** aggregate fields of "public3.time_works" */
export type Public3_Time_Works_Aggregate_Fields = {
  __typename?: 'public3_time_works_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Time_Works_Max_Fields>;
  min?: Maybe<Public3_Time_Works_Min_Fields>;
};

/** aggregate fields of "public3.time_works" */
export type Public3_Time_Works_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Time_Works_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.time_works". All fields are combined with a logical 'AND'. */
export type Public3_Time_Works_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Time_Works_Bool_Exp>>;
  _not?: InputMaybe<Public3_Time_Works_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Time_Works_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
  time_work?: InputMaybe<Interval_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.time_works" */
export enum Public3_Time_Works_Constraint {
  /** unique or primary key constraint on columns "id" */
  TimeWorksPkey = 'time_works_pkey',
}

/** input type for inserting data into table "public3.time_works" */
export type Public3_Time_Works_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work?: InputMaybe<Scalars['interval']['input']>;
};

/** aggregate max on columns */
export type Public3_Time_Works_Max_Fields = {
  __typename?: 'public3_time_works_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public3_Time_Works_Min_Fields = {
  __typename?: 'public3_time_works_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public3.time_works" */
export type Public3_Time_Works_Mutation_Response = {
  __typename?: 'public3_time_works_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Time_Works>;
};

/** on_conflict condition type for table "public3.time_works" */
export type Public3_Time_Works_On_Conflict = {
  constraint: Public3_Time_Works_Constraint;
  update_columns?: Array<Public3_Time_Works_Update_Column>;
  where?: InputMaybe<Public3_Time_Works_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.time_works". */
export type Public3_Time_Works_Order_By = {
  id?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
  time_work?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.time_works */
export type Public3_Time_Works_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.time_works" */
export enum Public3_Time_Works_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TaskId = 'task_id',
  /** column name */
  TimeWork = 'time_work',
}

/** input type for updating data in table "public3.time_works" */
export type Public3_Time_Works_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work?: InputMaybe<Scalars['interval']['input']>;
};

/** Streaming cursor of the table "public3_time_works" */
export type Public3_Time_Works_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Time_Works_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Time_Works_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work?: InputMaybe<Scalars['interval']['input']>;
};

/** update columns of table "public3.time_works" */
export enum Public3_Time_Works_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  TaskId = 'task_id',
  /** column name */
  TimeWork = 'time_work',
}

export type Public3_Time_Works_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Time_Works_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Time_Works_Bool_Exp;
};

/** columns and relationships of "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks = {
  __typename?: 'public3_user_planned_tasks';
  task_id: Scalars['uuid']['output'];
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks_Aggregate = {
  __typename?: 'public3_user_planned_tasks_aggregate';
  aggregate?: Maybe<Public3_User_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Public3_User_Planned_Tasks>;
};

/** aggregate fields of "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'public3_user_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_User_Planned_Tasks_Max_Fields>;
  min?: Maybe<Public3_User_Planned_Tasks_Min_Fields>;
};

/** aggregate fields of "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_User_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.user_planned_tasks". All fields are combined with a logical 'AND'. */
export type Public3_User_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_User_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public3_User_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_User_Planned_Tasks_Bool_Exp>>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.user_planned_tasks" */
export enum Public3_User_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "user_id", "task_id" */
  UserPlannedTasksPkey = 'user_planned_tasks_pkey',
}

/** input type for inserting data into table "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks_Insert_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public3_User_Planned_Tasks_Max_Fields = {
  __typename?: 'public3_user_planned_tasks_max_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public3_User_Planned_Tasks_Min_Fields = {
  __typename?: 'public3_user_planned_tasks_min_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks_Mutation_Response = {
  __typename?: 'public3_user_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_User_Planned_Tasks>;
};

/** on_conflict condition type for table "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks_On_Conflict = {
  constraint: Public3_User_Planned_Tasks_Constraint;
  update_columns?: Array<Public3_User_Planned_Tasks_Update_Column>;
  where?: InputMaybe<Public3_User_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.user_planned_tasks". */
export type Public3_User_Planned_Tasks_Order_By = {
  task_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.user_planned_tasks */
export type Public3_User_Planned_Tasks_Pk_Columns_Input = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

/** select columns of table "public3.user_planned_tasks" */
export enum Public3_User_Planned_Tasks_Select_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id',
}

/** input type for updating data in table "public3.user_planned_tasks" */
export type Public3_User_Planned_Tasks_Set_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public3_user_planned_tasks" */
export type Public3_User_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_User_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_User_Planned_Tasks_Stream_Cursor_Value_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public3.user_planned_tasks" */
export enum Public3_User_Planned_Tasks_Update_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id',
}

export type Public3_User_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_User_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_User_Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "public3.users" */
export type Public3_Users = {
  __typename?: 'public3_users';
  email: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  role_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public3.users" */
export type Public3_Users_Aggregate = {
  __typename?: 'public3_users_aggregate';
  aggregate?: Maybe<Public3_Users_Aggregate_Fields>;
  nodes: Array<Public3_Users>;
};

/** aggregate fields of "public3.users" */
export type Public3_Users_Aggregate_Fields = {
  __typename?: 'public3_users_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public3_Users_Max_Fields>;
  min?: Maybe<Public3_Users_Min_Fields>;
};

/** aggregate fields of "public3.users" */
export type Public3_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public3_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public3.users". All fields are combined with a logical 'AND'. */
export type Public3_Users_Bool_Exp = {
  _and?: InputMaybe<Array<Public3_Users_Bool_Exp>>;
  _not?: InputMaybe<Public3_Users_Bool_Exp>;
  _or?: InputMaybe<Array<Public3_Users_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public3.users" */
export enum Public3_Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey',
}

/** input type for inserting data into table "public3.users" */
export type Public3_Users_Insert_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public3_Users_Max_Fields = {
  __typename?: 'public3_users_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public3_Users_Min_Fields = {
  __typename?: 'public3_users_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public3.users" */
export type Public3_Users_Mutation_Response = {
  __typename?: 'public3_users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public3_Users>;
};

/** on_conflict condition type for table "public3.users" */
export type Public3_Users_On_Conflict = {
  constraint: Public3_Users_Constraint;
  update_columns?: Array<Public3_Users_Update_Column>;
  where?: InputMaybe<Public3_Users_Bool_Exp>;
};

/** Ordering options when selecting data from "public3.users". */
export type Public3_Users_Order_By = {
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public3.users */
export type Public3_Users_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public3.users" */
export enum Public3_Users_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  RoleId = 'role_id',
}

/** input type for updating data in table "public3.users" */
export type Public3_Users_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public3_users" */
export type Public3_Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public3_Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public3_Users_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public3.users" */
export enum Public3_Users_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  RoleId = 'role_id',
}

export type Public3_Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public3_Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public3_Users_Bool_Exp;
};

/** columns and relationships of "public6.branches" */
export type Public6_Branches = {
  __typename?: 'public6_branches';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  provider_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public6.branches" */
export type Public6_Branches_Aggregate = {
  __typename?: 'public6_branches_aggregate';
  aggregate?: Maybe<Public6_Branches_Aggregate_Fields>;
  nodes: Array<Public6_Branches>;
};

/** aggregate fields of "public6.branches" */
export type Public6_Branches_Aggregate_Fields = {
  __typename?: 'public6_branches_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Branches_Max_Fields>;
  min?: Maybe<Public6_Branches_Min_Fields>;
};

/** aggregate fields of "public6.branches" */
export type Public6_Branches_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Branches_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.branches". All fields are combined with a logical 'AND'. */
export type Public6_Branches_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Branches_Bool_Exp>>;
  _not?: InputMaybe<Public6_Branches_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Branches_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.branches" */
export enum Public6_Branches_Constraint {
  /** unique or primary key constraint on columns "name", "provider_id" */
  BranchesNameProviderIdKey = 'branches_name_provider_id_key',
  /** unique or primary key constraint on columns "id" */
  BranchesPkey = 'branches_pkey',
}

/** input type for inserting data into table "public6.branches" */
export type Public6_Branches_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public6_Branches_Max_Fields = {
  __typename?: 'public6_branches_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public6_Branches_Min_Fields = {
  __typename?: 'public6_branches_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public6.branches" */
export type Public6_Branches_Mutation_Response = {
  __typename?: 'public6_branches_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Branches>;
};

/** on_conflict condition type for table "public6.branches" */
export type Public6_Branches_On_Conflict = {
  constraint: Public6_Branches_Constraint;
  update_columns?: Array<Public6_Branches_Update_Column>;
  where?: InputMaybe<Public6_Branches_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.branches". */
export type Public6_Branches_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.branches */
export type Public6_Branches_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.branches" */
export enum Public6_Branches_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id',
}

/** input type for updating data in table "public6.branches" */
export type Public6_Branches_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public6_branches" */
export type Public6_Branches_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Branches_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Branches_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public6.branches" */
export enum Public6_Branches_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id',
}

export type Public6_Branches_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Branches_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Branches_Bool_Exp;
};

/** columns and relationships of "public6.cities" */
export type Public6_Cities = {
  __typename?: 'public6_cities';
  branch_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  time_zone: Scalars['String']['output'];
};

/** aggregated selection of "public6.cities" */
export type Public6_Cities_Aggregate = {
  __typename?: 'public6_cities_aggregate';
  aggregate?: Maybe<Public6_Cities_Aggregate_Fields>;
  nodes: Array<Public6_Cities>;
};

/** aggregate fields of "public6.cities" */
export type Public6_Cities_Aggregate_Fields = {
  __typename?: 'public6_cities_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Cities_Max_Fields>;
  min?: Maybe<Public6_Cities_Min_Fields>;
};

/** aggregate fields of "public6.cities" */
export type Public6_Cities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Cities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.cities". All fields are combined with a logical 'AND'. */
export type Public6_Cities_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Cities_Bool_Exp>>;
  _not?: InputMaybe<Public6_Cities_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Cities_Bool_Exp>>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  time_zone?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.cities" */
export enum Public6_Cities_Constraint {
  /** unique or primary key constraint on columns "branch_id", "name" */
  CitiesNameBranchIdKey = 'cities_name_branch_id_key',
  /** unique or primary key constraint on columns "id" */
  CitiesPkey = 'cities_pkey',
}

/** input type for inserting data into table "public6.cities" */
export type Public6_Cities_Insert_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Cities_Max_Fields = {
  __typename?: 'public6_cities_max_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Cities_Min_Fields = {
  __typename?: 'public6_cities_min_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.cities" */
export type Public6_Cities_Mutation_Response = {
  __typename?: 'public6_cities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Cities>;
};

/** on_conflict condition type for table "public6.cities" */
export type Public6_Cities_On_Conflict = {
  constraint: Public6_Cities_Constraint;
  update_columns?: Array<Public6_Cities_Update_Column>;
  where?: InputMaybe<Public6_Cities_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.cities". */
export type Public6_Cities_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  time_zone?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.cities */
export type Public6_Cities_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.cities" */
export enum Public6_Cities_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TimeZone = 'time_zone',
}

/** input type for updating data in table "public6.cities" */
export type Public6_Cities_Set_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_cities" */
export type Public6_Cities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Cities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Cities_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.cities" */
export enum Public6_Cities_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TimeZone = 'time_zone',
}

export type Public6_Cities_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Cities_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Cities_Bool_Exp;
};

/** columns and relationships of "public6.device_models" */
export type Public6_Device_Models = {
  __typename?: 'public6_device_models';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  vendor_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public6.device_models" */
export type Public6_Device_Models_Aggregate = {
  __typename?: 'public6_device_models_aggregate';
  aggregate?: Maybe<Public6_Device_Models_Aggregate_Fields>;
  nodes: Array<Public6_Device_Models>;
};

/** aggregate fields of "public6.device_models" */
export type Public6_Device_Models_Aggregate_Fields = {
  __typename?: 'public6_device_models_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Device_Models_Max_Fields>;
  min?: Maybe<Public6_Device_Models_Min_Fields>;
};

/** aggregate fields of "public6.device_models" */
export type Public6_Device_Models_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Device_Models_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.device_models". All fields are combined with a logical 'AND'. */
export type Public6_Device_Models_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Device_Models_Bool_Exp>>;
  _not?: InputMaybe<Public6_Device_Models_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Device_Models_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  vendor_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.device_models" */
export enum Public6_Device_Models_Constraint {
  /** unique or primary key constraint on columns "vendor_id", "name" */
  DeviceModelsNameVendorIdKey = 'device_models_name_vendor_id_key',
  /** unique or primary key constraint on columns "id" */
  DeviceModelsPkey = 'device_models_pkey',
}

/** input type for inserting data into table "public6.device_models" */
export type Public6_Device_Models_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public6_Device_Models_Max_Fields = {
  __typename?: 'public6_device_models_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public6_Device_Models_Min_Fields = {
  __typename?: 'public6_device_models_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public6.device_models" */
export type Public6_Device_Models_Mutation_Response = {
  __typename?: 'public6_device_models_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Device_Models>;
};

/** on_conflict condition type for table "public6.device_models" */
export type Public6_Device_Models_On_Conflict = {
  constraint: Public6_Device_Models_Constraint;
  update_columns?: Array<Public6_Device_Models_Update_Column>;
  where?: InputMaybe<Public6_Device_Models_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.device_models". */
export type Public6_Device_Models_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  vendor_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.device_models */
export type Public6_Device_Models_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.device_models" */
export enum Public6_Device_Models_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  VendorId = 'vendor_id',
}

/** input type for updating data in table "public6.device_models" */
export type Public6_Device_Models_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public6_device_models" */
export type Public6_Device_Models_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Device_Models_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Device_Models_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public6.device_models" */
export enum Public6_Device_Models_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  VendorId = 'vendor_id',
}

export type Public6_Device_Models_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Device_Models_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Device_Models_Bool_Exp;
};

/** columns and relationships of "public6.device_roles" */
export type Public6_Device_Roles = {
  __typename?: 'public6_device_roles';
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
  vendor_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public6.device_roles" */
export type Public6_Device_Roles_Aggregate = {
  __typename?: 'public6_device_roles_aggregate';
  aggregate?: Maybe<Public6_Device_Roles_Aggregate_Fields>;
  nodes: Array<Public6_Device_Roles>;
};

/** aggregate fields of "public6.device_roles" */
export type Public6_Device_Roles_Aggregate_Fields = {
  __typename?: 'public6_device_roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Device_Roles_Max_Fields>;
  min?: Maybe<Public6_Device_Roles_Min_Fields>;
};

/** aggregate fields of "public6.device_roles" */
export type Public6_Device_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Device_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.device_roles". All fields are combined with a logical 'AND'. */
export type Public6_Device_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Device_Roles_Bool_Exp>>;
  _not?: InputMaybe<Public6_Device_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Device_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  vendor_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.device_roles" */
export enum Public6_Device_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  DeviceRolesPkey = 'device_roles_pkey',
  /** unique or primary key constraint on columns "vendor_id", "role" */
  DeviceRolesRoleVendorIdKey = 'device_roles_role_vendor_id_key',
}

/** input type for inserting data into table "public6.device_roles" */
export type Public6_Device_Roles_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public6_Device_Roles_Max_Fields = {
  __typename?: 'public6_device_roles_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public6_Device_Roles_Min_Fields = {
  __typename?: 'public6_device_roles_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public6.device_roles" */
export type Public6_Device_Roles_Mutation_Response = {
  __typename?: 'public6_device_roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Device_Roles>;
};

/** on_conflict condition type for table "public6.device_roles" */
export type Public6_Device_Roles_On_Conflict = {
  constraint: Public6_Device_Roles_Constraint;
  update_columns?: Array<Public6_Device_Roles_Update_Column>;
  where?: InputMaybe<Public6_Device_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.device_roles". */
export type Public6_Device_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  vendor_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.device_roles */
export type Public6_Device_Roles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.device_roles" */
export enum Public6_Device_Roles_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  VendorId = 'vendor_id',
}

/** input type for updating data in table "public6.device_roles" */
export type Public6_Device_Roles_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public6_device_roles" */
export type Public6_Device_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Device_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Device_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public6.device_roles" */
export enum Public6_Device_Roles_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  VendorId = 'vendor_id',
}

export type Public6_Device_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Device_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Device_Roles_Bool_Exp;
};

/** columns and relationships of "public6.devices" */
export type Public6_Devices = {
  __typename?: 'public6_devices';
  hostname: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  model_id: Scalars['uuid']['output'];
  node_id: Scalars['uuid']['output'];
  role_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public6.devices" */
export type Public6_Devices_Aggregate = {
  __typename?: 'public6_devices_aggregate';
  aggregate?: Maybe<Public6_Devices_Aggregate_Fields>;
  nodes: Array<Public6_Devices>;
};

/** aggregate fields of "public6.devices" */
export type Public6_Devices_Aggregate_Fields = {
  __typename?: 'public6_devices_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Devices_Max_Fields>;
  min?: Maybe<Public6_Devices_Min_Fields>;
};

/** aggregate fields of "public6.devices" */
export type Public6_Devices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Devices_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.devices". All fields are combined with a logical 'AND'. */
export type Public6_Devices_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Devices_Bool_Exp>>;
  _not?: InputMaybe<Public6_Devices_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Devices_Bool_Exp>>;
  hostname?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  model_id?: InputMaybe<Uuid_Comparison_Exp>;
  node_id?: InputMaybe<Uuid_Comparison_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.devices" */
export enum Public6_Devices_Constraint {
  /** unique or primary key constraint on columns "hostname" */
  DevicesHostnameKey = 'devices_hostname_key',
  /** unique or primary key constraint on columns "id" */
  DevicesPkey = 'devices_pkey',
}

/** input type for inserting data into table "public6.devices" */
export type Public6_Devices_Insert_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public6_Devices_Max_Fields = {
  __typename?: 'public6_devices_max_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model_id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public6_Devices_Min_Fields = {
  __typename?: 'public6_devices_min_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model_id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public6.devices" */
export type Public6_Devices_Mutation_Response = {
  __typename?: 'public6_devices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Devices>;
};

/** on_conflict condition type for table "public6.devices" */
export type Public6_Devices_On_Conflict = {
  constraint: Public6_Devices_Constraint;
  update_columns?: Array<Public6_Devices_Update_Column>;
  where?: InputMaybe<Public6_Devices_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.devices". */
export type Public6_Devices_Order_By = {
  hostname?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  model_id?: InputMaybe<Order_By>;
  node_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.devices */
export type Public6_Devices_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.devices" */
export enum Public6_Devices_Select_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  RoleId = 'role_id',
}

/** input type for updating data in table "public6.devices" */
export type Public6_Devices_Set_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public6_devices" */
export type Public6_Devices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Devices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Devices_Stream_Cursor_Value_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public6.devices" */
export enum Public6_Devices_Update_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  RoleId = 'role_id',
}

export type Public6_Devices_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Devices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Devices_Bool_Exp;
};

/** columns and relationships of "public6.nodes" */
export type Public6_Nodes = {
  __typename?: 'public6_nodes';
  address?: Maybe<Scalars['String']['output']>;
  city_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public6.nodes" */
export type Public6_Nodes_Aggregate = {
  __typename?: 'public6_nodes_aggregate';
  aggregate?: Maybe<Public6_Nodes_Aggregate_Fields>;
  nodes: Array<Public6_Nodes>;
};

/** aggregate fields of "public6.nodes" */
export type Public6_Nodes_Aggregate_Fields = {
  __typename?: 'public6_nodes_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Nodes_Max_Fields>;
  min?: Maybe<Public6_Nodes_Min_Fields>;
};

/** aggregate fields of "public6.nodes" */
export type Public6_Nodes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Nodes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.nodes". All fields are combined with a logical 'AND'. */
export type Public6_Nodes_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Nodes_Bool_Exp>>;
  _not?: InputMaybe<Public6_Nodes_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Nodes_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  city_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.nodes" */
export enum Public6_Nodes_Constraint {
  /** unique or primary key constraint on columns "name", "city_id" */
  NodesNameCityIdKey = 'nodes_name_city_id_key',
  /** unique or primary key constraint on columns "id" */
  NodesPkey = 'nodes_pkey',
}

/** input type for inserting data into table "public6.nodes" */
export type Public6_Nodes_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Nodes_Max_Fields = {
  __typename?: 'public6_nodes_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Nodes_Min_Fields = {
  __typename?: 'public6_nodes_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.nodes" */
export type Public6_Nodes_Mutation_Response = {
  __typename?: 'public6_nodes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Nodes>;
};

/** on_conflict condition type for table "public6.nodes" */
export type Public6_Nodes_On_Conflict = {
  constraint: Public6_Nodes_Constraint;
  update_columns?: Array<Public6_Nodes_Update_Column>;
  where?: InputMaybe<Public6_Nodes_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.nodes". */
export type Public6_Nodes_Order_By = {
  address?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.nodes */
export type Public6_Nodes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.nodes" */
export enum Public6_Nodes_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public6.nodes" */
export type Public6_Nodes_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_nodes" */
export type Public6_Nodes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Nodes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Nodes_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.nodes" */
export enum Public6_Nodes_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public6_Nodes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Nodes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Nodes_Bool_Exp;
};

/** columns and relationships of "public6.planned_tasks" */
export type Public6_Planned_Tasks = {
  __typename?: 'public6_planned_tasks';
  author_id: Scalars['uuid']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  rm_task_id: Scalars['uuid']['output'];
  time_work_id: Scalars['uuid']['output'];
  yaml_url?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "public6.planned_tasks" */
export type Public6_Planned_Tasks_Aggregate = {
  __typename?: 'public6_planned_tasks_aggregate';
  aggregate?: Maybe<Public6_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Public6_Planned_Tasks>;
};

/** aggregate fields of "public6.planned_tasks" */
export type Public6_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'public6_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Planned_Tasks_Max_Fields>;
  min?: Maybe<Public6_Planned_Tasks_Min_Fields>;
};

/** aggregate fields of "public6.planned_tasks" */
export type Public6_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.planned_tasks". All fields are combined with a logical 'AND'. */
export type Public6_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public6_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Planned_Tasks_Bool_Exp>>;
  author_id?: InputMaybe<Uuid_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  rm_task_id?: InputMaybe<Uuid_Comparison_Exp>;
  time_work_id?: InputMaybe<Uuid_Comparison_Exp>;
  yaml_url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.planned_tasks" */
export enum Public6_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "name" */
  PlannedTasksNameKey = 'planned_tasks_name_key',
  /** unique or primary key constraint on columns "id" */
  PlannedTasksPkey = 'planned_tasks_pkey',
}

/** columns and relationships of "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices = {
  __typename?: 'public6_planned_tasks_devices';
  equipment_id: Scalars['uuid']['output'];
  task_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_Aggregate = {
  __typename?: 'public6_planned_tasks_devices_aggregate';
  aggregate?: Maybe<Public6_Planned_Tasks_Devices_Aggregate_Fields>;
  nodes: Array<Public6_Planned_Tasks_Devices>;
};

/** aggregate fields of "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_Aggregate_Fields = {
  __typename?: 'public6_planned_tasks_devices_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Planned_Tasks_Devices_Max_Fields>;
  min?: Maybe<Public6_Planned_Tasks_Devices_Min_Fields>;
};

/** aggregate fields of "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.planned_tasks_devices". All fields are combined with a logical 'AND'. */
export type Public6_Planned_Tasks_Devices_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Bool_Exp>>;
  _not?: InputMaybe<Public6_Planned_Tasks_Devices_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Bool_Exp>>;
  equipment_id?: InputMaybe<Uuid_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.planned_tasks_devices" */
export enum Public6_Planned_Tasks_Devices_Constraint {
  /** unique or primary key constraint on columns "task_id", "equipment_id" */
  PlannedTasksDevicesPkey = 'planned_tasks_devices_pkey',
}

/** input type for inserting data into table "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_Insert_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public6_Planned_Tasks_Devices_Max_Fields = {
  __typename?: 'public6_planned_tasks_devices_max_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public6_Planned_Tasks_Devices_Min_Fields = {
  __typename?: 'public6_planned_tasks_devices_min_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_Mutation_Response = {
  __typename?: 'public6_planned_tasks_devices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Planned_Tasks_Devices>;
};

/** on_conflict condition type for table "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_On_Conflict = {
  constraint: Public6_Planned_Tasks_Devices_Constraint;
  update_columns?: Array<Public6_Planned_Tasks_Devices_Update_Column>;
  where?: InputMaybe<Public6_Planned_Tasks_Devices_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.planned_tasks_devices". */
export type Public6_Planned_Tasks_Devices_Order_By = {
  equipment_id?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.planned_tasks_devices */
export type Public6_Planned_Tasks_Devices_Pk_Columns_Input = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

/** select columns of table "public6.planned_tasks_devices" */
export enum Public6_Planned_Tasks_Devices_Select_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id',
}

/** input type for updating data in table "public6.planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_Set_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public6_planned_tasks_devices" */
export type Public6_Planned_Tasks_Devices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Planned_Tasks_Devices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Planned_Tasks_Devices_Stream_Cursor_Value_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public6.planned_tasks_devices" */
export enum Public6_Planned_Tasks_Devices_Update_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id',
}

export type Public6_Planned_Tasks_Devices_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Planned_Tasks_Devices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Planned_Tasks_Devices_Bool_Exp;
};

/** input type for inserting data into table "public6.planned_tasks" */
export type Public6_Planned_Tasks_Insert_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Planned_Tasks_Max_Fields = {
  __typename?: 'public6_planned_tasks_max_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rm_task_id?: Maybe<Scalars['uuid']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
  yaml_url?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Planned_Tasks_Min_Fields = {
  __typename?: 'public6_planned_tasks_min_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rm_task_id?: Maybe<Scalars['uuid']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
  yaml_url?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.planned_tasks" */
export type Public6_Planned_Tasks_Mutation_Response = {
  __typename?: 'public6_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Planned_Tasks>;
};

/** on_conflict condition type for table "public6.planned_tasks" */
export type Public6_Planned_Tasks_On_Conflict = {
  constraint: Public6_Planned_Tasks_Constraint;
  update_columns?: Array<Public6_Planned_Tasks_Update_Column>;
  where?: InputMaybe<Public6_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.planned_tasks". */
export type Public6_Planned_Tasks_Order_By = {
  author_id?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  rm_task_id?: InputMaybe<Order_By>;
  time_work_id?: InputMaybe<Order_By>;
  yaml_url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.planned_tasks */
export type Public6_Planned_Tasks_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.planned_tasks" */
export enum Public6_Planned_Tasks_Select_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  RmTaskId = 'rm_task_id',
  /** column name */
  TimeWorkId = 'time_work_id',
  /** column name */
  YamlUrl = 'yaml_url',
}

/** input type for updating data in table "public6.planned_tasks" */
export type Public6_Planned_Tasks_Set_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_planned_tasks" */
export type Public6_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Planned_Tasks_Stream_Cursor_Value_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.planned_tasks" */
export enum Public6_Planned_Tasks_Update_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  RmTaskId = 'rm_task_id',
  /** column name */
  TimeWorkId = 'time_work_id',
  /** column name */
  YamlUrl = 'yaml_url',
}

export type Public6_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "public6.providers" */
export type Public6_Providers = {
  __typename?: 'public6_providers';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public6.providers" */
export type Public6_Providers_Aggregate = {
  __typename?: 'public6_providers_aggregate';
  aggregate?: Maybe<Public6_Providers_Aggregate_Fields>;
  nodes: Array<Public6_Providers>;
};

/** aggregate fields of "public6.providers" */
export type Public6_Providers_Aggregate_Fields = {
  __typename?: 'public6_providers_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Providers_Max_Fields>;
  min?: Maybe<Public6_Providers_Min_Fields>;
};

/** aggregate fields of "public6.providers" */
export type Public6_Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.providers". All fields are combined with a logical 'AND'. */
export type Public6_Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Providers_Bool_Exp>>;
  _not?: InputMaybe<Public6_Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Providers_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.providers" */
export enum Public6_Providers_Constraint {
  /** unique or primary key constraint on columns "name" */
  ProvidersNameKey = 'providers_name_key',
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = 'providers_pkey',
}

/** input type for inserting data into table "public6.providers" */
export type Public6_Providers_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Providers_Max_Fields = {
  __typename?: 'public6_providers_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Providers_Min_Fields = {
  __typename?: 'public6_providers_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.providers" */
export type Public6_Providers_Mutation_Response = {
  __typename?: 'public6_providers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Providers>;
};

/** on_conflict condition type for table "public6.providers" */
export type Public6_Providers_On_Conflict = {
  constraint: Public6_Providers_Constraint;
  update_columns?: Array<Public6_Providers_Update_Column>;
  where?: InputMaybe<Public6_Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.providers". */
export type Public6_Providers_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.providers */
export type Public6_Providers_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.providers" */
export enum Public6_Providers_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public6.providers" */
export type Public6_Providers_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_providers" */
export type Public6_Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Providers_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.providers" */
export enum Public6_Providers_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public6_Providers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Providers_Bool_Exp;
};

/** columns and relationships of "public6.rm_projects" */
export type Public6_Rm_Projects = {
  __typename?: 'public6_rm_projects';
  ext_id: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public6.rm_projects" */
export type Public6_Rm_Projects_Aggregate = {
  __typename?: 'public6_rm_projects_aggregate';
  aggregate?: Maybe<Public6_Rm_Projects_Aggregate_Fields>;
  nodes: Array<Public6_Rm_Projects>;
};

/** aggregate fields of "public6.rm_projects" */
export type Public6_Rm_Projects_Aggregate_Fields = {
  __typename?: 'public6_rm_projects_aggregate_fields';
  avg?: Maybe<Public6_Rm_Projects_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Rm_Projects_Max_Fields>;
  min?: Maybe<Public6_Rm_Projects_Min_Fields>;
  stddev?: Maybe<Public6_Rm_Projects_Stddev_Fields>;
  stddev_pop?: Maybe<Public6_Rm_Projects_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public6_Rm_Projects_Stddev_Samp_Fields>;
  sum?: Maybe<Public6_Rm_Projects_Sum_Fields>;
  var_pop?: Maybe<Public6_Rm_Projects_Var_Pop_Fields>;
  var_samp?: Maybe<Public6_Rm_Projects_Var_Samp_Fields>;
  variance?: Maybe<Public6_Rm_Projects_Variance_Fields>;
};

/** aggregate fields of "public6.rm_projects" */
export type Public6_Rm_Projects_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Rm_Projects_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public6_Rm_Projects_Avg_Fields = {
  __typename?: 'public6_rm_projects_avg_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public6.rm_projects". All fields are combined with a logical 'AND'. */
export type Public6_Rm_Projects_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Rm_Projects_Bool_Exp>>;
  _not?: InputMaybe<Public6_Rm_Projects_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Rm_Projects_Bool_Exp>>;
  ext_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.rm_projects" */
export enum Public6_Rm_Projects_Constraint {
  /** unique or primary key constraint on columns "ext_id" */
  RmProjectsExtIdKey = 'rm_projects_ext_id_key',
  /** unique or primary key constraint on columns "id" */
  RmProjectsPkey = 'rm_projects_pkey',
}

/** input type for incrementing numeric columns in table "public6.rm_projects" */
export type Public6_Rm_Projects_Inc_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public6.rm_projects" */
export type Public6_Rm_Projects_Insert_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Rm_Projects_Max_Fields = {
  __typename?: 'public6_rm_projects_max_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Rm_Projects_Min_Fields = {
  __typename?: 'public6_rm_projects_min_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.rm_projects" */
export type Public6_Rm_Projects_Mutation_Response = {
  __typename?: 'public6_rm_projects_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Rm_Projects>;
};

/** on_conflict condition type for table "public6.rm_projects" */
export type Public6_Rm_Projects_On_Conflict = {
  constraint: Public6_Rm_Projects_Constraint;
  update_columns?: Array<Public6_Rm_Projects_Update_Column>;
  where?: InputMaybe<Public6_Rm_Projects_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.rm_projects". */
export type Public6_Rm_Projects_Order_By = {
  ext_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.rm_projects */
export type Public6_Rm_Projects_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.rm_projects" */
export enum Public6_Rm_Projects_Select_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public6.rm_projects" */
export type Public6_Rm_Projects_Set_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Public6_Rm_Projects_Stddev_Fields = {
  __typename?: 'public6_rm_projects_stddev_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public6_Rm_Projects_Stddev_Pop_Fields = {
  __typename?: 'public6_rm_projects_stddev_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public6_Rm_Projects_Stddev_Samp_Fields = {
  __typename?: 'public6_rm_projects_stddev_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public6_rm_projects" */
export type Public6_Rm_Projects_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Rm_Projects_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Rm_Projects_Stream_Cursor_Value_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Public6_Rm_Projects_Sum_Fields = {
  __typename?: 'public6_rm_projects_sum_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public6.rm_projects" */
export enum Public6_Rm_Projects_Update_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public6_Rm_Projects_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public6_Rm_Projects_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Rm_Projects_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Rm_Projects_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public6_Rm_Projects_Var_Pop_Fields = {
  __typename?: 'public6_rm_projects_var_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public6_Rm_Projects_Var_Samp_Fields = {
  __typename?: 'public6_rm_projects_var_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public6_Rm_Projects_Variance_Fields = {
  __typename?: 'public6_rm_projects_variance_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public6.rm_tasks" */
export type Public6_Rm_Tasks = {
  __typename?: 'public6_rm_tasks';
  ext_id: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  project_id: Scalars['uuid']['output'];
  status: Scalars['String']['output'];
};

/** aggregated selection of "public6.rm_tasks" */
export type Public6_Rm_Tasks_Aggregate = {
  __typename?: 'public6_rm_tasks_aggregate';
  aggregate?: Maybe<Public6_Rm_Tasks_Aggregate_Fields>;
  nodes: Array<Public6_Rm_Tasks>;
};

/** aggregate fields of "public6.rm_tasks" */
export type Public6_Rm_Tasks_Aggregate_Fields = {
  __typename?: 'public6_rm_tasks_aggregate_fields';
  avg?: Maybe<Public6_Rm_Tasks_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Rm_Tasks_Max_Fields>;
  min?: Maybe<Public6_Rm_Tasks_Min_Fields>;
  stddev?: Maybe<Public6_Rm_Tasks_Stddev_Fields>;
  stddev_pop?: Maybe<Public6_Rm_Tasks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public6_Rm_Tasks_Stddev_Samp_Fields>;
  sum?: Maybe<Public6_Rm_Tasks_Sum_Fields>;
  var_pop?: Maybe<Public6_Rm_Tasks_Var_Pop_Fields>;
  var_samp?: Maybe<Public6_Rm_Tasks_Var_Samp_Fields>;
  variance?: Maybe<Public6_Rm_Tasks_Variance_Fields>;
};

/** aggregate fields of "public6.rm_tasks" */
export type Public6_Rm_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Rm_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public6_Rm_Tasks_Avg_Fields = {
  __typename?: 'public6_rm_tasks_avg_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public6.rm_tasks". All fields are combined with a logical 'AND'. */
export type Public6_Rm_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Rm_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public6_Rm_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Rm_Tasks_Bool_Exp>>;
  ext_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.rm_tasks" */
export enum Public6_Rm_Tasks_Constraint {
  /** unique or primary key constraint on columns "ext_id" */
  RmTasksExtIdKey = 'rm_tasks_ext_id_key',
  /** unique or primary key constraint on columns "id" */
  RmTasksPkey = 'rm_tasks_pkey',
}

/** input type for incrementing numeric columns in table "public6.rm_tasks" */
export type Public6_Rm_Tasks_Inc_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public6.rm_tasks" */
export type Public6_Rm_Tasks_Insert_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Rm_Tasks_Max_Fields = {
  __typename?: 'public6_rm_tasks_max_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Rm_Tasks_Min_Fields = {
  __typename?: 'public6_rm_tasks_min_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.rm_tasks" */
export type Public6_Rm_Tasks_Mutation_Response = {
  __typename?: 'public6_rm_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Rm_Tasks>;
};

/** on_conflict condition type for table "public6.rm_tasks" */
export type Public6_Rm_Tasks_On_Conflict = {
  constraint: Public6_Rm_Tasks_Constraint;
  update_columns?: Array<Public6_Rm_Tasks_Update_Column>;
  where?: InputMaybe<Public6_Rm_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.rm_tasks". */
export type Public6_Rm_Tasks_Order_By = {
  ext_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.rm_tasks */
export type Public6_Rm_Tasks_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.rm_tasks" */
export enum Public6_Rm_Tasks_Select_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  Status = 'status',
}

/** input type for updating data in table "public6.rm_tasks" */
export type Public6_Rm_Tasks_Set_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Public6_Rm_Tasks_Stddev_Fields = {
  __typename?: 'public6_rm_tasks_stddev_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public6_Rm_Tasks_Stddev_Pop_Fields = {
  __typename?: 'public6_rm_tasks_stddev_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public6_Rm_Tasks_Stddev_Samp_Fields = {
  __typename?: 'public6_rm_tasks_stddev_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public6_rm_tasks" */
export type Public6_Rm_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Rm_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Rm_Tasks_Stream_Cursor_Value_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Public6_Rm_Tasks_Sum_Fields = {
  __typename?: 'public6_rm_tasks_sum_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public6.rm_tasks" */
export enum Public6_Rm_Tasks_Update_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  Status = 'status',
}

export type Public6_Rm_Tasks_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public6_Rm_Tasks_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Rm_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Rm_Tasks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public6_Rm_Tasks_Var_Pop_Fields = {
  __typename?: 'public6_rm_tasks_var_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public6_Rm_Tasks_Var_Samp_Fields = {
  __typename?: 'public6_rm_tasks_var_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public6_Rm_Tasks_Variance_Fields = {
  __typename?: 'public6_rm_tasks_variance_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public6.roles" */
export type Public6_Roles = {
  __typename?: 'public6_roles';
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "public6.roles" */
export type Public6_Roles_Aggregate = {
  __typename?: 'public6_roles_aggregate';
  aggregate?: Maybe<Public6_Roles_Aggregate_Fields>;
  nodes: Array<Public6_Roles>;
};

/** aggregate fields of "public6.roles" */
export type Public6_Roles_Aggregate_Fields = {
  __typename?: 'public6_roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Roles_Max_Fields>;
  min?: Maybe<Public6_Roles_Min_Fields>;
};

/** aggregate fields of "public6.roles" */
export type Public6_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.roles". All fields are combined with a logical 'AND'. */
export type Public6_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Roles_Bool_Exp>>;
  _not?: InputMaybe<Public6_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.roles" */
export enum Public6_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  RolesPkey = 'roles_pkey',
  /** unique or primary key constraint on columns "role" */
  RolesRoleKey = 'roles_role_key',
}

/** input type for inserting data into table "public6.roles" */
export type Public6_Roles_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Roles_Max_Fields = {
  __typename?: 'public6_roles_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Roles_Min_Fields = {
  __typename?: 'public6_roles_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.roles" */
export type Public6_Roles_Mutation_Response = {
  __typename?: 'public6_roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Roles>;
};

/** on_conflict condition type for table "public6.roles" */
export type Public6_Roles_On_Conflict = {
  constraint: Public6_Roles_Constraint;
  update_columns?: Array<Public6_Roles_Update_Column>;
  where?: InputMaybe<Public6_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.roles". */
export type Public6_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.roles */
export type Public6_Roles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.roles" */
export enum Public6_Roles_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

/** input type for updating data in table "public6.roles" */
export type Public6_Roles_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_roles" */
export type Public6_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.roles" */
export enum Public6_Roles_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

export type Public6_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Roles_Bool_Exp;
};

/** columns and relationships of "public6.time_works" */
export type Public6_Time_Works = {
  __typename?: 'public6_time_works';
  end_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  start_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "public6.time_works" */
export type Public6_Time_Works_Aggregate = {
  __typename?: 'public6_time_works_aggregate';
  aggregate?: Maybe<Public6_Time_Works_Aggregate_Fields>;
  nodes: Array<Public6_Time_Works>;
};

/** aggregate fields of "public6.time_works" */
export type Public6_Time_Works_Aggregate_Fields = {
  __typename?: 'public6_time_works_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Time_Works_Max_Fields>;
  min?: Maybe<Public6_Time_Works_Min_Fields>;
};

/** aggregate fields of "public6.time_works" */
export type Public6_Time_Works_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Time_Works_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.time_works". All fields are combined with a logical 'AND'. */
export type Public6_Time_Works_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Time_Works_Bool_Exp>>;
  _not?: InputMaybe<Public6_Time_Works_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Time_Works_Bool_Exp>>;
  end_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  start_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.time_works" */
export enum Public6_Time_Works_Constraint {
  /** unique or primary key constraint on columns "id" */
  TimeWorksPkey = 'time_works_pkey',
}

/** input type for inserting data into table "public6.time_works" */
export type Public6_Time_Works_Insert_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Public6_Time_Works_Max_Fields = {
  __typename?: 'public6_time_works_max_fields';
  end_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Public6_Time_Works_Min_Fields = {
  __typename?: 'public6_time_works_min_fields';
  end_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "public6.time_works" */
export type Public6_Time_Works_Mutation_Response = {
  __typename?: 'public6_time_works_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Time_Works>;
};

/** on_conflict condition type for table "public6.time_works" */
export type Public6_Time_Works_On_Conflict = {
  constraint: Public6_Time_Works_Constraint;
  update_columns?: Array<Public6_Time_Works_Update_Column>;
  where?: InputMaybe<Public6_Time_Works_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.time_works". */
export type Public6_Time_Works_Order_By = {
  end_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.time_works */
export type Public6_Time_Works_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.time_works" */
export enum Public6_Time_Works_Select_Column {
  /** column name */
  EndAt = 'end_at',
  /** column name */
  Id = 'id',
  /** column name */
  StartAt = 'start_at',
}

/** input type for updating data in table "public6.time_works" */
export type Public6_Time_Works_Set_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "public6_time_works" */
export type Public6_Time_Works_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Time_Works_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Time_Works_Stream_Cursor_Value_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "public6.time_works" */
export enum Public6_Time_Works_Update_Column {
  /** column name */
  EndAt = 'end_at',
  /** column name */
  Id = 'id',
  /** column name */
  StartAt = 'start_at',
}

export type Public6_Time_Works_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Time_Works_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Time_Works_Bool_Exp;
};

/** columns and relationships of "public6.user_groups" */
export type Public6_User_Groups = {
  __typename?: 'public6_user_groups';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public6.user_groups" */
export type Public6_User_Groups_Aggregate = {
  __typename?: 'public6_user_groups_aggregate';
  aggregate?: Maybe<Public6_User_Groups_Aggregate_Fields>;
  nodes: Array<Public6_User_Groups>;
};

/** aggregate fields of "public6.user_groups" */
export type Public6_User_Groups_Aggregate_Fields = {
  __typename?: 'public6_user_groups_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_User_Groups_Max_Fields>;
  min?: Maybe<Public6_User_Groups_Min_Fields>;
};

/** aggregate fields of "public6.user_groups" */
export type Public6_User_Groups_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_User_Groups_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.user_groups". All fields are combined with a logical 'AND'. */
export type Public6_User_Groups_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_User_Groups_Bool_Exp>>;
  _not?: InputMaybe<Public6_User_Groups_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_User_Groups_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.user_groups" */
export enum Public6_User_Groups_Constraint {
  /** unique or primary key constraint on columns "name" */
  UserGroupsNameKey = 'user_groups_name_key',
  /** unique or primary key constraint on columns "id" */
  UserGroupsPkey = 'user_groups_pkey',
}

/** input type for inserting data into table "public6.user_groups" */
export type Public6_User_Groups_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_User_Groups_Max_Fields = {
  __typename?: 'public6_user_groups_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_User_Groups_Min_Fields = {
  __typename?: 'public6_user_groups_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.user_groups" */
export type Public6_User_Groups_Mutation_Response = {
  __typename?: 'public6_user_groups_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_User_Groups>;
};

/** on_conflict condition type for table "public6.user_groups" */
export type Public6_User_Groups_On_Conflict = {
  constraint: Public6_User_Groups_Constraint;
  update_columns?: Array<Public6_User_Groups_Update_Column>;
  where?: InputMaybe<Public6_User_Groups_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.user_groups". */
export type Public6_User_Groups_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.user_groups */
export type Public6_User_Groups_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.user_groups" */
export enum Public6_User_Groups_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public6.user_groups" */
export type Public6_User_Groups_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_user_groups" */
export type Public6_User_Groups_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_User_Groups_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_User_Groups_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.user_groups" */
export enum Public6_User_Groups_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public6_User_Groups_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_User_Groups_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_User_Groups_Bool_Exp;
};

/** columns and relationships of "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks = {
  __typename?: 'public6_user_planned_tasks';
  task_id: Scalars['uuid']['output'];
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks_Aggregate = {
  __typename?: 'public6_user_planned_tasks_aggregate';
  aggregate?: Maybe<Public6_User_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Public6_User_Planned_Tasks>;
};

/** aggregate fields of "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'public6_user_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_User_Planned_Tasks_Max_Fields>;
  min?: Maybe<Public6_User_Planned_Tasks_Min_Fields>;
};

/** aggregate fields of "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_User_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.user_planned_tasks". All fields are combined with a logical 'AND'. */
export type Public6_User_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_User_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public6_User_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_User_Planned_Tasks_Bool_Exp>>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.user_planned_tasks" */
export enum Public6_User_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "user_id", "task_id" */
  UserPlannedTasksPkey = 'user_planned_tasks_pkey',
}

/** input type for inserting data into table "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks_Insert_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public6_User_Planned_Tasks_Max_Fields = {
  __typename?: 'public6_user_planned_tasks_max_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public6_User_Planned_Tasks_Min_Fields = {
  __typename?: 'public6_user_planned_tasks_min_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks_Mutation_Response = {
  __typename?: 'public6_user_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_User_Planned_Tasks>;
};

/** on_conflict condition type for table "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks_On_Conflict = {
  constraint: Public6_User_Planned_Tasks_Constraint;
  update_columns?: Array<Public6_User_Planned_Tasks_Update_Column>;
  where?: InputMaybe<Public6_User_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.user_planned_tasks". */
export type Public6_User_Planned_Tasks_Order_By = {
  task_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.user_planned_tasks */
export type Public6_User_Planned_Tasks_Pk_Columns_Input = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

/** select columns of table "public6.user_planned_tasks" */
export enum Public6_User_Planned_Tasks_Select_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id',
}

/** input type for updating data in table "public6.user_planned_tasks" */
export type Public6_User_Planned_Tasks_Set_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public6_user_planned_tasks" */
export type Public6_User_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_User_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_User_Planned_Tasks_Stream_Cursor_Value_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public6.user_planned_tasks" */
export enum Public6_User_Planned_Tasks_Update_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id',
}

export type Public6_User_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_User_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_User_Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "public6.users" */
export type Public6_Users = {
  __typename?: 'public6_users';
  email: Scalars['String']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  group_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  is_active: Scalars['Boolean']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  role_id: Scalars['uuid']['output'];
  time_zone: Scalars['String']['output'];
};

/** aggregated selection of "public6.users" */
export type Public6_Users_Aggregate = {
  __typename?: 'public6_users_aggregate';
  aggregate?: Maybe<Public6_Users_Aggregate_Fields>;
  nodes: Array<Public6_Users>;
};

/** aggregate fields of "public6.users" */
export type Public6_Users_Aggregate_Fields = {
  __typename?: 'public6_users_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Users_Max_Fields>;
  min?: Maybe<Public6_Users_Min_Fields>;
};

/** aggregate fields of "public6.users" */
export type Public6_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.users". All fields are combined with a logical 'AND'. */
export type Public6_Users_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Users_Bool_Exp>>;
  _not?: InputMaybe<Public6_Users_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Users_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  middle_name?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  time_zone?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.users" */
export enum Public6_Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey',
}

/** input type for inserting data into table "public6.users" */
export type Public6_Users_Insert_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Users_Max_Fields = {
  __typename?: 'public6_users_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  group_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Users_Min_Fields = {
  __typename?: 'public6_users_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  group_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.users" */
export type Public6_Users_Mutation_Response = {
  __typename?: 'public6_users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Users>;
};

/** on_conflict condition type for table "public6.users" */
export type Public6_Users_On_Conflict = {
  constraint: Public6_Users_Constraint;
  update_columns?: Array<Public6_Users_Update_Column>;
  where?: InputMaybe<Public6_Users_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.users". */
export type Public6_Users_Order_By = {
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  time_zone?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.users */
export type Public6_Users_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.users" */
export enum Public6_Users_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  LastName = 'last_name',
  /** column name */
  MiddleName = 'middle_name',
  /** column name */
  Name = 'name',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  TimeZone = 'time_zone',
}

/** input type for updating data in table "public6.users" */
export type Public6_Users_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_users" */
export type Public6_Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Users_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.users" */
export enum Public6_Users_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  LastName = 'last_name',
  /** column name */
  MiddleName = 'middle_name',
  /** column name */
  Name = 'name',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  TimeZone = 'time_zone',
}

export type Public6_Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Users_Bool_Exp;
};

/** columns and relationships of "public6.vendors" */
export type Public6_Vendors = {
  __typename?: 'public6_vendors';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public6.vendors" */
export type Public6_Vendors_Aggregate = {
  __typename?: 'public6_vendors_aggregate';
  aggregate?: Maybe<Public6_Vendors_Aggregate_Fields>;
  nodes: Array<Public6_Vendors>;
};

/** aggregate fields of "public6.vendors" */
export type Public6_Vendors_Aggregate_Fields = {
  __typename?: 'public6_vendors_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public6_Vendors_Max_Fields>;
  min?: Maybe<Public6_Vendors_Min_Fields>;
};

/** aggregate fields of "public6.vendors" */
export type Public6_Vendors_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public6_Vendors_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public6.vendors". All fields are combined with a logical 'AND'. */
export type Public6_Vendors_Bool_Exp = {
  _and?: InputMaybe<Array<Public6_Vendors_Bool_Exp>>;
  _not?: InputMaybe<Public6_Vendors_Bool_Exp>;
  _or?: InputMaybe<Array<Public6_Vendors_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public6.vendors" */
export enum Public6_Vendors_Constraint {
  /** unique or primary key constraint on columns "name" */
  VendorsNameKey = 'vendors_name_key',
  /** unique or primary key constraint on columns "id" */
  VendorsPkey = 'vendors_pkey',
}

/** input type for inserting data into table "public6.vendors" */
export type Public6_Vendors_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public6_Vendors_Max_Fields = {
  __typename?: 'public6_vendors_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public6_Vendors_Min_Fields = {
  __typename?: 'public6_vendors_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public6.vendors" */
export type Public6_Vendors_Mutation_Response = {
  __typename?: 'public6_vendors_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public6_Vendors>;
};

/** on_conflict condition type for table "public6.vendors" */
export type Public6_Vendors_On_Conflict = {
  constraint: Public6_Vendors_Constraint;
  update_columns?: Array<Public6_Vendors_Update_Column>;
  where?: InputMaybe<Public6_Vendors_Bool_Exp>;
};

/** Ordering options when selecting data from "public6.vendors". */
export type Public6_Vendors_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public6.vendors */
export type Public6_Vendors_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public6.vendors" */
export enum Public6_Vendors_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public6.vendors" */
export type Public6_Vendors_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public6_vendors" */
export type Public6_Vendors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public6_Vendors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public6_Vendors_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public6.vendors" */
export enum Public6_Vendors_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public6_Vendors_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public6_Vendors_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public6_Vendors_Bool_Exp;
};

/** columns and relationships of "public7.branches" */
export type Public7_Branches = {
  __typename?: 'public7_branches';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  provider_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public7.branches" */
export type Public7_Branches_Aggregate = {
  __typename?: 'public7_branches_aggregate';
  aggregate?: Maybe<Public7_Branches_Aggregate_Fields>;
  nodes: Array<Public7_Branches>;
};

/** aggregate fields of "public7.branches" */
export type Public7_Branches_Aggregate_Fields = {
  __typename?: 'public7_branches_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Branches_Max_Fields>;
  min?: Maybe<Public7_Branches_Min_Fields>;
};

/** aggregate fields of "public7.branches" */
export type Public7_Branches_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Branches_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.branches". All fields are combined with a logical 'AND'. */
export type Public7_Branches_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Branches_Bool_Exp>>;
  _not?: InputMaybe<Public7_Branches_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Branches_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.branches" */
export enum Public7_Branches_Constraint {
  /** unique or primary key constraint on columns "name", "provider_id" */
  BranchesNameProviderIdKey = 'branches_name_provider_id_key',
  /** unique or primary key constraint on columns "id" */
  BranchesPkey = 'branches_pkey',
}

/** input type for inserting data into table "public7.branches" */
export type Public7_Branches_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public7_Branches_Max_Fields = {
  __typename?: 'public7_branches_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public7_Branches_Min_Fields = {
  __typename?: 'public7_branches_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public7.branches" */
export type Public7_Branches_Mutation_Response = {
  __typename?: 'public7_branches_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Branches>;
};

/** on_conflict condition type for table "public7.branches" */
export type Public7_Branches_On_Conflict = {
  constraint: Public7_Branches_Constraint;
  update_columns?: Array<Public7_Branches_Update_Column>;
  where?: InputMaybe<Public7_Branches_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.branches". */
export type Public7_Branches_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.branches */
export type Public7_Branches_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.branches" */
export enum Public7_Branches_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id',
}

/** input type for updating data in table "public7.branches" */
export type Public7_Branches_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public7_branches" */
export type Public7_Branches_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Branches_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Branches_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public7.branches" */
export enum Public7_Branches_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id',
}

export type Public7_Branches_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Branches_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Branches_Bool_Exp;
};

/** columns and relationships of "public7.cities" */
export type Public7_Cities = {
  __typename?: 'public7_cities';
  branch_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  time_zone: Scalars['String']['output'];
};

/** aggregated selection of "public7.cities" */
export type Public7_Cities_Aggregate = {
  __typename?: 'public7_cities_aggregate';
  aggregate?: Maybe<Public7_Cities_Aggregate_Fields>;
  nodes: Array<Public7_Cities>;
};

/** aggregate fields of "public7.cities" */
export type Public7_Cities_Aggregate_Fields = {
  __typename?: 'public7_cities_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Cities_Max_Fields>;
  min?: Maybe<Public7_Cities_Min_Fields>;
};

/** aggregate fields of "public7.cities" */
export type Public7_Cities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Cities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.cities". All fields are combined with a logical 'AND'. */
export type Public7_Cities_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Cities_Bool_Exp>>;
  _not?: InputMaybe<Public7_Cities_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Cities_Bool_Exp>>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  time_zone?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.cities" */
export enum Public7_Cities_Constraint {
  /** unique or primary key constraint on columns "branch_id", "name" */
  CitiesNameBranchIdKey = 'cities_name_branch_id_key',
  /** unique or primary key constraint on columns "id" */
  CitiesPkey = 'cities_pkey',
}

/** input type for inserting data into table "public7.cities" */
export type Public7_Cities_Insert_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Cities_Max_Fields = {
  __typename?: 'public7_cities_max_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Cities_Min_Fields = {
  __typename?: 'public7_cities_min_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.cities" */
export type Public7_Cities_Mutation_Response = {
  __typename?: 'public7_cities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Cities>;
};

/** on_conflict condition type for table "public7.cities" */
export type Public7_Cities_On_Conflict = {
  constraint: Public7_Cities_Constraint;
  update_columns?: Array<Public7_Cities_Update_Column>;
  where?: InputMaybe<Public7_Cities_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.cities". */
export type Public7_Cities_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  time_zone?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.cities */
export type Public7_Cities_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.cities" */
export enum Public7_Cities_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TimeZone = 'time_zone',
}

/** input type for updating data in table "public7.cities" */
export type Public7_Cities_Set_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_cities" */
export type Public7_Cities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Cities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Cities_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.cities" */
export enum Public7_Cities_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TimeZone = 'time_zone',
}

export type Public7_Cities_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Cities_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Cities_Bool_Exp;
};

/** columns and relationships of "public7.device_models" */
export type Public7_Device_Models = {
  __typename?: 'public7_device_models';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  vendor_id: Scalars['uuid']['output'];
  version: Scalars['String']['output'];
};

/** aggregated selection of "public7.device_models" */
export type Public7_Device_Models_Aggregate = {
  __typename?: 'public7_device_models_aggregate';
  aggregate?: Maybe<Public7_Device_Models_Aggregate_Fields>;
  nodes: Array<Public7_Device_Models>;
};

/** aggregate fields of "public7.device_models" */
export type Public7_Device_Models_Aggregate_Fields = {
  __typename?: 'public7_device_models_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Device_Models_Max_Fields>;
  min?: Maybe<Public7_Device_Models_Min_Fields>;
};

/** aggregate fields of "public7.device_models" */
export type Public7_Device_Models_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Device_Models_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.device_models". All fields are combined with a logical 'AND'. */
export type Public7_Device_Models_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Device_Models_Bool_Exp>>;
  _not?: InputMaybe<Public7_Device_Models_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Device_Models_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  vendor_id?: InputMaybe<Uuid_Comparison_Exp>;
  version?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.device_models" */
export enum Public7_Device_Models_Constraint {
  /** unique or primary key constraint on columns "vendor_id", "name", "version" */
  DeviceModelsNameVersionVendorIdKey = 'device_models_name_version_vendor_id_key',
  /** unique or primary key constraint on columns "id" */
  DeviceModelsPkey = 'device_models_pkey',
}

/** input type for inserting data into table "public7.device_models" */
export type Public7_Device_Models_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Device_Models_Max_Fields = {
  __typename?: 'public7_device_models_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Device_Models_Min_Fields = {
  __typename?: 'public7_device_models_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.device_models" */
export type Public7_Device_Models_Mutation_Response = {
  __typename?: 'public7_device_models_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Device_Models>;
};

/** on_conflict condition type for table "public7.device_models" */
export type Public7_Device_Models_On_Conflict = {
  constraint: Public7_Device_Models_Constraint;
  update_columns?: Array<Public7_Device_Models_Update_Column>;
  where?: InputMaybe<Public7_Device_Models_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.device_models". */
export type Public7_Device_Models_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  vendor_id?: InputMaybe<Order_By>;
  version?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.device_models */
export type Public7_Device_Models_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.device_models" */
export enum Public7_Device_Models_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  VendorId = 'vendor_id',
  /** column name */
  Version = 'version',
}

/** input type for updating data in table "public7.device_models" */
export type Public7_Device_Models_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_device_models" */
export type Public7_Device_Models_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Device_Models_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Device_Models_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.device_models" */
export enum Public7_Device_Models_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  VendorId = 'vendor_id',
  /** column name */
  Version = 'version',
}

export type Public7_Device_Models_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Device_Models_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Device_Models_Bool_Exp;
};

/** columns and relationships of "public7.device_roles" */
export type Public7_Device_Roles = {
  __typename?: 'public7_device_roles';
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
  vendor_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public7.device_roles" */
export type Public7_Device_Roles_Aggregate = {
  __typename?: 'public7_device_roles_aggregate';
  aggregate?: Maybe<Public7_Device_Roles_Aggregate_Fields>;
  nodes: Array<Public7_Device_Roles>;
};

/** aggregate fields of "public7.device_roles" */
export type Public7_Device_Roles_Aggregate_Fields = {
  __typename?: 'public7_device_roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Device_Roles_Max_Fields>;
  min?: Maybe<Public7_Device_Roles_Min_Fields>;
};

/** aggregate fields of "public7.device_roles" */
export type Public7_Device_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Device_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.device_roles". All fields are combined with a logical 'AND'. */
export type Public7_Device_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Device_Roles_Bool_Exp>>;
  _not?: InputMaybe<Public7_Device_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Device_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  vendor_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.device_roles" */
export enum Public7_Device_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  DeviceRolesPkey = 'device_roles_pkey',
  /** unique or primary key constraint on columns "vendor_id", "role" */
  DeviceRolesRoleVendorIdKey = 'device_roles_role_vendor_id_key',
}

/** input type for inserting data into table "public7.device_roles" */
export type Public7_Device_Roles_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public7_Device_Roles_Max_Fields = {
  __typename?: 'public7_device_roles_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public7_Device_Roles_Min_Fields = {
  __typename?: 'public7_device_roles_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public7.device_roles" */
export type Public7_Device_Roles_Mutation_Response = {
  __typename?: 'public7_device_roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Device_Roles>;
};

/** on_conflict condition type for table "public7.device_roles" */
export type Public7_Device_Roles_On_Conflict = {
  constraint: Public7_Device_Roles_Constraint;
  update_columns?: Array<Public7_Device_Roles_Update_Column>;
  where?: InputMaybe<Public7_Device_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.device_roles". */
export type Public7_Device_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  vendor_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.device_roles */
export type Public7_Device_Roles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.device_roles" */
export enum Public7_Device_Roles_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  VendorId = 'vendor_id',
}

/** input type for updating data in table "public7.device_roles" */
export type Public7_Device_Roles_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public7_device_roles" */
export type Public7_Device_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Device_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Device_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public7.device_roles" */
export enum Public7_Device_Roles_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  VendorId = 'vendor_id',
}

export type Public7_Device_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Device_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Device_Roles_Bool_Exp;
};

/** columns and relationships of "public7.devices" */
export type Public7_Devices = {
  __typename?: 'public7_devices';
  hostname: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  model_id: Scalars['uuid']['output'];
  node_id: Scalars['uuid']['output'];
  role_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public7.devices" */
export type Public7_Devices_Aggregate = {
  __typename?: 'public7_devices_aggregate';
  aggregate?: Maybe<Public7_Devices_Aggregate_Fields>;
  nodes: Array<Public7_Devices>;
};

/** aggregate fields of "public7.devices" */
export type Public7_Devices_Aggregate_Fields = {
  __typename?: 'public7_devices_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Devices_Max_Fields>;
  min?: Maybe<Public7_Devices_Min_Fields>;
};

/** aggregate fields of "public7.devices" */
export type Public7_Devices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Devices_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.devices". All fields are combined with a logical 'AND'. */
export type Public7_Devices_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Devices_Bool_Exp>>;
  _not?: InputMaybe<Public7_Devices_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Devices_Bool_Exp>>;
  hostname?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  model_id?: InputMaybe<Uuid_Comparison_Exp>;
  node_id?: InputMaybe<Uuid_Comparison_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.devices" */
export enum Public7_Devices_Constraint {
  /** unique or primary key constraint on columns "hostname" */
  DevicesHostnameKey = 'devices_hostname_key',
  /** unique or primary key constraint on columns "id" */
  DevicesPkey = 'devices_pkey',
}

/** input type for inserting data into table "public7.devices" */
export type Public7_Devices_Insert_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public7_Devices_Max_Fields = {
  __typename?: 'public7_devices_max_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model_id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public7_Devices_Min_Fields = {
  __typename?: 'public7_devices_min_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model_id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public7.devices" */
export type Public7_Devices_Mutation_Response = {
  __typename?: 'public7_devices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Devices>;
};

/** on_conflict condition type for table "public7.devices" */
export type Public7_Devices_On_Conflict = {
  constraint: Public7_Devices_Constraint;
  update_columns?: Array<Public7_Devices_Update_Column>;
  where?: InputMaybe<Public7_Devices_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.devices". */
export type Public7_Devices_Order_By = {
  hostname?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  model_id?: InputMaybe<Order_By>;
  node_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.devices */
export type Public7_Devices_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.devices" */
export enum Public7_Devices_Select_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  RoleId = 'role_id',
}

/** input type for updating data in table "public7.devices" */
export type Public7_Devices_Set_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public7_devices" */
export type Public7_Devices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Devices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Devices_Stream_Cursor_Value_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public7.devices" */
export enum Public7_Devices_Update_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  RoleId = 'role_id',
}

export type Public7_Devices_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Devices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Devices_Bool_Exp;
};

/** columns and relationships of "public7.nodes" */
export type Public7_Nodes = {
  __typename?: 'public7_nodes';
  address?: Maybe<Scalars['String']['output']>;
  city_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public7.nodes" */
export type Public7_Nodes_Aggregate = {
  __typename?: 'public7_nodes_aggregate';
  aggregate?: Maybe<Public7_Nodes_Aggregate_Fields>;
  nodes: Array<Public7_Nodes>;
};

/** aggregate fields of "public7.nodes" */
export type Public7_Nodes_Aggregate_Fields = {
  __typename?: 'public7_nodes_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Nodes_Max_Fields>;
  min?: Maybe<Public7_Nodes_Min_Fields>;
};

/** aggregate fields of "public7.nodes" */
export type Public7_Nodes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Nodes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.nodes". All fields are combined with a logical 'AND'. */
export type Public7_Nodes_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Nodes_Bool_Exp>>;
  _not?: InputMaybe<Public7_Nodes_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Nodes_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  city_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.nodes" */
export enum Public7_Nodes_Constraint {
  /** unique or primary key constraint on columns "name", "city_id" */
  NodesNameCityIdKey = 'nodes_name_city_id_key',
  /** unique or primary key constraint on columns "id" */
  NodesPkey = 'nodes_pkey',
}

/** input type for inserting data into table "public7.nodes" */
export type Public7_Nodes_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Nodes_Max_Fields = {
  __typename?: 'public7_nodes_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Nodes_Min_Fields = {
  __typename?: 'public7_nodes_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.nodes" */
export type Public7_Nodes_Mutation_Response = {
  __typename?: 'public7_nodes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Nodes>;
};

/** on_conflict condition type for table "public7.nodes" */
export type Public7_Nodes_On_Conflict = {
  constraint: Public7_Nodes_Constraint;
  update_columns?: Array<Public7_Nodes_Update_Column>;
  where?: InputMaybe<Public7_Nodes_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.nodes". */
export type Public7_Nodes_Order_By = {
  address?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.nodes */
export type Public7_Nodes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.nodes" */
export enum Public7_Nodes_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public7.nodes" */
export type Public7_Nodes_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_nodes" */
export type Public7_Nodes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Nodes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Nodes_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.nodes" */
export enum Public7_Nodes_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public7_Nodes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Nodes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Nodes_Bool_Exp;
};

/** columns and relationships of "public7.planned_tasks" */
export type Public7_Planned_Tasks = {
  __typename?: 'public7_planned_tasks';
  author_id: Scalars['uuid']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  rm_task_id: Scalars['uuid']['output'];
  time_work_id: Scalars['uuid']['output'];
  yaml_url?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "public7.planned_tasks" */
export type Public7_Planned_Tasks_Aggregate = {
  __typename?: 'public7_planned_tasks_aggregate';
  aggregate?: Maybe<Public7_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Public7_Planned_Tasks>;
};

/** aggregate fields of "public7.planned_tasks" */
export type Public7_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'public7_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Planned_Tasks_Max_Fields>;
  min?: Maybe<Public7_Planned_Tasks_Min_Fields>;
};

/** aggregate fields of "public7.planned_tasks" */
export type Public7_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.planned_tasks". All fields are combined with a logical 'AND'. */
export type Public7_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public7_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Planned_Tasks_Bool_Exp>>;
  author_id?: InputMaybe<Uuid_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  rm_task_id?: InputMaybe<Uuid_Comparison_Exp>;
  time_work_id?: InputMaybe<Uuid_Comparison_Exp>;
  yaml_url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.planned_tasks" */
export enum Public7_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "name" */
  PlannedTasksNameKey = 'planned_tasks_name_key',
  /** unique or primary key constraint on columns "id" */
  PlannedTasksPkey = 'planned_tasks_pkey',
}

/** columns and relationships of "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices = {
  __typename?: 'public7_planned_tasks_devices';
  equipment_id: Scalars['uuid']['output'];
  task_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_Aggregate = {
  __typename?: 'public7_planned_tasks_devices_aggregate';
  aggregate?: Maybe<Public7_Planned_Tasks_Devices_Aggregate_Fields>;
  nodes: Array<Public7_Planned_Tasks_Devices>;
};

/** aggregate fields of "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_Aggregate_Fields = {
  __typename?: 'public7_planned_tasks_devices_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Planned_Tasks_Devices_Max_Fields>;
  min?: Maybe<Public7_Planned_Tasks_Devices_Min_Fields>;
};

/** aggregate fields of "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.planned_tasks_devices". All fields are combined with a logical 'AND'. */
export type Public7_Planned_Tasks_Devices_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Bool_Exp>>;
  _not?: InputMaybe<Public7_Planned_Tasks_Devices_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Bool_Exp>>;
  equipment_id?: InputMaybe<Uuid_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.planned_tasks_devices" */
export enum Public7_Planned_Tasks_Devices_Constraint {
  /** unique or primary key constraint on columns "task_id", "equipment_id" */
  PlannedTasksDevicesPkey = 'planned_tasks_devices_pkey',
}

/** input type for inserting data into table "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_Insert_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public7_Planned_Tasks_Devices_Max_Fields = {
  __typename?: 'public7_planned_tasks_devices_max_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public7_Planned_Tasks_Devices_Min_Fields = {
  __typename?: 'public7_planned_tasks_devices_min_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_Mutation_Response = {
  __typename?: 'public7_planned_tasks_devices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Planned_Tasks_Devices>;
};

/** on_conflict condition type for table "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_On_Conflict = {
  constraint: Public7_Planned_Tasks_Devices_Constraint;
  update_columns?: Array<Public7_Planned_Tasks_Devices_Update_Column>;
  where?: InputMaybe<Public7_Planned_Tasks_Devices_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.planned_tasks_devices". */
export type Public7_Planned_Tasks_Devices_Order_By = {
  equipment_id?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.planned_tasks_devices */
export type Public7_Planned_Tasks_Devices_Pk_Columns_Input = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

/** select columns of table "public7.planned_tasks_devices" */
export enum Public7_Planned_Tasks_Devices_Select_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id',
}

/** input type for updating data in table "public7.planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_Set_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public7_planned_tasks_devices" */
export type Public7_Planned_Tasks_Devices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Planned_Tasks_Devices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Planned_Tasks_Devices_Stream_Cursor_Value_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public7.planned_tasks_devices" */
export enum Public7_Planned_Tasks_Devices_Update_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id',
}

export type Public7_Planned_Tasks_Devices_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Planned_Tasks_Devices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Planned_Tasks_Devices_Bool_Exp;
};

/** input type for inserting data into table "public7.planned_tasks" */
export type Public7_Planned_Tasks_Insert_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Planned_Tasks_Max_Fields = {
  __typename?: 'public7_planned_tasks_max_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rm_task_id?: Maybe<Scalars['uuid']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
  yaml_url?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Planned_Tasks_Min_Fields = {
  __typename?: 'public7_planned_tasks_min_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  rm_task_id?: Maybe<Scalars['uuid']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
  yaml_url?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.planned_tasks" */
export type Public7_Planned_Tasks_Mutation_Response = {
  __typename?: 'public7_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Planned_Tasks>;
};

/** on_conflict condition type for table "public7.planned_tasks" */
export type Public7_Planned_Tasks_On_Conflict = {
  constraint: Public7_Planned_Tasks_Constraint;
  update_columns?: Array<Public7_Planned_Tasks_Update_Column>;
  where?: InputMaybe<Public7_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.planned_tasks". */
export type Public7_Planned_Tasks_Order_By = {
  author_id?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  rm_task_id?: InputMaybe<Order_By>;
  time_work_id?: InputMaybe<Order_By>;
  yaml_url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.planned_tasks */
export type Public7_Planned_Tasks_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.planned_tasks" */
export enum Public7_Planned_Tasks_Select_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  RmTaskId = 'rm_task_id',
  /** column name */
  TimeWorkId = 'time_work_id',
  /** column name */
  YamlUrl = 'yaml_url',
}

/** input type for updating data in table "public7.planned_tasks" */
export type Public7_Planned_Tasks_Set_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_planned_tasks" */
export type Public7_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Planned_Tasks_Stream_Cursor_Value_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.planned_tasks" */
export enum Public7_Planned_Tasks_Update_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  RmTaskId = 'rm_task_id',
  /** column name */
  TimeWorkId = 'time_work_id',
  /** column name */
  YamlUrl = 'yaml_url',
}

export type Public7_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "public7.providers" */
export type Public7_Providers = {
  __typename?: 'public7_providers';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public7.providers" */
export type Public7_Providers_Aggregate = {
  __typename?: 'public7_providers_aggregate';
  aggregate?: Maybe<Public7_Providers_Aggregate_Fields>;
  nodes: Array<Public7_Providers>;
};

/** aggregate fields of "public7.providers" */
export type Public7_Providers_Aggregate_Fields = {
  __typename?: 'public7_providers_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Providers_Max_Fields>;
  min?: Maybe<Public7_Providers_Min_Fields>;
};

/** aggregate fields of "public7.providers" */
export type Public7_Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.providers". All fields are combined with a logical 'AND'. */
export type Public7_Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Providers_Bool_Exp>>;
  _not?: InputMaybe<Public7_Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Providers_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.providers" */
export enum Public7_Providers_Constraint {
  /** unique or primary key constraint on columns "name" */
  ProvidersNameKey = 'providers_name_key',
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = 'providers_pkey',
}

/** input type for inserting data into table "public7.providers" */
export type Public7_Providers_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Providers_Max_Fields = {
  __typename?: 'public7_providers_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Providers_Min_Fields = {
  __typename?: 'public7_providers_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.providers" */
export type Public7_Providers_Mutation_Response = {
  __typename?: 'public7_providers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Providers>;
};

/** on_conflict condition type for table "public7.providers" */
export type Public7_Providers_On_Conflict = {
  constraint: Public7_Providers_Constraint;
  update_columns?: Array<Public7_Providers_Update_Column>;
  where?: InputMaybe<Public7_Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.providers". */
export type Public7_Providers_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.providers */
export type Public7_Providers_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.providers" */
export enum Public7_Providers_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public7.providers" */
export type Public7_Providers_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_providers" */
export type Public7_Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Providers_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.providers" */
export enum Public7_Providers_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public7_Providers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Providers_Bool_Exp;
};

/** columns and relationships of "public7.rm_projects" */
export type Public7_Rm_Projects = {
  __typename?: 'public7_rm_projects';
  ext_id: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public7.rm_projects" */
export type Public7_Rm_Projects_Aggregate = {
  __typename?: 'public7_rm_projects_aggregate';
  aggregate?: Maybe<Public7_Rm_Projects_Aggregate_Fields>;
  nodes: Array<Public7_Rm_Projects>;
};

/** aggregate fields of "public7.rm_projects" */
export type Public7_Rm_Projects_Aggregate_Fields = {
  __typename?: 'public7_rm_projects_aggregate_fields';
  avg?: Maybe<Public7_Rm_Projects_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Rm_Projects_Max_Fields>;
  min?: Maybe<Public7_Rm_Projects_Min_Fields>;
  stddev?: Maybe<Public7_Rm_Projects_Stddev_Fields>;
  stddev_pop?: Maybe<Public7_Rm_Projects_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public7_Rm_Projects_Stddev_Samp_Fields>;
  sum?: Maybe<Public7_Rm_Projects_Sum_Fields>;
  var_pop?: Maybe<Public7_Rm_Projects_Var_Pop_Fields>;
  var_samp?: Maybe<Public7_Rm_Projects_Var_Samp_Fields>;
  variance?: Maybe<Public7_Rm_Projects_Variance_Fields>;
};

/** aggregate fields of "public7.rm_projects" */
export type Public7_Rm_Projects_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Rm_Projects_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public7_Rm_Projects_Avg_Fields = {
  __typename?: 'public7_rm_projects_avg_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public7.rm_projects". All fields are combined with a logical 'AND'. */
export type Public7_Rm_Projects_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Rm_Projects_Bool_Exp>>;
  _not?: InputMaybe<Public7_Rm_Projects_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Rm_Projects_Bool_Exp>>;
  ext_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.rm_projects" */
export enum Public7_Rm_Projects_Constraint {
  /** unique or primary key constraint on columns "ext_id" */
  RmProjectsExtIdKey = 'rm_projects_ext_id_key',
  /** unique or primary key constraint on columns "id" */
  RmProjectsPkey = 'rm_projects_pkey',
}

/** input type for incrementing numeric columns in table "public7.rm_projects" */
export type Public7_Rm_Projects_Inc_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public7.rm_projects" */
export type Public7_Rm_Projects_Insert_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Rm_Projects_Max_Fields = {
  __typename?: 'public7_rm_projects_max_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Rm_Projects_Min_Fields = {
  __typename?: 'public7_rm_projects_min_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.rm_projects" */
export type Public7_Rm_Projects_Mutation_Response = {
  __typename?: 'public7_rm_projects_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Rm_Projects>;
};

/** on_conflict condition type for table "public7.rm_projects" */
export type Public7_Rm_Projects_On_Conflict = {
  constraint: Public7_Rm_Projects_Constraint;
  update_columns?: Array<Public7_Rm_Projects_Update_Column>;
  where?: InputMaybe<Public7_Rm_Projects_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.rm_projects". */
export type Public7_Rm_Projects_Order_By = {
  ext_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.rm_projects */
export type Public7_Rm_Projects_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.rm_projects" */
export enum Public7_Rm_Projects_Select_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public7.rm_projects" */
export type Public7_Rm_Projects_Set_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Public7_Rm_Projects_Stddev_Fields = {
  __typename?: 'public7_rm_projects_stddev_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public7_Rm_Projects_Stddev_Pop_Fields = {
  __typename?: 'public7_rm_projects_stddev_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public7_Rm_Projects_Stddev_Samp_Fields = {
  __typename?: 'public7_rm_projects_stddev_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public7_rm_projects" */
export type Public7_Rm_Projects_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Rm_Projects_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Rm_Projects_Stream_Cursor_Value_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Public7_Rm_Projects_Sum_Fields = {
  __typename?: 'public7_rm_projects_sum_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public7.rm_projects" */
export enum Public7_Rm_Projects_Update_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public7_Rm_Projects_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public7_Rm_Projects_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Rm_Projects_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Rm_Projects_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public7_Rm_Projects_Var_Pop_Fields = {
  __typename?: 'public7_rm_projects_var_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public7_Rm_Projects_Var_Samp_Fields = {
  __typename?: 'public7_rm_projects_var_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public7_Rm_Projects_Variance_Fields = {
  __typename?: 'public7_rm_projects_variance_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public7.rm_tasks" */
export type Public7_Rm_Tasks = {
  __typename?: 'public7_rm_tasks';
  ext_id: Scalars['Int']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  project_id: Scalars['uuid']['output'];
  status: Scalars['String']['output'];
};

/** aggregated selection of "public7.rm_tasks" */
export type Public7_Rm_Tasks_Aggregate = {
  __typename?: 'public7_rm_tasks_aggregate';
  aggregate?: Maybe<Public7_Rm_Tasks_Aggregate_Fields>;
  nodes: Array<Public7_Rm_Tasks>;
};

/** aggregate fields of "public7.rm_tasks" */
export type Public7_Rm_Tasks_Aggregate_Fields = {
  __typename?: 'public7_rm_tasks_aggregate_fields';
  avg?: Maybe<Public7_Rm_Tasks_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Rm_Tasks_Max_Fields>;
  min?: Maybe<Public7_Rm_Tasks_Min_Fields>;
  stddev?: Maybe<Public7_Rm_Tasks_Stddev_Fields>;
  stddev_pop?: Maybe<Public7_Rm_Tasks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Public7_Rm_Tasks_Stddev_Samp_Fields>;
  sum?: Maybe<Public7_Rm_Tasks_Sum_Fields>;
  var_pop?: Maybe<Public7_Rm_Tasks_Var_Pop_Fields>;
  var_samp?: Maybe<Public7_Rm_Tasks_Var_Samp_Fields>;
  variance?: Maybe<Public7_Rm_Tasks_Variance_Fields>;
};

/** aggregate fields of "public7.rm_tasks" */
export type Public7_Rm_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Rm_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Public7_Rm_Tasks_Avg_Fields = {
  __typename?: 'public7_rm_tasks_avg_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "public7.rm_tasks". All fields are combined with a logical 'AND'. */
export type Public7_Rm_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Rm_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public7_Rm_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Rm_Tasks_Bool_Exp>>;
  ext_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.rm_tasks" */
export enum Public7_Rm_Tasks_Constraint {
  /** unique or primary key constraint on columns "ext_id" */
  RmTasksExtIdKey = 'rm_tasks_ext_id_key',
  /** unique or primary key constraint on columns "id" */
  RmTasksPkey = 'rm_tasks_pkey',
}

/** input type for incrementing numeric columns in table "public7.rm_tasks" */
export type Public7_Rm_Tasks_Inc_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "public7.rm_tasks" */
export type Public7_Rm_Tasks_Insert_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Rm_Tasks_Max_Fields = {
  __typename?: 'public7_rm_tasks_max_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Rm_Tasks_Min_Fields = {
  __typename?: 'public7_rm_tasks_min_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.rm_tasks" */
export type Public7_Rm_Tasks_Mutation_Response = {
  __typename?: 'public7_rm_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Rm_Tasks>;
};

/** on_conflict condition type for table "public7.rm_tasks" */
export type Public7_Rm_Tasks_On_Conflict = {
  constraint: Public7_Rm_Tasks_Constraint;
  update_columns?: Array<Public7_Rm_Tasks_Update_Column>;
  where?: InputMaybe<Public7_Rm_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.rm_tasks". */
export type Public7_Rm_Tasks_Order_By = {
  ext_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.rm_tasks */
export type Public7_Rm_Tasks_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.rm_tasks" */
export enum Public7_Rm_Tasks_Select_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  Status = 'status',
}

/** input type for updating data in table "public7.rm_tasks" */
export type Public7_Rm_Tasks_Set_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Public7_Rm_Tasks_Stddev_Fields = {
  __typename?: 'public7_rm_tasks_stddev_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Public7_Rm_Tasks_Stddev_Pop_Fields = {
  __typename?: 'public7_rm_tasks_stddev_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Public7_Rm_Tasks_Stddev_Samp_Fields = {
  __typename?: 'public7_rm_tasks_stddev_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "public7_rm_tasks" */
export type Public7_Rm_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Rm_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Rm_Tasks_Stream_Cursor_Value_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Public7_Rm_Tasks_Sum_Fields = {
  __typename?: 'public7_rm_tasks_sum_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "public7.rm_tasks" */
export enum Public7_Rm_Tasks_Update_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  Status = 'status',
}

export type Public7_Rm_Tasks_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Public7_Rm_Tasks_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Rm_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Rm_Tasks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Public7_Rm_Tasks_Var_Pop_Fields = {
  __typename?: 'public7_rm_tasks_var_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Public7_Rm_Tasks_Var_Samp_Fields = {
  __typename?: 'public7_rm_tasks_var_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Public7_Rm_Tasks_Variance_Fields = {
  __typename?: 'public7_rm_tasks_variance_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "public7.roles" */
export type Public7_Roles = {
  __typename?: 'public7_roles';
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "public7.roles" */
export type Public7_Roles_Aggregate = {
  __typename?: 'public7_roles_aggregate';
  aggregate?: Maybe<Public7_Roles_Aggregate_Fields>;
  nodes: Array<Public7_Roles>;
};

/** aggregate fields of "public7.roles" */
export type Public7_Roles_Aggregate_Fields = {
  __typename?: 'public7_roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Roles_Max_Fields>;
  min?: Maybe<Public7_Roles_Min_Fields>;
};

/** aggregate fields of "public7.roles" */
export type Public7_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.roles". All fields are combined with a logical 'AND'. */
export type Public7_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Roles_Bool_Exp>>;
  _not?: InputMaybe<Public7_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.roles" */
export enum Public7_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  RolesPkey = 'roles_pkey',
  /** unique or primary key constraint on columns "role" */
  RolesRoleKey = 'roles_role_key',
}

/** input type for inserting data into table "public7.roles" */
export type Public7_Roles_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Roles_Max_Fields = {
  __typename?: 'public7_roles_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Roles_Min_Fields = {
  __typename?: 'public7_roles_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.roles" */
export type Public7_Roles_Mutation_Response = {
  __typename?: 'public7_roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Roles>;
};

/** on_conflict condition type for table "public7.roles" */
export type Public7_Roles_On_Conflict = {
  constraint: Public7_Roles_Constraint;
  update_columns?: Array<Public7_Roles_Update_Column>;
  where?: InputMaybe<Public7_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.roles". */
export type Public7_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.roles */
export type Public7_Roles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.roles" */
export enum Public7_Roles_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

/** input type for updating data in table "public7.roles" */
export type Public7_Roles_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_roles" */
export type Public7_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.roles" */
export enum Public7_Roles_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
}

export type Public7_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Roles_Bool_Exp;
};

/** columns and relationships of "public7.time_works" */
export type Public7_Time_Works = {
  __typename?: 'public7_time_works';
  end_at: Scalars['timestamptz']['output'];
  id: Scalars['uuid']['output'];
  start_at: Scalars['timestamptz']['output'];
};

/** aggregated selection of "public7.time_works" */
export type Public7_Time_Works_Aggregate = {
  __typename?: 'public7_time_works_aggregate';
  aggregate?: Maybe<Public7_Time_Works_Aggregate_Fields>;
  nodes: Array<Public7_Time_Works>;
};

/** aggregate fields of "public7.time_works" */
export type Public7_Time_Works_Aggregate_Fields = {
  __typename?: 'public7_time_works_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Time_Works_Max_Fields>;
  min?: Maybe<Public7_Time_Works_Min_Fields>;
};

/** aggregate fields of "public7.time_works" */
export type Public7_Time_Works_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Time_Works_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.time_works". All fields are combined with a logical 'AND'. */
export type Public7_Time_Works_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Time_Works_Bool_Exp>>;
  _not?: InputMaybe<Public7_Time_Works_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Time_Works_Bool_Exp>>;
  end_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  start_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.time_works" */
export enum Public7_Time_Works_Constraint {
  /** unique or primary key constraint on columns "id" */
  TimeWorksPkey = 'time_works_pkey',
}

/** input type for inserting data into table "public7.time_works" */
export type Public7_Time_Works_Insert_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Public7_Time_Works_Max_Fields = {
  __typename?: 'public7_time_works_max_fields';
  end_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Public7_Time_Works_Min_Fields = {
  __typename?: 'public7_time_works_min_fields';
  end_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "public7.time_works" */
export type Public7_Time_Works_Mutation_Response = {
  __typename?: 'public7_time_works_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Time_Works>;
};

/** on_conflict condition type for table "public7.time_works" */
export type Public7_Time_Works_On_Conflict = {
  constraint: Public7_Time_Works_Constraint;
  update_columns?: Array<Public7_Time_Works_Update_Column>;
  where?: InputMaybe<Public7_Time_Works_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.time_works". */
export type Public7_Time_Works_Order_By = {
  end_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.time_works */
export type Public7_Time_Works_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.time_works" */
export enum Public7_Time_Works_Select_Column {
  /** column name */
  EndAt = 'end_at',
  /** column name */
  Id = 'id',
  /** column name */
  StartAt = 'start_at',
}

/** input type for updating data in table "public7.time_works" */
export type Public7_Time_Works_Set_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "public7_time_works" */
export type Public7_Time_Works_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Time_Works_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Time_Works_Stream_Cursor_Value_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "public7.time_works" */
export enum Public7_Time_Works_Update_Column {
  /** column name */
  EndAt = 'end_at',
  /** column name */
  Id = 'id',
  /** column name */
  StartAt = 'start_at',
}

export type Public7_Time_Works_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Time_Works_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Time_Works_Bool_Exp;
};

/** columns and relationships of "public7.user_groups" */
export type Public7_User_Groups = {
  __typename?: 'public7_user_groups';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public7.user_groups" */
export type Public7_User_Groups_Aggregate = {
  __typename?: 'public7_user_groups_aggregate';
  aggregate?: Maybe<Public7_User_Groups_Aggregate_Fields>;
  nodes: Array<Public7_User_Groups>;
};

/** aggregate fields of "public7.user_groups" */
export type Public7_User_Groups_Aggregate_Fields = {
  __typename?: 'public7_user_groups_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_User_Groups_Max_Fields>;
  min?: Maybe<Public7_User_Groups_Min_Fields>;
};

/** aggregate fields of "public7.user_groups" */
export type Public7_User_Groups_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_User_Groups_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.user_groups". All fields are combined with a logical 'AND'. */
export type Public7_User_Groups_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_User_Groups_Bool_Exp>>;
  _not?: InputMaybe<Public7_User_Groups_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_User_Groups_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.user_groups" */
export enum Public7_User_Groups_Constraint {
  /** unique or primary key constraint on columns "name" */
  UserGroupsNameKey = 'user_groups_name_key',
  /** unique or primary key constraint on columns "id" */
  UserGroupsPkey = 'user_groups_pkey',
}

/** input type for inserting data into table "public7.user_groups" */
export type Public7_User_Groups_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_User_Groups_Max_Fields = {
  __typename?: 'public7_user_groups_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_User_Groups_Min_Fields = {
  __typename?: 'public7_user_groups_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.user_groups" */
export type Public7_User_Groups_Mutation_Response = {
  __typename?: 'public7_user_groups_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_User_Groups>;
};

/** on_conflict condition type for table "public7.user_groups" */
export type Public7_User_Groups_On_Conflict = {
  constraint: Public7_User_Groups_Constraint;
  update_columns?: Array<Public7_User_Groups_Update_Column>;
  where?: InputMaybe<Public7_User_Groups_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.user_groups". */
export type Public7_User_Groups_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.user_groups */
export type Public7_User_Groups_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.user_groups" */
export enum Public7_User_Groups_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public7.user_groups" */
export type Public7_User_Groups_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_user_groups" */
export type Public7_User_Groups_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_User_Groups_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_User_Groups_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.user_groups" */
export enum Public7_User_Groups_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public7_User_Groups_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_User_Groups_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_User_Groups_Bool_Exp;
};

/** columns and relationships of "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks = {
  __typename?: 'public7_user_planned_tasks';
  task_id: Scalars['uuid']['output'];
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks_Aggregate = {
  __typename?: 'public7_user_planned_tasks_aggregate';
  aggregate?: Maybe<Public7_User_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<Public7_User_Planned_Tasks>;
};

/** aggregate fields of "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'public7_user_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_User_Planned_Tasks_Max_Fields>;
  min?: Maybe<Public7_User_Planned_Tasks_Min_Fields>;
};

/** aggregate fields of "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_User_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.user_planned_tasks". All fields are combined with a logical 'AND'. */
export type Public7_User_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_User_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Public7_User_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_User_Planned_Tasks_Bool_Exp>>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.user_planned_tasks" */
export enum Public7_User_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "user_id", "task_id" */
  UserPlannedTasksPkey = 'user_planned_tasks_pkey',
}

/** input type for inserting data into table "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks_Insert_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Public7_User_Planned_Tasks_Max_Fields = {
  __typename?: 'public7_user_planned_tasks_max_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Public7_User_Planned_Tasks_Min_Fields = {
  __typename?: 'public7_user_planned_tasks_min_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks_Mutation_Response = {
  __typename?: 'public7_user_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_User_Planned_Tasks>;
};

/** on_conflict condition type for table "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks_On_Conflict = {
  constraint: Public7_User_Planned_Tasks_Constraint;
  update_columns?: Array<Public7_User_Planned_Tasks_Update_Column>;
  where?: InputMaybe<Public7_User_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.user_planned_tasks". */
export type Public7_User_Planned_Tasks_Order_By = {
  task_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.user_planned_tasks */
export type Public7_User_Planned_Tasks_Pk_Columns_Input = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

/** select columns of table "public7.user_planned_tasks" */
export enum Public7_User_Planned_Tasks_Select_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id',
}

/** input type for updating data in table "public7.user_planned_tasks" */
export type Public7_User_Planned_Tasks_Set_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "public7_user_planned_tasks" */
export type Public7_User_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_User_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_User_Planned_Tasks_Stream_Cursor_Value_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "public7.user_planned_tasks" */
export enum Public7_User_Planned_Tasks_Update_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id',
}

export type Public7_User_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_User_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_User_Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "public7.users" */
export type Public7_Users = {
  __typename?: 'public7_users';
  email: Scalars['String']['output'];
  first_name: Scalars['String']['output'];
  group_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  is_active: Scalars['Boolean']['output'];
  last_name: Scalars['String']['output'];
  middle_name: Scalars['String']['output'];
  name: Scalars['String']['output'];
  role_id: Scalars['uuid']['output'];
  time_zone: Scalars['String']['output'];
};

/** aggregated selection of "public7.users" */
export type Public7_Users_Aggregate = {
  __typename?: 'public7_users_aggregate';
  aggregate?: Maybe<Public7_Users_Aggregate_Fields>;
  nodes: Array<Public7_Users>;
};

/** aggregate fields of "public7.users" */
export type Public7_Users_Aggregate_Fields = {
  __typename?: 'public7_users_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Users_Max_Fields>;
  min?: Maybe<Public7_Users_Min_Fields>;
};

/** aggregate fields of "public7.users" */
export type Public7_Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.users". All fields are combined with a logical 'AND'. */
export type Public7_Users_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Users_Bool_Exp>>;
  _not?: InputMaybe<Public7_Users_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Users_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  middle_name?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  time_zone?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.users" */
export enum Public7_Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey',
}

/** input type for inserting data into table "public7.users" */
export type Public7_Users_Insert_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Users_Max_Fields = {
  __typename?: 'public7_users_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  group_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Users_Min_Fields = {
  __typename?: 'public7_users_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  group_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.users" */
export type Public7_Users_Mutation_Response = {
  __typename?: 'public7_users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Users>;
};

/** on_conflict condition type for table "public7.users" */
export type Public7_Users_On_Conflict = {
  constraint: Public7_Users_Constraint;
  update_columns?: Array<Public7_Users_Update_Column>;
  where?: InputMaybe<Public7_Users_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.users". */
export type Public7_Users_Order_By = {
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  time_zone?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.users */
export type Public7_Users_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.users" */
export enum Public7_Users_Select_Column {
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  LastName = 'last_name',
  /** column name */
  MiddleName = 'middle_name',
  /** column name */
  Name = 'name',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  TimeZone = 'time_zone',
}

/** input type for updating data in table "public7.users" */
export type Public7_Users_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_users" */
export type Public7_Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Users_Stream_Cursor_Value_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.users" */
export enum Public7_Users_Update_Column {
  /** column name */
  Email = 'email',
  /** column name */
  FirstName = 'first_name',
  /** column name */
  GroupId = 'group_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsActive = 'is_active',
  /** column name */
  LastName = 'last_name',
  /** column name */
  MiddleName = 'middle_name',
  /** column name */
  Name = 'name',
  /** column name */
  RoleId = 'role_id',
  /** column name */
  TimeZone = 'time_zone',
}

export type Public7_Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Users_Bool_Exp;
};

/** columns and relationships of "public7.vendors" */
export type Public7_Vendors = {
  __typename?: 'public7_vendors';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "public7.vendors" */
export type Public7_Vendors_Aggregate = {
  __typename?: 'public7_vendors_aggregate';
  aggregate?: Maybe<Public7_Vendors_Aggregate_Fields>;
  nodes: Array<Public7_Vendors>;
};

/** aggregate fields of "public7.vendors" */
export type Public7_Vendors_Aggregate_Fields = {
  __typename?: 'public7_vendors_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Public7_Vendors_Max_Fields>;
  min?: Maybe<Public7_Vendors_Min_Fields>;
};

/** aggregate fields of "public7.vendors" */
export type Public7_Vendors_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Public7_Vendors_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "public7.vendors". All fields are combined with a logical 'AND'. */
export type Public7_Vendors_Bool_Exp = {
  _and?: InputMaybe<Array<Public7_Vendors_Bool_Exp>>;
  _not?: InputMaybe<Public7_Vendors_Bool_Exp>;
  _or?: InputMaybe<Array<Public7_Vendors_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "public7.vendors" */
export enum Public7_Vendors_Constraint {
  /** unique or primary key constraint on columns "name" */
  VendorsNameKey = 'vendors_name_key',
  /** unique or primary key constraint on columns "id" */
  VendorsPkey = 'vendors_pkey',
}

/** input type for inserting data into table "public7.vendors" */
export type Public7_Vendors_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Public7_Vendors_Max_Fields = {
  __typename?: 'public7_vendors_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Public7_Vendors_Min_Fields = {
  __typename?: 'public7_vendors_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "public7.vendors" */
export type Public7_Vendors_Mutation_Response = {
  __typename?: 'public7_vendors_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Public7_Vendors>;
};

/** on_conflict condition type for table "public7.vendors" */
export type Public7_Vendors_On_Conflict = {
  constraint: Public7_Vendors_Constraint;
  update_columns?: Array<Public7_Vendors_Update_Column>;
  where?: InputMaybe<Public7_Vendors_Bool_Exp>;
};

/** Ordering options when selecting data from "public7.vendors". */
export type Public7_Vendors_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: public7.vendors */
export type Public7_Vendors_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "public7.vendors" */
export enum Public7_Vendors_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

/** input type for updating data in table "public7.vendors" */
export type Public7_Vendors_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "public7_vendors" */
export type Public7_Vendors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Public7_Vendors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Public7_Vendors_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "public7.vendors" */
export enum Public7_Vendors_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
}

export type Public7_Vendors_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Public7_Vendors_Set_Input>;
  /** filter the rows which have to be updated */
  where: Public7_Vendors_Bool_Exp;
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
  /** fetch data from the table: "public2.apartment" */
  public2_apartment: Array<Public2_Apartment>;
  /** fetch aggregated fields from the table: "public2.apartment" */
  public2_apartment_aggregate: Public2_Apartment_Aggregate;
  /** fetch data from the table: "public2.apartment" using primary key columns */
  public2_apartment_by_pk?: Maybe<Public2_Apartment>;
  /** fetch data from the table: "public2.branch" */
  public2_branch: Array<Public2_Branch>;
  /** fetch aggregated fields from the table: "public2.branch" */
  public2_branch_aggregate: Public2_Branch_Aggregate;
  /** fetch data from the table: "public2.branch" using primary key columns */
  public2_branch_by_pk?: Maybe<Public2_Branch>;
  /** fetch data from the table: "public2.city" */
  public2_city: Array<Public2_City>;
  /** fetch aggregated fields from the table: "public2.city" */
  public2_city_aggregate: Public2_City_Aggregate;
  /** fetch data from the table: "public2.city" using primary key columns */
  public2_city_by_pk?: Maybe<Public2_City>;
  /** fetch data from the table: "public2.equipment" */
  public2_equipment: Array<Public2_Equipment>;
  /** fetch aggregated fields from the table: "public2.equipment" */
  public2_equipment_aggregate: Public2_Equipment_Aggregate;
  /** fetch data from the table: "public2.equipment" using primary key columns */
  public2_equipment_by_pk?: Maybe<Public2_Equipment>;
  /** fetch data from the table: "public2.house" */
  public2_house: Array<Public2_House>;
  /** fetch aggregated fields from the table: "public2.house" */
  public2_house_aggregate: Public2_House_Aggregate;
  /** fetch data from the table: "public2.house" using primary key columns */
  public2_house_by_pk?: Maybe<Public2_House>;
  /** fetch data from the table: "public2.planned_task" */
  public2_planned_task: Array<Public2_Planned_Task>;
  /** fetch aggregated fields from the table: "public2.planned_task" */
  public2_planned_task_aggregate: Public2_Planned_Task_Aggregate;
  /** fetch data from the table: "public2.planned_task" using primary key columns */
  public2_planned_task_by_pk?: Maybe<Public2_Planned_Task>;
  /** fetch data from the table: "public2.planned_tasks" */
  public2_planned_tasks: Array<Public2_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public2.planned_tasks" */
  public2_planned_tasks_aggregate: Public2_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public2.planned_tasks" using primary key columns */
  public2_planned_tasks_by_pk?: Maybe<Public2_Planned_Tasks>;
  /** fetch data from the table: "public2.provider" */
  public2_provider: Array<Public2_Provider>;
  /** fetch aggregated fields from the table: "public2.provider" */
  public2_provider_aggregate: Public2_Provider_Aggregate;
  /** fetch data from the table: "public2.provider" using primary key columns */
  public2_provider_by_pk?: Maybe<Public2_Provider>;
  /** fetch data from the table: "public2.role" */
  public2_role: Array<Public2_Role>;
  /** fetch aggregated fields from the table: "public2.role" */
  public2_role_aggregate: Public2_Role_Aggregate;
  /** fetch data from the table: "public2.role" using primary key columns */
  public2_role_by_pk?: Maybe<Public2_Role>;
  /** fetch data from the table: "public2.street" */
  public2_street: Array<Public2_Street>;
  /** fetch aggregated fields from the table: "public2.street" */
  public2_street_aggregate: Public2_Street_Aggregate;
  /** fetch data from the table: "public2.street" using primary key columns */
  public2_street_by_pk?: Maybe<Public2_Street>;
  /** fetch data from the table: "public2.time_work" */
  public2_time_work: Array<Public2_Time_Work>;
  /** fetch aggregated fields from the table: "public2.time_work" */
  public2_time_work_aggregate: Public2_Time_Work_Aggregate;
  /** fetch data from the table: "public2.time_work" using primary key columns */
  public2_time_work_by_pk?: Maybe<Public2_Time_Work>;
  /** fetch data from the table: "public2.user" */
  public2_user: Array<Public2_User>;
  /** fetch aggregated fields from the table: "public2.user" */
  public2_user_aggregate: Public2_User_Aggregate;
  /** fetch data from the table: "public2.user" using primary key columns */
  public2_user_by_pk?: Maybe<Public2_User>;
  /** fetch data from the table: "public3.branches" */
  public3_branches: Array<Public3_Branches>;
  /** fetch aggregated fields from the table: "public3.branches" */
  public3_branches_aggregate: Public3_Branches_Aggregate;
  /** fetch data from the table: "public3.branches" using primary key columns */
  public3_branches_by_pk?: Maybe<Public3_Branches>;
  /** fetch data from the table: "public3.cities" */
  public3_cities: Array<Public3_Cities>;
  /** fetch aggregated fields from the table: "public3.cities" */
  public3_cities_aggregate: Public3_Cities_Aggregate;
  /** fetch data from the table: "public3.cities" using primary key columns */
  public3_cities_by_pk?: Maybe<Public3_Cities>;
  /** fetch data from the table: "public3.equipments" */
  public3_equipments: Array<Public3_Equipments>;
  /** fetch aggregated fields from the table: "public3.equipments" */
  public3_equipments_aggregate: Public3_Equipments_Aggregate;
  /** fetch data from the table: "public3.equipments" using primary key columns */
  public3_equipments_by_pk?: Maybe<Public3_Equipments>;
  /** fetch data from the table: "public3.nodes" */
  public3_nodes: Array<Public3_Nodes>;
  /** fetch aggregated fields from the table: "public3.nodes" */
  public3_nodes_aggregate: Public3_Nodes_Aggregate;
  /** fetch data from the table: "public3.nodes" using primary key columns */
  public3_nodes_by_pk?: Maybe<Public3_Nodes>;
  /** fetch data from the table: "public3.planned_tasks" */
  public3_planned_tasks: Array<Public3_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public3.planned_tasks" */
  public3_planned_tasks_aggregate: Public3_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public3.planned_tasks" using primary key columns */
  public3_planned_tasks_by_pk?: Maybe<Public3_Planned_Tasks>;
  /** fetch data from the table: "public3.planned_tasks_equipments" */
  public3_planned_tasks_equipments: Array<Public3_Planned_Tasks_Equipments>;
  /** fetch aggregated fields from the table: "public3.planned_tasks_equipments" */
  public3_planned_tasks_equipments_aggregate: Public3_Planned_Tasks_Equipments_Aggregate;
  /** fetch data from the table: "public3.planned_tasks_equipments" using primary key columns */
  public3_planned_tasks_equipments_by_pk?: Maybe<Public3_Planned_Tasks_Equipments>;
  /** fetch data from the table: "public3.providers" */
  public3_providers: Array<Public3_Providers>;
  /** fetch aggregated fields from the table: "public3.providers" */
  public3_providers_aggregate: Public3_Providers_Aggregate;
  /** fetch data from the table: "public3.providers" using primary key columns */
  public3_providers_by_pk?: Maybe<Public3_Providers>;
  /** fetch data from the table: "public3.roles" */
  public3_roles: Array<Public3_Roles>;
  /** fetch aggregated fields from the table: "public3.roles" */
  public3_roles_aggregate: Public3_Roles_Aggregate;
  /** fetch data from the table: "public3.roles" using primary key columns */
  public3_roles_by_pk?: Maybe<Public3_Roles>;
  /** fetch data from the table: "public3.time_works" */
  public3_time_works: Array<Public3_Time_Works>;
  /** fetch aggregated fields from the table: "public3.time_works" */
  public3_time_works_aggregate: Public3_Time_Works_Aggregate;
  /** fetch data from the table: "public3.time_works" using primary key columns */
  public3_time_works_by_pk?: Maybe<Public3_Time_Works>;
  /** fetch data from the table: "public3.user_planned_tasks" */
  public3_user_planned_tasks: Array<Public3_User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public3.user_planned_tasks" */
  public3_user_planned_tasks_aggregate: Public3_User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public3.user_planned_tasks" using primary key columns */
  public3_user_planned_tasks_by_pk?: Maybe<Public3_User_Planned_Tasks>;
  /** fetch data from the table: "public3.users" */
  public3_users: Array<Public3_Users>;
  /** fetch aggregated fields from the table: "public3.users" */
  public3_users_aggregate: Public3_Users_Aggregate;
  /** fetch data from the table: "public3.users" using primary key columns */
  public3_users_by_pk?: Maybe<Public3_Users>;
  /** fetch data from the table: "public6.branches" */
  public6_branches: Array<Public6_Branches>;
  /** fetch aggregated fields from the table: "public6.branches" */
  public6_branches_aggregate: Public6_Branches_Aggregate;
  /** fetch data from the table: "public6.branches" using primary key columns */
  public6_branches_by_pk?: Maybe<Public6_Branches>;
  /** fetch data from the table: "public6.cities" */
  public6_cities: Array<Public6_Cities>;
  /** fetch aggregated fields from the table: "public6.cities" */
  public6_cities_aggregate: Public6_Cities_Aggregate;
  /** fetch data from the table: "public6.cities" using primary key columns */
  public6_cities_by_pk?: Maybe<Public6_Cities>;
  /** fetch data from the table: "public6.device_models" */
  public6_device_models: Array<Public6_Device_Models>;
  /** fetch aggregated fields from the table: "public6.device_models" */
  public6_device_models_aggregate: Public6_Device_Models_Aggregate;
  /** fetch data from the table: "public6.device_models" using primary key columns */
  public6_device_models_by_pk?: Maybe<Public6_Device_Models>;
  /** fetch data from the table: "public6.device_roles" */
  public6_device_roles: Array<Public6_Device_Roles>;
  /** fetch aggregated fields from the table: "public6.device_roles" */
  public6_device_roles_aggregate: Public6_Device_Roles_Aggregate;
  /** fetch data from the table: "public6.device_roles" using primary key columns */
  public6_device_roles_by_pk?: Maybe<Public6_Device_Roles>;
  /** fetch data from the table: "public6.devices" */
  public6_devices: Array<Public6_Devices>;
  /** fetch aggregated fields from the table: "public6.devices" */
  public6_devices_aggregate: Public6_Devices_Aggregate;
  /** fetch data from the table: "public6.devices" using primary key columns */
  public6_devices_by_pk?: Maybe<Public6_Devices>;
  /** fetch data from the table: "public6.nodes" */
  public6_nodes: Array<Public6_Nodes>;
  /** fetch aggregated fields from the table: "public6.nodes" */
  public6_nodes_aggregate: Public6_Nodes_Aggregate;
  /** fetch data from the table: "public6.nodes" using primary key columns */
  public6_nodes_by_pk?: Maybe<Public6_Nodes>;
  /** fetch data from the table: "public6.planned_tasks" */
  public6_planned_tasks: Array<Public6_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public6.planned_tasks" */
  public6_planned_tasks_aggregate: Public6_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public6.planned_tasks" using primary key columns */
  public6_planned_tasks_by_pk?: Maybe<Public6_Planned_Tasks>;
  /** fetch data from the table: "public6.planned_tasks_devices" */
  public6_planned_tasks_devices: Array<Public6_Planned_Tasks_Devices>;
  /** fetch aggregated fields from the table: "public6.planned_tasks_devices" */
  public6_planned_tasks_devices_aggregate: Public6_Planned_Tasks_Devices_Aggregate;
  /** fetch data from the table: "public6.planned_tasks_devices" using primary key columns */
  public6_planned_tasks_devices_by_pk?: Maybe<Public6_Planned_Tasks_Devices>;
  /** fetch data from the table: "public6.providers" */
  public6_providers: Array<Public6_Providers>;
  /** fetch aggregated fields from the table: "public6.providers" */
  public6_providers_aggregate: Public6_Providers_Aggregate;
  /** fetch data from the table: "public6.providers" using primary key columns */
  public6_providers_by_pk?: Maybe<Public6_Providers>;
  /** fetch data from the table: "public6.rm_projects" */
  public6_rm_projects: Array<Public6_Rm_Projects>;
  /** fetch aggregated fields from the table: "public6.rm_projects" */
  public6_rm_projects_aggregate: Public6_Rm_Projects_Aggregate;
  /** fetch data from the table: "public6.rm_projects" using primary key columns */
  public6_rm_projects_by_pk?: Maybe<Public6_Rm_Projects>;
  /** fetch data from the table: "public6.rm_tasks" */
  public6_rm_tasks: Array<Public6_Rm_Tasks>;
  /** fetch aggregated fields from the table: "public6.rm_tasks" */
  public6_rm_tasks_aggregate: Public6_Rm_Tasks_Aggregate;
  /** fetch data from the table: "public6.rm_tasks" using primary key columns */
  public6_rm_tasks_by_pk?: Maybe<Public6_Rm_Tasks>;
  /** fetch data from the table: "public6.roles" */
  public6_roles: Array<Public6_Roles>;
  /** fetch aggregated fields from the table: "public6.roles" */
  public6_roles_aggregate: Public6_Roles_Aggregate;
  /** fetch data from the table: "public6.roles" using primary key columns */
  public6_roles_by_pk?: Maybe<Public6_Roles>;
  /** fetch data from the table: "public6.time_works" */
  public6_time_works: Array<Public6_Time_Works>;
  /** fetch aggregated fields from the table: "public6.time_works" */
  public6_time_works_aggregate: Public6_Time_Works_Aggregate;
  /** fetch data from the table: "public6.time_works" using primary key columns */
  public6_time_works_by_pk?: Maybe<Public6_Time_Works>;
  /** fetch data from the table: "public6.user_groups" */
  public6_user_groups: Array<Public6_User_Groups>;
  /** fetch aggregated fields from the table: "public6.user_groups" */
  public6_user_groups_aggregate: Public6_User_Groups_Aggregate;
  /** fetch data from the table: "public6.user_groups" using primary key columns */
  public6_user_groups_by_pk?: Maybe<Public6_User_Groups>;
  /** fetch data from the table: "public6.user_planned_tasks" */
  public6_user_planned_tasks: Array<Public6_User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public6.user_planned_tasks" */
  public6_user_planned_tasks_aggregate: Public6_User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public6.user_planned_tasks" using primary key columns */
  public6_user_planned_tasks_by_pk?: Maybe<Public6_User_Planned_Tasks>;
  /** fetch data from the table: "public6.users" */
  public6_users: Array<Public6_Users>;
  /** fetch aggregated fields from the table: "public6.users" */
  public6_users_aggregate: Public6_Users_Aggregate;
  /** fetch data from the table: "public6.users" using primary key columns */
  public6_users_by_pk?: Maybe<Public6_Users>;
  /** fetch data from the table: "public6.vendors" */
  public6_vendors: Array<Public6_Vendors>;
  /** fetch aggregated fields from the table: "public6.vendors" */
  public6_vendors_aggregate: Public6_Vendors_Aggregate;
  /** fetch data from the table: "public6.vendors" using primary key columns */
  public6_vendors_by_pk?: Maybe<Public6_Vendors>;
  /** fetch data from the table: "public7.branches" */
  public7_branches: Array<Public7_Branches>;
  /** fetch aggregated fields from the table: "public7.branches" */
  public7_branches_aggregate: Public7_Branches_Aggregate;
  /** fetch data from the table: "public7.branches" using primary key columns */
  public7_branches_by_pk?: Maybe<Public7_Branches>;
  /** fetch data from the table: "public7.cities" */
  public7_cities: Array<Public7_Cities>;
  /** fetch aggregated fields from the table: "public7.cities" */
  public7_cities_aggregate: Public7_Cities_Aggregate;
  /** fetch data from the table: "public7.cities" using primary key columns */
  public7_cities_by_pk?: Maybe<Public7_Cities>;
  /** fetch data from the table: "public7.device_models" */
  public7_device_models: Array<Public7_Device_Models>;
  /** fetch aggregated fields from the table: "public7.device_models" */
  public7_device_models_aggregate: Public7_Device_Models_Aggregate;
  /** fetch data from the table: "public7.device_models" using primary key columns */
  public7_device_models_by_pk?: Maybe<Public7_Device_Models>;
  /** fetch data from the table: "public7.device_roles" */
  public7_device_roles: Array<Public7_Device_Roles>;
  /** fetch aggregated fields from the table: "public7.device_roles" */
  public7_device_roles_aggregate: Public7_Device_Roles_Aggregate;
  /** fetch data from the table: "public7.device_roles" using primary key columns */
  public7_device_roles_by_pk?: Maybe<Public7_Device_Roles>;
  /** fetch data from the table: "public7.devices" */
  public7_devices: Array<Public7_Devices>;
  /** fetch aggregated fields from the table: "public7.devices" */
  public7_devices_aggregate: Public7_Devices_Aggregate;
  /** fetch data from the table: "public7.devices" using primary key columns */
  public7_devices_by_pk?: Maybe<Public7_Devices>;
  /** fetch data from the table: "public7.nodes" */
  public7_nodes: Array<Public7_Nodes>;
  /** fetch aggregated fields from the table: "public7.nodes" */
  public7_nodes_aggregate: Public7_Nodes_Aggregate;
  /** fetch data from the table: "public7.nodes" using primary key columns */
  public7_nodes_by_pk?: Maybe<Public7_Nodes>;
  /** fetch data from the table: "public7.planned_tasks" */
  public7_planned_tasks: Array<Public7_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public7.planned_tasks" */
  public7_planned_tasks_aggregate: Public7_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public7.planned_tasks" using primary key columns */
  public7_planned_tasks_by_pk?: Maybe<Public7_Planned_Tasks>;
  /** fetch data from the table: "public7.planned_tasks_devices" */
  public7_planned_tasks_devices: Array<Public7_Planned_Tasks_Devices>;
  /** fetch aggregated fields from the table: "public7.planned_tasks_devices" */
  public7_planned_tasks_devices_aggregate: Public7_Planned_Tasks_Devices_Aggregate;
  /** fetch data from the table: "public7.planned_tasks_devices" using primary key columns */
  public7_planned_tasks_devices_by_pk?: Maybe<Public7_Planned_Tasks_Devices>;
  /** fetch data from the table: "public7.providers" */
  public7_providers: Array<Public7_Providers>;
  /** fetch aggregated fields from the table: "public7.providers" */
  public7_providers_aggregate: Public7_Providers_Aggregate;
  /** fetch data from the table: "public7.providers" using primary key columns */
  public7_providers_by_pk?: Maybe<Public7_Providers>;
  /** fetch data from the table: "public7.rm_projects" */
  public7_rm_projects: Array<Public7_Rm_Projects>;
  /** fetch aggregated fields from the table: "public7.rm_projects" */
  public7_rm_projects_aggregate: Public7_Rm_Projects_Aggregate;
  /** fetch data from the table: "public7.rm_projects" using primary key columns */
  public7_rm_projects_by_pk?: Maybe<Public7_Rm_Projects>;
  /** fetch data from the table: "public7.rm_tasks" */
  public7_rm_tasks: Array<Public7_Rm_Tasks>;
  /** fetch aggregated fields from the table: "public7.rm_tasks" */
  public7_rm_tasks_aggregate: Public7_Rm_Tasks_Aggregate;
  /** fetch data from the table: "public7.rm_tasks" using primary key columns */
  public7_rm_tasks_by_pk?: Maybe<Public7_Rm_Tasks>;
  /** fetch data from the table: "public7.roles" */
  public7_roles: Array<Public7_Roles>;
  /** fetch aggregated fields from the table: "public7.roles" */
  public7_roles_aggregate: Public7_Roles_Aggregate;
  /** fetch data from the table: "public7.roles" using primary key columns */
  public7_roles_by_pk?: Maybe<Public7_Roles>;
  /** fetch data from the table: "public7.time_works" */
  public7_time_works: Array<Public7_Time_Works>;
  /** fetch aggregated fields from the table: "public7.time_works" */
  public7_time_works_aggregate: Public7_Time_Works_Aggregate;
  /** fetch data from the table: "public7.time_works" using primary key columns */
  public7_time_works_by_pk?: Maybe<Public7_Time_Works>;
  /** fetch data from the table: "public7.user_groups" */
  public7_user_groups: Array<Public7_User_Groups>;
  /** fetch aggregated fields from the table: "public7.user_groups" */
  public7_user_groups_aggregate: Public7_User_Groups_Aggregate;
  /** fetch data from the table: "public7.user_groups" using primary key columns */
  public7_user_groups_by_pk?: Maybe<Public7_User_Groups>;
  /** fetch data from the table: "public7.user_planned_tasks" */
  public7_user_planned_tasks: Array<Public7_User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public7.user_planned_tasks" */
  public7_user_planned_tasks_aggregate: Public7_User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public7.user_planned_tasks" using primary key columns */
  public7_user_planned_tasks_by_pk?: Maybe<Public7_User_Planned_Tasks>;
  /** fetch data from the table: "public7.users" */
  public7_users: Array<Public7_Users>;
  /** fetch aggregated fields from the table: "public7.users" */
  public7_users_aggregate: Public7_Users_Aggregate;
  /** fetch data from the table: "public7.users" using primary key columns */
  public7_users_by_pk?: Maybe<Public7_Users>;
  /** fetch data from the table: "public7.vendors" */
  public7_vendors: Array<Public7_Vendors>;
  /** fetch aggregated fields from the table: "public7.vendors" */
  public7_vendors_aggregate: Public7_Vendors_Aggregate;
  /** fetch data from the table: "public7.vendors" using primary key columns */
  public7_vendors_by_pk?: Maybe<Public7_Vendors>;
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

export type Query_RootPublic2_ApartmentArgs = {
  distinct_on?: InputMaybe<Array<Public2_Apartment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Apartment_Order_By>>;
  where?: InputMaybe<Public2_Apartment_Bool_Exp>;
};

export type Query_RootPublic2_Apartment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Apartment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Apartment_Order_By>>;
  where?: InputMaybe<Public2_Apartment_Bool_Exp>;
};

export type Query_RootPublic2_Apartment_By_PkArgs = {
  apartment_id: Scalars['String']['input'];
};

export type Query_RootPublic2_BranchArgs = {
  distinct_on?: InputMaybe<Array<Public2_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Branch_Order_By>>;
  where?: InputMaybe<Public2_Branch_Bool_Exp>;
};

export type Query_RootPublic2_Branch_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Branch_Order_By>>;
  where?: InputMaybe<Public2_Branch_Bool_Exp>;
};

export type Query_RootPublic2_Branch_By_PkArgs = {
  branch: Scalars['String']['input'];
};

export type Query_RootPublic2_CityArgs = {
  distinct_on?: InputMaybe<Array<Public2_City_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_City_Order_By>>;
  where?: InputMaybe<Public2_City_Bool_Exp>;
};

export type Query_RootPublic2_City_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_City_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_City_Order_By>>;
  where?: InputMaybe<Public2_City_Bool_Exp>;
};

export type Query_RootPublic2_City_By_PkArgs = {
  city: Scalars['String']['input'];
};

export type Query_RootPublic2_EquipmentArgs = {
  distinct_on?: InputMaybe<Array<Public2_Equipment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Equipment_Order_By>>;
  where?: InputMaybe<Public2_Equipment_Bool_Exp>;
};

export type Query_RootPublic2_Equipment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Equipment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Equipment_Order_By>>;
  where?: InputMaybe<Public2_Equipment_Bool_Exp>;
};

export type Query_RootPublic2_Equipment_By_PkArgs = {
  equipment_id: Scalars['String']['input'];
};

export type Query_RootPublic2_HouseArgs = {
  distinct_on?: InputMaybe<Array<Public2_House_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_House_Order_By>>;
  where?: InputMaybe<Public2_House_Bool_Exp>;
};

export type Query_RootPublic2_House_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_House_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_House_Order_By>>;
  where?: InputMaybe<Public2_House_Bool_Exp>;
};

export type Query_RootPublic2_House_By_PkArgs = {
  house_number: Scalars['String']['input'];
};

export type Query_RootPublic2_Planned_TaskArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Task_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Task_Order_By>>;
  where?: InputMaybe<Public2_Planned_Task_Bool_Exp>;
};

export type Query_RootPublic2_Planned_Task_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Task_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Task_Order_By>>;
  where?: InputMaybe<Public2_Planned_Task_Bool_Exp>;
};

export type Query_RootPublic2_Planned_Task_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
};

export type Query_RootPublic2_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public2_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic2_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public2_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic2_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
};

export type Query_RootPublic2_ProviderArgs = {
  distinct_on?: InputMaybe<Array<Public2_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Provider_Order_By>>;
  where?: InputMaybe<Public2_Provider_Bool_Exp>;
};

export type Query_RootPublic2_Provider_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Provider_Order_By>>;
  where?: InputMaybe<Public2_Provider_Bool_Exp>;
};

export type Query_RootPublic2_Provider_By_PkArgs = {
  provider: Scalars['String']['input'];
};

export type Query_RootPublic2_RoleArgs = {
  distinct_on?: InputMaybe<Array<Public2_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Role_Order_By>>;
  where?: InputMaybe<Public2_Role_Bool_Exp>;
};

export type Query_RootPublic2_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Role_Order_By>>;
  where?: InputMaybe<Public2_Role_Bool_Exp>;
};

export type Query_RootPublic2_Role_By_PkArgs = {
  role: Scalars['String']['input'];
};

export type Query_RootPublic2_StreetArgs = {
  distinct_on?: InputMaybe<Array<Public2_Street_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Street_Order_By>>;
  where?: InputMaybe<Public2_Street_Bool_Exp>;
};

export type Query_RootPublic2_Street_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Street_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Street_Order_By>>;
  where?: InputMaybe<Public2_Street_Bool_Exp>;
};

export type Query_RootPublic2_Street_By_PkArgs = {
  street_id: Scalars['String']['input'];
};

export type Query_RootPublic2_Time_WorkArgs = {
  distinct_on?: InputMaybe<Array<Public2_Time_Work_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Time_Work_Order_By>>;
  where?: InputMaybe<Public2_Time_Work_Bool_Exp>;
};

export type Query_RootPublic2_Time_Work_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Time_Work_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Time_Work_Order_By>>;
  where?: InputMaybe<Public2_Time_Work_Bool_Exp>;
};

export type Query_RootPublic2_Time_Work_By_PkArgs = {
  time_work_id: Scalars['uuid']['input'];
};

export type Query_RootPublic2_UserArgs = {
  distinct_on?: InputMaybe<Array<Public2_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_User_Order_By>>;
  where?: InputMaybe<Public2_User_Bool_Exp>;
};

export type Query_RootPublic2_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_User_Order_By>>;
  where?: InputMaybe<Public2_User_Bool_Exp>;
};

export type Query_RootPublic2_User_By_PkArgs = {
  number: Scalars['uuid']['input'];
};

export type Query_RootPublic3_BranchesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Branches_Order_By>>;
  where?: InputMaybe<Public3_Branches_Bool_Exp>;
};

export type Query_RootPublic3_Branches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Branches_Order_By>>;
  where?: InputMaybe<Public3_Branches_Bool_Exp>;
};

export type Query_RootPublic3_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_CitiesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Cities_Order_By>>;
  where?: InputMaybe<Public3_Cities_Bool_Exp>;
};

export type Query_RootPublic3_Cities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Cities_Order_By>>;
  where?: InputMaybe<Public3_Cities_Bool_Exp>;
};

export type Query_RootPublic3_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_EquipmentsArgs = {
  distinct_on?: InputMaybe<Array<Public3_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Equipments_Bool_Exp>;
};

export type Query_RootPublic3_Equipments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Equipments_Bool_Exp>;
};

export type Query_RootPublic3_Equipments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_NodesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Nodes_Order_By>>;
  where?: InputMaybe<Public3_Nodes_Bool_Exp>;
};

export type Query_RootPublic3_Nodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Nodes_Order_By>>;
  where?: InputMaybe<Public3_Nodes_Bool_Exp>;
};

export type Query_RootPublic3_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic3_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic3_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_Planned_Tasks_EquipmentsArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Equipments_Bool_Exp>;
};

export type Query_RootPublic3_Planned_Tasks_Equipments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Equipments_Bool_Exp>;
};

export type Query_RootPublic3_Planned_Tasks_Equipments_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Public3_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Providers_Order_By>>;
  where?: InputMaybe<Public3_Providers_Bool_Exp>;
};

export type Query_RootPublic3_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Providers_Order_By>>;
  where?: InputMaybe<Public3_Providers_Bool_Exp>;
};

export type Query_RootPublic3_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Roles_Order_By>>;
  where?: InputMaybe<Public3_Roles_Bool_Exp>;
};

export type Query_RootPublic3_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Roles_Order_By>>;
  where?: InputMaybe<Public3_Roles_Bool_Exp>;
};

export type Query_RootPublic3_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_Time_WorksArgs = {
  distinct_on?: InputMaybe<Array<Public3_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Time_Works_Order_By>>;
  where?: InputMaybe<Public3_Time_Works_Bool_Exp>;
};

export type Query_RootPublic3_Time_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Time_Works_Order_By>>;
  where?: InputMaybe<Public3_Time_Works_Bool_Exp>;
};

export type Query_RootPublic3_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_User_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public3_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_User_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic3_User_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_User_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic3_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

export type Query_RootPublic3_UsersArgs = {
  distinct_on?: InputMaybe<Array<Public3_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Users_Order_By>>;
  where?: InputMaybe<Public3_Users_Bool_Exp>;
};

export type Query_RootPublic3_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Users_Order_By>>;
  where?: InputMaybe<Public3_Users_Bool_Exp>;
};

export type Query_RootPublic3_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_BranchesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Branches_Order_By>>;
  where?: InputMaybe<Public6_Branches_Bool_Exp>;
};

export type Query_RootPublic6_Branches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Branches_Order_By>>;
  where?: InputMaybe<Public6_Branches_Bool_Exp>;
};

export type Query_RootPublic6_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_CitiesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Cities_Order_By>>;
  where?: InputMaybe<Public6_Cities_Bool_Exp>;
};

export type Query_RootPublic6_Cities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Cities_Order_By>>;
  where?: InputMaybe<Public6_Cities_Bool_Exp>;
};

export type Query_RootPublic6_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_Device_ModelsArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Models_Order_By>>;
  where?: InputMaybe<Public6_Device_Models_Bool_Exp>;
};

export type Query_RootPublic6_Device_Models_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Models_Order_By>>;
  where?: InputMaybe<Public6_Device_Models_Bool_Exp>;
};

export type Query_RootPublic6_Device_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_Device_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Roles_Order_By>>;
  where?: InputMaybe<Public6_Device_Roles_Bool_Exp>;
};

export type Query_RootPublic6_Device_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Roles_Order_By>>;
  where?: InputMaybe<Public6_Device_Roles_Bool_Exp>;
};

export type Query_RootPublic6_Device_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Devices_Order_By>>;
  where?: InputMaybe<Public6_Devices_Bool_Exp>;
};

export type Query_RootPublic6_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Devices_Order_By>>;
  where?: InputMaybe<Public6_Devices_Bool_Exp>;
};

export type Query_RootPublic6_Devices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_NodesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Nodes_Order_By>>;
  where?: InputMaybe<Public6_Nodes_Bool_Exp>;
};

export type Query_RootPublic6_Nodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Nodes_Order_By>>;
  where?: InputMaybe<Public6_Nodes_Bool_Exp>;
};

export type Query_RootPublic6_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic6_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic6_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_Planned_Tasks_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Devices_Bool_Exp>;
};

export type Query_RootPublic6_Planned_Tasks_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Devices_Bool_Exp>;
};

export type Query_RootPublic6_Planned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Public6_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Providers_Order_By>>;
  where?: InputMaybe<Public6_Providers_Bool_Exp>;
};

export type Query_RootPublic6_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Providers_Order_By>>;
  where?: InputMaybe<Public6_Providers_Bool_Exp>;
};

export type Query_RootPublic6_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_Rm_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public6_Rm_Projects_Bool_Exp>;
};

export type Query_RootPublic6_Rm_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public6_Rm_Projects_Bool_Exp>;
};

export type Query_RootPublic6_Rm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_Rm_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Rm_Tasks_Bool_Exp>;
};

export type Query_RootPublic6_Rm_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Rm_Tasks_Bool_Exp>;
};

export type Query_RootPublic6_Rm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Roles_Order_By>>;
  where?: InputMaybe<Public6_Roles_Bool_Exp>;
};

export type Query_RootPublic6_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Roles_Order_By>>;
  where?: InputMaybe<Public6_Roles_Bool_Exp>;
};

export type Query_RootPublic6_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_Time_WorksArgs = {
  distinct_on?: InputMaybe<Array<Public6_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Time_Works_Order_By>>;
  where?: InputMaybe<Public6_Time_Works_Bool_Exp>;
};

export type Query_RootPublic6_Time_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Time_Works_Order_By>>;
  where?: InputMaybe<Public6_Time_Works_Bool_Exp>;
};

export type Query_RootPublic6_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_User_GroupsArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Groups_Order_By>>;
  where?: InputMaybe<Public6_User_Groups_Bool_Exp>;
};

export type Query_RootPublic6_User_Groups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Groups_Order_By>>;
  where?: InputMaybe<Public6_User_Groups_Bool_Exp>;
};

export type Query_RootPublic6_User_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_User_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_User_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic6_User_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_User_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic6_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_UsersArgs = {
  distinct_on?: InputMaybe<Array<Public6_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Users_Order_By>>;
  where?: InputMaybe<Public6_Users_Bool_Exp>;
};

export type Query_RootPublic6_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Users_Order_By>>;
  where?: InputMaybe<Public6_Users_Bool_Exp>;
};

export type Query_RootPublic6_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic6_VendorsArgs = {
  distinct_on?: InputMaybe<Array<Public6_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Vendors_Order_By>>;
  where?: InputMaybe<Public6_Vendors_Bool_Exp>;
};

export type Query_RootPublic6_Vendors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Vendors_Order_By>>;
  where?: InputMaybe<Public6_Vendors_Bool_Exp>;
};

export type Query_RootPublic6_Vendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_BranchesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Branches_Order_By>>;
  where?: InputMaybe<Public7_Branches_Bool_Exp>;
};

export type Query_RootPublic7_Branches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Branches_Order_By>>;
  where?: InputMaybe<Public7_Branches_Bool_Exp>;
};

export type Query_RootPublic7_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_CitiesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Cities_Order_By>>;
  where?: InputMaybe<Public7_Cities_Bool_Exp>;
};

export type Query_RootPublic7_Cities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Cities_Order_By>>;
  where?: InputMaybe<Public7_Cities_Bool_Exp>;
};

export type Query_RootPublic7_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_Device_ModelsArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Models_Order_By>>;
  where?: InputMaybe<Public7_Device_Models_Bool_Exp>;
};

export type Query_RootPublic7_Device_Models_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Models_Order_By>>;
  where?: InputMaybe<Public7_Device_Models_Bool_Exp>;
};

export type Query_RootPublic7_Device_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_Device_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Roles_Order_By>>;
  where?: InputMaybe<Public7_Device_Roles_Bool_Exp>;
};

export type Query_RootPublic7_Device_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Roles_Order_By>>;
  where?: InputMaybe<Public7_Device_Roles_Bool_Exp>;
};

export type Query_RootPublic7_Device_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Devices_Order_By>>;
  where?: InputMaybe<Public7_Devices_Bool_Exp>;
};

export type Query_RootPublic7_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Devices_Order_By>>;
  where?: InputMaybe<Public7_Devices_Bool_Exp>;
};

export type Query_RootPublic7_Devices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_NodesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Nodes_Order_By>>;
  where?: InputMaybe<Public7_Nodes_Bool_Exp>;
};

export type Query_RootPublic7_Nodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Nodes_Order_By>>;
  where?: InputMaybe<Public7_Nodes_Bool_Exp>;
};

export type Query_RootPublic7_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic7_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic7_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_Planned_Tasks_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Devices_Bool_Exp>;
};

export type Query_RootPublic7_Planned_Tasks_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Devices_Bool_Exp>;
};

export type Query_RootPublic7_Planned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Public7_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Providers_Order_By>>;
  where?: InputMaybe<Public7_Providers_Bool_Exp>;
};

export type Query_RootPublic7_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Providers_Order_By>>;
  where?: InputMaybe<Public7_Providers_Bool_Exp>;
};

export type Query_RootPublic7_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_Rm_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public7_Rm_Projects_Bool_Exp>;
};

export type Query_RootPublic7_Rm_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public7_Rm_Projects_Bool_Exp>;
};

export type Query_RootPublic7_Rm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_Rm_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Rm_Tasks_Bool_Exp>;
};

export type Query_RootPublic7_Rm_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Rm_Tasks_Bool_Exp>;
};

export type Query_RootPublic7_Rm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Roles_Order_By>>;
  where?: InputMaybe<Public7_Roles_Bool_Exp>;
};

export type Query_RootPublic7_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Roles_Order_By>>;
  where?: InputMaybe<Public7_Roles_Bool_Exp>;
};

export type Query_RootPublic7_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_Time_WorksArgs = {
  distinct_on?: InputMaybe<Array<Public7_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Time_Works_Order_By>>;
  where?: InputMaybe<Public7_Time_Works_Bool_Exp>;
};

export type Query_RootPublic7_Time_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Time_Works_Order_By>>;
  where?: InputMaybe<Public7_Time_Works_Bool_Exp>;
};

export type Query_RootPublic7_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_User_GroupsArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Groups_Order_By>>;
  where?: InputMaybe<Public7_User_Groups_Bool_Exp>;
};

export type Query_RootPublic7_User_Groups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Groups_Order_By>>;
  where?: InputMaybe<Public7_User_Groups_Bool_Exp>;
};

export type Query_RootPublic7_User_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_User_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_User_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic7_User_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_User_Planned_Tasks_Bool_Exp>;
};

export type Query_RootPublic7_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_UsersArgs = {
  distinct_on?: InputMaybe<Array<Public7_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Users_Order_By>>;
  where?: InputMaybe<Public7_Users_Bool_Exp>;
};

export type Query_RootPublic7_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Users_Order_By>>;
  where?: InputMaybe<Public7_Users_Bool_Exp>;
};

export type Query_RootPublic7_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Query_RootPublic7_VendorsArgs = {
  distinct_on?: InputMaybe<Array<Public7_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Vendors_Order_By>>;
  where?: InputMaybe<Public7_Vendors_Bool_Exp>;
};

export type Query_RootPublic7_Vendors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Vendors_Order_By>>;
  where?: InputMaybe<Public7_Vendors_Bool_Exp>;
};

export type Query_RootPublic7_Vendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
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
  /** fetch data from the table: "public2.apartment" */
  public2_apartment: Array<Public2_Apartment>;
  /** fetch aggregated fields from the table: "public2.apartment" */
  public2_apartment_aggregate: Public2_Apartment_Aggregate;
  /** fetch data from the table: "public2.apartment" using primary key columns */
  public2_apartment_by_pk?: Maybe<Public2_Apartment>;
  /** fetch data from the table in a streaming manner: "public2.apartment" */
  public2_apartment_stream: Array<Public2_Apartment>;
  /** fetch data from the table: "public2.branch" */
  public2_branch: Array<Public2_Branch>;
  /** fetch aggregated fields from the table: "public2.branch" */
  public2_branch_aggregate: Public2_Branch_Aggregate;
  /** fetch data from the table: "public2.branch" using primary key columns */
  public2_branch_by_pk?: Maybe<Public2_Branch>;
  /** fetch data from the table in a streaming manner: "public2.branch" */
  public2_branch_stream: Array<Public2_Branch>;
  /** fetch data from the table: "public2.city" */
  public2_city: Array<Public2_City>;
  /** fetch aggregated fields from the table: "public2.city" */
  public2_city_aggregate: Public2_City_Aggregate;
  /** fetch data from the table: "public2.city" using primary key columns */
  public2_city_by_pk?: Maybe<Public2_City>;
  /** fetch data from the table in a streaming manner: "public2.city" */
  public2_city_stream: Array<Public2_City>;
  /** fetch data from the table: "public2.equipment" */
  public2_equipment: Array<Public2_Equipment>;
  /** fetch aggregated fields from the table: "public2.equipment" */
  public2_equipment_aggregate: Public2_Equipment_Aggregate;
  /** fetch data from the table: "public2.equipment" using primary key columns */
  public2_equipment_by_pk?: Maybe<Public2_Equipment>;
  /** fetch data from the table in a streaming manner: "public2.equipment" */
  public2_equipment_stream: Array<Public2_Equipment>;
  /** fetch data from the table: "public2.house" */
  public2_house: Array<Public2_House>;
  /** fetch aggregated fields from the table: "public2.house" */
  public2_house_aggregate: Public2_House_Aggregate;
  /** fetch data from the table: "public2.house" using primary key columns */
  public2_house_by_pk?: Maybe<Public2_House>;
  /** fetch data from the table in a streaming manner: "public2.house" */
  public2_house_stream: Array<Public2_House>;
  /** fetch data from the table: "public2.planned_task" */
  public2_planned_task: Array<Public2_Planned_Task>;
  /** fetch aggregated fields from the table: "public2.planned_task" */
  public2_planned_task_aggregate: Public2_Planned_Task_Aggregate;
  /** fetch data from the table: "public2.planned_task" using primary key columns */
  public2_planned_task_by_pk?: Maybe<Public2_Planned_Task>;
  /** fetch data from the table in a streaming manner: "public2.planned_task" */
  public2_planned_task_stream: Array<Public2_Planned_Task>;
  /** fetch data from the table: "public2.planned_tasks" */
  public2_planned_tasks: Array<Public2_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public2.planned_tasks" */
  public2_planned_tasks_aggregate: Public2_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public2.planned_tasks" using primary key columns */
  public2_planned_tasks_by_pk?: Maybe<Public2_Planned_Tasks>;
  /** fetch data from the table in a streaming manner: "public2.planned_tasks" */
  public2_planned_tasks_stream: Array<Public2_Planned_Tasks>;
  /** fetch data from the table: "public2.provider" */
  public2_provider: Array<Public2_Provider>;
  /** fetch aggregated fields from the table: "public2.provider" */
  public2_provider_aggregate: Public2_Provider_Aggregate;
  /** fetch data from the table: "public2.provider" using primary key columns */
  public2_provider_by_pk?: Maybe<Public2_Provider>;
  /** fetch data from the table in a streaming manner: "public2.provider" */
  public2_provider_stream: Array<Public2_Provider>;
  /** fetch data from the table: "public2.role" */
  public2_role: Array<Public2_Role>;
  /** fetch aggregated fields from the table: "public2.role" */
  public2_role_aggregate: Public2_Role_Aggregate;
  /** fetch data from the table: "public2.role" using primary key columns */
  public2_role_by_pk?: Maybe<Public2_Role>;
  /** fetch data from the table in a streaming manner: "public2.role" */
  public2_role_stream: Array<Public2_Role>;
  /** fetch data from the table: "public2.street" */
  public2_street: Array<Public2_Street>;
  /** fetch aggregated fields from the table: "public2.street" */
  public2_street_aggregate: Public2_Street_Aggregate;
  /** fetch data from the table: "public2.street" using primary key columns */
  public2_street_by_pk?: Maybe<Public2_Street>;
  /** fetch data from the table in a streaming manner: "public2.street" */
  public2_street_stream: Array<Public2_Street>;
  /** fetch data from the table: "public2.time_work" */
  public2_time_work: Array<Public2_Time_Work>;
  /** fetch aggregated fields from the table: "public2.time_work" */
  public2_time_work_aggregate: Public2_Time_Work_Aggregate;
  /** fetch data from the table: "public2.time_work" using primary key columns */
  public2_time_work_by_pk?: Maybe<Public2_Time_Work>;
  /** fetch data from the table in a streaming manner: "public2.time_work" */
  public2_time_work_stream: Array<Public2_Time_Work>;
  /** fetch data from the table: "public2.user" */
  public2_user: Array<Public2_User>;
  /** fetch aggregated fields from the table: "public2.user" */
  public2_user_aggregate: Public2_User_Aggregate;
  /** fetch data from the table: "public2.user" using primary key columns */
  public2_user_by_pk?: Maybe<Public2_User>;
  /** fetch data from the table in a streaming manner: "public2.user" */
  public2_user_stream: Array<Public2_User>;
  /** fetch data from the table: "public3.branches" */
  public3_branches: Array<Public3_Branches>;
  /** fetch aggregated fields from the table: "public3.branches" */
  public3_branches_aggregate: Public3_Branches_Aggregate;
  /** fetch data from the table: "public3.branches" using primary key columns */
  public3_branches_by_pk?: Maybe<Public3_Branches>;
  /** fetch data from the table in a streaming manner: "public3.branches" */
  public3_branches_stream: Array<Public3_Branches>;
  /** fetch data from the table: "public3.cities" */
  public3_cities: Array<Public3_Cities>;
  /** fetch aggregated fields from the table: "public3.cities" */
  public3_cities_aggregate: Public3_Cities_Aggregate;
  /** fetch data from the table: "public3.cities" using primary key columns */
  public3_cities_by_pk?: Maybe<Public3_Cities>;
  /** fetch data from the table in a streaming manner: "public3.cities" */
  public3_cities_stream: Array<Public3_Cities>;
  /** fetch data from the table: "public3.equipments" */
  public3_equipments: Array<Public3_Equipments>;
  /** fetch aggregated fields from the table: "public3.equipments" */
  public3_equipments_aggregate: Public3_Equipments_Aggregate;
  /** fetch data from the table: "public3.equipments" using primary key columns */
  public3_equipments_by_pk?: Maybe<Public3_Equipments>;
  /** fetch data from the table in a streaming manner: "public3.equipments" */
  public3_equipments_stream: Array<Public3_Equipments>;
  /** fetch data from the table: "public3.nodes" */
  public3_nodes: Array<Public3_Nodes>;
  /** fetch aggregated fields from the table: "public3.nodes" */
  public3_nodes_aggregate: Public3_Nodes_Aggregate;
  /** fetch data from the table: "public3.nodes" using primary key columns */
  public3_nodes_by_pk?: Maybe<Public3_Nodes>;
  /** fetch data from the table in a streaming manner: "public3.nodes" */
  public3_nodes_stream: Array<Public3_Nodes>;
  /** fetch data from the table: "public3.planned_tasks" */
  public3_planned_tasks: Array<Public3_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public3.planned_tasks" */
  public3_planned_tasks_aggregate: Public3_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public3.planned_tasks" using primary key columns */
  public3_planned_tasks_by_pk?: Maybe<Public3_Planned_Tasks>;
  /** fetch data from the table: "public3.planned_tasks_equipments" */
  public3_planned_tasks_equipments: Array<Public3_Planned_Tasks_Equipments>;
  /** fetch aggregated fields from the table: "public3.planned_tasks_equipments" */
  public3_planned_tasks_equipments_aggregate: Public3_Planned_Tasks_Equipments_Aggregate;
  /** fetch data from the table: "public3.planned_tasks_equipments" using primary key columns */
  public3_planned_tasks_equipments_by_pk?: Maybe<Public3_Planned_Tasks_Equipments>;
  /** fetch data from the table in a streaming manner: "public3.planned_tasks_equipments" */
  public3_planned_tasks_equipments_stream: Array<Public3_Planned_Tasks_Equipments>;
  /** fetch data from the table in a streaming manner: "public3.planned_tasks" */
  public3_planned_tasks_stream: Array<Public3_Planned_Tasks>;
  /** fetch data from the table: "public3.providers" */
  public3_providers: Array<Public3_Providers>;
  /** fetch aggregated fields from the table: "public3.providers" */
  public3_providers_aggregate: Public3_Providers_Aggregate;
  /** fetch data from the table: "public3.providers" using primary key columns */
  public3_providers_by_pk?: Maybe<Public3_Providers>;
  /** fetch data from the table in a streaming manner: "public3.providers" */
  public3_providers_stream: Array<Public3_Providers>;
  /** fetch data from the table: "public3.roles" */
  public3_roles: Array<Public3_Roles>;
  /** fetch aggregated fields from the table: "public3.roles" */
  public3_roles_aggregate: Public3_Roles_Aggregate;
  /** fetch data from the table: "public3.roles" using primary key columns */
  public3_roles_by_pk?: Maybe<Public3_Roles>;
  /** fetch data from the table in a streaming manner: "public3.roles" */
  public3_roles_stream: Array<Public3_Roles>;
  /** fetch data from the table: "public3.time_works" */
  public3_time_works: Array<Public3_Time_Works>;
  /** fetch aggregated fields from the table: "public3.time_works" */
  public3_time_works_aggregate: Public3_Time_Works_Aggregate;
  /** fetch data from the table: "public3.time_works" using primary key columns */
  public3_time_works_by_pk?: Maybe<Public3_Time_Works>;
  /** fetch data from the table in a streaming manner: "public3.time_works" */
  public3_time_works_stream: Array<Public3_Time_Works>;
  /** fetch data from the table: "public3.user_planned_tasks" */
  public3_user_planned_tasks: Array<Public3_User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public3.user_planned_tasks" */
  public3_user_planned_tasks_aggregate: Public3_User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public3.user_planned_tasks" using primary key columns */
  public3_user_planned_tasks_by_pk?: Maybe<Public3_User_Planned_Tasks>;
  /** fetch data from the table in a streaming manner: "public3.user_planned_tasks" */
  public3_user_planned_tasks_stream: Array<Public3_User_Planned_Tasks>;
  /** fetch data from the table: "public3.users" */
  public3_users: Array<Public3_Users>;
  /** fetch aggregated fields from the table: "public3.users" */
  public3_users_aggregate: Public3_Users_Aggregate;
  /** fetch data from the table: "public3.users" using primary key columns */
  public3_users_by_pk?: Maybe<Public3_Users>;
  /** fetch data from the table in a streaming manner: "public3.users" */
  public3_users_stream: Array<Public3_Users>;
  /** fetch data from the table: "public6.branches" */
  public6_branches: Array<Public6_Branches>;
  /** fetch aggregated fields from the table: "public6.branches" */
  public6_branches_aggregate: Public6_Branches_Aggregate;
  /** fetch data from the table: "public6.branches" using primary key columns */
  public6_branches_by_pk?: Maybe<Public6_Branches>;
  /** fetch data from the table in a streaming manner: "public6.branches" */
  public6_branches_stream: Array<Public6_Branches>;
  /** fetch data from the table: "public6.cities" */
  public6_cities: Array<Public6_Cities>;
  /** fetch aggregated fields from the table: "public6.cities" */
  public6_cities_aggregate: Public6_Cities_Aggregate;
  /** fetch data from the table: "public6.cities" using primary key columns */
  public6_cities_by_pk?: Maybe<Public6_Cities>;
  /** fetch data from the table in a streaming manner: "public6.cities" */
  public6_cities_stream: Array<Public6_Cities>;
  /** fetch data from the table: "public6.device_models" */
  public6_device_models: Array<Public6_Device_Models>;
  /** fetch aggregated fields from the table: "public6.device_models" */
  public6_device_models_aggregate: Public6_Device_Models_Aggregate;
  /** fetch data from the table: "public6.device_models" using primary key columns */
  public6_device_models_by_pk?: Maybe<Public6_Device_Models>;
  /** fetch data from the table in a streaming manner: "public6.device_models" */
  public6_device_models_stream: Array<Public6_Device_Models>;
  /** fetch data from the table: "public6.device_roles" */
  public6_device_roles: Array<Public6_Device_Roles>;
  /** fetch aggregated fields from the table: "public6.device_roles" */
  public6_device_roles_aggregate: Public6_Device_Roles_Aggregate;
  /** fetch data from the table: "public6.device_roles" using primary key columns */
  public6_device_roles_by_pk?: Maybe<Public6_Device_Roles>;
  /** fetch data from the table in a streaming manner: "public6.device_roles" */
  public6_device_roles_stream: Array<Public6_Device_Roles>;
  /** fetch data from the table: "public6.devices" */
  public6_devices: Array<Public6_Devices>;
  /** fetch aggregated fields from the table: "public6.devices" */
  public6_devices_aggregate: Public6_Devices_Aggregate;
  /** fetch data from the table: "public6.devices" using primary key columns */
  public6_devices_by_pk?: Maybe<Public6_Devices>;
  /** fetch data from the table in a streaming manner: "public6.devices" */
  public6_devices_stream: Array<Public6_Devices>;
  /** fetch data from the table: "public6.nodes" */
  public6_nodes: Array<Public6_Nodes>;
  /** fetch aggregated fields from the table: "public6.nodes" */
  public6_nodes_aggregate: Public6_Nodes_Aggregate;
  /** fetch data from the table: "public6.nodes" using primary key columns */
  public6_nodes_by_pk?: Maybe<Public6_Nodes>;
  /** fetch data from the table in a streaming manner: "public6.nodes" */
  public6_nodes_stream: Array<Public6_Nodes>;
  /** fetch data from the table: "public6.planned_tasks" */
  public6_planned_tasks: Array<Public6_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public6.planned_tasks" */
  public6_planned_tasks_aggregate: Public6_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public6.planned_tasks" using primary key columns */
  public6_planned_tasks_by_pk?: Maybe<Public6_Planned_Tasks>;
  /** fetch data from the table: "public6.planned_tasks_devices" */
  public6_planned_tasks_devices: Array<Public6_Planned_Tasks_Devices>;
  /** fetch aggregated fields from the table: "public6.planned_tasks_devices" */
  public6_planned_tasks_devices_aggregate: Public6_Planned_Tasks_Devices_Aggregate;
  /** fetch data from the table: "public6.planned_tasks_devices" using primary key columns */
  public6_planned_tasks_devices_by_pk?: Maybe<Public6_Planned_Tasks_Devices>;
  /** fetch data from the table in a streaming manner: "public6.planned_tasks_devices" */
  public6_planned_tasks_devices_stream: Array<Public6_Planned_Tasks_Devices>;
  /** fetch data from the table in a streaming manner: "public6.planned_tasks" */
  public6_planned_tasks_stream: Array<Public6_Planned_Tasks>;
  /** fetch data from the table: "public6.providers" */
  public6_providers: Array<Public6_Providers>;
  /** fetch aggregated fields from the table: "public6.providers" */
  public6_providers_aggregate: Public6_Providers_Aggregate;
  /** fetch data from the table: "public6.providers" using primary key columns */
  public6_providers_by_pk?: Maybe<Public6_Providers>;
  /** fetch data from the table in a streaming manner: "public6.providers" */
  public6_providers_stream: Array<Public6_Providers>;
  /** fetch data from the table: "public6.rm_projects" */
  public6_rm_projects: Array<Public6_Rm_Projects>;
  /** fetch aggregated fields from the table: "public6.rm_projects" */
  public6_rm_projects_aggregate: Public6_Rm_Projects_Aggregate;
  /** fetch data from the table: "public6.rm_projects" using primary key columns */
  public6_rm_projects_by_pk?: Maybe<Public6_Rm_Projects>;
  /** fetch data from the table in a streaming manner: "public6.rm_projects" */
  public6_rm_projects_stream: Array<Public6_Rm_Projects>;
  /** fetch data from the table: "public6.rm_tasks" */
  public6_rm_tasks: Array<Public6_Rm_Tasks>;
  /** fetch aggregated fields from the table: "public6.rm_tasks" */
  public6_rm_tasks_aggregate: Public6_Rm_Tasks_Aggregate;
  /** fetch data from the table: "public6.rm_tasks" using primary key columns */
  public6_rm_tasks_by_pk?: Maybe<Public6_Rm_Tasks>;
  /** fetch data from the table in a streaming manner: "public6.rm_tasks" */
  public6_rm_tasks_stream: Array<Public6_Rm_Tasks>;
  /** fetch data from the table: "public6.roles" */
  public6_roles: Array<Public6_Roles>;
  /** fetch aggregated fields from the table: "public6.roles" */
  public6_roles_aggregate: Public6_Roles_Aggregate;
  /** fetch data from the table: "public6.roles" using primary key columns */
  public6_roles_by_pk?: Maybe<Public6_Roles>;
  /** fetch data from the table in a streaming manner: "public6.roles" */
  public6_roles_stream: Array<Public6_Roles>;
  /** fetch data from the table: "public6.time_works" */
  public6_time_works: Array<Public6_Time_Works>;
  /** fetch aggregated fields from the table: "public6.time_works" */
  public6_time_works_aggregate: Public6_Time_Works_Aggregate;
  /** fetch data from the table: "public6.time_works" using primary key columns */
  public6_time_works_by_pk?: Maybe<Public6_Time_Works>;
  /** fetch data from the table in a streaming manner: "public6.time_works" */
  public6_time_works_stream: Array<Public6_Time_Works>;
  /** fetch data from the table: "public6.user_groups" */
  public6_user_groups: Array<Public6_User_Groups>;
  /** fetch aggregated fields from the table: "public6.user_groups" */
  public6_user_groups_aggregate: Public6_User_Groups_Aggregate;
  /** fetch data from the table: "public6.user_groups" using primary key columns */
  public6_user_groups_by_pk?: Maybe<Public6_User_Groups>;
  /** fetch data from the table in a streaming manner: "public6.user_groups" */
  public6_user_groups_stream: Array<Public6_User_Groups>;
  /** fetch data from the table: "public6.user_planned_tasks" */
  public6_user_planned_tasks: Array<Public6_User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public6.user_planned_tasks" */
  public6_user_planned_tasks_aggregate: Public6_User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public6.user_planned_tasks" using primary key columns */
  public6_user_planned_tasks_by_pk?: Maybe<Public6_User_Planned_Tasks>;
  /** fetch data from the table in a streaming manner: "public6.user_planned_tasks" */
  public6_user_planned_tasks_stream: Array<Public6_User_Planned_Tasks>;
  /** fetch data from the table: "public6.users" */
  public6_users: Array<Public6_Users>;
  /** fetch aggregated fields from the table: "public6.users" */
  public6_users_aggregate: Public6_Users_Aggregate;
  /** fetch data from the table: "public6.users" using primary key columns */
  public6_users_by_pk?: Maybe<Public6_Users>;
  /** fetch data from the table in a streaming manner: "public6.users" */
  public6_users_stream: Array<Public6_Users>;
  /** fetch data from the table: "public6.vendors" */
  public6_vendors: Array<Public6_Vendors>;
  /** fetch aggregated fields from the table: "public6.vendors" */
  public6_vendors_aggregate: Public6_Vendors_Aggregate;
  /** fetch data from the table: "public6.vendors" using primary key columns */
  public6_vendors_by_pk?: Maybe<Public6_Vendors>;
  /** fetch data from the table in a streaming manner: "public6.vendors" */
  public6_vendors_stream: Array<Public6_Vendors>;
  /** fetch data from the table: "public7.branches" */
  public7_branches: Array<Public7_Branches>;
  /** fetch aggregated fields from the table: "public7.branches" */
  public7_branches_aggregate: Public7_Branches_Aggregate;
  /** fetch data from the table: "public7.branches" using primary key columns */
  public7_branches_by_pk?: Maybe<Public7_Branches>;
  /** fetch data from the table in a streaming manner: "public7.branches" */
  public7_branches_stream: Array<Public7_Branches>;
  /** fetch data from the table: "public7.cities" */
  public7_cities: Array<Public7_Cities>;
  /** fetch aggregated fields from the table: "public7.cities" */
  public7_cities_aggregate: Public7_Cities_Aggregate;
  /** fetch data from the table: "public7.cities" using primary key columns */
  public7_cities_by_pk?: Maybe<Public7_Cities>;
  /** fetch data from the table in a streaming manner: "public7.cities" */
  public7_cities_stream: Array<Public7_Cities>;
  /** fetch data from the table: "public7.device_models" */
  public7_device_models: Array<Public7_Device_Models>;
  /** fetch aggregated fields from the table: "public7.device_models" */
  public7_device_models_aggregate: Public7_Device_Models_Aggregate;
  /** fetch data from the table: "public7.device_models" using primary key columns */
  public7_device_models_by_pk?: Maybe<Public7_Device_Models>;
  /** fetch data from the table in a streaming manner: "public7.device_models" */
  public7_device_models_stream: Array<Public7_Device_Models>;
  /** fetch data from the table: "public7.device_roles" */
  public7_device_roles: Array<Public7_Device_Roles>;
  /** fetch aggregated fields from the table: "public7.device_roles" */
  public7_device_roles_aggregate: Public7_Device_Roles_Aggregate;
  /** fetch data from the table: "public7.device_roles" using primary key columns */
  public7_device_roles_by_pk?: Maybe<Public7_Device_Roles>;
  /** fetch data from the table in a streaming manner: "public7.device_roles" */
  public7_device_roles_stream: Array<Public7_Device_Roles>;
  /** fetch data from the table: "public7.devices" */
  public7_devices: Array<Public7_Devices>;
  /** fetch aggregated fields from the table: "public7.devices" */
  public7_devices_aggregate: Public7_Devices_Aggregate;
  /** fetch data from the table: "public7.devices" using primary key columns */
  public7_devices_by_pk?: Maybe<Public7_Devices>;
  /** fetch data from the table in a streaming manner: "public7.devices" */
  public7_devices_stream: Array<Public7_Devices>;
  /** fetch data from the table: "public7.nodes" */
  public7_nodes: Array<Public7_Nodes>;
  /** fetch aggregated fields from the table: "public7.nodes" */
  public7_nodes_aggregate: Public7_Nodes_Aggregate;
  /** fetch data from the table: "public7.nodes" using primary key columns */
  public7_nodes_by_pk?: Maybe<Public7_Nodes>;
  /** fetch data from the table in a streaming manner: "public7.nodes" */
  public7_nodes_stream: Array<Public7_Nodes>;
  /** fetch data from the table: "public7.planned_tasks" */
  public7_planned_tasks: Array<Public7_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public7.planned_tasks" */
  public7_planned_tasks_aggregate: Public7_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public7.planned_tasks" using primary key columns */
  public7_planned_tasks_by_pk?: Maybe<Public7_Planned_Tasks>;
  /** fetch data from the table: "public7.planned_tasks_devices" */
  public7_planned_tasks_devices: Array<Public7_Planned_Tasks_Devices>;
  /** fetch aggregated fields from the table: "public7.planned_tasks_devices" */
  public7_planned_tasks_devices_aggregate: Public7_Planned_Tasks_Devices_Aggregate;
  /** fetch data from the table: "public7.planned_tasks_devices" using primary key columns */
  public7_planned_tasks_devices_by_pk?: Maybe<Public7_Planned_Tasks_Devices>;
  /** fetch data from the table in a streaming manner: "public7.planned_tasks_devices" */
  public7_planned_tasks_devices_stream: Array<Public7_Planned_Tasks_Devices>;
  /** fetch data from the table in a streaming manner: "public7.planned_tasks" */
  public7_planned_tasks_stream: Array<Public7_Planned_Tasks>;
  /** fetch data from the table: "public7.providers" */
  public7_providers: Array<Public7_Providers>;
  /** fetch aggregated fields from the table: "public7.providers" */
  public7_providers_aggregate: Public7_Providers_Aggregate;
  /** fetch data from the table: "public7.providers" using primary key columns */
  public7_providers_by_pk?: Maybe<Public7_Providers>;
  /** fetch data from the table in a streaming manner: "public7.providers" */
  public7_providers_stream: Array<Public7_Providers>;
  /** fetch data from the table: "public7.rm_projects" */
  public7_rm_projects: Array<Public7_Rm_Projects>;
  /** fetch aggregated fields from the table: "public7.rm_projects" */
  public7_rm_projects_aggregate: Public7_Rm_Projects_Aggregate;
  /** fetch data from the table: "public7.rm_projects" using primary key columns */
  public7_rm_projects_by_pk?: Maybe<Public7_Rm_Projects>;
  /** fetch data from the table in a streaming manner: "public7.rm_projects" */
  public7_rm_projects_stream: Array<Public7_Rm_Projects>;
  /** fetch data from the table: "public7.rm_tasks" */
  public7_rm_tasks: Array<Public7_Rm_Tasks>;
  /** fetch aggregated fields from the table: "public7.rm_tasks" */
  public7_rm_tasks_aggregate: Public7_Rm_Tasks_Aggregate;
  /** fetch data from the table: "public7.rm_tasks" using primary key columns */
  public7_rm_tasks_by_pk?: Maybe<Public7_Rm_Tasks>;
  /** fetch data from the table in a streaming manner: "public7.rm_tasks" */
  public7_rm_tasks_stream: Array<Public7_Rm_Tasks>;
  /** fetch data from the table: "public7.roles" */
  public7_roles: Array<Public7_Roles>;
  /** fetch aggregated fields from the table: "public7.roles" */
  public7_roles_aggregate: Public7_Roles_Aggregate;
  /** fetch data from the table: "public7.roles" using primary key columns */
  public7_roles_by_pk?: Maybe<Public7_Roles>;
  /** fetch data from the table in a streaming manner: "public7.roles" */
  public7_roles_stream: Array<Public7_Roles>;
  /** fetch data from the table: "public7.time_works" */
  public7_time_works: Array<Public7_Time_Works>;
  /** fetch aggregated fields from the table: "public7.time_works" */
  public7_time_works_aggregate: Public7_Time_Works_Aggregate;
  /** fetch data from the table: "public7.time_works" using primary key columns */
  public7_time_works_by_pk?: Maybe<Public7_Time_Works>;
  /** fetch data from the table in a streaming manner: "public7.time_works" */
  public7_time_works_stream: Array<Public7_Time_Works>;
  /** fetch data from the table: "public7.user_groups" */
  public7_user_groups: Array<Public7_User_Groups>;
  /** fetch aggregated fields from the table: "public7.user_groups" */
  public7_user_groups_aggregate: Public7_User_Groups_Aggregate;
  /** fetch data from the table: "public7.user_groups" using primary key columns */
  public7_user_groups_by_pk?: Maybe<Public7_User_Groups>;
  /** fetch data from the table in a streaming manner: "public7.user_groups" */
  public7_user_groups_stream: Array<Public7_User_Groups>;
  /** fetch data from the table: "public7.user_planned_tasks" */
  public7_user_planned_tasks: Array<Public7_User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "public7.user_planned_tasks" */
  public7_user_planned_tasks_aggregate: Public7_User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "public7.user_planned_tasks" using primary key columns */
  public7_user_planned_tasks_by_pk?: Maybe<Public7_User_Planned_Tasks>;
  /** fetch data from the table in a streaming manner: "public7.user_planned_tasks" */
  public7_user_planned_tasks_stream: Array<Public7_User_Planned_Tasks>;
  /** fetch data from the table: "public7.users" */
  public7_users: Array<Public7_Users>;
  /** fetch aggregated fields from the table: "public7.users" */
  public7_users_aggregate: Public7_Users_Aggregate;
  /** fetch data from the table: "public7.users" using primary key columns */
  public7_users_by_pk?: Maybe<Public7_Users>;
  /** fetch data from the table in a streaming manner: "public7.users" */
  public7_users_stream: Array<Public7_Users>;
  /** fetch data from the table: "public7.vendors" */
  public7_vendors: Array<Public7_Vendors>;
  /** fetch aggregated fields from the table: "public7.vendors" */
  public7_vendors_aggregate: Public7_Vendors_Aggregate;
  /** fetch data from the table: "public7.vendors" using primary key columns */
  public7_vendors_by_pk?: Maybe<Public7_Vendors>;
  /** fetch data from the table in a streaming manner: "public7.vendors" */
  public7_vendors_stream: Array<Public7_Vendors>;
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

export type Subscription_RootPublic2_ApartmentArgs = {
  distinct_on?: InputMaybe<Array<Public2_Apartment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Apartment_Order_By>>;
  where?: InputMaybe<Public2_Apartment_Bool_Exp>;
};

export type Subscription_RootPublic2_Apartment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Apartment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Apartment_Order_By>>;
  where?: InputMaybe<Public2_Apartment_Bool_Exp>;
};

export type Subscription_RootPublic2_Apartment_By_PkArgs = {
  apartment_id: Scalars['String']['input'];
};

export type Subscription_RootPublic2_Apartment_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Apartment_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Apartment_Bool_Exp>;
};

export type Subscription_RootPublic2_BranchArgs = {
  distinct_on?: InputMaybe<Array<Public2_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Branch_Order_By>>;
  where?: InputMaybe<Public2_Branch_Bool_Exp>;
};

export type Subscription_RootPublic2_Branch_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Branch_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Branch_Order_By>>;
  where?: InputMaybe<Public2_Branch_Bool_Exp>;
};

export type Subscription_RootPublic2_Branch_By_PkArgs = {
  branch: Scalars['String']['input'];
};

export type Subscription_RootPublic2_Branch_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Branch_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Branch_Bool_Exp>;
};

export type Subscription_RootPublic2_CityArgs = {
  distinct_on?: InputMaybe<Array<Public2_City_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_City_Order_By>>;
  where?: InputMaybe<Public2_City_Bool_Exp>;
};

export type Subscription_RootPublic2_City_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_City_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_City_Order_By>>;
  where?: InputMaybe<Public2_City_Bool_Exp>;
};

export type Subscription_RootPublic2_City_By_PkArgs = {
  city: Scalars['String']['input'];
};

export type Subscription_RootPublic2_City_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_City_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_City_Bool_Exp>;
};

export type Subscription_RootPublic2_EquipmentArgs = {
  distinct_on?: InputMaybe<Array<Public2_Equipment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Equipment_Order_By>>;
  where?: InputMaybe<Public2_Equipment_Bool_Exp>;
};

export type Subscription_RootPublic2_Equipment_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Equipment_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Equipment_Order_By>>;
  where?: InputMaybe<Public2_Equipment_Bool_Exp>;
};

export type Subscription_RootPublic2_Equipment_By_PkArgs = {
  equipment_id: Scalars['String']['input'];
};

export type Subscription_RootPublic2_Equipment_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Equipment_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Equipment_Bool_Exp>;
};

export type Subscription_RootPublic2_HouseArgs = {
  distinct_on?: InputMaybe<Array<Public2_House_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_House_Order_By>>;
  where?: InputMaybe<Public2_House_Bool_Exp>;
};

export type Subscription_RootPublic2_House_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_House_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_House_Order_By>>;
  where?: InputMaybe<Public2_House_Bool_Exp>;
};

export type Subscription_RootPublic2_House_By_PkArgs = {
  house_number: Scalars['String']['input'];
};

export type Subscription_RootPublic2_House_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_House_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_House_Bool_Exp>;
};

export type Subscription_RootPublic2_Planned_TaskArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Task_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Task_Order_By>>;
  where?: InputMaybe<Public2_Planned_Task_Bool_Exp>;
};

export type Subscription_RootPublic2_Planned_Task_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Task_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Task_Order_By>>;
  where?: InputMaybe<Public2_Planned_Task_Bool_Exp>;
};

export type Subscription_RootPublic2_Planned_Task_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic2_Planned_Task_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Planned_Task_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Planned_Task_Bool_Exp>;
};

export type Subscription_RootPublic2_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public2_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic2_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public2_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic2_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic2_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic2_ProviderArgs = {
  distinct_on?: InputMaybe<Array<Public2_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Provider_Order_By>>;
  where?: InputMaybe<Public2_Provider_Bool_Exp>;
};

export type Subscription_RootPublic2_Provider_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Provider_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Provider_Order_By>>;
  where?: InputMaybe<Public2_Provider_Bool_Exp>;
};

export type Subscription_RootPublic2_Provider_By_PkArgs = {
  provider: Scalars['String']['input'];
};

export type Subscription_RootPublic2_Provider_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Provider_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Provider_Bool_Exp>;
};

export type Subscription_RootPublic2_RoleArgs = {
  distinct_on?: InputMaybe<Array<Public2_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Role_Order_By>>;
  where?: InputMaybe<Public2_Role_Bool_Exp>;
};

export type Subscription_RootPublic2_Role_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Role_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Role_Order_By>>;
  where?: InputMaybe<Public2_Role_Bool_Exp>;
};

export type Subscription_RootPublic2_Role_By_PkArgs = {
  role: Scalars['String']['input'];
};

export type Subscription_RootPublic2_Role_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Role_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Role_Bool_Exp>;
};

export type Subscription_RootPublic2_StreetArgs = {
  distinct_on?: InputMaybe<Array<Public2_Street_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Street_Order_By>>;
  where?: InputMaybe<Public2_Street_Bool_Exp>;
};

export type Subscription_RootPublic2_Street_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Street_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Street_Order_By>>;
  where?: InputMaybe<Public2_Street_Bool_Exp>;
};

export type Subscription_RootPublic2_Street_By_PkArgs = {
  street_id: Scalars['String']['input'];
};

export type Subscription_RootPublic2_Street_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Street_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Street_Bool_Exp>;
};

export type Subscription_RootPublic2_Time_WorkArgs = {
  distinct_on?: InputMaybe<Array<Public2_Time_Work_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Time_Work_Order_By>>;
  where?: InputMaybe<Public2_Time_Work_Bool_Exp>;
};

export type Subscription_RootPublic2_Time_Work_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_Time_Work_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_Time_Work_Order_By>>;
  where?: InputMaybe<Public2_Time_Work_Bool_Exp>;
};

export type Subscription_RootPublic2_Time_Work_By_PkArgs = {
  time_work_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic2_Time_Work_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_Time_Work_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_Time_Work_Bool_Exp>;
};

export type Subscription_RootPublic2_UserArgs = {
  distinct_on?: InputMaybe<Array<Public2_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_User_Order_By>>;
  where?: InputMaybe<Public2_User_Bool_Exp>;
};

export type Subscription_RootPublic2_User_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public2_User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public2_User_Order_By>>;
  where?: InputMaybe<Public2_User_Bool_Exp>;
};

export type Subscription_RootPublic2_User_By_PkArgs = {
  number: Scalars['uuid']['input'];
};

export type Subscription_RootPublic2_User_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public2_User_Stream_Cursor_Input>>;
  where?: InputMaybe<Public2_User_Bool_Exp>;
};

export type Subscription_RootPublic3_BranchesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Branches_Order_By>>;
  where?: InputMaybe<Public3_Branches_Bool_Exp>;
};

export type Subscription_RootPublic3_Branches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Branches_Order_By>>;
  where?: InputMaybe<Public3_Branches_Bool_Exp>;
};

export type Subscription_RootPublic3_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Branches_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Branches_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Branches_Bool_Exp>;
};

export type Subscription_RootPublic3_CitiesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Cities_Order_By>>;
  where?: InputMaybe<Public3_Cities_Bool_Exp>;
};

export type Subscription_RootPublic3_Cities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Cities_Order_By>>;
  where?: InputMaybe<Public3_Cities_Bool_Exp>;
};

export type Subscription_RootPublic3_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Cities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Cities_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Cities_Bool_Exp>;
};

export type Subscription_RootPublic3_EquipmentsArgs = {
  distinct_on?: InputMaybe<Array<Public3_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Equipments_Bool_Exp>;
};

export type Subscription_RootPublic3_Equipments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Equipments_Bool_Exp>;
};

export type Subscription_RootPublic3_Equipments_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Equipments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Equipments_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Equipments_Bool_Exp>;
};

export type Subscription_RootPublic3_NodesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Nodes_Order_By>>;
  where?: InputMaybe<Public3_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic3_Nodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Nodes_Order_By>>;
  where?: InputMaybe<Public3_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic3_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Nodes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Nodes_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic3_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic3_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic3_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Planned_Tasks_EquipmentsArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Equipments_Bool_Exp>;
};

export type Subscription_RootPublic3_Planned_Tasks_Equipments_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Planned_Tasks_Equipments_Order_By>>;
  where?: InputMaybe<Public3_Planned_Tasks_Equipments_Bool_Exp>;
};

export type Subscription_RootPublic3_Planned_Tasks_Equipments_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Planned_Tasks_Equipments_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Planned_Tasks_Equipments_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Planned_Tasks_Equipments_Bool_Exp>;
};

export type Subscription_RootPublic3_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic3_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Public3_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Providers_Order_By>>;
  where?: InputMaybe<Public3_Providers_Bool_Exp>;
};

export type Subscription_RootPublic3_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Providers_Order_By>>;
  where?: InputMaybe<Public3_Providers_Bool_Exp>;
};

export type Subscription_RootPublic3_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Providers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Providers_Bool_Exp>;
};

export type Subscription_RootPublic3_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public3_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Roles_Order_By>>;
  where?: InputMaybe<Public3_Roles_Bool_Exp>;
};

export type Subscription_RootPublic3_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Roles_Order_By>>;
  where?: InputMaybe<Public3_Roles_Bool_Exp>;
};

export type Subscription_RootPublic3_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Roles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Roles_Bool_Exp>;
};

export type Subscription_RootPublic3_Time_WorksArgs = {
  distinct_on?: InputMaybe<Array<Public3_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Time_Works_Order_By>>;
  where?: InputMaybe<Public3_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic3_Time_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Time_Works_Order_By>>;
  where?: InputMaybe<Public3_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic3_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Time_Works_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Time_Works_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic3_User_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public3_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic3_User_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public3_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic3_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_User_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_User_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic3_UsersArgs = {
  distinct_on?: InputMaybe<Array<Public3_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Users_Order_By>>;
  where?: InputMaybe<Public3_Users_Bool_Exp>;
};

export type Subscription_RootPublic3_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public3_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public3_Users_Order_By>>;
  where?: InputMaybe<Public3_Users_Bool_Exp>;
};

export type Subscription_RootPublic3_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic3_Users_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public3_Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Public3_Users_Bool_Exp>;
};

export type Subscription_RootPublic6_BranchesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Branches_Order_By>>;
  where?: InputMaybe<Public6_Branches_Bool_Exp>;
};

export type Subscription_RootPublic6_Branches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Branches_Order_By>>;
  where?: InputMaybe<Public6_Branches_Bool_Exp>;
};

export type Subscription_RootPublic6_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Branches_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Branches_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Branches_Bool_Exp>;
};

export type Subscription_RootPublic6_CitiesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Cities_Order_By>>;
  where?: InputMaybe<Public6_Cities_Bool_Exp>;
};

export type Subscription_RootPublic6_Cities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Cities_Order_By>>;
  where?: InputMaybe<Public6_Cities_Bool_Exp>;
};

export type Subscription_RootPublic6_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Cities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Cities_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Cities_Bool_Exp>;
};

export type Subscription_RootPublic6_Device_ModelsArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Models_Order_By>>;
  where?: InputMaybe<Public6_Device_Models_Bool_Exp>;
};

export type Subscription_RootPublic6_Device_Models_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Models_Order_By>>;
  where?: InputMaybe<Public6_Device_Models_Bool_Exp>;
};

export type Subscription_RootPublic6_Device_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Device_Models_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Device_Models_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Device_Models_Bool_Exp>;
};

export type Subscription_RootPublic6_Device_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Roles_Order_By>>;
  where?: InputMaybe<Public6_Device_Roles_Bool_Exp>;
};

export type Subscription_RootPublic6_Device_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Device_Roles_Order_By>>;
  where?: InputMaybe<Public6_Device_Roles_Bool_Exp>;
};

export type Subscription_RootPublic6_Device_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Device_Roles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Device_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Device_Roles_Bool_Exp>;
};

export type Subscription_RootPublic6_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Devices_Order_By>>;
  where?: InputMaybe<Public6_Devices_Bool_Exp>;
};

export type Subscription_RootPublic6_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Devices_Order_By>>;
  where?: InputMaybe<Public6_Devices_Bool_Exp>;
};

export type Subscription_RootPublic6_Devices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Devices_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Devices_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Devices_Bool_Exp>;
};

export type Subscription_RootPublic6_NodesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Nodes_Order_By>>;
  where?: InputMaybe<Public6_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic6_Nodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Nodes_Order_By>>;
  where?: InputMaybe<Public6_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic6_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Nodes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Nodes_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic6_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Planned_Tasks_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Devices_Bool_Exp>;
};

export type Subscription_RootPublic6_Planned_Tasks_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public6_Planned_Tasks_Devices_Bool_Exp>;
};

export type Subscription_RootPublic6_Planned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Planned_Tasks_Devices_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Planned_Tasks_Devices_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Planned_Tasks_Devices_Bool_Exp>;
};

export type Subscription_RootPublic6_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Public6_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Providers_Order_By>>;
  where?: InputMaybe<Public6_Providers_Bool_Exp>;
};

export type Subscription_RootPublic6_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Providers_Order_By>>;
  where?: InputMaybe<Public6_Providers_Bool_Exp>;
};

export type Subscription_RootPublic6_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Providers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Providers_Bool_Exp>;
};

export type Subscription_RootPublic6_Rm_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public6_Rm_Projects_Bool_Exp>;
};

export type Subscription_RootPublic6_Rm_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public6_Rm_Projects_Bool_Exp>;
};

export type Subscription_RootPublic6_Rm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Rm_Projects_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Rm_Projects_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Rm_Projects_Bool_Exp>;
};

export type Subscription_RootPublic6_Rm_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Rm_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_Rm_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public6_Rm_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_Rm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Rm_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Rm_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Rm_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public6_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Roles_Order_By>>;
  where?: InputMaybe<Public6_Roles_Bool_Exp>;
};

export type Subscription_RootPublic6_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Roles_Order_By>>;
  where?: InputMaybe<Public6_Roles_Bool_Exp>;
};

export type Subscription_RootPublic6_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Roles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Roles_Bool_Exp>;
};

export type Subscription_RootPublic6_Time_WorksArgs = {
  distinct_on?: InputMaybe<Array<Public6_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Time_Works_Order_By>>;
  where?: InputMaybe<Public6_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic6_Time_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Time_Works_Order_By>>;
  where?: InputMaybe<Public6_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic6_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Time_Works_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Time_Works_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic6_User_GroupsArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Groups_Order_By>>;
  where?: InputMaybe<Public6_User_Groups_Bool_Exp>;
};

export type Subscription_RootPublic6_User_Groups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Groups_Order_By>>;
  where?: InputMaybe<Public6_User_Groups_Bool_Exp>;
};

export type Subscription_RootPublic6_User_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_User_Groups_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_User_Groups_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_User_Groups_Bool_Exp>;
};

export type Subscription_RootPublic6_User_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_User_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public6_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_User_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_User_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic6_UsersArgs = {
  distinct_on?: InputMaybe<Array<Public6_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Users_Order_By>>;
  where?: InputMaybe<Public6_Users_Bool_Exp>;
};

export type Subscription_RootPublic6_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Users_Order_By>>;
  where?: InputMaybe<Public6_Users_Bool_Exp>;
};

export type Subscription_RootPublic6_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Users_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Users_Bool_Exp>;
};

export type Subscription_RootPublic6_VendorsArgs = {
  distinct_on?: InputMaybe<Array<Public6_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Vendors_Order_By>>;
  where?: InputMaybe<Public6_Vendors_Bool_Exp>;
};

export type Subscription_RootPublic6_Vendors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public6_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public6_Vendors_Order_By>>;
  where?: InputMaybe<Public6_Vendors_Bool_Exp>;
};

export type Subscription_RootPublic6_Vendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic6_Vendors_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public6_Vendors_Stream_Cursor_Input>>;
  where?: InputMaybe<Public6_Vendors_Bool_Exp>;
};

export type Subscription_RootPublic7_BranchesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Branches_Order_By>>;
  where?: InputMaybe<Public7_Branches_Bool_Exp>;
};

export type Subscription_RootPublic7_Branches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Branches_Order_By>>;
  where?: InputMaybe<Public7_Branches_Bool_Exp>;
};

export type Subscription_RootPublic7_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Branches_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Branches_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Branches_Bool_Exp>;
};

export type Subscription_RootPublic7_CitiesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Cities_Order_By>>;
  where?: InputMaybe<Public7_Cities_Bool_Exp>;
};

export type Subscription_RootPublic7_Cities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Cities_Order_By>>;
  where?: InputMaybe<Public7_Cities_Bool_Exp>;
};

export type Subscription_RootPublic7_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Cities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Cities_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Cities_Bool_Exp>;
};

export type Subscription_RootPublic7_Device_ModelsArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Models_Order_By>>;
  where?: InputMaybe<Public7_Device_Models_Bool_Exp>;
};

export type Subscription_RootPublic7_Device_Models_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Models_Order_By>>;
  where?: InputMaybe<Public7_Device_Models_Bool_Exp>;
};

export type Subscription_RootPublic7_Device_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Device_Models_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Device_Models_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Device_Models_Bool_Exp>;
};

export type Subscription_RootPublic7_Device_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Roles_Order_By>>;
  where?: InputMaybe<Public7_Device_Roles_Bool_Exp>;
};

export type Subscription_RootPublic7_Device_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Device_Roles_Order_By>>;
  where?: InputMaybe<Public7_Device_Roles_Bool_Exp>;
};

export type Subscription_RootPublic7_Device_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Device_Roles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Device_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Device_Roles_Bool_Exp>;
};

export type Subscription_RootPublic7_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Devices_Order_By>>;
  where?: InputMaybe<Public7_Devices_Bool_Exp>;
};

export type Subscription_RootPublic7_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Devices_Order_By>>;
  where?: InputMaybe<Public7_Devices_Bool_Exp>;
};

export type Subscription_RootPublic7_Devices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Devices_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Devices_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Devices_Bool_Exp>;
};

export type Subscription_RootPublic7_NodesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Nodes_Order_By>>;
  where?: InputMaybe<Public7_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic7_Nodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Nodes_Order_By>>;
  where?: InputMaybe<Public7_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic7_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Nodes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Nodes_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Nodes_Bool_Exp>;
};

export type Subscription_RootPublic7_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Planned_Tasks_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Devices_Bool_Exp>;
};

export type Subscription_RootPublic7_Planned_Tasks_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Public7_Planned_Tasks_Devices_Bool_Exp>;
};

export type Subscription_RootPublic7_Planned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Planned_Tasks_Devices_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Planned_Tasks_Devices_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Planned_Tasks_Devices_Bool_Exp>;
};

export type Subscription_RootPublic7_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_ProvidersArgs = {
  distinct_on?: InputMaybe<Array<Public7_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Providers_Order_By>>;
  where?: InputMaybe<Public7_Providers_Bool_Exp>;
};

export type Subscription_RootPublic7_Providers_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Providers_Order_By>>;
  where?: InputMaybe<Public7_Providers_Bool_Exp>;
};

export type Subscription_RootPublic7_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Providers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Providers_Bool_Exp>;
};

export type Subscription_RootPublic7_Rm_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public7_Rm_Projects_Bool_Exp>;
};

export type Subscription_RootPublic7_Rm_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Projects_Order_By>>;
  where?: InputMaybe<Public7_Rm_Projects_Bool_Exp>;
};

export type Subscription_RootPublic7_Rm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Rm_Projects_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Rm_Projects_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Rm_Projects_Bool_Exp>;
};

export type Subscription_RootPublic7_Rm_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Rm_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_Rm_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Rm_Tasks_Order_By>>;
  where?: InputMaybe<Public7_Rm_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_Rm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Rm_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Rm_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Rm_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_RolesArgs = {
  distinct_on?: InputMaybe<Array<Public7_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Roles_Order_By>>;
  where?: InputMaybe<Public7_Roles_Bool_Exp>;
};

export type Subscription_RootPublic7_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Roles_Order_By>>;
  where?: InputMaybe<Public7_Roles_Bool_Exp>;
};

export type Subscription_RootPublic7_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Roles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Roles_Bool_Exp>;
};

export type Subscription_RootPublic7_Time_WorksArgs = {
  distinct_on?: InputMaybe<Array<Public7_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Time_Works_Order_By>>;
  where?: InputMaybe<Public7_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic7_Time_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Time_Works_Order_By>>;
  where?: InputMaybe<Public7_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic7_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Time_Works_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Time_Works_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Time_Works_Bool_Exp>;
};

export type Subscription_RootPublic7_User_GroupsArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Groups_Order_By>>;
  where?: InputMaybe<Public7_User_Groups_Bool_Exp>;
};

export type Subscription_RootPublic7_User_Groups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Groups_Order_By>>;
  where?: InputMaybe<Public7_User_Groups_Bool_Exp>;
};

export type Subscription_RootPublic7_User_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_User_Groups_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_User_Groups_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_User_Groups_Bool_Exp>;
};

export type Subscription_RootPublic7_User_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_User_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<Public7_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_User_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_User_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_User_Planned_Tasks_Bool_Exp>;
};

export type Subscription_RootPublic7_UsersArgs = {
  distinct_on?: InputMaybe<Array<Public7_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Users_Order_By>>;
  where?: InputMaybe<Public7_Users_Bool_Exp>;
};

export type Subscription_RootPublic7_Users_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Users_Order_By>>;
  where?: InputMaybe<Public7_Users_Bool_Exp>;
};

export type Subscription_RootPublic7_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Users_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Users_Bool_Exp>;
};

export type Subscription_RootPublic7_VendorsArgs = {
  distinct_on?: InputMaybe<Array<Public7_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Vendors_Order_By>>;
  where?: InputMaybe<Public7_Vendors_Bool_Exp>;
};

export type Subscription_RootPublic7_Vendors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Public7_Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Public7_Vendors_Order_By>>;
  where?: InputMaybe<Public7_Vendors_Bool_Exp>;
};

export type Subscription_RootPublic7_Vendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
};

export type Subscription_RootPublic7_Vendors_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Public7_Vendors_Stream_Cursor_Input>>;
  where?: InputMaybe<Public7_Vendors_Bool_Exp>;
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

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>;
  _gt?: InputMaybe<Scalars['timestamptz']['input']>;
  _gte?: InputMaybe<Scalars['timestamptz']['input']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['timestamptz']['input']>;
  _lte?: InputMaybe<Scalars['timestamptz']['input']>;
  _neq?: InputMaybe<Scalars['timestamptz']['input']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>;
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

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']['input']>;
  _gt?: InputMaybe<Scalars['uuid']['input']>;
  _gte?: InputMaybe<Scalars['uuid']['input']>;
  _in?: InputMaybe<Array<Scalars['uuid']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['uuid']['input']>;
  _lte?: InputMaybe<Scalars['uuid']['input']>;
  _neq?: InputMaybe<Scalars['uuid']['input']>;
  _nin?: InputMaybe<Array<Scalars['uuid']['input']>>;
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

export type InsertPlannedTasksMutationVariables = Types.Exact<{
  objects: Array<Types.Planned_Tasks_Insert_Input> | Types.Planned_Tasks_Insert_Input;
}>;

export type InsertPlannedTasksMutation = {
  __typename?: 'mutation_root';
  insert_planned_tasks?: {
    __typename?: 'planned_tasks_mutation_response';
    affected_rows: number;
  } | null;
};

export const InsertPlannedTasksDocument = gql`
  mutation InsertPlannedTasks($objects: [planned_tasks_insert_input!]!) {
    insert_planned_tasks(
      objects: $objects
      on_conflict: {
        constraint: planned_tasks_pkey
        update_columns: [time_work, description, equipment]
      }
    ) {
      affected_rows
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
    InsertPlannedTasks(
      variables: InsertPlannedTasksMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<InsertPlannedTasksMutation> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<InsertPlannedTasksMutation>({
            document: InsertPlannedTasksDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'InsertPlannedTasks',
        'mutation',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
