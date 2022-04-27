export default interface IProduct {
  _id: string;
  title: string;
  name: string;
  price: number;
  image: string;
  description: string;
  slug: { current: string };
  brand: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
}
