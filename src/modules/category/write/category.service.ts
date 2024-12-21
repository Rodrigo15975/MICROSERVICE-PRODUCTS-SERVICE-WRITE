import { HttpStatus, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { HandledRpcException } from '../../utils/handle-errorst'
import {
  CreateCategoryDto,
  CreateCategoryManyDto,
  CreateDiscountRulesCategory,
} from '../dto/create-category.dto'
import {
  UpdateCategoryDto,
  UpdateDiscountRulesCategory,
} from '../dto/update-category.dto'
import { CategoryServiceRead } from '../read/category.read.service'

@Injectable()
export class CategoryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryServiceRead: CategoryServiceRead,
  ) {}

  /**
   * Creates a new category if it doesn't already exist.
   * @param data - The data for the category to create
   * @returns Success message if created
   */

  async create(data: CreateCategoryDto) {
    await this.prismaService.category.findUnique({
      where: {
        category: data.category,
      },
    })

    await this.verifyCategoryExisting(data.category)
    const newCategory = await this.prismaService.category.create({
      data,
    })
    this.categoryServiceRead.create(newCategory)
    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      'Successfully created',
      HttpStatus.CREATED,
      CategoryService.name,
    )
  }

  /**
   * Creates multiple categories, skipping duplicates.
   * @param data - The data for the categories to create
   * @returns Success message if created
   */
  async createMany(data: CreateCategoryManyDto) {
    const categoriesData = data.categories

    // 1. Obtener las categorías existentes antes de la creación
    const existingCategories = await this.prismaService.category.findMany({
      where: {
        category: {
          in: categoriesData.map((category) => category.category),
        },
      },
    })

    // 2. Filtrar las categorías que no existen para crear nuevas
    const categoriesToCreate = categoriesData.filter(
      (category) =>
        !existingCategories.some(
          (existing) => existing.category === category.category,
        ),
    )

    // 3. Crear las nuevas categorías
    await this.prismaService.category.createMany({
      data: categoriesToCreate,
      skipDuplicates: true, // Asegúrate de que esto esté en true para evitar cualquier duplicado
    })

    // 4. Obtener las categorías recién creadas
    const createdCategories = await this.prismaService.category.findMany({
      where: {
        category: {
          in: categoriesToCreate.map((category) => category.category),
        },
      },
    })
    if (createdCategories.length > 0)
      this.categoryServiceRead.createMany(createdCategories)

    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      'Created many categories succesfully (invalid dupliqued)',
      HttpStatus.CREATED,
      CategoryService.name,
    )
  }

  /**
   * Verifies if a category already exists.
   * @param category - The category name to check
   */
  private async verifyCategoryExisting(data: string | undefined) {
    const category = await this.prismaService.category.findFirst({
      where: {
        category: {
          equals: data,
          mode: 'insensitive',
        },
      },
    })
    if (category)
      throw HandledRpcException.rpcException(
        `Already existing category ${category.category} `,
        HttpStatus.CONFLICT,
      )
  }

  /**
   * Updates a category's information.
   * @param id - The ID of the category to update
   * @param data - The new data for the category
   * @returns Success message if updated
   */
  async update(id: number, data: UpdateCategoryDto) {
    const { category } = data
    const findCategory = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    })
    if (findCategory?.category !== category)
      await this.verifyCategoryExisting(category)

    const categoryUpdated = await this.prismaService.category.update({
      data,
      where: {
        id,
      },
    })
    this.categoryServiceRead.update(categoryUpdated)

    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      `Updated category ${data.category} successfully`,
      HttpStatus.ACCEPTED,
      CategoryService.name,
    )
  }

  /**
   * Removes a category by ID.
   * @param id - The ID of the category to delete
   * @returns Success message if deleted
   */
  async remove(id: number) {
    await this.prismaService.category.delete({
      where: {
        id,
      },
    })
    this.categoryServiceRead.remove(id)
    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      `Deleted category successfully`,
      HttpStatus.ACCEPTED,
      CategoryService.name,
    )
  }
  /**
   *  @param id - The ID of the category with discount to delete
   *
   */
  async removeDiscount(id: number) {
    await this.prismaService.dicountRules.delete({
      where: {
        id,
      },
    })
    this.categoryServiceRead.removeDiscount(id)
    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      `Deleted  discount with category successfully`,
      HttpStatus.ACCEPTED,
      CategoryService.name,
    )
  }

  /**
   * Updates discount rules for a category.
   * @param id - The ID of the category to update
   * @param data - The discount rule data to update
   * @returns Success message if updated
   * @Send Updated data send of DB READ
   */
  async updateDiscountWithCategory(
    id: number,
    data: UpdateDiscountRulesCategory,
  ) {
    const { discount, end_date } = data

    const discountUpdated = await this.prismaService.dicountRules.update({
      where: {
        id,
      },
      data: {
        end_date,
        discount,
      },
    })
    this.categoryServiceRead.updateDiscountWithCategory(discountUpdated)

    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      'Discount updated successfully',
      HttpStatus.ACCEPTED,
      CategoryService.name,
    )
  }

  /**
   * Creates a discount for a category.
   * @param data - The discount rule data
   * @returns Success message if created
   */

  async createDiscount(data: CreateDiscountRulesCategory) {
    const { id: categoryId, start_date } = data
    await this.verifyExistingDiscountWithCategory(categoryId, start_date)

    const [, categoryWithDiscount] = await this.prismaService.$transaction([
      this.prismaService.dicountRules.create({
        data: {
          ...data,
          categoryId,
          id: undefined,
        },
      }),
      this.prismaService.category.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          discountRules: true,
        },
      }),
    ])
    this.categoryServiceRead.createDiscountWithCategory(categoryWithDiscount)
    return HandledRpcException.ResponseSuccessfullyMessagePattern(
      'Discount created successfully',
      HttpStatus.CREATED,
      CategoryService.name,
    )
  }

  /**
   * Verifies if a discount already exists for a category.
   * @param id - The category ID to check
   */
  private async verifyExistingDiscountWithCategory(
    categoryId: number,
    start_date: string,
  ) {
    const discountRulesFound = await this.prismaService.dicountRules.findFirst({
      where: {
        categoryId: {
          equals: categoryId,
        },
      },
    })
    if (
      discountRulesFound?.is_active ||
      discountRulesFound?.start_date === start_date
    )
      throw HandledRpcException.rpcException(
        'Already existing discount',
        HttpStatus.CONFLICT,
      )
  }
}
