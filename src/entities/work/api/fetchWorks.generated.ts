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

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete data from the table: "works" */
  delete_works?: Maybe<Works_Mutation_Response>;
  /** delete single row from the table: "works" */
  delete_works_by_pk?: Maybe<Works>;
  /** insert data into the table: "works" */
  insert_works?: Maybe<Works_Mutation_Response>;
  /** insert a single row into the table: "works" */
  insert_works_one?: Maybe<Works>;
  /** update data of the table: "works" */
  update_works?: Maybe<Works_Mutation_Response>;
  /** update single row of the table: "works" */
  update_works_by_pk?: Maybe<Works>;
  /** update multiples rows of table: "works" */
  update_works_many?: Maybe<Array<Maybe<Works_Mutation_Response>>>;
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

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "works" */
  works: Array<Works>;
  /** fetch aggregated fields from the table: "works" */
  works_aggregate: Works_Aggregate;
  /** fetch data from the table: "works" using primary key columns */
  works_by_pk?: Maybe<Works>;
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
  /** fetch data from the table: "works" */
  works: Array<Works>;
  /** fetch aggregated fields from the table: "works" */
  works_aggregate: Works_Aggregate;
  /** fetch data from the table: "works" using primary key columns */
  works_by_pk?: Maybe<Works>;
  /** fetch data from the table in a streaming manner: "works" */
  works_stream: Array<Works>;
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

export type FetchWorksQueryVariables = Types.Exact<{ [key: string]: never }>;

export type FetchWorksQuery = {
  __typename?: 'query_root';
  works: Array<{
    __typename?: 'works';
    date: any;
    project: string;
    site: string;
    description: string;
    time_range: string;
    status: string;
    ppr_hours: number;
    work_hours: number;
    overtime_hours: number;
    idInt?: string | null;
    __codegenTest?: string | null;
  }>;
};

export const FetchWorksDocument = gql`
  query FetchWorks {
    works {
      idInt: id
      date
      project
      site
      description
      time_range
      status
      ppr_hours
      work_hours
      overtime_hours
      __codegenTest: id
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
    FetchWorks(
      variables?: FetchWorksQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<FetchWorksQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<FetchWorksQuery>({
            document: FetchWorksDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'FetchWorks',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
