import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { store, Options } from "sdk/db";
import { translator } from "sdk/db";
import { EntityConstructor } from "sdk/db";
import { CountryEntity } from "./CountryEntity";

export interface CountryEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<CountryEntity>;
    readonly key: {
        name: string;
        column: string;
        value: string | number;
    }
    readonly previousEntity?: CountryEntity;
}

export class CountryRepository {

    public findAll(options: Options = {}): CountryEntity[] {
        let list = store.list((CountryEntity as EntityConstructor).$entity_name, options);
        translator.translateList(list, options.language, (CountryEntity as EntityConstructor).$table_name);
        return list;
    }

    public findById(id: number, options: Options = {}): CountryEntity | undefined {
        const entity = store.get((CountryEntity as EntityConstructor).$entity_name, id);
        translator.translateEntity(entity, id, options.language, (CountryEntity as EntityConstructor).$table_name);
        return entity ?? undefined;
    }

    public create(entity: CountryEntity): string | number {
        const id = store.save((CountryEntity as EntityConstructor).$entity_name, entity);
        this.triggerEvent({
            operation: "create",
            table: (CountryEntity as EntityConstructor).$table_name,
            entity: entity,
            key: {
                name: (CountryEntity as EntityConstructor).$id_name,
                column: (CountryEntity as EntityConstructor).$id_column,
                value: id
            }
        });
        return id;
    }

    public update(entity: CountryEntity): void {
        const previousEntity = this.findById(entity.Id as number);
        store.update((CountryEntity as EntityConstructor).$entity_name, entity);
        this.triggerEvent({
            operation: "update",
            table: (CountryEntity as EntityConstructor).$table_name,
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: (CountryEntity as EntityConstructor).$id_name,
                column: (CountryEntity as EntityConstructor).$id_column,
                value: entity.Id
            }
        });
    }

    public upsert(entity: CountryEntity): string | number {
        const id = entity.Id;
        if (!id) {
            return store.save((CountryEntity as EntityConstructor).$entity_name, entity);
        }

        const existingEntity = store.get((CountryEntity as EntityConstructor).$entity_name, id);
        if (existingEntity) {
            this.update(entity);
            return id;
        } else {
            return store.save((CountryEntity as EntityConstructor).$entity_name, entity);
        }
    }

    public deleteById(id: number): void {
        const entity = store.get((CountryEntity as EntityConstructor).$entity_name, id);
        store.remove((CountryEntity as EntityConstructor).$entity_name, id);
        this.triggerEvent({
            operation: "delete",
            table: (CountryEntity as EntityConstructor).$table_name,
            entity: entity,
            key: {
                name: (CountryEntity as EntityConstructor).$id_name,
                column: (CountryEntity as EntityConstructor).$id_column,
                value: id
            }
        });
    }

    public count(options?: Options): number {
        return store.count((CountryEntity as EntityConstructor).$entity_name, options);
    }

    private async triggerEvent(data: CountryEntityEvent) {
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
