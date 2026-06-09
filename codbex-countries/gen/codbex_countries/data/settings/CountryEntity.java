package gen.codbex_countries.data.settings;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

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
