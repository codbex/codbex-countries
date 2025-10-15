
@Entity("CountryEntity")
@Table("CODBEX_COUNTRY")
export class CountryEntity {

    @Id
    @Generated("sequence")
    @Column({ name: "COUNTRY_ID", type: "long" })
    public Id: number;

    @Column({ name: "COUNTRY_NAME", type: "string" })
    Name: string;

    @Column({ name: "COUNTRY_CODE2", type: "string" })
    Code2: string;

    @Column({ name: "COUNTRY_CODE3", type: "string" })
    Code3: string;

    @Column({ name: "COUNTRY_NUMERIC", type: "string" })
    Numeric: string;

}