export class CreateProductDto {
  urlParam: string;

  name: string;

  description: string;

  userId: number;

  imageUrl?: string;

  price: number;
}
