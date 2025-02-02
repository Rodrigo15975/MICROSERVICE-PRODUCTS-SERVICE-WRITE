import { PartialType } from '@nestjs/mapped-types'

class ProductUpdate {
  product: string
  category: string
  brand: string
  quantity: number
  discount: number
  price: number
  gender: string
  description: string
  id: number
  minStock: number
  total_sold?: number
}

export class UpdateProductDto extends PartialType(ProductUpdate) {
  id: number
}
