import { CustomFieldConfig } from '@vendure/core';

export const customerCustomFields: CustomFieldConfig[] = [
  { name: 'curp', type: 'string', label: [{ languageCode: 'es' as any, value: 'CURP' }] },
  { name: 'rfc', type: 'string', label: [{ languageCode: 'es' as any, value: 'RFC' }] },
  { name: 'fechaNacimiento', type: 'datetime', label: [{ languageCode: 'es' as any, value: 'Fecha de Nacimiento' }] },
  { name: 'direccion', type: 'string', label: [{ languageCode: 'es' as any, value: 'Dirección' }] },
  { name: 'ciudad', type: 'string', label: [{ languageCode: 'es' as any, value: 'Ciudad' }] },
  { name: 'estado', type: 'string', label: [{ languageCode: 'es' as any, value: 'Estado' }] },
  { name: 'codigoPostal', type: 'string', label: [{ languageCode: 'es' as any, value: 'Código Postal' }] },
  { name: 'tipoIdentificacion', type: 'string', label: [{ languageCode: 'es' as any, value: 'Tipo de Identificación' }] },
  { name: 'numeroIdentificacion', type: 'string', label: [{ languageCode: 'es' as any, value: 'Número de Identificación' }] },
  { name: 'contratoActivoId', type: 'int', nullable: true, label: [{ languageCode: 'es' as any, value: 'ID de Contrato Activo' }] },
];

export const productCustomFields: CustomFieldConfig[] = [
  { name: 'marca', type: 'string', label: [{ languageCode: 'es' as any, value: 'Marca' }] },
  { name: 'modelo', type: 'string', label: [{ languageCode: 'es' as any, value: 'Modelo' }] },
  { name: 'numeroDeSerie', type: 'string', label: [{ languageCode: 'es' as any, value: 'Número de Serie' }] },
  { name: 'valorAvaluo', type: 'int', label: [{ languageCode: 'es' as any, value: 'Valor de Avalúo (MXN)' }] },
  {
    name: 'estadoArticulo',
    type: 'string',
    defaultValue: 'Disponible',
    options: [
      { value: 'Disponible', label: [{ languageCode: 'es' as any, value: 'Disponible' }] },
      { value: 'Empeñado', label: [{ languageCode: 'es' as any, value: 'Empeñado' }] },
      { value: 'Vendido', label: [{ languageCode: 'es' as any, value: 'Vendido' }] },
      { value: 'Retirado', label: [{ languageCode: 'es' as any, value: 'Retirado' }] },
    ],
    label: [{ languageCode: 'es' as any, value: 'Estado del Artículo' }],
  },
  { name: 'familia', type: 'string', label: [{ languageCode: 'es' as any, value: 'Familia / Categoría' }] },
  { name: 'fechaEntrada', type: 'datetime', nullable: true, label: [{ languageCode: 'es' as any, value: 'Fecha de Entrada' }] },
];
