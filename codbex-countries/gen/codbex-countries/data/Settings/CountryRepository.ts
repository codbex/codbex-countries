import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { CountryEntity } from './CountryEntity'

@Component('CountryRepository')
export class CountryRepository extends Repository<CountryEntity> {

    constructor() {
        super((CountryEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<CountryEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-countries-Settings-Country', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-countries-Settings-Country').send(JSON.stringify(data));
    }
}
