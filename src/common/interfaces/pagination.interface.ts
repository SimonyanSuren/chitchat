import { ApiProperty } from '@nestjs/swagger';

export abstract class IPagination<T> {
  @ApiProperty()
  data: T[]; // Array of items for the current page

  @ApiProperty()
  totalCount: number; // Total number of items in the entire collection

  @ApiProperty()
  pageSize: number; // Number of items per page

  @ApiProperty()
  currentPage: number; // Current page number

  @ApiProperty()
  totalPages: number; // Total number of pages
}
