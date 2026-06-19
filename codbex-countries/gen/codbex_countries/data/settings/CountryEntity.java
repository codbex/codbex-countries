package gen.codbex_countries.data.settings;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_COUNTRY")
@Documentation("Country entity mapping")
public class CountryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COUNTRY_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "COUNTRY_NAME", length = 255, nullable = false, unique = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "COUNTRY_CODE2", length = 2, nullable = false, unique = true)
    @Documentation("Code2")
    public String Code2;

    @Column(name = "COUNTRY_CODE3", length = 3, nullable = false, unique = true)
    @Documentation("Code3")
    public String Code3;

    @Column(name = "COUNTRY_NUMERIC", length = 3, nullable = false, unique = true)
    @Documentation("Numeric")
    public String Numeric;

}
