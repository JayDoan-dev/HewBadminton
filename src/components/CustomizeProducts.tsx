  "use client";

  import { products } from "@wix/stores";
  import { useEffect, useState } from "react";
  import Add from "./Add";

  const CustomizeProducts = ({
    productId,
    variants,
    productOptions,
  }: {
    productId: string;
    variants: products.Variant[];
    productOptions: products.ProductOption[];
  }) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [selectedVariant, setSelectedVariant] = useState<products.Variant>();
    const [missingOptions, setMissingOptions] = useState<string[]>([]);

    useEffect(() => {
      const variant = variants.find((v) => {
        const variantChoices = v.choices;
        if (!variantChoices) return false;
        return Object.entries(selectedOptions).every(
          ([key, value]) => variantChoices[key] === value
        );
      });
      setSelectedVariant(variant);
    }, [selectedOptions, variants]);

    const handleOptionSelect = (optionType: string, choice: string) => {
      setSelectedOptions((prev) => ({
        ...prev,
        [optionType]: choice,
      }));
      setMissingOptions((prev) => prev.filter((opt) => opt !== optionType));
    };

    const isVariantInStock = (choices: { [key: string]: string }) => {
      return variants.some((variant) => {
        const variantChoices = variant.choices;
        if (!variantChoices) return false;

        return (
          Object.entries(choices).every(
            ([key, value]) => variantChoices[key] === value
          ) &&
          variant.stock?.inStock &&
          variant.stock?.quantity &&
          variant.stock?.quantity > 0
        );
      });
    };

    const validateOptions = () => {
      const missing = productOptions
        .filter((opt) => !selectedOptions[opt.name!])
        .map((opt) => opt.name!);
      setMissingOptions(missing);
      return missing.length === 0;
    };

    return (
      <div className="flex flex-col gap-6">
        {productOptions.map((option) => (
          <div className="flex flex-col gap-2" key={option.name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">
                  Choose a {option.name}
                </h4>
                {missingOptions.includes(option.name!) && (
                  <span className="text-red-500 text-sm">* Required</span>
                )}
              </div>
              {selectedOptions[option.name!] && (
                <span className="text-sm text-gray-600">
                  Selected: <strong>{selectedOptions[option.name!]}</strong>
                </span>
              )}
            </div>

            <ul className="flex items-center gap-3 flex-wrap">
              {option.choices?.map((choice) => {
                const disabled = !isVariantInStock({
                  ...selectedOptions,
                  [option.name!]: choice.description!,
                });

                const selected =
                  selectedOptions[option.name!] === choice.description;

                const clickHandler = disabled
                  ? undefined
                  : () => handleOptionSelect(option.name!, choice.description!);

                return option.name === "Color" ? (
                  <li
                    key={choice.description}
                    className="w-8 h-8 rounded-full ring-1 ring-gray-300 relative"
                    style={{
                      backgroundColor: choice.value,
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                    onClick={clickHandler}
                  >
                    {selected && (
                      <div className="absolute w-10 h-10 rounded-full ring-2 ring-black top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                    {disabled && (
                      <div className="absolute w-10 h-[2px] bg-red-400 rotate-45 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                    )}
                  </li>
                ) : (
                  <li
                    key={choice.description}
                    className="ring-1 ring-hew text-hew rounded-md py-1 px-4 text-sm"
                    style={{
                      cursor: disabled ? "not-allowed" : "pointer",
                      backgroundColor: selected
                        ? "#FC7855"
                        : disabled
                        ? "#FFBDB6"
                        : "white",
                      color: selected || disabled ? "white" : "#FC7855",
                      boxShadow: disabled ? "none" : "",
                    }}
                    onClick={clickHandler}
                  >
                    {choice.description}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <Add
          productId={productId}
          variantId={selectedVariant?._id || "00000000-0000-0000-000000000000"}
          stockNumber={selectedVariant?.stock?.quantity || 0}
          validateOptions={validateOptions}
        />
      </div>
    );
  };

  export default CustomizeProducts;
