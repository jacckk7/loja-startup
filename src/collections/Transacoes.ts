import { CollectionConfig } from 'payload';

export const Transacoes: CollectionConfig = {
    slug: 'transacoes',
    labels: {
        singular: 'Transação',
        plural: 'Transações',
    },
    fields: [
        {
            name: 'produto',
            type: 'relationship',
            relationTo: 'produtos',
            required: true,
        },
        {
            name: 'quantidade',
            type: 'number',
            required: true,
            defaultValue: 1,
        },
        {
            name: 'data',
            type: 'date',
            required: true,
            defaultValue: () => new Date(),
        },
    ],
}