const enum PATTERNAME {
  PRODUCTS_CREATE_READ = 'products.create.read',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patterNameRead: MessagePattern = {
  PRODUCTS_CREATE_READ: PATTERNAME.PRODUCTS_CREATE_READ,
}

export const { PRODUCTS_CREATE_READ } = patterNameRead
