import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  CATEGORY_CREATE_DISCOUNT_READ,
  CATEGORY_CREATE_MANY_READ,
  CATEGORY_CREATE_READ,
  CATEGORY_DELETE_DISCOUNT_READ,
  CATEGORY_DELETE_READ,
  CATEGORY_UPDATE_DISCOUNT_READ,
  CATEGORY_UPDATE_READ,
} from '../common/patternRead'
import { CATEGORY_CREATE_MANY } from '../common/patternWrite'
import { proxyName } from '../common/proxyName'
import {
  CreateCategoryDto,
  CreateDiscountRulesWithCategoryInDBReadDto,
  SendCategoryManyDto,
  UpdateDiscountRulesWithCategoryInDBReadDto,
} from '../dto/create-category.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'

@Injectable()
export class CategoryServiceRead {
  private readonly logger = new Logger(CategoryServiceRead.name)
  constructor(
    @Inject(proxyName.nameRead) private readonly clientCategory: ClientProxy,
  ) {}
  create(data: CreateCategoryDto) {
    try {
      this.clientCategory.emit(CATEGORY_CREATE_READ, data)
      this.logger.log(
        `${CATEGORY_CREATE_READ} event emitted with data: ${JSON.stringify(data)}`,
      )
    } catch (error) {
      this.logger.error(error, `Failed to emit  ${CATEGORY_CREATE_READ} EVENT`)
    }
  }

  createMany(data: SendCategoryManyDto[]) {
    try {
      this.clientCategory.emit(CATEGORY_CREATE_MANY_READ, data)
      this.logger.log(
        `${CATEGORY_CREATE_MANY_READ} event emitted with data: ${JSON.stringify(data)}`,
      )
    } catch (error) {
      this.logger.error(error, `Failed to emit  ${CATEGORY_CREATE_MANY} EVENT`)
    }
  }

  update(data: UpdateCategoryDto) {
    try {
      this.clientCategory.emit(CATEGORY_UPDATE_READ, data)
      this.logger.log(
        `${CATEGORY_UPDATE_READ} event emitted with data: ${JSON.stringify(data)}`,
      )
    } catch (error) {
      this.logger.error(error, `Failed to emit  ${CATEGORY_UPDATE_READ} EVENT`)
    }
  }

  remove(id: number) {
    try {
      this.clientCategory.emit(CATEGORY_DELETE_READ, id)
      this.logger.log(
        `${CATEGORY_DELETE_READ} event emitted with id : ${JSON.stringify(id)}`,
      )
    } catch (error) {
      this.logger.error(error, `Failed to emit  ${CATEGORY_DELETE_READ} EVENT`)
    }
  }
  removeDiscount(id: number) {
    try {
      this.clientCategory.emit(CATEGORY_DELETE_DISCOUNT_READ, id)
      this.logger.log(
        `${CATEGORY_DELETE_DISCOUNT_READ} event emitted with id : ${JSON.stringify(id)}`,
      )
    } catch (error) {
      this.logger.error(
        error,
        `Failed to emit  ${CATEGORY_DELETE_DISCOUNT_READ} EVENT`,
      )
    }
  }

  createDiscountWithCategory(data: CreateDiscountRulesWithCategoryInDBReadDto) {
    try {
      this.clientCategory.emit(CATEGORY_CREATE_DISCOUNT_READ, data)
      this.logger.log(
        `${CATEGORY_CREATE_DISCOUNT_READ} event emitted with data:`,
        JSON.stringify(data),
      )
    } catch (error) {
      this.logger.error(
        error,
        `Failed to emit  ${CATEGORY_CREATE_DISCOUNT_READ} EVENT`,
      )
    }
  }

  updateDiscountWithCategory(data: UpdateDiscountRulesWithCategoryInDBReadDto) {
    try {
      this.clientCategory.emit(CATEGORY_UPDATE_DISCOUNT_READ, data)
      this.logger.log(
        `${CATEGORY_UPDATE_DISCOUNT_READ} event emitted with data:`,
        JSON.stringify(data),
      )
    } catch (error) {
      this.logger.error(
        error,
        `Failed to emit  ${CATEGORY_UPDATE_DISCOUNT_READ} EVENT`,
      )
    }
  }
}
