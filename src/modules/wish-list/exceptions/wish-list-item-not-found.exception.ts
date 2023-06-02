import { NotFoundException } from '@nestjs/common';

export class WishListItemNotFoundException extends NotFoundException {
  constructor() {
    super('error.wish_list_item_not_found');
  }
}
