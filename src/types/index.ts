export interface Product {
    id: number;
    title: string;
    variants: Variant[];
    image: {
      id: number;
      product_id: number;
      src: string;
    };
  }
  
  export interface Variant {
    id: number;
    product_id: number;
    title: string;
    price: string;
  }
  
  export interface SelectedProduct extends Product {
    discount?: {
      type: 'percentage' | 'flat';
      value: number;
    };
    position: number;
  }
  
  export interface SelectedVariant extends Variant {
    discount?: {
      type: 'percentage' | 'flat';
      value: number;
    };
    position: number;
  }
  
  