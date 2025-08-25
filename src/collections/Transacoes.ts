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

  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        const produtoId = data.produto as string
        const novaQuantidade = data.quantidade

        const produto = await req.payload.findByID({
          collection: 'produtos',
          id: produtoId,
        })

        if (!produto) {
          throw new Error('Produto não cadastrado.')
        }

        if (operation === 'create') {
          if (novaQuantidade > produto.estoque) {
            throw new Error(
              `Estoque insuficiente: estoque atual: ${produto.estoque}, quantidade solicitada: ${novaQuantidade}.`,
            )
          }
        }

        if (operation === 'update' && originalDoc) {
          const quantidadeAntiga = originalDoc.quantidade
          const diferenca = novaQuantidade - quantidadeAntiga

          if (diferenca > 0 && diferenca > produto.estoque) {
            throw new Error(
              `Estoque insuficiente: estoque atual: ${produto.estoque}, quantidade solicitada a mais: ${diferenca}.`,
            )
          }
        }
      },
    ],
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        const produtoRel = doc.produto
        const produtoId = typeof produtoRel === 'string' ? produtoRel : produtoRel.id
        const quantidade = doc.quantidade

        const produto = await req.payload.findByID({
          collection: 'produtos',
          id: produtoId,
        })

        if (!produto) return

        if (operation === 'create') {
          await req.payload.update({
            collection: 'produtos',
            id: produtoId,
            data: { estoque: (produto.estoque || 0) - quantidade },
          })
        }

        if (operation === 'update' && previousDoc) {
          const quantidadeAntiga = previousDoc.quantidade
          const diferenca = quantidade - quantidadeAntiga
          const novoEstoque = (produto.estoque || 0) - diferenca

          await req.payload.update({
            collection: 'produtos',
            id: produtoId,
            data: { estoque: novoEstoque },
          })
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const produtoRel = doc.produto;
        const produtoId = typeof produtoRel === 'string' ? produtoRel : produtoRel.id;
        const quantidade = doc.quantidade;

        const produto = await req.payload.findByID({
          collection: 'produtos',
          id: produtoId,
        });

        if (produto) {
          const novoEstoque = (produto.estoque || 0) + quantidade;

          await req.payload.update({
            collection: 'produtos',
            id: produtoId,
            data: { estoque: novoEstoque },
          });
        }
      },
    ],
  },
}