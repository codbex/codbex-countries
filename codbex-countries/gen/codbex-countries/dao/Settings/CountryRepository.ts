import { sql, query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { store } from "sdk/db";
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
        value: number;
    }
}

export interface CountryUpdateEntityEvent extends CountryEntityEvent {
    readonly previousEntity: CountryEntity;
}

export class CountryRepository {

    private static readonly TABLE = "CODBEX_COUNTRY";

    public findAll(options: CountryEntityOptions = {}): CountryEntity[] {
        let list = store.list("CountryEntity", { 'conditions': [], 'limit': options.$limit || 20, 'offset': options.$offset || 0 });
        if (options.$language) {
            try {
                let script = sql.getDialect().select().column("*").from('"' + CountryRepository.TABLE + '_LANG"').where('Language = ?').build();
                const resultSet = query.execute(script, [options.$language]);
                if (resultSet !== null && resultSet[0] !== null) {
                    let translatedProperties = Object.getOwnPropertyNames(resultSet[0]);
                    let maps: any[] = [];
                    for (let i = 0; i < translatedProperties.length - 2; i++) {
                        maps[i] = {};
                    }
                    resultSet.forEach((r) => {
                        for (let i = 0; i < translatedProperties.length - 2; i++) {
                            maps[i][r[translatedProperties[0]]] = r[translatedProperties[i + 1]];
                        }
                    });
                    list.forEach((r) => {
                        for (let i = 0; i < translatedProperties.length - 2; i++) {
                            if (maps[i][r[translatedProperties[0]]]) {
                                r[translatedProperties[i + 1]] = maps[i][r[translatedProperties[0]]];
                            }
                        }

                    });
                }
            } catch (Error) {
                console.error("Entity is marked as language dependent, but no language table present: " + CountryRepository.TABLE);
            }
        }
        return list;
    }

    public findById(id: number, options: CountryEntityOptions = {}): CountryEntity | undefined {
        const entity = store.get("CountryEntity", id);
        if (entity && options.$language) {
            try {
                let script = sql.getDialect().select().column("*").from('"' + CountryRepository.TABLE + '_LANG"').where('Language = ?').where('Id = ?').build();
                const resultSet = query.execute(script, [options.$language, id]);
                let translatedProperties = Object.getOwnPropertyNames(resultSet[0]);
                let maps: any[] = [];
                for (let i = 0; i < translatedProperties.length - 2; i++) {
                    maps[i] = {};
                }
                resultSet.forEach((r) => {
                    for (let i = 0; i < translatedProperties.length - 2; i++) {
                        maps[i][r[translatedProperties[0]]] = r[translatedProperties[i + 1]];
                    }
                });
                for (let i = 0; i < translatedProperties.length - 2; i++) {
                    if (maps[i][entity[translatedProperties[0]]]) {
                        entity[translatedProperties[i + 1]] = maps[i][entity[translatedProperties[0]]];
                    }
                }
            } catch (Error) {
                console.error("Entity is marked as language dependent, but no language table present: " + CountryRepository.TABLE);
            }
        }
        return entity ?? undefined;
    }

    public create(entity: CountryEntity): number {
        const id = store.save('CountryEntity', entity);
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

    public update(entity: CountryEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_COUNTRY",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "COUNTRY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: CountryEntity): number {
        const id = entity.Id;
        if (!id) {
            return store.save('CountryEntity', entity);
        }

        const existingEntity = store.get('CountryEntity', id);
        if (existingEntity) {
            this.update(entity);
            return id;
        } else {
            return store.save('CountryEntity', entity);
        }
    }

    public deleteById(id: number): void {
        const entity = store.get('CountryEntity', id);
        store.remove('CountryEntity', id);
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
        return store.count('CountryEntity', options);
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
