const enum PATTERNAME {
  PRODUCTS_CREATE_READ = 'products.create.read',
  PRODUCTS_CREATE_ONE_VARIANT_READ = 'products.create.url.read',

  PRODUCTS_REMOVE_READ = 'products.remove.read',
  PRODUCTS_REMOVE_URL_READ = 'products.remove.url.read',
  PRODUCTS_REMOVE_SIZE_READ = 'products.remove.one.size',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patterNameRead: MessagePattern = {
  PRODUCTS_CREATE_READ: PATTERNAME.PRODUCTS_CREATE_READ,
  PRODUCTS_CREATE_ONE_VARIANT_READ: PATTERNAME.PRODUCTS_CREATE_ONE_VARIANT_READ,
  PRODUCTS_REMOVE_READ: PATTERNAME.PRODUCTS_REMOVE_READ,
  PRODUCTS_REMOVE_URL_READ: PATTERNAME.PRODUCTS_REMOVE_URL_READ,
  PRODUCTS_REMOVE_SIZE_READ: PATTERNAME.PRODUCTS_REMOVE_SIZE_READ,
}

export const {
  PRODUCTS_REMOVE_SIZE_READ,
  PRODUCTS_CREATE_ONE_VARIANT_READ,
  PRODUCTS_CREATE_READ,
  PRODUCTS_REMOVE_READ,
  PRODUCTS_REMOVE_URL_READ,
} = patterNameRead
