export class CreateProductDto {
  products: ProductDto[]
}

export class ProductVariantDto {
  color: string
  image: null
  url: string
}

export class ProductInventoryDto {
  minStock: number
  stock: boolean
  productsId: number
}
export class ProductDto {
  product: string
  productVariant: ProductVariantDto[]
  price: number
  size: string[]
  gender: string
  brand: string
  description: string
  quantity: number
  is_new: boolean
  category: string
  discount: number
  productInventory: ProductInventoryDto
}
