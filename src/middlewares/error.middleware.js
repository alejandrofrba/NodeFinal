
const errorMiddleware = (err, req, res, next) => {

  
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Errores de validación',
      details: err.issues.map((i) => {
  
        const fieldName = (i.code === 'unrecognized_keys' && i.keys)
          ? i.keys[0]
          : i.path.join('.');
        return {
          field: fieldName,
          message: i.message
        };
      }),
    });
  }

  
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Cuerpo de la solicitud no es JSON válido',
    });
  }


  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'El cuerpo de la solicitud supera el límite permitido',
    });
  }


  if (
    err &&
    typeof err.status === 'number' &&
    typeof err.message === 'string'
  ) {
    const body = { error: err.message };
    if (Array.isArray(err.details)) {
      body.details = err.details;
    }
    return res.status(err.status).json(body);
  }


  if (err && err.stack) {
    console.error(err.stack);
  } else {
    console.error(err);
  }
  return res.status(500).json({ error: 'Error interno del servidor' });
};

export default errorMiddleware;
