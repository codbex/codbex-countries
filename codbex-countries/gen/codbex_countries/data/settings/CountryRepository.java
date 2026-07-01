package gen.codbex_countries.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class CountryRepository extends JavaRepository<CountryEntity> {

    public CountryRepository() {
        super(CountryEntity.class);
    }

    @Override
    public CountryEntity save(CountryEntity entity) {
        CountryEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-countries-Settings-Country", Json.stringify(saved));
        return saved;
    }

    @Override
    public CountryEntity update(CountryEntity entity) {
        CountryEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-countries-Settings-Country-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Country-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public CountryEntity updateWithoutEvent(CountryEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(CountryEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-countries-Settings-Country-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        CountryEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-countries-Settings-Country-deleted", Json.stringify(entity));
        }
    }
}
