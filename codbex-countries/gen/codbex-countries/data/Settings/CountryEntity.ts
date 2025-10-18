import { Entity, Table, Id, Generated, Column, Documentation } from "sdk/db";

@Entity("CountryEntity")
@Table("CODBEX_COUNTRY")
@Documentation("My CountryEntity")
export class CountryEntity {

    @Id()
    @Generated("sequence")
    @Column({ name: "COUNTRY_ID", type: "long" })
    @Documentation("My Id")
    public Id?: number;

    @Column({ name: "COUNTRY_NAME", type: "string" })
    @Documentation("My Name")
    public Name?: string;

    @Column({ name: "COUNTRY_CODE2", type: "string" })
    public Code2?: string;

    @Column({ name: "COUNTRY_CODE3", type: "string" })
    public Code3?: string;

    @Column({ name: "COUNTRY_NUMERIC", type: "string" })
    public Numeric?: string;

}

(new CountryEntity());