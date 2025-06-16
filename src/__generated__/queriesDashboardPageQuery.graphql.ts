/**
 * @generated SignedSource<<a150c63cd463db09fff9ece59a400cbc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type queriesDashboardPageQuery$variables = Record<PropertyKey, never>;
export type queriesDashboardPageQuery$data = {
  readonly works: ReadonlyArray<{
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
  }>;
};
export type queriesDashboardPageQuery = {
  response: queriesDashboardPageQuery$data;
  variables: queriesDashboardPageQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      alias: null,
      args: null,
      concreteType: 'works',
      kind: 'LinkedField',
      name: 'works',
      plural: true,
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
      argumentDefinitions: [],
      kind: 'Fragment',
      metadata: null,
      name: 'queriesDashboardPageQuery',
      selections: v0 /*: any*/,
      type: 'query_root',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: [],
      kind: 'Operation',
      name: 'queriesDashboardPageQuery',
      selections: v0 /*: any*/,
    },
    params: {
      cacheID: '69a3e865696c42027286dc2e65b7bfd7',
      id: null,
      metadata: {},
      name: 'queriesDashboardPageQuery',
      operationKind: 'query',
      text: 'query queriesDashboardPageQuery {\n  works {\n    id\n    date\n    project\n    site\n    description\n    timeRange: time_range\n    status\n    pprHours: ppr_hours\n    workHours: work_hours\n    overtimeHours: overtime_hours\n  }\n}\n',
    },
  };
})();

(node as any).hash = '38ce0aed9059101f310897a1bb696d6a';

export default node;
