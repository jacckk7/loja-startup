import { CollectionConfig } from 'payload';

export const Produtos: CollectionConfig = {
    slug: 'produtos',
    labels: {
        singular: 'Produto',
        plural: 'Produtos',
    },
    fields: [
        {
            name: 'nome',
            type: 'text',
            required: true,
        },
        {
            name: 'descricao',
            type: 'textarea',
            required: false,
        },
        {
            name: 'preco',
            type: 'number',
            required: true,
        },
        {
            name: 'estoque',
            type: 'number',
            required:true,
            defaultValue: 0,
        },
    ],
}
