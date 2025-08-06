import type { AllEntities, Entity } from 'aura-workflow';

type MySQLMap = {
	database: 'deleteTable' | 'executeQuery' | 'insert' | 'select' | 'update' | 'upsert';
};

export type MySqlType = AllEntities<MySQLMap>;

export type MySQLDatabaseType = Entity<MySQLMap, 'database'>;
