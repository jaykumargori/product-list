import React, { useState, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useStore } from "../store/useStore";
import type { SelectedProduct } from "../types";
import { Button } from "../components/ui/button";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import DiscountPicker from "./DiscountPicker";
import ProductPicker from "./ProductPicker";
import VariantItem from "./VaraintItem";

interface ProductItemProps {
  product: SelectedProduct;
  index: number;
  moveProduct: (dragIndex: number, hoverIndex: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  index,
  moveProduct,
}) => {
  const [showVariants, setShowVariants] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    { index: number },
    void,
    { handlerId: string | symbol | null }
  >({
    accept: "PRODUCT",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveProduct(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<
    { id: number; index: number },
    void,
    { isDragging: boolean }
  >({
    type: "PRODUCT",
    item: () => ({ id: product.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const hasMultipleVariants = product.variants.length > 1;

  const moveVariant = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      useStore.getState().updateVariantOrder(product.id, dragIndex, hoverIndex);
    },
    [product.id]
  );


  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <div className="flex items-start gap-4">
        <div className="pt-3">
          <div className="flex gap-[2px] cursor-move">
            <div className="flex flex-col gap-[2px]">
              <div className="w-[2px] h-[2px] rounded-full bg-gray-400" />
              <div className="w-[2px] h-[2px] rounded-full bg-gray-400" />
              <div className="w-[2px] h-[2px] rounded-full bg-gray-400" />
            </div>
            <div className="flex flex-col gap-[2px]">
              <div className="w-[2px] h-[2px] rounded-full bg-gray-400" />
              <div className="w-[2px] h-[2px] rounded-full bg-gray-400" />
              <div className="w-[2px] h-[2px] rounded-full bg-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-[auto_1fr_200px] items-start gap-4">
          <span className="pt-1 text-[14px] text-gray-400">{index + 1}.</span>

          <div className="bg-white border border-[rgba(0,0,0,0.07)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] w-[215px] h-[31px] px-4 py-0 flex items-center">
            <Button
              variant="ghost"
              className="w-full h-full text-left justify-between font-normal text-gray-400 hover:bg-transparent px-0"
              onClick={() => setIsPickerOpen(true)}
            >
              {product.title}
              <Pencil className="w-3 h-3 text-[#047857]" />
            </Button>
          </div>

          <DiscountPicker product={product} />
        </div>
      </div>

      {hasMultipleVariants && (
        <div className="pl-[52px] mt-1">
          <Button
            variant="link"
            onClick={() => setShowVariants(!showVariants)}
            className="text-[12px] text-[#006EFF] p-0 h-auto font-[400]"
          >
            {showVariants ? "Hide" : "Show"} variants
            {showVariants ? (
              <ChevronUp className="w-3 h-3 ml-1" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-1" />
            )}
          </Button>

          {showVariants && (
            <div className="mt-2 space-y-2 pl-5">
              {product.variants.map((variant, variantIndex) => (
                <VariantItem
                  key={variant.id}
                  variant={variant}
                  index={variantIndex}
                  moveVariant={moveVariant}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <ProductPicker
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        onSelect={(products) => {
          useStore.getState().replaceProduct(index, products);
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
};

export default ProductItem;
