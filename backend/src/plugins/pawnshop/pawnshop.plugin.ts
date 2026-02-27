import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { gql } from 'graphql-tag';
import { Contrato } from './contrato.entity';
import { ContratoService } from './contrato.service';
import { ContratoResolver } from './contrato.resolver';
import { Combo } from './combo.entity';
import { ComboService } from './combo.service';
import { ComboResolver } from './combo.resolver';
import { customerCustomFields, productCustomFields } from './custom-fields';

@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [Contrato, Combo],
  providers: [ContratoService, ContratoResolver, ComboService, ComboResolver],
  configuration: (config) => {
    config.customFields = config.customFields || {};
    config.customFields.Customer = [
      ...(config.customFields.Customer || []),
      ...customerCustomFields,
    ];
    config.customFields.Product = [
      ...(config.customFields.Product || []),
      ...productCustomFields,
    ];
    return config;
  },
  adminApiExtensions: {
    schema: gql`
      type Contrato {
        id: Int!
        customerId: Int!
        customerName: String!
        productId: Int!
        fechaContrato: String!
        plazo: Int!
        tasaInteres: Float!
        montoPrestamo: Int!
        montoTotal: Int!
        fechaVencimiento: String!
        estado: String!
        createdAt: String!
        updatedAt: String!
      }

      input CreateContratoInput {
        customerId: Int!
        productId: Int!
        fechaContrato: String!
        plazo: Int!
        tasaInteres: Float!
        montoPrestamo: Int!
        montoTotal: Int!
        fechaVencimiento: String!
        estado: String
      }

      input UpdateContratoInput {
        customerId: Int
        productId: Int
        fechaContrato: String
        plazo: Int
        tasaInteres: Float
        montoPrestamo: Int
        montoTotal: Int
        fechaVencimiento: String
        estado: String
      }

      type Combo {
        id: Int!
        nombre: String!
        productIds: [Int!]!
        precioAntes: Int!
        precioAhora: Int!
        visible: Boolean!
        createdAt: String!
        updatedAt: String!
      }

      input CreateComboInput {
        nombre: String!
        productIds: [Int!]!
        precioAntes: Int!
        precioAhora: Int!
        visible: Boolean
      }

      input UpdateComboInput {
        nombre: String
        productIds: [Int!]
        precioAntes: Int
        precioAhora: Int
        visible: Boolean
      }

      extend type Query {
        contratos: [Contrato!]!
        contrato(id: Int!): Contrato
        contratosByCustomer(customerId: Int!): [Contrato!]!
        combos: [Combo!]!
        combo(id: Int!): Combo
      }

      extend type Mutation {
        createContrato(input: CreateContratoInput!): Contrato!
        updateContrato(id: Int!, input: UpdateContratoInput!): Contrato!
        deleteContrato(id: Int!): Boolean!
        createCombo(input: CreateComboInput!): Combo!
        updateCombo(id: Int!, input: UpdateComboInput!): Combo!
        deleteCombo(id: Int!): Boolean!
      }
    `,
    resolvers: [ContratoResolver, ComboResolver],
  },
})
export class PawnshopPlugin {}
