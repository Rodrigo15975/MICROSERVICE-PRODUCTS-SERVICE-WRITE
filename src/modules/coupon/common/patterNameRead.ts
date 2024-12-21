const enum PATTERNAME {
  COUPON_CREATE_READ = 'coupon.create.read',
  COUPON_REMOVE_READ = 'coupon.remove.read',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patternNameRead: MessagePattern = {
  COUPON_CREATE_READ: PATTERNAME.COUPON_CREATE_READ,
  COUPON_REMOVE_READ: PATTERNAME.COUPON_REMOVE_READ,
}

export const { COUPON_CREATE_READ, COUPON_REMOVE_READ } = patternNameRead
