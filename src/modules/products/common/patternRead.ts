const enum PATTERNAME {
  PRODUCTS_CREATE_READ = 'products.create.read',
  PRODUCTS_REMOVE_READ = 'products.remove.read',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patterNameRead: MessagePattern = {
  PRODUCTS_CREATE_READ: PATTERNAME.PRODUCTS_CREATE_READ,
  PRODUCTS_REMOVE_READ: PATTERNAME.PRODUCTS_REMOVE_READ,
}

export const { PRODUCTS_CREATE_READ, PRODUCTS_REMOVE_READ } = patterNameRead
