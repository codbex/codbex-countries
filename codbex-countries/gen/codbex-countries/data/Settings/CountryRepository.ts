import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { CountryEntity } from "./CountryEntity";
import { Repository, EntityEvent, EntityConstructor } from "sdk/db";

export class CountryRepository extends Repository<CountryEntity> {

    constructor() {
        super((CountryEntity as EntityConstructor));
    }

    protected async triggerEvent(data: EntityEvent<CountryEntity>) {
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
