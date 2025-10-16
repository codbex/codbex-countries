import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { store } from "sdk/db";
import { translator } from "sdk/db";
import { CountryEntity } from "./CountryEntity";

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
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface CountryEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CountryEntity>;
    readonly key: {
        name: string;
        column: string;
        value: string | number;
    }
}

export interface CountryUpdateEntityEvent extends CountryEntityEvent {
    readonly previousEntity: CountryEntity;
}

export class CountryRepository {

    public findAll(options: CountryEntityOptions = {}): CountryEntity[] {
        let list = store.list(CountryEntity.$entity_name, { 'conditions': [], 'limit': options.$limit || 20, 'offset': options.$offset || 0 });
        translator.translateList(list, options.$language, CountryEntity.$table_name);
        return list;
    }

    public findById(id: number, options: CountryEntityOptions = {}): CountryEntity | undefined {
        const entity = store.get(CountryEntity.$entity_name, id);
        translator.translateEntity(entity, id, options.$language, CountryEntity.$table_name);
        return entity ?? undefined;
    }

    public create(entity: CountryEntity): string | number {
        const id = store.save(CountryEntity.$entity_name, entity);
        this.triggerEvent({
            operation: "create",
            table: CountryEntity.$table_name,
            entity: entity,
            key: {
                name: CountryEntity.$id_name,
                column: CountryEntity.$id_column,
                value: id
            }
        });
        return id;
    }

    public update(entity: CountryEntity): void {
        const previousEntity = this.findById(entity.Id);
        store.update(CountryEntity.$entity_name, entity);
        this.triggerEvent({
            operation: "update",
            table: CountryEntity.$table_name,
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: CountryEntity.$id_name,
                column: CountryEntity.$id_column,
                value: entity.Id
            }
        });
    }

    public upsert(entity: CountryEntity): string | number {
        const id = entity.Id;
        if (!id) {
            return store.save(CountryEntity.$entity_name, entity);
        }

        const existingEntity = store.get(CountryEntity.$entity_name, id);
        if (existingEntity) {
            this.update(entity);
            return id;
        } else {
            return store.save(CountryEntity.$entity_name, entity);
        }
    }

    public deleteById(id: number): void {
        const entity = store.get(CountryEntity.$entity_name, id);
        store.remove(CountryEntity.$entity_name, id);
        this.triggerEvent({
            operation: "delete",
            table: CountryEntity.$table_name,
            entity: entity,
            key: {
                name: CountryEntity.$id_name,
                column: CountryEntity.$id_column,
                value: id
            }
        });
    }

    public count(options?: CountryEntityOptions): number {
        return store.count(CountryEntity.$entity_name, { 'conditions': [], 'limit': options?.$limit || 20, 'offset': options?.$offset || 0 });
    }

    private async triggerEvent(data: CountryEntityEvent | CountryUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-countries-Settings-Country", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        producer.topic("codbex-countries-Settings-Country").send(JSON.stringify(data));
    }
}
