import { useAppSelector } from '@/app/store';
import { cartSlice } from '../features/cart.slice';

export function useCart() {
  const products = useAppSelector(cartSlice.selectors.selectProducts);
  const total = useAppSelector(cartSlice.selectors.selectCartTotal);

  return { products, total };
}
