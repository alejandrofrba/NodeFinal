/**
 * Esquema de validación para POST /api/products/create.
 */

import { z } from 'zod';

const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

const productCreateSchema = z.object(
  {
    // name
    name: z
      .string({
        required_error: 'El campo "name" es obligatorio',
        invalid_type_error: 'El campo "name" debe ser una cadena de texto',
      })
      .trim()
      .min(1, 'El campo "name" no puede estar vacío')
      .max(120, 'El campo "name" no puede tener más de 120 caracteres'),

    // price
    price: z
      .number({
        required_error: 'El campo "price" es obligatorio',
        invalid_type_error: 'El campo "price" debe ser un número',
      })
      .finite('El campo "price" debe ser un número finito')
      .min(0, 'El campo "price" debe ser un número positivo')
      .max(MAX_SAFE_INTEGER, 'El campo "price" no puede ser mayor que 9007199254740991'),

    // description
    description: z
      .string({
        invalid_type_error: 'El campo "description" debe ser una cadena de texto',
      })
      .trim()
      .max(2000, 'El campo "description" no puede tener más de 2000 caracteres')
      .optional(),

    // stock
    stock: z
      .number({
        invalid_type_error: 'El campo "stock" debe ser un número entero',
      })
      .int('El campo "stock" debe ser un número entero')
      .min(0, 'El campo "stock" debe ser un número entero positivo')
      .optional(),

    // category
    category: z
      .string({
        invalid_type_error: 'El campo "category" debe ser una cadena de texto',
      })
      .trim()
      .max(60, 'El campo "category" no puede tener más de 60 caracteres')
      .optional(),
  },
  {

    errorMap: (issue, ctx) => {
      if (issue.code === z.ZodIssueCode.unrecognized_keys) {
        return { message: `El campo "${issue.keys[0]}" no está permitido` };
      }
      return { message: ctx.defaultError };
    },
  }
).strict();

export { productCreateSchema };
