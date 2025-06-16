/**
 * @generated SignedSource<<b58f8d0b8b2b18852a4dd12fbf4872cc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RealtimeClient_WorksPatchQuery$variables = {
  id: number;
};
export type RealtimeClient_WorksPatchQuery$data = {
  readonly works_by_pk:
    | {
        readonly date: any;
        readonly description: string;
        readonly id: number;
        readonly overtimeHours: number;
        readonly pprHours: number;
        readonly project: string;
        readonly site: string;
        readonly status: string;
        readonly timeRange: string;
        readonly workHours: number;
      }
    | null
    | undefined;
};
export type RealtimeClient_WorksPatchQuery = {
  response: RealtimeClient_WorksPatchQuery$data;
  variables: RealtimeClient_WorksPatchQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'id',
      },
    ],
    v1 = [
      {
        alias: null,
        args: [
          {
            kind: 'Variable',
            name: 'id',
            variableName: 'id',
          },
        ],
        concreteType: 'works',
        kind: 'LinkedField',
        name: 'works_by_pk',
        plural: false,
        selections: [
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'id',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'date',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'project',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'site',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'description',
            storageKey: null,
          },
          {
            alias: 'timeRange',
            args: null,
            kind: 'ScalarField',
            name: 'time_range',
            storageKey: null,
          },
          {
            alias: null,
            args: null,
            kind: 'ScalarField',
            name: 'status',
            storageKey: null,
          },
          {
            alias: 'pprHours',
            args: null,
            kind: 'ScalarField',
            name: 'ppr_hours',
            storageKey: null,
          },
          {
            alias: 'workHours',
            args: null,
            kind: 'ScalarField',
            name: 'work_hours',
            storageKey: null,
          },
          {
            alias: 'overtimeHours',
            args: null,
            kind: 'ScalarField',
            name: 'overtime_hours',
            storageKey: null,
          },
        ],
        storageKey: null,
      },
    ];
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'RealtimeClient_WorksPatchQuery',
      selections: v1 /*: any*/,
      type: 'query_root',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'RealtimeClient_WorksPatchQuery',
      selections: v1 /*: any*/,
    },
    params: {
      cacheID: '7c519f2f47d130cf49ee32c27c45224c',
      id: null,
      metadata: {},
      name: 'RealtimeClient_WorksPatchQuery',
      operationKind: 'query',
      text: 'query RealtimeClient_WorksPatchQuery(\n  $id: Int!\n) {\n  works_by_pk(id: $id) {\n    id\n    date\n    project\n    site\n    description\n    timeRange: time_range\n    status\n    pprHours: ppr_hours\n    workHours: work_hours\n    overtimeHours: overtime_hours\n  }\n}\n',
    },
  };
})();

(node as any).hash = 'a2de1fa6996787c21f2850eb13554917';

export default node;
