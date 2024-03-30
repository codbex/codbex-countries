import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface CountryEntity {
    readonly Id: number;
    Name: string;
    Code2: string;
    Code3: string;
    Numeric: string;
}

export interface CountryCreateEntity {
    readonly Name: string;
    readonly Code2: string;
    readonly Code3: string;
    readonly Numeric: string;
}

export interface CountryUpdateEntity extends CountryCreateEntity {
    readonly Id: number;
}

export interface CountryEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Code2?: string | string[];
            Code3?: string | string[];
            Numeric?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Code2?: string | string[];
            Code3?: string | string[];
            Numeric?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Code2?: string;
            Code3?: string;
            Numeric?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Code2?: string;
            Code3?: string;
            Numeric?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Code2?: string;
            Code3?: string;
            Numeric?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Code2?: string;
            Code3?: string;
            Numeric?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Code2?: string;
            Code3?: string;
            Numeric?: string;
        };
    },
    $select?: (keyof CountryEntity)[],
    $sort?: string | (keyof CountryEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface CountryEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CountryEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class CountryRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_COUNTRY",
        properties: [
            {
                name: "Id",
                column: "COUNTRY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "COUNTRY_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Code2",
                column: "COUNTRY_CODE2",
                type: "CHAR",
                required: true
            },
            {
                name: "Code3",
                column: "COUNTRY_CODE3",
                type: "CHAR",
                required: true
            },
            {
                name: "Numeric",
                column: "COUNTRY_NUMERIC",
                type: "CHAR",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(CountryRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: CountryEntityOptions): CountryEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): CountryEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: CountryCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_COUNTRY",
            entity: entity,
            key: {
                name: "Id",
                column: "COUNTRY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: CountryUpdateEntity): void {
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_COUNTRY",
            entity: entity,
            key: {
                name: "Id",
                column: "COUNTRY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CountryCreateEntity | CountryUpdateEntity): number {
        const id = (entity as CountryUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as CountryUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_COUNTRY",
            entity: entity,
            key: {
                name: "Id",
                column: "COUNTRY_ID",
                value: id
            }
        });
    }

    public count(options?: CountryEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX__COUNTRY"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: CountryEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-countries-Countries-Country", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-countries-Countries-Country").send(JSON.stringify(data));
    }
}
