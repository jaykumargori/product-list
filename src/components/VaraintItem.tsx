import { Pencil } from "lucide-react";
import { Button } from "./ui/button";
import DiscountPicker from "./DiscountPicker";
import { SelectedVariant, Variant } from "../types";
import { useRef } from "react";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";

interface VariantItemProps {
  variant: Variant;
  index: number;
  moveVariant: (dragIndex: number, hoverIndex: number) => void;
}

const VariantItem: React.FC<VariantItemProps> = ({
  variant,
  index,
  moveVariant,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    { index: number },
    void,
    { handlerId: string | symbol | null }
  >({
    accept: "VARIANT",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item: { index: number }, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveVariant(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<
    { id: number; index: number },
    void,
    { isDragging: boolean }
  >({
    type: "VARIANT",
    item: () => ({ id: variant.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  const selectedVariant: SelectedVariant = {
    ...variant,
    position: index,
  };

  return (
    <div
      ref={ref}
      style={{ opacity }}
      className="grid grid-cols-[auto_1fr_200px] items-center gap-4"
      data-handler-id={handlerId}
    >
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
      <div className="bg-white border border-[rgba(0,0,0,0.07)] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] w-[215px] h-[31px] px-4 py-0 flex items-center">
        <Button
          variant="ghost"
          className="w-full h-full text-left justify-between font-normal text-gray-400 hover:bg-transparent px-0"
        >
          {variant.title}
          <Pencil className="w-3 h-3 text-[#047857]" />
        </Button>
      </div>
      <DiscountPicker variant={selectedVariant} />
    </div>
  );
};

export default VariantItem;
