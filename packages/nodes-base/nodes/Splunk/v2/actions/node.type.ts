import type { AllEntities } from 'aura-workflow';

type NodeMap = {
	alert: 'getReport' | 'getMetrics';
	report: 'create' | 'deleteReport' | 'get' | 'getAll';
	search: 'create' | 'deleteJob' | 'get' | 'getAll' | 'getResult';
	user: 'create' | 'deleteUser' | 'get' | 'getAll' | 'update';
};

export type SplunkType = AllEntities<NodeMap>;
