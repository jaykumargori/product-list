import React, { useState } from "react";
import { useStore } from "../store/useStore";
import type { SelectedProduct, SelectedVariant } from "../types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { X } from "lucide-react";

interface DiscountPickerProps {
  product?: SelectedProduct;
  variant?: SelectedVariant;
  productId?: number;
}

const DiscountPicker: React.FC<DiscountPickerProps> = ({
  product,
  variant,
  productId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "flat">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState("");
  const { updateProductDiscount, updateVariantDiscount } = useStore();

  const handleUpdateDiscount = () => {
    if (!discountValue) return;

    const discount = {
      type: discountType,
      value: Number(discountValue),
    };

    if (variant && productId) {
      updateVariantDiscount(productId, variant.id, discount);
    } else if (product) {
      updateProductDiscount(product.id, discount);
    }
  };

  const handleRemoveDiscount = () => {
    if (product) {
      updateProductDiscount(product.id, undefined);
    } else if (variant && productId) {
      updateVariantDiscount(productId, variant.id, undefined);
    }
    setIsEditing(false);
    setDiscountValue("");
  };

  const currentDiscount = product?.discount || variant?.discount;

  if (!isEditing && !currentDiscount) {
    return (
      <Button
        onClick={() => setIsEditing(true)}
        className="w-36 h-[32px] bg-[#047857] hover:bg-[#047857]/90 text-white rounded-[4px] font-normal"
      >
        Add Discount
      </Button>
    );
  }

  if (currentDiscount) {
    return (
      <div className="flex items-center">
        <Input
          type="text"
          value={currentDiscount.value}
          className="w-[69px] h-[31px] text-center bg-white border border-[rgba(0,0,0,0.1)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] rounded-[0px] px-2"
          readOnly
        />
        <div className="w-[80px] h-[31px] bg-white border border-[rgba(0,0,0,0.1)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] border-l-0 px-3 py-1 text-sm flex items-center">
          {currentDiscount.type === "percentage" ? "% Off" : "Flat Off"}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-gray-600 p-0 h-auto ml-2"
          onClick={() => {
            if (product) {
              updateProductDiscount(product.id, undefined);
            } else if (variant && productId) {
              updateVariantDiscount(productId, variant.id, undefined);
            }
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={discountValue}
        onChange={(e) => {
          setDiscountValue(e.target.value);
          handleUpdateDiscount();
        }}
        className="w-[69px] h-[31px] text-center bg-white border border-[rgba(0,0,0,0.1)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] rounded-[0px] px-2"
        placeholder="0"
      />
      <Select
        value={discountType}
        onValueChange={(value: "percentage" | "flat") => {
          setDiscountType(value);
          if (discountValue) handleUpdateDiscount();
        }}
      >
        <SelectTrigger className="w-[95px] h-[31px] border border-[rgba(0,0,0,0.1)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] border-l-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="percentage">% Off</SelectItem>
          <SelectItem value="flat">Flat Off</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleRemoveDiscount}
        className="w-[40px] h-[10px] p-[0px] bg-transparent hover:bg-transparent text-gray-600"
      >
        <X size={16} />
      </Button>
    </div>
  );
};

export default DiscountPicker;
