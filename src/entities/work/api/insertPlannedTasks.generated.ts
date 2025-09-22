import * as Types from '../../../shared/api/graphql';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  date: { input: any; output: any; }
  jsonb: { input: any; output: any; }
  timestamptz: { input: any; output: any; }
  uuid: { input: any; output: any; }
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

/** columns and relationships of "branches" */
export type Branches = {
  __typename?: 'branches';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  provider_id: Scalars['uuid']['output'];
};

/** aggregated selection of "branches" */
export type Branches_Aggregate = {
  __typename?: 'branches_aggregate';
  aggregate?: Maybe<Branches_Aggregate_Fields>;
  nodes: Array<Branches>;
};

/** aggregate fields of "branches" */
export type Branches_Aggregate_Fields = {
  __typename?: 'branches_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Branches_Max_Fields>;
  min?: Maybe<Branches_Min_Fields>;
};


/** aggregate fields of "branches" */
export type Branches_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Branches_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "branches". All fields are combined with a logical 'AND'. */
export type Branches_Bool_Exp = {
  _and?: InputMaybe<Array<Branches_Bool_Exp>>;
  _not?: InputMaybe<Branches_Bool_Exp>;
  _or?: InputMaybe<Array<Branches_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  provider_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "branches" */
export enum Branches_Constraint {
  /** unique or primary key constraint on columns "id" */
  BranchesPkey = 'branches_pkey'
}

/** input type for inserting data into table "branches" */
export type Branches_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Branches_Max_Fields = {
  __typename?: 'branches_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Branches_Min_Fields = {
  __typename?: 'branches_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "branches" */
export type Branches_Mutation_Response = {
  __typename?: 'branches_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Branches>;
};

/** on_conflict condition type for table "branches" */
export type Branches_On_Conflict = {
  constraint: Branches_Constraint;
  update_columns?: Array<Branches_Update_Column>;
  where?: InputMaybe<Branches_Bool_Exp>;
};

/** Ordering options when selecting data from "branches". */
export type Branches_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  provider_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: branches */
export type Branches_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "branches" */
export enum Branches_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id'
}

/** input type for updating data in table "branches" */
export type Branches_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "branches" */
export type Branches_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Branches_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Branches_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  provider_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "branches" */
export enum Branches_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProviderId = 'provider_id'
}

export type Branches_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Branches_Set_Input>;
  /** filter the rows which have to be updated */
  where: Branches_Bool_Exp;
};

/** columns and relationships of "cities" */
export type Cities = {
  __typename?: 'cities';
  branch_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  time_zone: Scalars['String']['output'];
};

/** aggregated selection of "cities" */
export type Cities_Aggregate = {
  __typename?: 'cities_aggregate';
  aggregate?: Maybe<Cities_Aggregate_Fields>;
  nodes: Array<Cities>;
};

/** aggregate fields of "cities" */
export type Cities_Aggregate_Fields = {
  __typename?: 'cities_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Cities_Max_Fields>;
  min?: Maybe<Cities_Min_Fields>;
};


/** aggregate fields of "cities" */
export type Cities_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Cities_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "cities". All fields are combined with a logical 'AND'. */
export type Cities_Bool_Exp = {
  _and?: InputMaybe<Array<Cities_Bool_Exp>>;
  _not?: InputMaybe<Cities_Bool_Exp>;
  _or?: InputMaybe<Array<Cities_Bool_Exp>>;
  branch_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  time_zone?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "cities" */
export enum Cities_Constraint {
  /** unique or primary key constraint on columns "id" */
  CitiesPkey = 'cities_pkey'
}

/** input type for inserting data into table "cities" */
export type Cities_Insert_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Cities_Max_Fields = {
  __typename?: 'cities_max_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Cities_Min_Fields = {
  __typename?: 'cities_min_fields';
  branch_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "cities" */
export type Cities_Mutation_Response = {
  __typename?: 'cities_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Cities>;
};

/** on_conflict condition type for table "cities" */
export type Cities_On_Conflict = {
  constraint: Cities_Constraint;
  update_columns?: Array<Cities_Update_Column>;
  where?: InputMaybe<Cities_Bool_Exp>;
};

/** Ordering options when selecting data from "cities". */
export type Cities_Order_By = {
  branch_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  time_zone?: InputMaybe<Order_By>;
};

/** primary key columns input for table: cities */
export type Cities_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "cities" */
export enum Cities_Select_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TimeZone = 'time_zone'
}

/** input type for updating data in table "cities" */
export type Cities_Set_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "cities" */
export type Cities_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Cities_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Cities_Stream_Cursor_Value_Input = {
  branch_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "cities" */
export enum Cities_Update_Column {
  /** column name */
  BranchId = 'branch_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  TimeZone = 'time_zone'
}

export type Cities_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Cities_Set_Input>;
  /** filter the rows which have to be updated */
  where: Cities_Bool_Exp;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
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

/** columns and relationships of "device_models" */
export type Device_Models = {
  __typename?: 'device_models';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  vendor_id: Scalars['uuid']['output'];
  version: Scalars['String']['output'];
};

/** aggregated selection of "device_models" */
export type Device_Models_Aggregate = {
  __typename?: 'device_models_aggregate';
  aggregate?: Maybe<Device_Models_Aggregate_Fields>;
  nodes: Array<Device_Models>;
};

/** aggregate fields of "device_models" */
export type Device_Models_Aggregate_Fields = {
  __typename?: 'device_models_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Device_Models_Max_Fields>;
  min?: Maybe<Device_Models_Min_Fields>;
};


/** aggregate fields of "device_models" */
export type Device_Models_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Device_Models_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "device_models". All fields are combined with a logical 'AND'. */
export type Device_Models_Bool_Exp = {
  _and?: InputMaybe<Array<Device_Models_Bool_Exp>>;
  _not?: InputMaybe<Device_Models_Bool_Exp>;
  _or?: InputMaybe<Array<Device_Models_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  vendor_id?: InputMaybe<Uuid_Comparison_Exp>;
  version?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "device_models" */
export enum Device_Models_Constraint {
  /** unique or primary key constraint on columns "id" */
  DeviceModelsPkey = 'device_models_pkey'
}

/** input type for inserting data into table "device_models" */
export type Device_Models_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Device_Models_Max_Fields = {
  __typename?: 'device_models_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Device_Models_Min_Fields = {
  __typename?: 'device_models_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "device_models" */
export type Device_Models_Mutation_Response = {
  __typename?: 'device_models_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Device_Models>;
};

/** on_conflict condition type for table "device_models" */
export type Device_Models_On_Conflict = {
  constraint: Device_Models_Constraint;
  update_columns?: Array<Device_Models_Update_Column>;
  where?: InputMaybe<Device_Models_Bool_Exp>;
};

/** Ordering options when selecting data from "device_models". */
export type Device_Models_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  vendor_id?: InputMaybe<Order_By>;
  version?: InputMaybe<Order_By>;
};

/** primary key columns input for table: device_models */
export type Device_Models_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "device_models" */
export enum Device_Models_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  VendorId = 'vendor_id',
  /** column name */
  Version = 'version'
}

/** input type for updating data in table "device_models" */
export type Device_Models_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "device_models" */
export type Device_Models_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Device_Models_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Device_Models_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "device_models" */
export enum Device_Models_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  VendorId = 'vendor_id',
  /** column name */
  Version = 'version'
}

export type Device_Models_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Device_Models_Set_Input>;
  /** filter the rows which have to be updated */
  where: Device_Models_Bool_Exp;
};

/** columns and relationships of "device_roles" */
export type Device_Roles = {
  __typename?: 'device_roles';
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
  vendor_id: Scalars['uuid']['output'];
};

/** aggregated selection of "device_roles" */
export type Device_Roles_Aggregate = {
  __typename?: 'device_roles_aggregate';
  aggregate?: Maybe<Device_Roles_Aggregate_Fields>;
  nodes: Array<Device_Roles>;
};

/** aggregate fields of "device_roles" */
export type Device_Roles_Aggregate_Fields = {
  __typename?: 'device_roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Device_Roles_Max_Fields>;
  min?: Maybe<Device_Roles_Min_Fields>;
};


/** aggregate fields of "device_roles" */
export type Device_Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Device_Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "device_roles". All fields are combined with a logical 'AND'. */
export type Device_Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Device_Roles_Bool_Exp>>;
  _not?: InputMaybe<Device_Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Device_Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  vendor_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "device_roles" */
export enum Device_Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  DeviceRolesPkey = 'device_roles_pkey'
}

/** input type for inserting data into table "device_roles" */
export type Device_Roles_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Device_Roles_Max_Fields = {
  __typename?: 'device_roles_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Device_Roles_Min_Fields = {
  __typename?: 'device_roles_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
  vendor_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "device_roles" */
export type Device_Roles_Mutation_Response = {
  __typename?: 'device_roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Device_Roles>;
};

/** on_conflict condition type for table "device_roles" */
export type Device_Roles_On_Conflict = {
  constraint: Device_Roles_Constraint;
  update_columns?: Array<Device_Roles_Update_Column>;
  where?: InputMaybe<Device_Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "device_roles". */
export type Device_Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  vendor_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: device_roles */
export type Device_Roles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "device_roles" */
export enum Device_Roles_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  VendorId = 'vendor_id'
}

/** input type for updating data in table "device_roles" */
export type Device_Roles_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "device_roles" */
export type Device_Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Device_Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Device_Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  vendor_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "device_roles" */
export enum Device_Roles_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  VendorId = 'vendor_id'
}

export type Device_Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Device_Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Device_Roles_Bool_Exp;
};

/** columns and relationships of "devices" */
export type Devices = {
  __typename?: 'devices';
  hostname: Scalars['String']['output'];
  id: Scalars['uuid']['output'];
  model_id: Scalars['uuid']['output'];
  node_id: Scalars['uuid']['output'];
  role_id: Scalars['uuid']['output'];
};

/** aggregated selection of "devices" */
export type Devices_Aggregate = {
  __typename?: 'devices_aggregate';
  aggregate?: Maybe<Devices_Aggregate_Fields>;
  nodes: Array<Devices>;
};

/** aggregate fields of "devices" */
export type Devices_Aggregate_Fields = {
  __typename?: 'devices_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Devices_Max_Fields>;
  min?: Maybe<Devices_Min_Fields>;
};


/** aggregate fields of "devices" */
export type Devices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Devices_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "devices". All fields are combined with a logical 'AND'. */
export type Devices_Bool_Exp = {
  _and?: InputMaybe<Array<Devices_Bool_Exp>>;
  _not?: InputMaybe<Devices_Bool_Exp>;
  _or?: InputMaybe<Array<Devices_Bool_Exp>>;
  hostname?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  model_id?: InputMaybe<Uuid_Comparison_Exp>;
  node_id?: InputMaybe<Uuid_Comparison_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "devices" */
export enum Devices_Constraint {
  /** unique or primary key constraint on columns "id" */
  DevicesPkey = 'devices_pkey'
}

/** input type for inserting data into table "devices" */
export type Devices_Insert_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Devices_Max_Fields = {
  __typename?: 'devices_max_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model_id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Devices_Min_Fields = {
  __typename?: 'devices_min_fields';
  hostname?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  model_id?: Maybe<Scalars['uuid']['output']>;
  node_id?: Maybe<Scalars['uuid']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "devices" */
export type Devices_Mutation_Response = {
  __typename?: 'devices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Devices>;
};

/** on_conflict condition type for table "devices" */
export type Devices_On_Conflict = {
  constraint: Devices_Constraint;
  update_columns?: Array<Devices_Update_Column>;
  where?: InputMaybe<Devices_Bool_Exp>;
};

/** Ordering options when selecting data from "devices". */
export type Devices_Order_By = {
  hostname?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  model_id?: InputMaybe<Order_By>;
  node_id?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: devices */
export type Devices_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "devices" */
export enum Devices_Select_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  RoleId = 'role_id'
}

/** input type for updating data in table "devices" */
export type Devices_Set_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "devices" */
export type Devices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Devices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Devices_Stream_Cursor_Value_Input = {
  hostname?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  model_id?: InputMaybe<Scalars['uuid']['input']>;
  node_id?: InputMaybe<Scalars['uuid']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "devices" */
export enum Devices_Update_Column {
  /** column name */
  Hostname = 'hostname',
  /** column name */
  Id = 'id',
  /** column name */
  ModelId = 'model_id',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  RoleId = 'role_id'
}

export type Devices_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Devices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Devices_Bool_Exp;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>;
  _eq?: InputMaybe<Scalars['jsonb']['input']>;
  _gt?: InputMaybe<Scalars['jsonb']['input']>;
  _gte?: InputMaybe<Scalars['jsonb']['input']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>;
  _is_null?: InputMaybe<Scalars['Boolean']['input']>;
  _lt?: InputMaybe<Scalars['jsonb']['input']>;
  _lte?: InputMaybe<Scalars['jsonb']['input']>;
  _neq?: InputMaybe<Scalars['jsonb']['input']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "branches" */
  delete_branches?: Maybe<Branches_Mutation_Response>;
  /** delete single row from the table: "branches" */
  delete_branches_by_pk?: Maybe<Branches>;
  /** delete data from the table: "cities" */
  delete_cities?: Maybe<Cities_Mutation_Response>;
  /** delete single row from the table: "cities" */
  delete_cities_by_pk?: Maybe<Cities>;
  /** delete data from the table: "device_models" */
  delete_device_models?: Maybe<Device_Models_Mutation_Response>;
  /** delete single row from the table: "device_models" */
  delete_device_models_by_pk?: Maybe<Device_Models>;
  /** delete data from the table: "device_roles" */
  delete_device_roles?: Maybe<Device_Roles_Mutation_Response>;
  /** delete single row from the table: "device_roles" */
  delete_device_roles_by_pk?: Maybe<Device_Roles>;
  /** delete data from the table: "devices" */
  delete_devices?: Maybe<Devices_Mutation_Response>;
  /** delete single row from the table: "devices" */
  delete_devices_by_pk?: Maybe<Devices>;
  /** delete data from the table: "nodes" */
  delete_nodes?: Maybe<Nodes_Mutation_Response>;
  /** delete single row from the table: "nodes" */
  delete_nodes_by_pk?: Maybe<Nodes>;
  /** delete data from the table: "planned_tasks" */
  delete_planned_tasks?: Maybe<Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "planned_tasks" */
  delete_planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** delete data from the table: "planned_tasks_devices" */
  delete_planned_tasks_devices?: Maybe<Planned_Tasks_Devices_Mutation_Response>;
  /** delete single row from the table: "planned_tasks_devices" */
  delete_planned_tasks_devices_by_pk?: Maybe<Planned_Tasks_Devices>;
  /** delete data from the table: "providers" */
  delete_providers?: Maybe<Providers_Mutation_Response>;
  /** delete single row from the table: "providers" */
  delete_providers_by_pk?: Maybe<Providers>;
  /** delete data from the table: "query" */
  delete_query?: Maybe<Query_Mutation_Response>;
  /** delete single row from the table: "query" */
  delete_query_by_pk?: Maybe<Query>;
  /** delete data from the table: "rm_projects" */
  delete_rm_projects?: Maybe<Rm_Projects_Mutation_Response>;
  /** delete single row from the table: "rm_projects" */
  delete_rm_projects_by_pk?: Maybe<Rm_Projects>;
  /** delete data from the table: "rm_tasks" */
  delete_rm_tasks?: Maybe<Rm_Tasks_Mutation_Response>;
  /** delete single row from the table: "rm_tasks" */
  delete_rm_tasks_by_pk?: Maybe<Rm_Tasks>;
  /** delete data from the table: "roles" */
  delete_roles?: Maybe<Roles_Mutation_Response>;
  /** delete single row from the table: "roles" */
  delete_roles_by_pk?: Maybe<Roles>;
  /** delete data from the table: "time_works" */
  delete_time_works?: Maybe<Time_Works_Mutation_Response>;
  /** delete single row from the table: "time_works" */
  delete_time_works_by_pk?: Maybe<Time_Works>;
  /** delete data from the table: "user" */
  delete_user?: Maybe<User_Mutation_Response>;
  /** delete single row from the table: "user" */
  delete_user_by_pk?: Maybe<User>;
  /** delete data from the table: "user_groups" */
  delete_user_groups?: Maybe<User_Groups_Mutation_Response>;
  /** delete single row from the table: "user_groups" */
  delete_user_groups_by_pk?: Maybe<User_Groups>;
  /** delete data from the table: "user_planned_tasks" */
  delete_user_planned_tasks?: Maybe<User_Planned_Tasks_Mutation_Response>;
  /** delete single row from the table: "user_planned_tasks" */
  delete_user_planned_tasks_by_pk?: Maybe<User_Planned_Tasks>;
  /** delete data from the table: "users" */
  delete_users?: Maybe<Users_Mutation_Response>;
  /** delete single row from the table: "users" */
  delete_users_by_pk?: Maybe<Users>;
  /** delete data from the table: "vendors" */
  delete_vendors?: Maybe<Vendors_Mutation_Response>;
  /** delete single row from the table: "vendors" */
  delete_vendors_by_pk?: Maybe<Vendors>;
  /** delete data from the table: "works" */
  delete_works?: Maybe<Works_Mutation_Response>;
  /** delete single row from the table: "works" */
  delete_works_by_pk?: Maybe<Works>;
  /** insert data into the table: "branches" */
  insert_branches?: Maybe<Branches_Mutation_Response>;
  /** insert a single row into the table: "branches" */
  insert_branches_one?: Maybe<Branches>;
  /** insert data into the table: "cities" */
  insert_cities?: Maybe<Cities_Mutation_Response>;
  /** insert a single row into the table: "cities" */
  insert_cities_one?: Maybe<Cities>;
  /** insert data into the table: "device_models" */
  insert_device_models?: Maybe<Device_Models_Mutation_Response>;
  /** insert a single row into the table: "device_models" */
  insert_device_models_one?: Maybe<Device_Models>;
  /** insert data into the table: "device_roles" */
  insert_device_roles?: Maybe<Device_Roles_Mutation_Response>;
  /** insert a single row into the table: "device_roles" */
  insert_device_roles_one?: Maybe<Device_Roles>;
  /** insert data into the table: "devices" */
  insert_devices?: Maybe<Devices_Mutation_Response>;
  /** insert a single row into the table: "devices" */
  insert_devices_one?: Maybe<Devices>;
  /** insert data into the table: "nodes" */
  insert_nodes?: Maybe<Nodes_Mutation_Response>;
  /** insert a single row into the table: "nodes" */
  insert_nodes_one?: Maybe<Nodes>;
  /** insert data into the table: "planned_tasks" */
  insert_planned_tasks?: Maybe<Planned_Tasks_Mutation_Response>;
  /** insert data into the table: "planned_tasks_devices" */
  insert_planned_tasks_devices?: Maybe<Planned_Tasks_Devices_Mutation_Response>;
  /** insert a single row into the table: "planned_tasks_devices" */
  insert_planned_tasks_devices_one?: Maybe<Planned_Tasks_Devices>;
  /** insert a single row into the table: "planned_tasks" */
  insert_planned_tasks_one?: Maybe<Planned_Tasks>;
  /** insert data into the table: "providers" */
  insert_providers?: Maybe<Providers_Mutation_Response>;
  /** insert a single row into the table: "providers" */
  insert_providers_one?: Maybe<Providers>;
  /** insert data into the table: "query" */
  insert_query?: Maybe<Query_Mutation_Response>;
  /** insert a single row into the table: "query" */
  insert_query_one?: Maybe<Query>;
  /** insert data into the table: "rm_projects" */
  insert_rm_projects?: Maybe<Rm_Projects_Mutation_Response>;
  /** insert a single row into the table: "rm_projects" */
  insert_rm_projects_one?: Maybe<Rm_Projects>;
  /** insert data into the table: "rm_tasks" */
  insert_rm_tasks?: Maybe<Rm_Tasks_Mutation_Response>;
  /** insert a single row into the table: "rm_tasks" */
  insert_rm_tasks_one?: Maybe<Rm_Tasks>;
  /** insert data into the table: "roles" */
  insert_roles?: Maybe<Roles_Mutation_Response>;
  /** insert a single row into the table: "roles" */
  insert_roles_one?: Maybe<Roles>;
  /** insert data into the table: "time_works" */
  insert_time_works?: Maybe<Time_Works_Mutation_Response>;
  /** insert a single row into the table: "time_works" */
  insert_time_works_one?: Maybe<Time_Works>;
  /** insert data into the table: "user" */
  insert_user?: Maybe<User_Mutation_Response>;
  /** insert data into the table: "user_groups" */
  insert_user_groups?: Maybe<User_Groups_Mutation_Response>;
  /** insert a single row into the table: "user_groups" */
  insert_user_groups_one?: Maybe<User_Groups>;
  /** insert a single row into the table: "user" */
  insert_user_one?: Maybe<User>;
  /** insert data into the table: "user_planned_tasks" */
  insert_user_planned_tasks?: Maybe<User_Planned_Tasks_Mutation_Response>;
  /** insert a single row into the table: "user_planned_tasks" */
  insert_user_planned_tasks_one?: Maybe<User_Planned_Tasks>;
  /** insert data into the table: "users" */
  insert_users?: Maybe<Users_Mutation_Response>;
  /** insert a single row into the table: "users" */
  insert_users_one?: Maybe<Users>;
  /** insert data into the table: "vendors" */
  insert_vendors?: Maybe<Vendors_Mutation_Response>;
  /** insert a single row into the table: "vendors" */
  insert_vendors_one?: Maybe<Vendors>;
  /** insert data into the table: "works" */
  insert_works?: Maybe<Works_Mutation_Response>;
  /** insert a single row into the table: "works" */
  insert_works_one?: Maybe<Works>;
  /** update data of the table: "branches" */
  update_branches?: Maybe<Branches_Mutation_Response>;
  /** update single row of the table: "branches" */
  update_branches_by_pk?: Maybe<Branches>;
  /** update multiples rows of table: "branches" */
  update_branches_many?: Maybe<Array<Maybe<Branches_Mutation_Response>>>;
  /** update data of the table: "cities" */
  update_cities?: Maybe<Cities_Mutation_Response>;
  /** update single row of the table: "cities" */
  update_cities_by_pk?: Maybe<Cities>;
  /** update multiples rows of table: "cities" */
  update_cities_many?: Maybe<Array<Maybe<Cities_Mutation_Response>>>;
  /** update data of the table: "device_models" */
  update_device_models?: Maybe<Device_Models_Mutation_Response>;
  /** update single row of the table: "device_models" */
  update_device_models_by_pk?: Maybe<Device_Models>;
  /** update multiples rows of table: "device_models" */
  update_device_models_many?: Maybe<Array<Maybe<Device_Models_Mutation_Response>>>;
  /** update data of the table: "device_roles" */
  update_device_roles?: Maybe<Device_Roles_Mutation_Response>;
  /** update single row of the table: "device_roles" */
  update_device_roles_by_pk?: Maybe<Device_Roles>;
  /** update multiples rows of table: "device_roles" */
  update_device_roles_many?: Maybe<Array<Maybe<Device_Roles_Mutation_Response>>>;
  /** update data of the table: "devices" */
  update_devices?: Maybe<Devices_Mutation_Response>;
  /** update single row of the table: "devices" */
  update_devices_by_pk?: Maybe<Devices>;
  /** update multiples rows of table: "devices" */
  update_devices_many?: Maybe<Array<Maybe<Devices_Mutation_Response>>>;
  /** update data of the table: "nodes" */
  update_nodes?: Maybe<Nodes_Mutation_Response>;
  /** update single row of the table: "nodes" */
  update_nodes_by_pk?: Maybe<Nodes>;
  /** update multiples rows of table: "nodes" */
  update_nodes_many?: Maybe<Array<Maybe<Nodes_Mutation_Response>>>;
  /** update data of the table: "planned_tasks" */
  update_planned_tasks?: Maybe<Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "planned_tasks" */
  update_planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** update data of the table: "planned_tasks_devices" */
  update_planned_tasks_devices?: Maybe<Planned_Tasks_Devices_Mutation_Response>;
  /** update single row of the table: "planned_tasks_devices" */
  update_planned_tasks_devices_by_pk?: Maybe<Planned_Tasks_Devices>;
  /** update multiples rows of table: "planned_tasks_devices" */
  update_planned_tasks_devices_many?: Maybe<Array<Maybe<Planned_Tasks_Devices_Mutation_Response>>>;
  /** update multiples rows of table: "planned_tasks" */
  update_planned_tasks_many?: Maybe<Array<Maybe<Planned_Tasks_Mutation_Response>>>;
  /** update data of the table: "providers" */
  update_providers?: Maybe<Providers_Mutation_Response>;
  /** update single row of the table: "providers" */
  update_providers_by_pk?: Maybe<Providers>;
  /** update multiples rows of table: "providers" */
  update_providers_many?: Maybe<Array<Maybe<Providers_Mutation_Response>>>;
  /** update data of the table: "query" */
  update_query?: Maybe<Query_Mutation_Response>;
  /** update single row of the table: "query" */
  update_query_by_pk?: Maybe<Query>;
  /** update multiples rows of table: "query" */
  update_query_many?: Maybe<Array<Maybe<Query_Mutation_Response>>>;
  /** update data of the table: "rm_projects" */
  update_rm_projects?: Maybe<Rm_Projects_Mutation_Response>;
  /** update single row of the table: "rm_projects" */
  update_rm_projects_by_pk?: Maybe<Rm_Projects>;
  /** update multiples rows of table: "rm_projects" */
  update_rm_projects_many?: Maybe<Array<Maybe<Rm_Projects_Mutation_Response>>>;
  /** update data of the table: "rm_tasks" */
  update_rm_tasks?: Maybe<Rm_Tasks_Mutation_Response>;
  /** update single row of the table: "rm_tasks" */
  update_rm_tasks_by_pk?: Maybe<Rm_Tasks>;
  /** update multiples rows of table: "rm_tasks" */
  update_rm_tasks_many?: Maybe<Array<Maybe<Rm_Tasks_Mutation_Response>>>;
  /** update data of the table: "roles" */
  update_roles?: Maybe<Roles_Mutation_Response>;
  /** update single row of the table: "roles" */
  update_roles_by_pk?: Maybe<Roles>;
  /** update multiples rows of table: "roles" */
  update_roles_many?: Maybe<Array<Maybe<Roles_Mutation_Response>>>;
  /** update data of the table: "time_works" */
  update_time_works?: Maybe<Time_Works_Mutation_Response>;
  /** update single row of the table: "time_works" */
  update_time_works_by_pk?: Maybe<Time_Works>;
  /** update multiples rows of table: "time_works" */
  update_time_works_many?: Maybe<Array<Maybe<Time_Works_Mutation_Response>>>;
  /** update data of the table: "user" */
  update_user?: Maybe<User_Mutation_Response>;
  /** update single row of the table: "user" */
  update_user_by_pk?: Maybe<User>;
  /** update data of the table: "user_groups" */
  update_user_groups?: Maybe<User_Groups_Mutation_Response>;
  /** update single row of the table: "user_groups" */
  update_user_groups_by_pk?: Maybe<User_Groups>;
  /** update multiples rows of table: "user_groups" */
  update_user_groups_many?: Maybe<Array<Maybe<User_Groups_Mutation_Response>>>;
  /** update multiples rows of table: "user" */
  update_user_many?: Maybe<Array<Maybe<User_Mutation_Response>>>;
  /** update data of the table: "user_planned_tasks" */
  update_user_planned_tasks?: Maybe<User_Planned_Tasks_Mutation_Response>;
  /** update single row of the table: "user_planned_tasks" */
  update_user_planned_tasks_by_pk?: Maybe<User_Planned_Tasks>;
  /** update multiples rows of table: "user_planned_tasks" */
  update_user_planned_tasks_many?: Maybe<Array<Maybe<User_Planned_Tasks_Mutation_Response>>>;
  /** update data of the table: "users" */
  update_users?: Maybe<Users_Mutation_Response>;
  /** update single row of the table: "users" */
  update_users_by_pk?: Maybe<Users>;
  /** update multiples rows of table: "users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
  /** update data of the table: "vendors" */
  update_vendors?: Maybe<Vendors_Mutation_Response>;
  /** update single row of the table: "vendors" */
  update_vendors_by_pk?: Maybe<Vendors>;
  /** update multiples rows of table: "vendors" */
  update_vendors_many?: Maybe<Array<Maybe<Vendors_Mutation_Response>>>;
  /** update data of the table: "works" */
  update_works?: Maybe<Works_Mutation_Response>;
  /** update single row of the table: "works" */
  update_works_by_pk?: Maybe<Works>;
  /** update multiples rows of table: "works" */
  update_works_many?: Maybe<Array<Maybe<Works_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDelete_BranchesArgs = {
  where: Branches_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Branches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_CitiesArgs = {
  where: Cities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Cities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Device_ModelsArgs = {
  where: Device_Models_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Device_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Device_RolesArgs = {
  where: Device_Roles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Device_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_DevicesArgs = {
  where: Devices_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Devices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_NodesArgs = {
  where: Nodes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Nodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Planned_TasksArgs = {
  where: Planned_Tasks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Planned_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Planned_Tasks_DevicesArgs = {
  where: Planned_Tasks_Devices_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Planned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_ProvidersArgs = {
  where: Providers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Providers_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_QueryArgs = {
  where: Query_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Query_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rm_ProjectsArgs = {
  where: Rm_Projects_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Rm_TasksArgs = {
  where: Rm_Tasks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Rm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_RolesArgs = {
  where: Roles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_Time_WorksArgs = {
  where: Time_Works_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Time_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UserArgs = {
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootDelete_User_GroupsArgs = {
  where: User_Groups_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_User_Planned_TasksArgs = {
  where: User_Planned_Tasks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_User_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_UsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Users_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_VendorsArgs = {
  where: Vendors_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Vendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


/** mutation root */
export type Mutation_RootDelete_WorksArgs = {
  where: Works_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Works_By_PkArgs = {
  id: Scalars['Int']['input'];
};


/** mutation root */
export type Mutation_RootInsert_BranchesArgs = {
  objects: Array<Branches_Insert_Input>;
  on_conflict?: InputMaybe<Branches_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Branches_OneArgs = {
  object: Branches_Insert_Input;
  on_conflict?: InputMaybe<Branches_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_CitiesArgs = {
  objects: Array<Cities_Insert_Input>;
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Cities_OneArgs = {
  object: Cities_Insert_Input;
  on_conflict?: InputMaybe<Cities_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Device_ModelsArgs = {
  objects: Array<Device_Models_Insert_Input>;
  on_conflict?: InputMaybe<Device_Models_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Device_Models_OneArgs = {
  object: Device_Models_Insert_Input;
  on_conflict?: InputMaybe<Device_Models_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Device_RolesArgs = {
  objects: Array<Device_Roles_Insert_Input>;
  on_conflict?: InputMaybe<Device_Roles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Device_Roles_OneArgs = {
  object: Device_Roles_Insert_Input;
  on_conflict?: InputMaybe<Device_Roles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_DevicesArgs = {
  objects: Array<Devices_Insert_Input>;
  on_conflict?: InputMaybe<Devices_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Devices_OneArgs = {
  object: Devices_Insert_Input;
  on_conflict?: InputMaybe<Devices_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_NodesArgs = {
  objects: Array<Nodes_Insert_Input>;
  on_conflict?: InputMaybe<Nodes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Nodes_OneArgs = {
  object: Nodes_Insert_Input;
  on_conflict?: InputMaybe<Nodes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Planned_TasksArgs = {
  objects: Array<Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Planned_Tasks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Planned_Tasks_DevicesArgs = {
  objects: Array<Planned_Tasks_Devices_Insert_Input>;
  on_conflict?: InputMaybe<Planned_Tasks_Devices_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Planned_Tasks_Devices_OneArgs = {
  object: Planned_Tasks_Devices_Insert_Input;
  on_conflict?: InputMaybe<Planned_Tasks_Devices_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Planned_Tasks_OneArgs = {
  object: Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Planned_Tasks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_ProvidersArgs = {
  objects: Array<Providers_Insert_Input>;
  on_conflict?: InputMaybe<Providers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Providers_OneArgs = {
  object: Providers_Insert_Input;
  on_conflict?: InputMaybe<Providers_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_QueryArgs = {
  objects: Array<Query_Insert_Input>;
  on_conflict?: InputMaybe<Query_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Query_OneArgs = {
  object: Query_Insert_Input;
  on_conflict?: InputMaybe<Query_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rm_ProjectsArgs = {
  objects: Array<Rm_Projects_Insert_Input>;
  on_conflict?: InputMaybe<Rm_Projects_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rm_Projects_OneArgs = {
  object: Rm_Projects_Insert_Input;
  on_conflict?: InputMaybe<Rm_Projects_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rm_TasksArgs = {
  objects: Array<Rm_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<Rm_Tasks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Rm_Tasks_OneArgs = {
  object: Rm_Tasks_Insert_Input;
  on_conflict?: InputMaybe<Rm_Tasks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_RolesArgs = {
  objects: Array<Roles_Insert_Input>;
  on_conflict?: InputMaybe<Roles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Roles_OneArgs = {
  object: Roles_Insert_Input;
  on_conflict?: InputMaybe<Roles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Time_WorksArgs = {
  objects: Array<Time_Works_Insert_Input>;
  on_conflict?: InputMaybe<Time_Works_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Time_Works_OneArgs = {
  object: Time_Works_Insert_Input;
  on_conflict?: InputMaybe<Time_Works_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_UserArgs = {
  objects: Array<User_Insert_Input>;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_GroupsArgs = {
  objects: Array<User_Groups_Insert_Input>;
  on_conflict?: InputMaybe<User_Groups_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Groups_OneArgs = {
  object: User_Groups_Insert_Input;
  on_conflict?: InputMaybe<User_Groups_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_OneArgs = {
  object: User_Insert_Input;
  on_conflict?: InputMaybe<User_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Planned_TasksArgs = {
  objects: Array<User_Planned_Tasks_Insert_Input>;
  on_conflict?: InputMaybe<User_Planned_Tasks_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_User_Planned_Tasks_OneArgs = {
  object: User_Planned_Tasks_Insert_Input;
  on_conflict?: InputMaybe<User_Planned_Tasks_On_Conflict>;
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
export type Mutation_RootInsert_VendorsArgs = {
  objects: Array<Vendors_Insert_Input>;
  on_conflict?: InputMaybe<Vendors_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Vendors_OneArgs = {
  object: Vendors_Insert_Input;
  on_conflict?: InputMaybe<Vendors_On_Conflict>;
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
export type Mutation_RootUpdate_BranchesArgs = {
  _set?: InputMaybe<Branches_Set_Input>;
  where: Branches_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Branches_By_PkArgs = {
  _set?: InputMaybe<Branches_Set_Input>;
  pk_columns: Branches_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Branches_ManyArgs = {
  updates: Array<Branches_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_CitiesArgs = {
  _set?: InputMaybe<Cities_Set_Input>;
  where: Cities_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Cities_By_PkArgs = {
  _set?: InputMaybe<Cities_Set_Input>;
  pk_columns: Cities_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Cities_ManyArgs = {
  updates: Array<Cities_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Device_ModelsArgs = {
  _set?: InputMaybe<Device_Models_Set_Input>;
  where: Device_Models_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Device_Models_By_PkArgs = {
  _set?: InputMaybe<Device_Models_Set_Input>;
  pk_columns: Device_Models_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Device_Models_ManyArgs = {
  updates: Array<Device_Models_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Device_RolesArgs = {
  _set?: InputMaybe<Device_Roles_Set_Input>;
  where: Device_Roles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Device_Roles_By_PkArgs = {
  _set?: InputMaybe<Device_Roles_Set_Input>;
  pk_columns: Device_Roles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Device_Roles_ManyArgs = {
  updates: Array<Device_Roles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_DevicesArgs = {
  _set?: InputMaybe<Devices_Set_Input>;
  where: Devices_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Devices_By_PkArgs = {
  _set?: InputMaybe<Devices_Set_Input>;
  pk_columns: Devices_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Devices_ManyArgs = {
  updates: Array<Devices_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_NodesArgs = {
  _set?: InputMaybe<Nodes_Set_Input>;
  where: Nodes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Nodes_By_PkArgs = {
  _set?: InputMaybe<Nodes_Set_Input>;
  pk_columns: Nodes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Nodes_ManyArgs = {
  updates: Array<Nodes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Planned_TasksArgs = {
  _set?: InputMaybe<Planned_Tasks_Set_Input>;
  where: Planned_Tasks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<Planned_Tasks_Set_Input>;
  pk_columns: Planned_Tasks_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Planned_Tasks_DevicesArgs = {
  _set?: InputMaybe<Planned_Tasks_Devices_Set_Input>;
  where: Planned_Tasks_Devices_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Planned_Tasks_Devices_By_PkArgs = {
  _set?: InputMaybe<Planned_Tasks_Devices_Set_Input>;
  pk_columns: Planned_Tasks_Devices_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Planned_Tasks_Devices_ManyArgs = {
  updates: Array<Planned_Tasks_Devices_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Planned_Tasks_ManyArgs = {
  updates: Array<Planned_Tasks_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_ProvidersArgs = {
  _set?: InputMaybe<Providers_Set_Input>;
  where: Providers_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Providers_By_PkArgs = {
  _set?: InputMaybe<Providers_Set_Input>;
  pk_columns: Providers_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Providers_ManyArgs = {
  updates: Array<Providers_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_QueryArgs = {
  _append?: InputMaybe<Query_Append_Input>;
  _delete_at_path?: InputMaybe<Query_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Query_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Query_Delete_Key_Input>;
  _prepend?: InputMaybe<Query_Prepend_Input>;
  _set?: InputMaybe<Query_Set_Input>;
  where: Query_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Query_By_PkArgs = {
  _append?: InputMaybe<Query_Append_Input>;
  _delete_at_path?: InputMaybe<Query_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Query_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Query_Delete_Key_Input>;
  _prepend?: InputMaybe<Query_Prepend_Input>;
  _set?: InputMaybe<Query_Set_Input>;
  pk_columns: Query_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Query_ManyArgs = {
  updates: Array<Query_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rm_ProjectsArgs = {
  _inc?: InputMaybe<Rm_Projects_Inc_Input>;
  _set?: InputMaybe<Rm_Projects_Set_Input>;
  where: Rm_Projects_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rm_Projects_By_PkArgs = {
  _inc?: InputMaybe<Rm_Projects_Inc_Input>;
  _set?: InputMaybe<Rm_Projects_Set_Input>;
  pk_columns: Rm_Projects_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rm_Projects_ManyArgs = {
  updates: Array<Rm_Projects_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Rm_TasksArgs = {
  _inc?: InputMaybe<Rm_Tasks_Inc_Input>;
  _set?: InputMaybe<Rm_Tasks_Set_Input>;
  where: Rm_Tasks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Rm_Tasks_By_PkArgs = {
  _inc?: InputMaybe<Rm_Tasks_Inc_Input>;
  _set?: InputMaybe<Rm_Tasks_Set_Input>;
  pk_columns: Rm_Tasks_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Rm_Tasks_ManyArgs = {
  updates: Array<Rm_Tasks_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_RolesArgs = {
  _set?: InputMaybe<Roles_Set_Input>;
  where: Roles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Roles_By_PkArgs = {
  _set?: InputMaybe<Roles_Set_Input>;
  pk_columns: Roles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Roles_ManyArgs = {
  updates: Array<Roles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Time_WorksArgs = {
  _set?: InputMaybe<Time_Works_Set_Input>;
  where: Time_Works_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Time_Works_By_PkArgs = {
  _set?: InputMaybe<Time_Works_Set_Input>;
  pk_columns: Time_Works_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Time_Works_ManyArgs = {
  updates: Array<Time_Works_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UserArgs = {
  _inc?: InputMaybe<User_Inc_Input>;
  _set?: InputMaybe<User_Set_Input>;
  where: User_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_By_PkArgs = {
  _inc?: InputMaybe<User_Inc_Input>;
  _set?: InputMaybe<User_Set_Input>;
  pk_columns: User_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_GroupsArgs = {
  _set?: InputMaybe<User_Groups_Set_Input>;
  where: User_Groups_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Groups_By_PkArgs = {
  _set?: InputMaybe<User_Groups_Set_Input>;
  pk_columns: User_Groups_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Groups_ManyArgs = {
  updates: Array<User_Groups_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_User_ManyArgs = {
  updates: Array<User_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_User_Planned_TasksArgs = {
  _set?: InputMaybe<User_Planned_Tasks_Set_Input>;
  where: User_Planned_Tasks_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_User_Planned_Tasks_By_PkArgs = {
  _set?: InputMaybe<User_Planned_Tasks_Set_Input>;
  pk_columns: User_Planned_Tasks_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_User_Planned_Tasks_ManyArgs = {
  updates: Array<User_Planned_Tasks_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UsersArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Users_By_PkArgs = {
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_VendorsArgs = {
  _set?: InputMaybe<Vendors_Set_Input>;
  where: Vendors_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Vendors_By_PkArgs = {
  _set?: InputMaybe<Vendors_Set_Input>;
  pk_columns: Vendors_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Vendors_ManyArgs = {
  updates: Array<Vendors_Updates>;
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

/** columns and relationships of "nodes" */
export type Nodes = {
  __typename?: 'nodes';
  address?: Maybe<Scalars['String']['output']>;
  city_id: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "nodes" */
export type Nodes_Aggregate = {
  __typename?: 'nodes_aggregate';
  aggregate?: Maybe<Nodes_Aggregate_Fields>;
  nodes: Array<Nodes>;
};

/** aggregate fields of "nodes" */
export type Nodes_Aggregate_Fields = {
  __typename?: 'nodes_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Nodes_Max_Fields>;
  min?: Maybe<Nodes_Min_Fields>;
};


/** aggregate fields of "nodes" */
export type Nodes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Nodes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "nodes". All fields are combined with a logical 'AND'. */
export type Nodes_Bool_Exp = {
  _and?: InputMaybe<Array<Nodes_Bool_Exp>>;
  _not?: InputMaybe<Nodes_Bool_Exp>;
  _or?: InputMaybe<Array<Nodes_Bool_Exp>>;
  address?: InputMaybe<String_Comparison_Exp>;
  city_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "nodes" */
export enum Nodes_Constraint {
  /** unique or primary key constraint on columns "id" */
  NodesPkey = 'nodes_pkey'
}

/** input type for inserting data into table "nodes" */
export type Nodes_Insert_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Nodes_Max_Fields = {
  __typename?: 'nodes_max_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Nodes_Min_Fields = {
  __typename?: 'nodes_min_fields';
  address?: Maybe<Scalars['String']['output']>;
  city_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "nodes" */
export type Nodes_Mutation_Response = {
  __typename?: 'nodes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Nodes>;
};

/** on_conflict condition type for table "nodes" */
export type Nodes_On_Conflict = {
  constraint: Nodes_Constraint;
  update_columns?: Array<Nodes_Update_Column>;
  where?: InputMaybe<Nodes_Bool_Exp>;
};

/** Ordering options when selecting data from "nodes". */
export type Nodes_Order_By = {
  address?: InputMaybe<Order_By>;
  city_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: nodes */
export type Nodes_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "nodes" */
export enum Nodes_Select_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "nodes" */
export type Nodes_Set_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "nodes" */
export type Nodes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Nodes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Nodes_Stream_Cursor_Value_Input = {
  address?: InputMaybe<Scalars['String']['input']>;
  city_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "nodes" */
export enum Nodes_Update_Column {
  /** column name */
  Address = 'address',
  /** column name */
  CityId = 'city_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Nodes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Nodes_Set_Input>;
  /** filter the rows which have to be updated */
  where: Nodes_Bool_Exp;
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
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "planned_tasks" */
export type Planned_Tasks = {
  __typename?: 'planned_tasks';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  project_id?: Maybe<Scalars['uuid']['output']>;
  rm_task_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
  yaml_url?: Maybe<Scalars['String']['output']>;
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
  count: Scalars['Int']['output'];
  max?: Maybe<Planned_Tasks_Max_Fields>;
  min?: Maybe<Planned_Tasks_Min_Fields>;
};


/** aggregate fields of "planned_tasks" */
export type Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "planned_tasks". All fields are combined with a logical 'AND'. */
export type Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Planned_Tasks_Bool_Exp>>;
  author_id?: InputMaybe<Uuid_Comparison_Exp>;
  description?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  rm_task_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
  time_work_id?: InputMaybe<Uuid_Comparison_Exp>;
  yaml_url?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "planned_tasks" */
export enum Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "id" */
  PlannedTasksPkey = 'planned_tasks_pkey'
}

/** columns and relationships of "planned_tasks_devices" */
export type Planned_Tasks_Devices = {
  __typename?: 'planned_tasks_devices';
  equipment_id: Scalars['uuid']['output'];
  task_id: Scalars['uuid']['output'];
};

/** aggregated selection of "planned_tasks_devices" */
export type Planned_Tasks_Devices_Aggregate = {
  __typename?: 'planned_tasks_devices_aggregate';
  aggregate?: Maybe<Planned_Tasks_Devices_Aggregate_Fields>;
  nodes: Array<Planned_Tasks_Devices>;
};

/** aggregate fields of "planned_tasks_devices" */
export type Planned_Tasks_Devices_Aggregate_Fields = {
  __typename?: 'planned_tasks_devices_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Planned_Tasks_Devices_Max_Fields>;
  min?: Maybe<Planned_Tasks_Devices_Min_Fields>;
};


/** aggregate fields of "planned_tasks_devices" */
export type Planned_Tasks_Devices_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Planned_Tasks_Devices_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "planned_tasks_devices". All fields are combined with a logical 'AND'. */
export type Planned_Tasks_Devices_Bool_Exp = {
  _and?: InputMaybe<Array<Planned_Tasks_Devices_Bool_Exp>>;
  _not?: InputMaybe<Planned_Tasks_Devices_Bool_Exp>;
  _or?: InputMaybe<Array<Planned_Tasks_Devices_Bool_Exp>>;
  equipment_id?: InputMaybe<Uuid_Comparison_Exp>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "planned_tasks_devices" */
export enum Planned_Tasks_Devices_Constraint {
  /** unique or primary key constraint on columns "task_id", "equipment_id" */
  PlannedTasksDevicesPkey = 'planned_tasks_devices_pkey'
}

/** input type for inserting data into table "planned_tasks_devices" */
export type Planned_Tasks_Devices_Insert_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type Planned_Tasks_Devices_Max_Fields = {
  __typename?: 'planned_tasks_devices_max_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type Planned_Tasks_Devices_Min_Fields = {
  __typename?: 'planned_tasks_devices_min_fields';
  equipment_id?: Maybe<Scalars['uuid']['output']>;
  task_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "planned_tasks_devices" */
export type Planned_Tasks_Devices_Mutation_Response = {
  __typename?: 'planned_tasks_devices_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Planned_Tasks_Devices>;
};

/** on_conflict condition type for table "planned_tasks_devices" */
export type Planned_Tasks_Devices_On_Conflict = {
  constraint: Planned_Tasks_Devices_Constraint;
  update_columns?: Array<Planned_Tasks_Devices_Update_Column>;
  where?: InputMaybe<Planned_Tasks_Devices_Bool_Exp>;
};

/** Ordering options when selecting data from "planned_tasks_devices". */
export type Planned_Tasks_Devices_Order_By = {
  equipment_id?: InputMaybe<Order_By>;
  task_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: planned_tasks_devices */
export type Planned_Tasks_Devices_Pk_Columns_Input = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};

/** select columns of table "planned_tasks_devices" */
export enum Planned_Tasks_Devices_Select_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id'
}

/** input type for updating data in table "planned_tasks_devices" */
export type Planned_Tasks_Devices_Set_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "planned_tasks_devices" */
export type Planned_Tasks_Devices_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Planned_Tasks_Devices_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Planned_Tasks_Devices_Stream_Cursor_Value_Input = {
  equipment_id?: InputMaybe<Scalars['uuid']['input']>;
  task_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "planned_tasks_devices" */
export enum Planned_Tasks_Devices_Update_Column {
  /** column name */
  EquipmentId = 'equipment_id',
  /** column name */
  TaskId = 'task_id'
}

export type Planned_Tasks_Devices_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Planned_Tasks_Devices_Set_Input>;
  /** filter the rows which have to be updated */
  where: Planned_Tasks_Devices_Bool_Exp;
};

/** input type for inserting data into table "planned_tasks" */
export type Planned_Tasks_Insert_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Planned_Tasks_Max_Fields = {
  __typename?: 'planned_tasks_max_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  rm_task_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
  yaml_url?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Planned_Tasks_Min_Fields = {
  __typename?: 'planned_tasks_min_fields';
  author_id?: Maybe<Scalars['uuid']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  rm_task_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  time_work_id?: Maybe<Scalars['uuid']['output']>;
  yaml_url?: Maybe<Scalars['String']['output']>;
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
  author_id?: InputMaybe<Order_By>;
  description?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  rm_task_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
  time_work_id?: InputMaybe<Order_By>;
  yaml_url?: InputMaybe<Order_By>;
};

/** primary key columns input for table: planned_tasks */
export type Planned_Tasks_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "planned_tasks" */
export enum Planned_Tasks_Select_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  RmTaskId = 'rm_task_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeWorkId = 'time_work_id',
  /** column name */
  YamlUrl = 'yaml_url'
}

/** input type for updating data in table "planned_tasks" */
export type Planned_Tasks_Set_Input = {
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
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
  author_id?: InputMaybe<Scalars['uuid']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  rm_task_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  time_work_id?: InputMaybe<Scalars['uuid']['input']>;
  yaml_url?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "planned_tasks" */
export enum Planned_Tasks_Update_Column {
  /** column name */
  AuthorId = 'author_id',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  RmTaskId = 'rm_task_id',
  /** column name */
  Status = 'status',
  /** column name */
  TimeWorkId = 'time_work_id',
  /** column name */
  YamlUrl = 'yaml_url'
}

export type Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Planned_Tasks_Bool_Exp;
};

/** columns and relationships of "providers" */
export type Providers = {
  __typename?: 'providers';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "providers" */
export type Providers_Aggregate = {
  __typename?: 'providers_aggregate';
  aggregate?: Maybe<Providers_Aggregate_Fields>;
  nodes: Array<Providers>;
};

/** aggregate fields of "providers" */
export type Providers_Aggregate_Fields = {
  __typename?: 'providers_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Providers_Max_Fields>;
  min?: Maybe<Providers_Min_Fields>;
};


/** aggregate fields of "providers" */
export type Providers_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Providers_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "providers". All fields are combined with a logical 'AND'. */
export type Providers_Bool_Exp = {
  _and?: InputMaybe<Array<Providers_Bool_Exp>>;
  _not?: InputMaybe<Providers_Bool_Exp>;
  _or?: InputMaybe<Array<Providers_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "providers" */
export enum Providers_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = 'providers_pkey'
}

/** input type for inserting data into table "providers" */
export type Providers_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Providers_Max_Fields = {
  __typename?: 'providers_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Providers_Min_Fields = {
  __typename?: 'providers_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "providers" */
export type Providers_Mutation_Response = {
  __typename?: 'providers_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Providers>;
};

/** on_conflict condition type for table "providers" */
export type Providers_On_Conflict = {
  constraint: Providers_Constraint;
  update_columns?: Array<Providers_Update_Column>;
  where?: InputMaybe<Providers_Bool_Exp>;
};

/** Ordering options when selecting data from "providers". */
export type Providers_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: providers */
export type Providers_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "providers" */
export enum Providers_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "providers" */
export type Providers_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "providers" */
export type Providers_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Providers_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Providers_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "providers" */
export enum Providers_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Providers_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Providers_Set_Input>;
  /** filter the rows which have to be updated */
  where: Providers_Bool_Exp;
};

/** columns and relationships of "query" */
export type Query = {
  __typename?: 'query';
  device: Scalars['uuid']['output'];
  id: Scalars['uuid']['output'];
  received_at: Scalars['timestamptz']['output'];
  request_type: Scalars['String']['output'];
  result?: Maybe<Scalars['jsonb']['output']>;
  status: Scalars['String']['output'];
};


/** columns and relationships of "query" */
export type QueryResultArgs = {
  path?: InputMaybe<Scalars['String']['input']>;
};

/** aggregated selection of "query" */
export type Query_Aggregate = {
  __typename?: 'query_aggregate';
  aggregate?: Maybe<Query_Aggregate_Fields>;
  nodes: Array<Query>;
};

/** aggregate fields of "query" */
export type Query_Aggregate_Fields = {
  __typename?: 'query_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Query_Max_Fields>;
  min?: Maybe<Query_Min_Fields>;
};


/** aggregate fields of "query" */
export type Query_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Query_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Query_Append_Input = {
  result?: InputMaybe<Scalars['jsonb']['input']>;
};

/** Boolean expression to filter rows from the table "query". All fields are combined with a logical 'AND'. */
export type Query_Bool_Exp = {
  _and?: InputMaybe<Array<Query_Bool_Exp>>;
  _not?: InputMaybe<Query_Bool_Exp>;
  _or?: InputMaybe<Array<Query_Bool_Exp>>;
  device?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  received_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  request_type?: InputMaybe<String_Comparison_Exp>;
  result?: InputMaybe<Jsonb_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "query" */
export enum Query_Constraint {
  /** unique or primary key constraint on columns "id" */
  QueryPkey = 'query_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Query_Delete_At_Path_Input = {
  result?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Query_Delete_Elem_Input = {
  result?: InputMaybe<Scalars['Int']['input']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Query_Delete_Key_Input = {
  result?: InputMaybe<Scalars['String']['input']>;
};

/** input type for inserting data into table "query" */
export type Query_Insert_Input = {
  device?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  received_at?: InputMaybe<Scalars['timestamptz']['input']>;
  request_type?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Query_Max_Fields = {
  __typename?: 'query_max_fields';
  device?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  received_at?: Maybe<Scalars['timestamptz']['output']>;
  request_type?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Query_Min_Fields = {
  __typename?: 'query_min_fields';
  device?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  received_at?: Maybe<Scalars['timestamptz']['output']>;
  request_type?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "query" */
export type Query_Mutation_Response = {
  __typename?: 'query_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Query>;
};

/** on_conflict condition type for table "query" */
export type Query_On_Conflict = {
  constraint: Query_Constraint;
  update_columns?: Array<Query_Update_Column>;
  where?: InputMaybe<Query_Bool_Exp>;
};

/** Ordering options when selecting data from "query". */
export type Query_Order_By = {
  device?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  received_at?: InputMaybe<Order_By>;
  request_type?: InputMaybe<Order_By>;
  result?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: query */
export type Query_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Query_Prepend_Input = {
  result?: InputMaybe<Scalars['jsonb']['input']>;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "branches" */
  branches: Array<Branches>;
  /** fetch aggregated fields from the table: "branches" */
  branches_aggregate: Branches_Aggregate;
  /** fetch data from the table: "branches" using primary key columns */
  branches_by_pk?: Maybe<Branches>;
  /** fetch data from the table: "cities" */
  cities: Array<Cities>;
  /** fetch aggregated fields from the table: "cities" */
  cities_aggregate: Cities_Aggregate;
  /** fetch data from the table: "cities" using primary key columns */
  cities_by_pk?: Maybe<Cities>;
  /** fetch data from the table: "device_models" */
  device_models: Array<Device_Models>;
  /** fetch aggregated fields from the table: "device_models" */
  device_models_aggregate: Device_Models_Aggregate;
  /** fetch data from the table: "device_models" using primary key columns */
  device_models_by_pk?: Maybe<Device_Models>;
  /** fetch data from the table: "device_roles" */
  device_roles: Array<Device_Roles>;
  /** fetch aggregated fields from the table: "device_roles" */
  device_roles_aggregate: Device_Roles_Aggregate;
  /** fetch data from the table: "device_roles" using primary key columns */
  device_roles_by_pk?: Maybe<Device_Roles>;
  /** fetch data from the table: "devices" */
  devices: Array<Devices>;
  /** fetch aggregated fields from the table: "devices" */
  devices_aggregate: Devices_Aggregate;
  /** fetch data from the table: "devices" using primary key columns */
  devices_by_pk?: Maybe<Devices>;
  /** fetch data from the table: "nodes" */
  nodes: Array<Nodes>;
  /** fetch aggregated fields from the table: "nodes" */
  nodes_aggregate: Nodes_Aggregate;
  /** fetch data from the table: "nodes" using primary key columns */
  nodes_by_pk?: Maybe<Nodes>;
  /** fetch data from the table: "planned_tasks" */
  planned_tasks: Array<Planned_Tasks>;
  /** fetch aggregated fields from the table: "planned_tasks" */
  planned_tasks_aggregate: Planned_Tasks_Aggregate;
  /** fetch data from the table: "planned_tasks" using primary key columns */
  planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** fetch data from the table: "planned_tasks_devices" */
  planned_tasks_devices: Array<Planned_Tasks_Devices>;
  /** fetch aggregated fields from the table: "planned_tasks_devices" */
  planned_tasks_devices_aggregate: Planned_Tasks_Devices_Aggregate;
  /** fetch data from the table: "planned_tasks_devices" using primary key columns */
  planned_tasks_devices_by_pk?: Maybe<Planned_Tasks_Devices>;
  /** fetch data from the table: "providers" */
  providers: Array<Providers>;
  /** fetch aggregated fields from the table: "providers" */
  providers_aggregate: Providers_Aggregate;
  /** fetch data from the table: "providers" using primary key columns */
  providers_by_pk?: Maybe<Providers>;
  /** fetch data from the table: "query" */
  query: Array<Query>;
  /** fetch aggregated fields from the table: "query" */
  query_aggregate: Query_Aggregate;
  /** fetch data from the table: "query" using primary key columns */
  query_by_pk?: Maybe<Query>;
  /** fetch data from the table: "rm_projects" */
  rm_projects: Array<Rm_Projects>;
  /** fetch aggregated fields from the table: "rm_projects" */
  rm_projects_aggregate: Rm_Projects_Aggregate;
  /** fetch data from the table: "rm_projects" using primary key columns */
  rm_projects_by_pk?: Maybe<Rm_Projects>;
  /** fetch data from the table: "rm_tasks" */
  rm_tasks: Array<Rm_Tasks>;
  /** fetch aggregated fields from the table: "rm_tasks" */
  rm_tasks_aggregate: Rm_Tasks_Aggregate;
  /** fetch data from the table: "rm_tasks" using primary key columns */
  rm_tasks_by_pk?: Maybe<Rm_Tasks>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  roles_aggregate: Roles_Aggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roles_by_pk?: Maybe<Roles>;
  /** fetch data from the table: "time_works" */
  time_works: Array<Time_Works>;
  /** fetch aggregated fields from the table: "time_works" */
  time_works_aggregate: Time_Works_Aggregate;
  /** fetch data from the table: "time_works" using primary key columns */
  time_works_by_pk?: Maybe<Time_Works>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "user_groups" */
  user_groups: Array<User_Groups>;
  /** fetch aggregated fields from the table: "user_groups" */
  user_groups_aggregate: User_Groups_Aggregate;
  /** fetch data from the table: "user_groups" using primary key columns */
  user_groups_by_pk?: Maybe<User_Groups>;
  /** fetch data from the table: "user_planned_tasks" */
  user_planned_tasks: Array<User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "user_planned_tasks" */
  user_planned_tasks_aggregate: User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "user_planned_tasks" using primary key columns */
  user_planned_tasks_by_pk?: Maybe<User_Planned_Tasks>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table: "vendors" */
  vendors: Array<Vendors>;
  /** fetch aggregated fields from the table: "vendors" */
  vendors_aggregate: Vendors_Aggregate;
  /** fetch data from the table: "vendors" using primary key columns */
  vendors_by_pk?: Maybe<Vendors>;
  /** fetch data from the table: "works" */
  works: Array<Works>;
  /** fetch aggregated fields from the table: "works" */
  works_aggregate: Works_Aggregate;
  /** fetch data from the table: "works" using primary key columns */
  works_by_pk?: Maybe<Works>;
};


export type Query_RootBranchesArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};


export type Query_RootBranches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};


export type Query_RootBranches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};


export type Query_RootCities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};


export type Query_RootCities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootDevice_ModelsArgs = {
  distinct_on?: InputMaybe<Array<Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Models_Order_By>>;
  where?: InputMaybe<Device_Models_Bool_Exp>;
};


export type Query_RootDevice_Models_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Models_Order_By>>;
  where?: InputMaybe<Device_Models_Bool_Exp>;
};


export type Query_RootDevice_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootDevice_RolesArgs = {
  distinct_on?: InputMaybe<Array<Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Roles_Order_By>>;
  where?: InputMaybe<Device_Roles_Bool_Exp>;
};


export type Query_RootDevice_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Roles_Order_By>>;
  where?: InputMaybe<Device_Roles_Bool_Exp>;
};


export type Query_RootDevice_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootDevicesArgs = {
  distinct_on?: InputMaybe<Array<Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Devices_Order_By>>;
  where?: InputMaybe<Devices_Bool_Exp>;
};


export type Query_RootDevices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Devices_Order_By>>;
  where?: InputMaybe<Devices_Bool_Exp>;
};


export type Query_RootDevices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootNodesArgs = {
  distinct_on?: InputMaybe<Array<Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nodes_Order_By>>;
  where?: InputMaybe<Nodes_Bool_Exp>;
};


export type Query_RootNodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nodes_Order_By>>;
  where?: InputMaybe<Nodes_Bool_Exp>;
};


export type Query_RootNodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
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
  id: Scalars['uuid']['input'];
};


export type Query_RootPlanned_Tasks_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Devices_Bool_Exp>;
};


export type Query_RootPlanned_Tasks_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Devices_Bool_Exp>;
};


export type Query_RootPlanned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};


export type Query_RootProvidersArgs = {
  distinct_on?: InputMaybe<Array<Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Providers_Order_By>>;
  where?: InputMaybe<Providers_Bool_Exp>;
};


export type Query_RootProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Providers_Order_By>>;
  where?: InputMaybe<Providers_Bool_Exp>;
};


export type Query_RootProviders_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootQueryArgs = {
  distinct_on?: InputMaybe<Array<Query_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Query_Order_By>>;
  where?: InputMaybe<Query_Bool_Exp>;
};


export type Query_RootQuery_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Query_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Query_Order_By>>;
  where?: InputMaybe<Query_Bool_Exp>;
};


export type Query_RootQuery_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootRm_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Projects_Order_By>>;
  where?: InputMaybe<Rm_Projects_Bool_Exp>;
};


export type Query_RootRm_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Projects_Order_By>>;
  where?: InputMaybe<Rm_Projects_Bool_Exp>;
};


export type Query_RootRm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootRm_TasksArgs = {
  distinct_on?: InputMaybe<Array<Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Tasks_Order_By>>;
  where?: InputMaybe<Rm_Tasks_Bool_Exp>;
};


export type Query_RootRm_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Tasks_Order_By>>;
  where?: InputMaybe<Rm_Tasks_Bool_Exp>;
};


export type Query_RootRm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootRolesArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};


export type Query_RootRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};


export type Query_RootRoles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootTime_WorksArgs = {
  distinct_on?: InputMaybe<Array<Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Time_Works_Order_By>>;
  where?: InputMaybe<Time_Works_Bool_Exp>;
};


export type Query_RootTime_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Time_Works_Order_By>>;
  where?: InputMaybe<Time_Works_Bool_Exp>;
};


export type Query_RootTime_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Query_RootUser_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Query_RootUser_GroupsArgs = {
  distinct_on?: InputMaybe<Array<User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Groups_Order_By>>;
  where?: InputMaybe<User_Groups_Bool_Exp>;
};


export type Query_RootUser_Groups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Groups_Order_By>>;
  where?: InputMaybe<User_Groups_Bool_Exp>;
};


export type Query_RootUser_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Query_RootUser_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<User_Planned_Tasks_Bool_Exp>;
};


export type Query_RootUser_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<User_Planned_Tasks_Bool_Exp>;
};


export type Query_RootUser_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
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
  id: Scalars['uuid']['input'];
};


export type Query_RootVendorsArgs = {
  distinct_on?: InputMaybe<Array<Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vendors_Order_By>>;
  where?: InputMaybe<Vendors_Bool_Exp>;
};


export type Query_RootVendors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vendors_Order_By>>;
  where?: InputMaybe<Vendors_Bool_Exp>;
};


export type Query_RootVendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
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
  id: Scalars['Int']['input'];
};

/** select columns of table "query" */
export enum Query_Select_Column {
  /** column name */
  Device = 'device',
  /** column name */
  Id = 'id',
  /** column name */
  ReceivedAt = 'received_at',
  /** column name */
  RequestType = 'request_type',
  /** column name */
  Result = 'result',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "query" */
export type Query_Set_Input = {
  device?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  received_at?: InputMaybe<Scalars['timestamptz']['input']>;
  request_type?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "query" */
export type Query_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Query_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Query_Stream_Cursor_Value_Input = {
  device?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  received_at?: InputMaybe<Scalars['timestamptz']['input']>;
  request_type?: InputMaybe<Scalars['String']['input']>;
  result?: InputMaybe<Scalars['jsonb']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "query" */
export enum Query_Update_Column {
  /** column name */
  Device = 'device',
  /** column name */
  Id = 'id',
  /** column name */
  ReceivedAt = 'received_at',
  /** column name */
  RequestType = 'request_type',
  /** column name */
  Result = 'result',
  /** column name */
  Status = 'status'
}

export type Query_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Query_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Query_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Query_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Query_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Query_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Query_Set_Input>;
  /** filter the rows which have to be updated */
  where: Query_Bool_Exp;
};

/** columns and relationships of "rm_projects" */
export type Rm_Projects = {
  __typename?: 'rm_projects';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "rm_projects" */
export type Rm_Projects_Aggregate = {
  __typename?: 'rm_projects_aggregate';
  aggregate?: Maybe<Rm_Projects_Aggregate_Fields>;
  nodes: Array<Rm_Projects>;
};

/** aggregate fields of "rm_projects" */
export type Rm_Projects_Aggregate_Fields = {
  __typename?: 'rm_projects_aggregate_fields';
  avg?: Maybe<Rm_Projects_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rm_Projects_Max_Fields>;
  min?: Maybe<Rm_Projects_Min_Fields>;
  stddev?: Maybe<Rm_Projects_Stddev_Fields>;
  stddev_pop?: Maybe<Rm_Projects_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rm_Projects_Stddev_Samp_Fields>;
  sum?: Maybe<Rm_Projects_Sum_Fields>;
  var_pop?: Maybe<Rm_Projects_Var_Pop_Fields>;
  var_samp?: Maybe<Rm_Projects_Var_Samp_Fields>;
  variance?: Maybe<Rm_Projects_Variance_Fields>;
};


/** aggregate fields of "rm_projects" */
export type Rm_Projects_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rm_Projects_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rm_Projects_Avg_Fields = {
  __typename?: 'rm_projects_avg_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rm_projects". All fields are combined with a logical 'AND'. */
export type Rm_Projects_Bool_Exp = {
  _and?: InputMaybe<Array<Rm_Projects_Bool_Exp>>;
  _not?: InputMaybe<Rm_Projects_Bool_Exp>;
  _or?: InputMaybe<Array<Rm_Projects_Bool_Exp>>;
  ext_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "rm_projects" */
export enum Rm_Projects_Constraint {
  /** unique or primary key constraint on columns "id" */
  RmProjectsPkey = 'rm_projects_pkey'
}

/** input type for incrementing numeric columns in table "rm_projects" */
export type Rm_Projects_Inc_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rm_projects" */
export type Rm_Projects_Insert_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Rm_Projects_Max_Fields = {
  __typename?: 'rm_projects_max_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Rm_Projects_Min_Fields = {
  __typename?: 'rm_projects_min_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "rm_projects" */
export type Rm_Projects_Mutation_Response = {
  __typename?: 'rm_projects_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rm_Projects>;
};

/** on_conflict condition type for table "rm_projects" */
export type Rm_Projects_On_Conflict = {
  constraint: Rm_Projects_Constraint;
  update_columns?: Array<Rm_Projects_Update_Column>;
  where?: InputMaybe<Rm_Projects_Bool_Exp>;
};

/** Ordering options when selecting data from "rm_projects". */
export type Rm_Projects_Order_By = {
  ext_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rm_projects */
export type Rm_Projects_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "rm_projects" */
export enum Rm_Projects_Select_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "rm_projects" */
export type Rm_Projects_Set_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Rm_Projects_Stddev_Fields = {
  __typename?: 'rm_projects_stddev_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rm_Projects_Stddev_Pop_Fields = {
  __typename?: 'rm_projects_stddev_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rm_Projects_Stddev_Samp_Fields = {
  __typename?: 'rm_projects_stddev_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rm_projects" */
export type Rm_Projects_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rm_Projects_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rm_Projects_Stream_Cursor_Value_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Rm_Projects_Sum_Fields = {
  __typename?: 'rm_projects_sum_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rm_projects" */
export enum Rm_Projects_Update_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Rm_Projects_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rm_Projects_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rm_Projects_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rm_Projects_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rm_Projects_Var_Pop_Fields = {
  __typename?: 'rm_projects_var_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rm_Projects_Var_Samp_Fields = {
  __typename?: 'rm_projects_var_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rm_Projects_Variance_Fields = {
  __typename?: 'rm_projects_variance_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "rm_tasks" */
export type Rm_Tasks = {
  __typename?: 'rm_tasks';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
  project_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** aggregated selection of "rm_tasks" */
export type Rm_Tasks_Aggregate = {
  __typename?: 'rm_tasks_aggregate';
  aggregate?: Maybe<Rm_Tasks_Aggregate_Fields>;
  nodes: Array<Rm_Tasks>;
};

/** aggregate fields of "rm_tasks" */
export type Rm_Tasks_Aggregate_Fields = {
  __typename?: 'rm_tasks_aggregate_fields';
  avg?: Maybe<Rm_Tasks_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<Rm_Tasks_Max_Fields>;
  min?: Maybe<Rm_Tasks_Min_Fields>;
  stddev?: Maybe<Rm_Tasks_Stddev_Fields>;
  stddev_pop?: Maybe<Rm_Tasks_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Rm_Tasks_Stddev_Samp_Fields>;
  sum?: Maybe<Rm_Tasks_Sum_Fields>;
  var_pop?: Maybe<Rm_Tasks_Var_Pop_Fields>;
  var_samp?: Maybe<Rm_Tasks_Var_Samp_Fields>;
  variance?: Maybe<Rm_Tasks_Variance_Fields>;
};


/** aggregate fields of "rm_tasks" */
export type Rm_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Rm_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type Rm_Tasks_Avg_Fields = {
  __typename?: 'rm_tasks_avg_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "rm_tasks". All fields are combined with a logical 'AND'. */
export type Rm_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<Rm_Tasks_Bool_Exp>>;
  _not?: InputMaybe<Rm_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<Rm_Tasks_Bool_Exp>>;
  ext_id?: InputMaybe<Int_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  project_id?: InputMaybe<Uuid_Comparison_Exp>;
  status?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "rm_tasks" */
export enum Rm_Tasks_Constraint {
  /** unique or primary key constraint on columns "id" */
  RmTasksPkey = 'rm_tasks_pkey'
}

/** input type for incrementing numeric columns in table "rm_tasks" */
export type Rm_Tasks_Inc_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "rm_tasks" */
export type Rm_Tasks_Insert_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Rm_Tasks_Max_Fields = {
  __typename?: 'rm_tasks_max_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Rm_Tasks_Min_Fields = {
  __typename?: 'rm_tasks_min_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  project_id?: Maybe<Scalars['uuid']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "rm_tasks" */
export type Rm_Tasks_Mutation_Response = {
  __typename?: 'rm_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Rm_Tasks>;
};

/** on_conflict condition type for table "rm_tasks" */
export type Rm_Tasks_On_Conflict = {
  constraint: Rm_Tasks_Constraint;
  update_columns?: Array<Rm_Tasks_Update_Column>;
  where?: InputMaybe<Rm_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "rm_tasks". */
export type Rm_Tasks_Order_By = {
  ext_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  project_id?: InputMaybe<Order_By>;
  status?: InputMaybe<Order_By>;
};

/** primary key columns input for table: rm_tasks */
export type Rm_Tasks_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "rm_tasks" */
export enum Rm_Tasks_Select_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  Status = 'status'
}

/** input type for updating data in table "rm_tasks" */
export type Rm_Tasks_Set_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type Rm_Tasks_Stddev_Fields = {
  __typename?: 'rm_tasks_stddev_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Rm_Tasks_Stddev_Pop_Fields = {
  __typename?: 'rm_tasks_stddev_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Rm_Tasks_Stddev_Samp_Fields = {
  __typename?: 'rm_tasks_stddev_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "rm_tasks" */
export type Rm_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Rm_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Rm_Tasks_Stream_Cursor_Value_Input = {
  ext_id?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  project_id?: InputMaybe<Scalars['uuid']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type Rm_Tasks_Sum_Fields = {
  __typename?: 'rm_tasks_sum_fields';
  ext_id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "rm_tasks" */
export enum Rm_Tasks_Update_Column {
  /** column name */
  ExtId = 'ext_id',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  ProjectId = 'project_id',
  /** column name */
  Status = 'status'
}

export type Rm_Tasks_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Rm_Tasks_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Rm_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: Rm_Tasks_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Rm_Tasks_Var_Pop_Fields = {
  __typename?: 'rm_tasks_var_pop_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Rm_Tasks_Var_Samp_Fields = {
  __typename?: 'rm_tasks_var_samp_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Rm_Tasks_Variance_Fields = {
  __typename?: 'rm_tasks_variance_fields';
  ext_id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "roles" */
export type Roles = {
  __typename?: 'roles';
  id: Scalars['uuid']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "roles" */
export type Roles_Aggregate = {
  __typename?: 'roles_aggregate';
  aggregate?: Maybe<Roles_Aggregate_Fields>;
  nodes: Array<Roles>;
};

/** aggregate fields of "roles" */
export type Roles_Aggregate_Fields = {
  __typename?: 'roles_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Roles_Max_Fields>;
  min?: Maybe<Roles_Min_Fields>;
};


/** aggregate fields of "roles" */
export type Roles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Roles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "roles". All fields are combined with a logical 'AND'. */
export type Roles_Bool_Exp = {
  _and?: InputMaybe<Array<Roles_Bool_Exp>>;
  _not?: InputMaybe<Roles_Bool_Exp>;
  _or?: InputMaybe<Array<Roles_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "roles" */
export enum Roles_Constraint {
  /** unique or primary key constraint on columns "id" */
  RolesPkey = 'roles_pkey'
}

/** input type for inserting data into table "roles" */
export type Roles_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Roles_Max_Fields = {
  __typename?: 'roles_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Roles_Min_Fields = {
  __typename?: 'roles_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "roles" */
export type Roles_Mutation_Response = {
  __typename?: 'roles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Roles>;
};

/** on_conflict condition type for table "roles" */
export type Roles_On_Conflict = {
  constraint: Roles_Constraint;
  update_columns?: Array<Roles_Update_Column>;
  where?: InputMaybe<Roles_Bool_Exp>;
};

/** Ordering options when selecting data from "roles". */
export type Roles_Order_By = {
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: roles */
export type Roles_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "roles" */
export enum Roles_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role'
}

/** input type for updating data in table "roles" */
export type Roles_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "roles" */
export type Roles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Roles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Roles_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "roles" */
export enum Roles_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role'
}

export type Roles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Roles_Set_Input>;
  /** filter the rows which have to be updated */
  where: Roles_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "branches" */
  branches: Array<Branches>;
  /** fetch aggregated fields from the table: "branches" */
  branches_aggregate: Branches_Aggregate;
  /** fetch data from the table: "branches" using primary key columns */
  branches_by_pk?: Maybe<Branches>;
  /** fetch data from the table in a streaming manner: "branches" */
  branches_stream: Array<Branches>;
  /** fetch data from the table: "cities" */
  cities: Array<Cities>;
  /** fetch aggregated fields from the table: "cities" */
  cities_aggregate: Cities_Aggregate;
  /** fetch data from the table: "cities" using primary key columns */
  cities_by_pk?: Maybe<Cities>;
  /** fetch data from the table in a streaming manner: "cities" */
  cities_stream: Array<Cities>;
  /** fetch data from the table: "device_models" */
  device_models: Array<Device_Models>;
  /** fetch aggregated fields from the table: "device_models" */
  device_models_aggregate: Device_Models_Aggregate;
  /** fetch data from the table: "device_models" using primary key columns */
  device_models_by_pk?: Maybe<Device_Models>;
  /** fetch data from the table in a streaming manner: "device_models" */
  device_models_stream: Array<Device_Models>;
  /** fetch data from the table: "device_roles" */
  device_roles: Array<Device_Roles>;
  /** fetch aggregated fields from the table: "device_roles" */
  device_roles_aggregate: Device_Roles_Aggregate;
  /** fetch data from the table: "device_roles" using primary key columns */
  device_roles_by_pk?: Maybe<Device_Roles>;
  /** fetch data from the table in a streaming manner: "device_roles" */
  device_roles_stream: Array<Device_Roles>;
  /** fetch data from the table: "devices" */
  devices: Array<Devices>;
  /** fetch aggregated fields from the table: "devices" */
  devices_aggregate: Devices_Aggregate;
  /** fetch data from the table: "devices" using primary key columns */
  devices_by_pk?: Maybe<Devices>;
  /** fetch data from the table in a streaming manner: "devices" */
  devices_stream: Array<Devices>;
  /** fetch data from the table: "nodes" */
  nodes: Array<Nodes>;
  /** fetch aggregated fields from the table: "nodes" */
  nodes_aggregate: Nodes_Aggregate;
  /** fetch data from the table: "nodes" using primary key columns */
  nodes_by_pk?: Maybe<Nodes>;
  /** fetch data from the table in a streaming manner: "nodes" */
  nodes_stream: Array<Nodes>;
  /** fetch data from the table: "planned_tasks" */
  planned_tasks: Array<Planned_Tasks>;
  /** fetch aggregated fields from the table: "planned_tasks" */
  planned_tasks_aggregate: Planned_Tasks_Aggregate;
  /** fetch data from the table: "planned_tasks" using primary key columns */
  planned_tasks_by_pk?: Maybe<Planned_Tasks>;
  /** fetch data from the table: "planned_tasks_devices" */
  planned_tasks_devices: Array<Planned_Tasks_Devices>;
  /** fetch aggregated fields from the table: "planned_tasks_devices" */
  planned_tasks_devices_aggregate: Planned_Tasks_Devices_Aggregate;
  /** fetch data from the table: "planned_tasks_devices" using primary key columns */
  planned_tasks_devices_by_pk?: Maybe<Planned_Tasks_Devices>;
  /** fetch data from the table in a streaming manner: "planned_tasks_devices" */
  planned_tasks_devices_stream: Array<Planned_Tasks_Devices>;
  /** fetch data from the table in a streaming manner: "planned_tasks" */
  planned_tasks_stream: Array<Planned_Tasks>;
  /** fetch data from the table: "providers" */
  providers: Array<Providers>;
  /** fetch aggregated fields from the table: "providers" */
  providers_aggregate: Providers_Aggregate;
  /** fetch data from the table: "providers" using primary key columns */
  providers_by_pk?: Maybe<Providers>;
  /** fetch data from the table in a streaming manner: "providers" */
  providers_stream: Array<Providers>;
  /** fetch data from the table: "query" */
  query: Array<Query>;
  /** fetch aggregated fields from the table: "query" */
  query_aggregate: Query_Aggregate;
  /** fetch data from the table: "query" using primary key columns */
  query_by_pk?: Maybe<Query>;
  /** fetch data from the table in a streaming manner: "query" */
  query_stream: Array<Query>;
  /** fetch data from the table: "rm_projects" */
  rm_projects: Array<Rm_Projects>;
  /** fetch aggregated fields from the table: "rm_projects" */
  rm_projects_aggregate: Rm_Projects_Aggregate;
  /** fetch data from the table: "rm_projects" using primary key columns */
  rm_projects_by_pk?: Maybe<Rm_Projects>;
  /** fetch data from the table in a streaming manner: "rm_projects" */
  rm_projects_stream: Array<Rm_Projects>;
  /** fetch data from the table: "rm_tasks" */
  rm_tasks: Array<Rm_Tasks>;
  /** fetch aggregated fields from the table: "rm_tasks" */
  rm_tasks_aggregate: Rm_Tasks_Aggregate;
  /** fetch data from the table: "rm_tasks" using primary key columns */
  rm_tasks_by_pk?: Maybe<Rm_Tasks>;
  /** fetch data from the table in a streaming manner: "rm_tasks" */
  rm_tasks_stream: Array<Rm_Tasks>;
  /** fetch data from the table: "roles" */
  roles: Array<Roles>;
  /** fetch aggregated fields from the table: "roles" */
  roles_aggregate: Roles_Aggregate;
  /** fetch data from the table: "roles" using primary key columns */
  roles_by_pk?: Maybe<Roles>;
  /** fetch data from the table in a streaming manner: "roles" */
  roles_stream: Array<Roles>;
  /** fetch data from the table: "time_works" */
  time_works: Array<Time_Works>;
  /** fetch aggregated fields from the table: "time_works" */
  time_works_aggregate: Time_Works_Aggregate;
  /** fetch data from the table: "time_works" using primary key columns */
  time_works_by_pk?: Maybe<Time_Works>;
  /** fetch data from the table in a streaming manner: "time_works" */
  time_works_stream: Array<Time_Works>;
  /** fetch data from the table: "user" */
  user: Array<User>;
  /** fetch aggregated fields from the table: "user" */
  user_aggregate: User_Aggregate;
  /** fetch data from the table: "user" using primary key columns */
  user_by_pk?: Maybe<User>;
  /** fetch data from the table: "user_groups" */
  user_groups: Array<User_Groups>;
  /** fetch aggregated fields from the table: "user_groups" */
  user_groups_aggregate: User_Groups_Aggregate;
  /** fetch data from the table: "user_groups" using primary key columns */
  user_groups_by_pk?: Maybe<User_Groups>;
  /** fetch data from the table in a streaming manner: "user_groups" */
  user_groups_stream: Array<User_Groups>;
  /** fetch data from the table: "user_planned_tasks" */
  user_planned_tasks: Array<User_Planned_Tasks>;
  /** fetch aggregated fields from the table: "user_planned_tasks" */
  user_planned_tasks_aggregate: User_Planned_Tasks_Aggregate;
  /** fetch data from the table: "user_planned_tasks" using primary key columns */
  user_planned_tasks_by_pk?: Maybe<User_Planned_Tasks>;
  /** fetch data from the table in a streaming manner: "user_planned_tasks" */
  user_planned_tasks_stream: Array<User_Planned_Tasks>;
  /** fetch data from the table in a streaming manner: "user" */
  user_stream: Array<User>;
  /** fetch data from the table: "users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "users" */
  users_aggregate: Users_Aggregate;
  /** fetch data from the table: "users" using primary key columns */
  users_by_pk?: Maybe<Users>;
  /** fetch data from the table in a streaming manner: "users" */
  users_stream: Array<Users>;
  /** fetch data from the table: "vendors" */
  vendors: Array<Vendors>;
  /** fetch aggregated fields from the table: "vendors" */
  vendors_aggregate: Vendors_Aggregate;
  /** fetch data from the table: "vendors" using primary key columns */
  vendors_by_pk?: Maybe<Vendors>;
  /** fetch data from the table in a streaming manner: "vendors" */
  vendors_stream: Array<Vendors>;
  /** fetch data from the table: "works" */
  works: Array<Works>;
  /** fetch aggregated fields from the table: "works" */
  works_aggregate: Works_Aggregate;
  /** fetch data from the table: "works" using primary key columns */
  works_by_pk?: Maybe<Works>;
  /** fetch data from the table in a streaming manner: "works" */
  works_stream: Array<Works>;
};


export type Subscription_RootBranchesArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};


export type Subscription_RootBranches_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Branches_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Branches_Order_By>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};


export type Subscription_RootBranches_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootBranches_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Branches_Stream_Cursor_Input>>;
  where?: InputMaybe<Branches_Bool_Exp>;
};


export type Subscription_RootCitiesArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};


export type Subscription_RootCities_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Cities_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Cities_Order_By>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};


export type Subscription_RootCities_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootCities_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Cities_Stream_Cursor_Input>>;
  where?: InputMaybe<Cities_Bool_Exp>;
};


export type Subscription_RootDevice_ModelsArgs = {
  distinct_on?: InputMaybe<Array<Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Models_Order_By>>;
  where?: InputMaybe<Device_Models_Bool_Exp>;
};


export type Subscription_RootDevice_Models_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Device_Models_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Models_Order_By>>;
  where?: InputMaybe<Device_Models_Bool_Exp>;
};


export type Subscription_RootDevice_Models_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootDevice_Models_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Device_Models_Stream_Cursor_Input>>;
  where?: InputMaybe<Device_Models_Bool_Exp>;
};


export type Subscription_RootDevice_RolesArgs = {
  distinct_on?: InputMaybe<Array<Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Roles_Order_By>>;
  where?: InputMaybe<Device_Roles_Bool_Exp>;
};


export type Subscription_RootDevice_Roles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Device_Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Device_Roles_Order_By>>;
  where?: InputMaybe<Device_Roles_Bool_Exp>;
};


export type Subscription_RootDevice_Roles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootDevice_Roles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Device_Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Device_Roles_Bool_Exp>;
};


export type Subscription_RootDevicesArgs = {
  distinct_on?: InputMaybe<Array<Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Devices_Order_By>>;
  where?: InputMaybe<Devices_Bool_Exp>;
};


export type Subscription_RootDevices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Devices_Order_By>>;
  where?: InputMaybe<Devices_Bool_Exp>;
};


export type Subscription_RootDevices_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootDevices_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Devices_Stream_Cursor_Input>>;
  where?: InputMaybe<Devices_Bool_Exp>;
};


export type Subscription_RootNodesArgs = {
  distinct_on?: InputMaybe<Array<Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nodes_Order_By>>;
  where?: InputMaybe<Nodes_Bool_Exp>;
};


export type Subscription_RootNodes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Nodes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Nodes_Order_By>>;
  where?: InputMaybe<Nodes_Bool_Exp>;
};


export type Subscription_RootNodes_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootNodes_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Nodes_Stream_Cursor_Input>>;
  where?: InputMaybe<Nodes_Bool_Exp>;
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
  id: Scalars['uuid']['input'];
};


export type Subscription_RootPlanned_Tasks_DevicesArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Devices_Bool_Exp>;
};


export type Subscription_RootPlanned_Tasks_Devices_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Planned_Tasks_Devices_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Planned_Tasks_Devices_Order_By>>;
  where?: InputMaybe<Planned_Tasks_Devices_Bool_Exp>;
};


export type Subscription_RootPlanned_Tasks_Devices_By_PkArgs = {
  equipment_id: Scalars['uuid']['input'];
  task_id: Scalars['uuid']['input'];
};


export type Subscription_RootPlanned_Tasks_Devices_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Planned_Tasks_Devices_Stream_Cursor_Input>>;
  where?: InputMaybe<Planned_Tasks_Devices_Bool_Exp>;
};


export type Subscription_RootPlanned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Planned_Tasks_Bool_Exp>;
};


export type Subscription_RootProvidersArgs = {
  distinct_on?: InputMaybe<Array<Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Providers_Order_By>>;
  where?: InputMaybe<Providers_Bool_Exp>;
};


export type Subscription_RootProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Providers_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Providers_Order_By>>;
  where?: InputMaybe<Providers_Bool_Exp>;
};


export type Subscription_RootProviders_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootProviders_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Providers_Stream_Cursor_Input>>;
  where?: InputMaybe<Providers_Bool_Exp>;
};


export type Subscription_RootQueryArgs = {
  distinct_on?: InputMaybe<Array<Query_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Query_Order_By>>;
  where?: InputMaybe<Query_Bool_Exp>;
};


export type Subscription_RootQuery_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Query_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Query_Order_By>>;
  where?: InputMaybe<Query_Bool_Exp>;
};


export type Subscription_RootQuery_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootQuery_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Query_Stream_Cursor_Input>>;
  where?: InputMaybe<Query_Bool_Exp>;
};


export type Subscription_RootRm_ProjectsArgs = {
  distinct_on?: InputMaybe<Array<Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Projects_Order_By>>;
  where?: InputMaybe<Rm_Projects_Bool_Exp>;
};


export type Subscription_RootRm_Projects_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rm_Projects_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Projects_Order_By>>;
  where?: InputMaybe<Rm_Projects_Bool_Exp>;
};


export type Subscription_RootRm_Projects_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRm_Projects_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rm_Projects_Stream_Cursor_Input>>;
  where?: InputMaybe<Rm_Projects_Bool_Exp>;
};


export type Subscription_RootRm_TasksArgs = {
  distinct_on?: InputMaybe<Array<Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Tasks_Order_By>>;
  where?: InputMaybe<Rm_Tasks_Bool_Exp>;
};


export type Subscription_RootRm_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Rm_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Rm_Tasks_Order_By>>;
  where?: InputMaybe<Rm_Tasks_Bool_Exp>;
};


export type Subscription_RootRm_Tasks_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRm_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Rm_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<Rm_Tasks_Bool_Exp>;
};


export type Subscription_RootRolesArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};


export type Subscription_RootRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Roles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Roles_Order_By>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};


export type Subscription_RootRoles_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootRoles_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Roles_Stream_Cursor_Input>>;
  where?: InputMaybe<Roles_Bool_Exp>;
};


export type Subscription_RootTime_WorksArgs = {
  distinct_on?: InputMaybe<Array<Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Time_Works_Order_By>>;
  where?: InputMaybe<Time_Works_Bool_Exp>;
};


export type Subscription_RootTime_Works_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Time_Works_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Time_Works_Order_By>>;
  where?: InputMaybe<Time_Works_Bool_Exp>;
};


export type Subscription_RootTime_Works_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootTime_Works_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Time_Works_Stream_Cursor_Input>>;
  where?: InputMaybe<Time_Works_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Order_By>>;
  where?: InputMaybe<User_Bool_Exp>;
};


export type Subscription_RootUser_By_PkArgs = {
  id: Scalars['Int']['input'];
};


export type Subscription_RootUser_GroupsArgs = {
  distinct_on?: InputMaybe<Array<User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Groups_Order_By>>;
  where?: InputMaybe<User_Groups_Bool_Exp>;
};


export type Subscription_RootUser_Groups_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Groups_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Groups_Order_By>>;
  where?: InputMaybe<User_Groups_Bool_Exp>;
};


export type Subscription_RootUser_Groups_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUser_Groups_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Groups_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Groups_Bool_Exp>;
};


export type Subscription_RootUser_Planned_TasksArgs = {
  distinct_on?: InputMaybe<Array<User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<User_Planned_Tasks_Bool_Exp>;
};


export type Subscription_RootUser_Planned_Tasks_AggregateArgs = {
  distinct_on?: InputMaybe<Array<User_Planned_Tasks_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<User_Planned_Tasks_Order_By>>;
  where?: InputMaybe<User_Planned_Tasks_Bool_Exp>;
};


export type Subscription_RootUser_Planned_Tasks_By_PkArgs = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};


export type Subscription_RootUser_Planned_Tasks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Planned_Tasks_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Planned_Tasks_Bool_Exp>;
};


export type Subscription_RootUser_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<User_Stream_Cursor_Input>>;
  where?: InputMaybe<User_Bool_Exp>;
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
  id: Scalars['uuid']['input'];
};


export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootVendorsArgs = {
  distinct_on?: InputMaybe<Array<Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vendors_Order_By>>;
  where?: InputMaybe<Vendors_Bool_Exp>;
};


export type Subscription_RootVendors_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Vendors_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<Array<Vendors_Order_By>>;
  where?: InputMaybe<Vendors_Bool_Exp>;
};


export type Subscription_RootVendors_By_PkArgs = {
  id: Scalars['uuid']['input'];
};


export type Subscription_RootVendors_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Vendors_Stream_Cursor_Input>>;
  where?: InputMaybe<Vendors_Bool_Exp>;
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
  id: Scalars['Int']['input'];
};


export type Subscription_RootWorks_StreamArgs = {
  batch_size: Scalars['Int']['input'];
  cursor: Array<InputMaybe<Works_Stream_Cursor_Input>>;
  where?: InputMaybe<Works_Bool_Exp>;
};

/** columns and relationships of "time_works" */
export type Time_Works = {
  __typename?: 'time_works';
  end_at?: Maybe<Scalars['timestamptz']['output']>;
  id: Scalars['uuid']['output'];
  start_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregated selection of "time_works" */
export type Time_Works_Aggregate = {
  __typename?: 'time_works_aggregate';
  aggregate?: Maybe<Time_Works_Aggregate_Fields>;
  nodes: Array<Time_Works>;
};

/** aggregate fields of "time_works" */
export type Time_Works_Aggregate_Fields = {
  __typename?: 'time_works_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Time_Works_Max_Fields>;
  min?: Maybe<Time_Works_Min_Fields>;
};


/** aggregate fields of "time_works" */
export type Time_Works_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Time_Works_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "time_works". All fields are combined with a logical 'AND'. */
export type Time_Works_Bool_Exp = {
  _and?: InputMaybe<Array<Time_Works_Bool_Exp>>;
  _not?: InputMaybe<Time_Works_Bool_Exp>;
  _or?: InputMaybe<Array<Time_Works_Bool_Exp>>;
  end_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  start_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "time_works" */
export enum Time_Works_Constraint {
  /** unique or primary key constraint on columns "id" */
  TimeWorksPkey = 'time_works_pkey'
}

/** input type for inserting data into table "time_works" */
export type Time_Works_Insert_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** aggregate max on columns */
export type Time_Works_Max_Fields = {
  __typename?: 'time_works_max_fields';
  end_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** aggregate min on columns */
export type Time_Works_Min_Fields = {
  __typename?: 'time_works_min_fields';
  end_at?: Maybe<Scalars['timestamptz']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  start_at?: Maybe<Scalars['timestamptz']['output']>;
};

/** response of any mutation on the table "time_works" */
export type Time_Works_Mutation_Response = {
  __typename?: 'time_works_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Time_Works>;
};

/** on_conflict condition type for table "time_works" */
export type Time_Works_On_Conflict = {
  constraint: Time_Works_Constraint;
  update_columns?: Array<Time_Works_Update_Column>;
  where?: InputMaybe<Time_Works_Bool_Exp>;
};

/** Ordering options when selecting data from "time_works". */
export type Time_Works_Order_By = {
  end_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  start_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: time_works */
export type Time_Works_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "time_works" */
export enum Time_Works_Select_Column {
  /** column name */
  EndAt = 'end_at',
  /** column name */
  Id = 'id',
  /** column name */
  StartAt = 'start_at'
}

/** input type for updating data in table "time_works" */
export type Time_Works_Set_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** Streaming cursor of the table "time_works" */
export type Time_Works_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Time_Works_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Time_Works_Stream_Cursor_Value_Input = {
  end_at?: InputMaybe<Scalars['timestamptz']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  start_at?: InputMaybe<Scalars['timestamptz']['input']>;
};

/** update columns of table "time_works" */
export enum Time_Works_Update_Column {
  /** column name */
  EndAt = 'end_at',
  /** column name */
  Id = 'id',
  /** column name */
  StartAt = 'start_at'
}

export type Time_Works_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Time_Works_Set_Input>;
  /** filter the rows which have to be updated */
  where: Time_Works_Bool_Exp;
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

/** columns and relationships of "user" */
export type User = {
  __typename?: 'user';
  author: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  role: Scalars['String']['output'];
};

/** aggregated selection of "user" */
export type User_Aggregate = {
  __typename?: 'user_aggregate';
  aggregate?: Maybe<User_Aggregate_Fields>;
  nodes: Array<User>;
};

/** aggregate fields of "user" */
export type User_Aggregate_Fields = {
  __typename?: 'user_aggregate_fields';
  avg?: Maybe<User_Avg_Fields>;
  count: Scalars['Int']['output'];
  max?: Maybe<User_Max_Fields>;
  min?: Maybe<User_Min_Fields>;
  stddev?: Maybe<User_Stddev_Fields>;
  stddev_pop?: Maybe<User_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<User_Stddev_Samp_Fields>;
  sum?: Maybe<User_Sum_Fields>;
  var_pop?: Maybe<User_Var_Pop_Fields>;
  var_samp?: Maybe<User_Var_Samp_Fields>;
  variance?: Maybe<User_Variance_Fields>;
};


/** aggregate fields of "user" */
export type User_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** aggregate avg on columns */
export type User_Avg_Fields = {
  __typename?: 'user_avg_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Boolean expression to filter rows from the table "user". All fields are combined with a logical 'AND'. */
export type User_Bool_Exp = {
  _and?: InputMaybe<Array<User_Bool_Exp>>;
  _not?: InputMaybe<User_Bool_Exp>;
  _or?: InputMaybe<Array<User_Bool_Exp>>;
  author?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Int_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user" */
export enum User_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserPkey = 'user_pkey'
}

/** columns and relationships of "user_groups" */
export type User_Groups = {
  __typename?: 'user_groups';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "user_groups" */
export type User_Groups_Aggregate = {
  __typename?: 'user_groups_aggregate';
  aggregate?: Maybe<User_Groups_Aggregate_Fields>;
  nodes: Array<User_Groups>;
};

/** aggregate fields of "user_groups" */
export type User_Groups_Aggregate_Fields = {
  __typename?: 'user_groups_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Groups_Max_Fields>;
  min?: Maybe<User_Groups_Min_Fields>;
};


/** aggregate fields of "user_groups" */
export type User_Groups_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Groups_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "user_groups". All fields are combined with a logical 'AND'. */
export type User_Groups_Bool_Exp = {
  _and?: InputMaybe<Array<User_Groups_Bool_Exp>>;
  _not?: InputMaybe<User_Groups_Bool_Exp>;
  _or?: InputMaybe<Array<User_Groups_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_groups" */
export enum User_Groups_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserGroupsPkey = 'user_groups_pkey'
}

/** input type for inserting data into table "user_groups" */
export type User_Groups_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type User_Groups_Max_Fields = {
  __typename?: 'user_groups_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type User_Groups_Min_Fields = {
  __typename?: 'user_groups_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "user_groups" */
export type User_Groups_Mutation_Response = {
  __typename?: 'user_groups_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Groups>;
};

/** on_conflict condition type for table "user_groups" */
export type User_Groups_On_Conflict = {
  constraint: User_Groups_Constraint;
  update_columns?: Array<User_Groups_Update_Column>;
  where?: InputMaybe<User_Groups_Bool_Exp>;
};

/** Ordering options when selecting data from "user_groups". */
export type User_Groups_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_groups */
export type User_Groups_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "user_groups" */
export enum User_Groups_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "user_groups" */
export type User_Groups_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "user_groups" */
export type User_Groups_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Groups_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Groups_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "user_groups" */
export enum User_Groups_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type User_Groups_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Groups_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Groups_Bool_Exp;
};

/** input type for incrementing numeric columns in table "user" */
export type User_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "user" */
export type User_Insert_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type User_Max_Fields = {
  __typename?: 'user_max_fields';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type User_Min_Fields = {
  __typename?: 'user_min_fields';
  author?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  role?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "user" */
export type User_Mutation_Response = {
  __typename?: 'user_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User>;
};

/** on_conflict condition type for table "user" */
export type User_On_Conflict = {
  constraint: User_Constraint;
  update_columns?: Array<User_Update_Column>;
  where?: InputMaybe<User_Bool_Exp>;
};

/** Ordering options when selecting data from "user". */
export type User_Order_By = {
  author?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user */
export type User_Pk_Columns_Input = {
  id: Scalars['Int']['input'];
};

/** columns and relationships of "user_planned_tasks" */
export type User_Planned_Tasks = {
  __typename?: 'user_planned_tasks';
  task_id: Scalars['uuid']['output'];
  user_id: Scalars['uuid']['output'];
};

/** aggregated selection of "user_planned_tasks" */
export type User_Planned_Tasks_Aggregate = {
  __typename?: 'user_planned_tasks_aggregate';
  aggregate?: Maybe<User_Planned_Tasks_Aggregate_Fields>;
  nodes: Array<User_Planned_Tasks>;
};

/** aggregate fields of "user_planned_tasks" */
export type User_Planned_Tasks_Aggregate_Fields = {
  __typename?: 'user_planned_tasks_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<User_Planned_Tasks_Max_Fields>;
  min?: Maybe<User_Planned_Tasks_Min_Fields>;
};


/** aggregate fields of "user_planned_tasks" */
export type User_Planned_Tasks_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<User_Planned_Tasks_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "user_planned_tasks". All fields are combined with a logical 'AND'. */
export type User_Planned_Tasks_Bool_Exp = {
  _and?: InputMaybe<Array<User_Planned_Tasks_Bool_Exp>>;
  _not?: InputMaybe<User_Planned_Tasks_Bool_Exp>;
  _or?: InputMaybe<Array<User_Planned_Tasks_Bool_Exp>>;
  task_id?: InputMaybe<Uuid_Comparison_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_planned_tasks" */
export enum User_Planned_Tasks_Constraint {
  /** unique or primary key constraint on columns "user_id", "task_id" */
  UserPlannedTasksPkey = 'user_planned_tasks_pkey'
}

/** input type for inserting data into table "user_planned_tasks" */
export type User_Planned_Tasks_Insert_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** aggregate max on columns */
export type User_Planned_Tasks_Max_Fields = {
  __typename?: 'user_planned_tasks_max_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** aggregate min on columns */
export type User_Planned_Tasks_Min_Fields = {
  __typename?: 'user_planned_tasks_min_fields';
  task_id?: Maybe<Scalars['uuid']['output']>;
  user_id?: Maybe<Scalars['uuid']['output']>;
};

/** response of any mutation on the table "user_planned_tasks" */
export type User_Planned_Tasks_Mutation_Response = {
  __typename?: 'user_planned_tasks_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<User_Planned_Tasks>;
};

/** on_conflict condition type for table "user_planned_tasks" */
export type User_Planned_Tasks_On_Conflict = {
  constraint: User_Planned_Tasks_Constraint;
  update_columns?: Array<User_Planned_Tasks_Update_Column>;
  where?: InputMaybe<User_Planned_Tasks_Bool_Exp>;
};

/** Ordering options when selecting data from "user_planned_tasks". */
export type User_Planned_Tasks_Order_By = {
  task_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_planned_tasks */
export type User_Planned_Tasks_Pk_Columns_Input = {
  task_id: Scalars['uuid']['input'];
  user_id: Scalars['uuid']['input'];
};

/** select columns of table "user_planned_tasks" */
export enum User_Planned_Tasks_Select_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id'
}

/** input type for updating data in table "user_planned_tasks" */
export type User_Planned_Tasks_Set_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** Streaming cursor of the table "user_planned_tasks" */
export type User_Planned_Tasks_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Planned_Tasks_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Planned_Tasks_Stream_Cursor_Value_Input = {
  task_id?: InputMaybe<Scalars['uuid']['input']>;
  user_id?: InputMaybe<Scalars['uuid']['input']>;
};

/** update columns of table "user_planned_tasks" */
export enum User_Planned_Tasks_Update_Column {
  /** column name */
  TaskId = 'task_id',
  /** column name */
  UserId = 'user_id'
}

export type User_Planned_Tasks_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Planned_Tasks_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Planned_Tasks_Bool_Exp;
};

/** select columns of table "user" */
export enum User_Select_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role'
}

/** input type for updating data in table "user" */
export type User_Set_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate stddev on columns */
export type User_Stddev_Fields = {
  __typename?: 'user_stddev_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type User_Stddev_Pop_Fields = {
  __typename?: 'user_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type User_Stddev_Samp_Fields = {
  __typename?: 'user_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** Streaming cursor of the table "user" */
export type User_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: User_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type User_Stream_Cursor_Value_Input = {
  author?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate sum on columns */
export type User_Sum_Fields = {
  __typename?: 'user_sum_fields';
  id?: Maybe<Scalars['Int']['output']>;
};

/** update columns of table "user" */
export enum User_Update_Column {
  /** column name */
  Author = 'author',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role'
}

export type User_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<User_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<User_Set_Input>;
  /** filter the rows which have to be updated */
  where: User_Bool_Exp;
};

/** aggregate var_pop on columns */
export type User_Var_Pop_Fields = {
  __typename?: 'user_var_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type User_Var_Samp_Fields = {
  __typename?: 'user_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type User_Variance_Fields = {
  __typename?: 'user_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
};

/** columns and relationships of "users" */
export type Users = {
  __typename?: 'users';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  group_id?: Maybe<Scalars['uuid']['output']>;
  id: Scalars['uuid']['output'];
  is_active?: Maybe<Scalars['Boolean']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
  team_lead_id?: Maybe<Scalars['uuid']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
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
  count: Scalars['Int']['output'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  email?: InputMaybe<String_Comparison_Exp>;
  first_name?: InputMaybe<String_Comparison_Exp>;
  group_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_active?: InputMaybe<Boolean_Comparison_Exp>;
  last_name?: InputMaybe<String_Comparison_Exp>;
  middle_name?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  role_id?: InputMaybe<Uuid_Comparison_Exp>;
  team_lead_id?: InputMaybe<Uuid_Comparison_Exp>;
  time_zone?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey'
}

/** input type for inserting data into table "users" */
export type Users_Insert_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  team_lead_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  group_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
  team_lead_id?: Maybe<Scalars['uuid']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  group_id?: Maybe<Scalars['uuid']['output']>;
  id?: Maybe<Scalars['uuid']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
  middle_name?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  role_id?: Maybe<Scalars['uuid']['output']>;
  team_lead_id?: Maybe<Scalars['uuid']['output']>;
  time_zone?: Maybe<Scalars['String']['output']>;
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
  email?: InputMaybe<Order_By>;
  first_name?: InputMaybe<Order_By>;
  group_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_active?: InputMaybe<Order_By>;
  last_name?: InputMaybe<Order_By>;
  middle_name?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  role_id?: InputMaybe<Order_By>;
  team_lead_id?: InputMaybe<Order_By>;
  time_zone?: InputMaybe<Order_By>;
};

/** primary key columns input for table: users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "users" */
export enum Users_Select_Column {
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
  TeamLeadId = 'team_lead_id',
  /** column name */
  TimeZone = 'time_zone'
}

/** input type for updating data in table "users" */
export type Users_Set_Input = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  team_lead_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
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
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  group_id?: InputMaybe<Scalars['uuid']['input']>;
  id?: InputMaybe<Scalars['uuid']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  middle_name?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  role_id?: InputMaybe<Scalars['uuid']['input']>;
  team_lead_id?: InputMaybe<Scalars['uuid']['input']>;
  time_zone?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "users" */
export enum Users_Update_Column {
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
  TeamLeadId = 'team_lead_id',
  /** column name */
  TimeZone = 'time_zone'
}

export type Users_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  /** filter the rows which have to be updated */
  where: Users_Bool_Exp;
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

/** columns and relationships of "vendors" */
export type Vendors = {
  __typename?: 'vendors';
  id: Scalars['uuid']['output'];
  name: Scalars['String']['output'];
};

/** aggregated selection of "vendors" */
export type Vendors_Aggregate = {
  __typename?: 'vendors_aggregate';
  aggregate?: Maybe<Vendors_Aggregate_Fields>;
  nodes: Array<Vendors>;
};

/** aggregate fields of "vendors" */
export type Vendors_Aggregate_Fields = {
  __typename?: 'vendors_aggregate_fields';
  count: Scalars['Int']['output'];
  max?: Maybe<Vendors_Max_Fields>;
  min?: Maybe<Vendors_Min_Fields>;
};


/** aggregate fields of "vendors" */
export type Vendors_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Vendors_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Boolean expression to filter rows from the table "vendors". All fields are combined with a logical 'AND'. */
export type Vendors_Bool_Exp = {
  _and?: InputMaybe<Array<Vendors_Bool_Exp>>;
  _not?: InputMaybe<Vendors_Bool_Exp>;
  _or?: InputMaybe<Array<Vendors_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "vendors" */
export enum Vendors_Constraint {
  /** unique or primary key constraint on columns "id" */
  VendorsPkey = 'vendors_pkey'
}

/** input type for inserting data into table "vendors" */
export type Vendors_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** aggregate max on columns */
export type Vendors_Max_Fields = {
  __typename?: 'vendors_max_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** aggregate min on columns */
export type Vendors_Min_Fields = {
  __typename?: 'vendors_min_fields';
  id?: Maybe<Scalars['uuid']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** response of any mutation on the table "vendors" */
export type Vendors_Mutation_Response = {
  __typename?: 'vendors_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int']['output'];
  /** data from the rows affected by the mutation */
  returning: Array<Vendors>;
};

/** on_conflict condition type for table "vendors" */
export type Vendors_On_Conflict = {
  constraint: Vendors_Constraint;
  update_columns?: Array<Vendors_Update_Column>;
  where?: InputMaybe<Vendors_Bool_Exp>;
};

/** Ordering options when selecting data from "vendors". */
export type Vendors_Order_By = {
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: vendors */
export type Vendors_Pk_Columns_Input = {
  id: Scalars['uuid']['input'];
};

/** select columns of table "vendors" */
export enum Vendors_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "vendors" */
export type Vendors_Set_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Streaming cursor of the table "vendors" */
export type Vendors_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Vendors_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Vendors_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** update columns of table "vendors" */
export enum Vendors_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Vendors_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Vendors_Set_Input>;
  /** filter the rows which have to be updated */
  where: Vendors_Bool_Exp;
};

/** columns and relationships of "works" */
export type Works = {
  __typename?: 'works';
  date: Scalars['date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  overtime_hours?: Maybe<Scalars['Int']['output']>;
  ppr_hours?: Maybe<Scalars['Int']['output']>;
  project: Scalars['String']['output'];
  site: Scalars['String']['output'];
  status: Scalars['String']['output'];
  time_range?: Maybe<Scalars['String']['output']>;
  work_hours?: Maybe<Scalars['Int']['output']>;
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
  id?: Maybe<Scalars['Float']['output']>;
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
  id?: InputMaybe<Int_Comparison_Exp>;
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
  WorksPkey = 'works_pkey'
}

/** input type for incrementing numeric columns in table "works" */
export type Works_Inc_Input = {
  id?: InputMaybe<Scalars['Int']['input']>;
  overtime_hours?: InputMaybe<Scalars['Int']['input']>;
  ppr_hours?: InputMaybe<Scalars['Int']['input']>;
  work_hours?: InputMaybe<Scalars['Int']['input']>;
};

/** input type for inserting data into table "works" */
export type Works_Insert_Input = {
  date?: InputMaybe<Scalars['date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
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
  id?: Maybe<Scalars['Int']['output']>;
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
  id?: Maybe<Scalars['Int']['output']>;
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
  id: Scalars['Int']['input'];
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
  WorkHours = 'work_hours'
}

/** input type for updating data in table "works" */
export type Works_Set_Input = {
  date?: InputMaybe<Scalars['date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
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
  id?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_pop on columns */
export type Works_Stddev_Pop_Fields = {
  __typename?: 'works_stddev_pop_fields';
  id?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate stddev_samp on columns */
export type Works_Stddev_Samp_Fields = {
  __typename?: 'works_stddev_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
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
  id?: InputMaybe<Scalars['Int']['input']>;
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
  id?: Maybe<Scalars['Int']['output']>;
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
  Id = 'id',
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
  WorkHours = 'work_hours'
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
  id?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate var_samp on columns */
export type Works_Var_Samp_Fields = {
  __typename?: 'works_var_samp_fields';
  id?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

/** aggregate variance on columns */
export type Works_Variance_Fields = {
  __typename?: 'works_variance_fields';
  id?: Maybe<Scalars['Float']['output']>;
  overtime_hours?: Maybe<Scalars['Float']['output']>;
  ppr_hours?: Maybe<Scalars['Float']['output']>;
  work_hours?: Maybe<Scalars['Float']['output']>;
};

export type InsertPlannedTasksMutationVariables = Types.Exact<{
  objects: Array<Types.Planned_Tasks_Insert_Input> | Types.Planned_Tasks_Insert_Input;
}>;


export type InsertPlannedTasksMutation = { __typename?: 'mutation_root', insert_planned_tasks?: { __typename?: 'planned_tasks_mutation_response', affected_rows: number } | null };


export const InsertPlannedTasksDocument = gql`
    mutation InsertPlannedTasks($objects: [planned_tasks_insert_input!]!) {
  insert_planned_tasks(
    objects: $objects
    on_conflict: {constraint: planned_tasks_pkey, update_columns: [time_work_id, description, yaml_url, author_id, rm_task_id, project_id, status]}
  ) {
    affected_rows
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    InsertPlannedTasks(variables: InsertPlannedTasksMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<InsertPlannedTasksMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InsertPlannedTasksMutation>({ document: InsertPlannedTasksDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'InsertPlannedTasks', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;