import React, { useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../components/ui/button";
import { useStore } from "../store/useStore";
import ProductItem from "./ProductItem";

const ProductList: React.FC = () => {
  const { selectedProducts, addProduct, updateProductOrder } = useStore();

  const handleAddEmptyProduct = () => {
    addProduct({
      id: Date.now(),
      title: "Select Product",
      variants: [],
      image: {
        id: 0,
        product_id: 0,
        src: "/placeholder.svg",
      },
    });
  };

  const moveProduct = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      updateProductOrder(dragIndex, hoverIndex);
    },
    [updateProductOrder]
  );

  return (
    <div className="w-full max-w-xl mx-auto px-8 py-12">
      <div className="space-y-8">
        <h1 className="text-[16px] font-semibold leading-6 text-left text-[rgba(32,34,35,1)]">
          Add Products
        </h1>

        <div className="grid grid-cols-[auto_1fr_200px] gap-4 px-4">
          <span className="pt-3 text-gray-400"></span>
          <div className="text-[14px] font-normal text-[#111827]">Product</div>
          <div className="text-[14px] font-normal text-[#111827]">Discount</div>
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="space-y-6">
            {selectedProducts.map((product, index) => (
              <ProductItem
                key={`${product.id}-${index}`}
                product={product}
                index={index}
                moveProduct={moveProduct}
              />
            ))}
          </div>
        </DndProvider>

        <div className="flex justify-end">
          <Button
            onClick={handleAddEmptyProduct}
            variant="outline"
            className="w-64 h-[48px] border-[2px] border-[#047857] text-[#047857] hover:bg-transparent hover:border-[#047857]/90 hover:text-[#047857]/90 text-base font-normal font-[600]"
          >
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
