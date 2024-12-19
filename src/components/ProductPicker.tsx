import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Product } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Search, Loader2, X } from "lucide-react";
import placeholderImage from "../assets/placeholder.png";

const MONK_COMMERCE_API_KEY = import.meta.env
  .VITE_API_URL_MONK_COMMERCE_API_KEY;

interface ProductPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (products: Product[]) => void;
}

const ProductPicker: React.FC<ProductPickerProps> = ({
  open,
  onOpenChange,
  onSelect,
}) => {
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<{
    [key: string]: Set<number>;
  }>({});

  const parentRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["products", search],
    queryFn: async ({ pageParam = 1 }) => {
      const myHeaders = new Headers();
      myHeaders.append("x-api-key", MONK_COMMERCE_API_KEY);

      const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect,
      };

      const searchParams = new URLSearchParams({
        search,
        page: String(pageParam),
        limit: "10",
      }).toString();

      const response = await fetch(
        `https://stageapi.monkcommerce.app/task/products/search?${searchParams}`,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await response.text();
      return JSON.parse(result);
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.length === 10 ? pages?.length + 1 : undefined;
    },
  });

  const allProducts = data?.pages.flat() ?? [];

  const getEstimatedSize = (product: Product) => {
    // Base height for product header
    const baseHeight = 60;
    // Height per variant
    const variantHeight = 48;
    // Calculate total height based on number of variants
    return baseHeight + (product?.variants?.length ?? 0) * variantHeight;
  };

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allProducts.length + 1 : allProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const product = allProducts[index];
      return product ? getEstimatedSize(product) : 60;
    },
    overscan: 5,
  });

  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      if (
        scrollElement.scrollTop + scrollElement.clientHeight >=
        scrollElement.scrollHeight - 100
      ) {
        !isFetching && hasNextPage && fetchNextPage();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetching]);

  // Helper function to format price
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return !isNaN(numPrice) ? numPrice.toFixed(2) : "0.00";
  };

  const toggleProduct = (productId: number, variantId?: number) => {
    setSelectedProducts((prev) => {
      const next = { ...prev };
      if (!next[productId]) {
        next[productId] = new Set();
      }

      if (variantId === undefined) {
        // Toggle all variants
        const product = allProducts.find((p) => p.id === productId);
        if (!product) return prev;

        if (next[productId].size === product.variants.length) {
          next[productId].clear();
        } else {
          product.variants.forEach((v: { id: number }) =>
            next[productId].add(v.id)
          );
        }
      } else {
        // Toggle single variant
        if (next[productId].has(variantId)) {
          next[productId].delete(variantId);
        } else {
          next[productId].add(variantId);
        }
      }

      if (next[productId].size === 0) {
        delete next[productId];
      }

      return next;
    });
  };

  const isProductSelected = (product: Product) => {
    return selectedProducts[product.id]?.size === product.variants.length;
  };

  const isVariantSelected = (productId: number, variantId: number) => {
    return selectedProducts[productId]?.has(variantId) ?? false;
  };

  const getSelectedCount = () => {
    return Object.values(selectedProducts).reduce(
      (acc, variants) => acc + variants.size,
      0
    );
  };

  const handleAdd = () => {
    const selected = allProducts
      .filter((product) => selectedProducts[product.id])
      .map((product) => ({
        ...product,
        variants: product.variants.filter((variant: { id: number }) =>
          selectedProducts[product.id].has(variant.id)
        ),
      }));
    onSelect(selected);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-white rounded-lg">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="text-lg font-normal text-gray-700">
            Select Products
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 h-auto p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search product"
              className="pl-9 bg-white border-gray-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div ref={parentRef} className="relative h-[400px] overflow-auto">
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const product = allProducts[virtualRow.index];

              if (!product) {
                return (
                  <div
                    key="loader"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="flex items-center justify-center"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                );
              }

              return (
                <div
                  key={product.id}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  className="hover:bg-gray-50"
                >
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        checked={isProductSelected(product)}
                        onCheckedChange={() => toggleProduct(product.id)}
                        className="h-4 w-4 rounded border-gray-400 data-[state=checked]:bg-[rgba(0,128,96,1)] data-[state=checked]:border-[rgba(0,128,96,1)]"
                      />

                      <img
                        src={
                          product.image?.src || placeholderImage
                        }
                        alt={product.title || "Placeholder"}
                        className="w-8 h-8 rounded object-cover bg-gray-100"
                      />
                      <span className="font-normal text-gray-700">
                        {product.title}
                      </span>
                    </div>
                    <div className="space-y-2 pl-7">
                      {product.variants.map(
                        (variant: {
                          id: number;
                          title: string;
                          price: string;
                        }) => (
                          <div
                            key={variant.id}
                            className="flex items-center justify-between px-4 py-1"
                          >
                            <div className="flex items-center gap-3 min-w-[200px]">
                              <Checkbox
                                checked={isVariantSelected(
                                  product.id,
                                  variant.id
                                )}
                                onCheckedChange={() =>
                                  toggleProduct(product.id, variant.id)
                                }
                                className="h-4 w-4 rounded border-gray-400 data-[state=checked]:bg-[rgba(0,128,96,1)] data-[state=checked]:border-[rgba(0,128,96,1)]"
                              />
                              <span className="font-normal text-gray-700">
                                {variant.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 ml-auto">
                              <span className="text-sm text-gray-500 min-w-[100px] text-right">
                                99 available
                              </span>
                              <span className="text-sm text-gray-900 min-w-[60px] text-right">
                                ${formatPrice(variant.price)}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-white">
          <div className="font-normal text-gray-700">
            {getSelectedCount()} products selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-36 text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} className="w-16  text-white px-6">
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPicker;
