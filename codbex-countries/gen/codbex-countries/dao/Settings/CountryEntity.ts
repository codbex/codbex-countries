import { Entity, Table, Id, Generated, Column } from "sdk/db";

@Entity("CountryEntity")
@Table("CODBEX_COUNTRY")
export class CountryEntity {

    @Id
    @Generated("sequence")
    @Column({ name: "COUNTRY_ID", type: "long" })
    public Id?: number;

    @Column({ name: "COUNTRY_NAME", type: "string" })
    public Name?: string;

    @Column({ name: "COUNTRY_CODE2", type: "string" })
    public Code2?: string;

    @Column({ name: "COUNTRY_CODE3", type: "string" })
    public Code3?: string;

    @Column({ name: "COUNTRY_NUMERIC", type: "string" })
    public Numeric?: string;

}