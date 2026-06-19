package gen.codbex_countries.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;

@Repository
public class CountryRepository extends JavaRepository<CountryEntity> {

    public CountryRepository() {
        super(CountryEntity.class);
    }
}
