const enum PATTERNAME {
  COUPON_CREATE = 'coupon.create',
  COUPON_REMOVE = 'coupon.remove',
}

type MessagePattern = {
  [K in keyof typeof PATTERNAME]: (typeof PATTERNAME)[K]
}

const patternNameWrite: MessagePattern = {
  COUPON_CREATE: PATTERNAME.COUPON_CREATE,
  COUPON_REMOVE: PATTERNAME.COUPON_REMOVE,
}

export const { COUPON_CREATE, COUPON_REMOVE } = patternNameWrite
