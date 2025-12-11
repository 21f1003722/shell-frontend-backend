import React from "react";
import { ChevronRight, Lock, CheckCircle, TrendingUp } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import dp1 from "../assets/icons/dpProfile1.svg";
import dp2 from "../assets/icons/dpProfile2.svg";
import dp3 from "../assets/icons/dpProfile3.svg";
import dp4 from "../assets/icons/dpProfile4.svg";
import user from "../assets/icons/user.svg";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

/* ---------------- PRODUCT CARD ---------------- */
const ProductCard = ({ product, onRequestAccess, handleOpenDataQuality, id }) => {
  const isAccessible = product.accessible;

  return (
    <div
      className={`border-2  w-full h-auto rounded-lg mb-4 p-6 flex flex-col 2xl:flex-row gap-4 2xl:gap-2 ${
        isAccessible
          ? "bg-[#F0FDF466] border-[#0000001A]"
          : "bg-[#FECDCA1F] border-[#FBCE0799]"
      }`}
    >
      <div className={`w-full ${isAccessible !== "" ? "2xl:w-1/2" : "w-full"}`}>
        <div className="flex items-center gap-1 mb-2">
          <h3
            className="w-fit truncate text-gray-900 text-[16px] font-medium"
            id={`product-title-${id}`}
          >
            {product.title}
          </h3>
          <Tooltip
            anchorSelect={`#product-title-${id}`}
            place="top"
            content={product.title}
          />
          <span
            className="px-3 py-1 flex items-center justify-center gap-1 
                   bg-blue-100 text-blue-700 text-[11px] font-medium 
                   rounded-full text-nowrap"
          >
            <span>{product.matchPercent}%</span> match
          </span>

          {/* Access Badge → 30% */}
          {isAccessible === "" ? null : isAccessible ? (
            <span
              className="px-3 py-1  bg-green-600 text-white text-[12px] 
                     font-medium rounded-full flex items-center justify-center gap-1 text-nowrap 
                     "
            >
              <CheckCircle size={16} /> Accessible
            </span>
          ) : (
            <span
              className="px-3 py-1 bg-red-600 text-white text-[10px] 
                     font-medium rounded-full flex items-center justify-center gap-1 text-nowrap 
                     "
            >
              <Lock size={10} /> Access Required
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex flex-wrap w-full gap-2">
          {product.tags?.map((tag, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 text-[11px] rounded ${
                tag.highlighted
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
      {isAccessible !== "" && (
        <div className="w-full 2xl:w-1/2 pt-2 2xl:pt-0 2xl:pl-2 border-t 2xl:border-t-0 2xl:border-l border-[#00000029]">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white rounded-xl h-[68px] p-3">
              <div className="text-[11px] text-gray-600 mb-1">Data Owner:</div>

              <div className="flex items-center gap-2">
                <img
                  src={product.ownerProfile}
                  alt={product.owner}
                  className="w-4 h-4 rounded-full "
                />
                <span title={product.owner} className="text-xs font-medium">{product.owner?.split("@")[0]?.split(".")?.map((word) => word.charAt(0)?.toUpperCase() + word.slice(1))?.join(" ") || product.owner}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl h-[68px] p-3">
              <div className="text-[11px] text-gray-600 mb-1">
                Data Veracity score
              </div>

              <div className="flex items-center gap-1 text-[12px]">
                <span className="text-sm font-bold">
                  {product.veracityScore}
                </span>

                <div className="flex items-center text-green-600 text-[10px] font-medium">
                  <TrendingUp size={16} /> +{product.veracityChange} from last
                  month
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isAccessible && isAccessible !== "" && (
              <button
                onClick={() => onRequestAccess(product.title)}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-2.5 py-2 text-xs rounded"
              >
                Request for Access
              </button>
            )}
            <button
              className="flex items-center text-[10px] flex-start gap-1 text-gray-700 font-medium hover:text-gray-900 cursor-pointer"
              onClick={() => handleOpenDataQuality(product)}
            >
              View Data Quality
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- DATA PRODUCTS PAGE ---------------- */
export default function DataProducts() {
  const { finalProducts, setProductPermission, setDataQualityModalVisible } =
    useAppContext();

  //  const shuffle = (arr) => arr
  //.map((value) => ({ value, sort: Math.random() }))
  //.sort((a, b) => a.sort - b.sort)
  //.map(({ value }) => value);

  // Convert backend → UI model
  const products =
    finalProducts?.map((item, index) => {
      const entities = Array.isArray(item.it4it_entities)
        ? item.it4it_entities
        : [item.it4it_entities];

      return {
        title: item.table_name,
        matchPercent: item.relevancy_score || 90 - index * 5,
        accessible: !item.access ? "" : item.access === "accessible",
        description: item.business_glossary,
        tags: entities.map((entity, i) => ({
          label: entity,
          highlighted: i === 0,
        })),
        ownerProfile: [user][index % 1],
        // ownerProfile: [dp1, dp2, dp3, dp4][index % 4],
        owner: item.user_name?.split("@")[0],
        veracityScore: 70 + index * 3,
        veracityChange: 1,
        ...item,
      };
    }) || [];
    // ?.sort((a, b) => b.matchPercent - a.matchPercent)

  const handleRequestAccess = (table_name) => {
    setProductPermission(table_name);
  };

  const handleOpenDataQuality = (table_name) => {
    setDataQualityModalVisible(table_name);
  };

  return (
    <div className="h-full w-full bg-gray-50 p-4">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[18px] text-gray-900 mb-1">Search Results</h1>

            <p className="text-gray-600 text-[14px]">
              {products.length} products found •{" "}
              {products.filter((p) => p.accessible).length} accessible
            </p>
          </div>
          {products && products.length > 10 ? (
            <button className="border-2 border-yellow-400 text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-yellow-50 flex items-center text-[12px] gap-2">
              View All Products
              <ChevronRight size={20} />
            </button>
          ) : null}
        </div>

        <div className="pb-4">
          {products.length > 0 ? (
            products.map((product, idx) => (
              <ProductCard
                key={idx}
                id={idx}
                product={product}
                onRequestAccess={handleRequestAccess}
                handleOpenDataQuality={handleOpenDataQuality}
              />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              No products found. Try searching for data products.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
