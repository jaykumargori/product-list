import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Product, SelectedProduct } from "../types";

interface ProductStore {
  selectedProducts: SelectedProduct[];
  addProduct: (product: Product) => void;
  removeProduct: (productId: number) => void;
  updateProductOrder: (startIndex: number, endIndex: number) => void;
  updateProductDiscount: (
    productId: number,
    discount: { type: "percentage" | "flat"; value: number } | undefined
  ) => void;
  updateVariantDiscount: (
    productId: number,
    variantId: number,
    discount: { type: "percentage" | "flat"; value: number } | undefined
  ) => void;
  updateVariantOrder: (
    productId: number,
    startIndex: number,
    endIndex: number
  ) => void;
  replaceProduct: (index: number, newProducts: Product[]) => void;
}

export const useStore = create<ProductStore>()(
  devtools((set) => ({
    selectedProducts: [],

    addProduct: (product) =>
      set((state) => ({
        selectedProducts: [
          ...state.selectedProducts,
          {
            ...product,
            position: state.selectedProducts.length,
          },
        ],
      })),

    removeProduct: (productId) =>
      set((state) => ({
        selectedProducts: state.selectedProducts.filter(
          (p) => p.id !== productId
        ),
      })),

    updateProductOrder: (startIndex, endIndex) =>
      set((state) => {
        const newProducts = Array.from(state.selectedProducts);
        const [reorderedItem] = newProducts.splice(startIndex, 1);
        newProducts.splice(endIndex, 0, reorderedItem);
        return {
          selectedProducts: newProducts.map((p, index) => ({
            ...p,
            position: index,
          })),
        };
      }),

    updateProductDiscount: (productId, discount) =>
      set((state) => ({
        selectedProducts: state.selectedProducts.map((p) =>
          p.id === productId ? { ...p, discount } : p
        ),
      })),

    updateVariantDiscount: (productId, variantId, discount) =>
      set((state) => ({
        selectedProducts: state.selectedProducts.map((p) =>
          p.id === productId
            ? {
                ...p,
                variants: p.variants.map((v) =>
                  v.id === variantId ? { ...v, discount } : v
                ),
              }
            : p
        ),
      })),

    updateVariantOrder: (productId, startIndex, endIndex) =>
      set((state) => ({
        selectedProducts: state.selectedProducts.map((p) =>
          p.id === productId
            ? {
                ...p,
                variants: (() => {
                  const newVariants = Array.from(p.variants);
                  const [reorderedVariant] = newVariants.splice(startIndex, 1);
                  newVariants.splice(endIndex, 0, reorderedVariant);
                  return newVariants;
                })(),
              }
            : p
        ),
      })),

    replaceProduct: (index, newProducts) =>
      set((state) => {
        const products = [...state.selectedProducts];
        products.splice(
          index,
          1,
          ...newProducts.map((p, i) => ({
            ...p,
            position: index + i,
          }))
        );
        return { selectedProducts: products };
      }),
  }))
);
