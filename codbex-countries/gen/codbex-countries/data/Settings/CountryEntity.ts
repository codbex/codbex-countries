import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('CountryEntity')
@Table('CODBEX_COUNTRY')
@Documentation('Country entity mapping')
export class CountryEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'COUNTRY_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'COUNTRY_NAME',
        type: 'string',
        length: 255,
    })
    public Name!: string;

    @Documentation('Code2')
    @Column({
        name: 'COUNTRY_CODE2',
        type: 'string',
        length: 2,
    })
    public Code2!: string;

    @Documentation('Code3')
    @Column({
        name: 'COUNTRY_CODE3',
        type: 'string',
        length: 3,
    })
    public Code3!: string;

    @Documentation('Numeric')
    @Column({
        name: 'COUNTRY_NUMERIC',
        type: 'string',
        length: 3,
    })
    public Numeric!: string;

}

(new CountryEntity());
