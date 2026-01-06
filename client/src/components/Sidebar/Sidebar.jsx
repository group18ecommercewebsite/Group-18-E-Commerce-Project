import React, { useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import '../Sidebar/style.css';
import { Collapse } from 'react-collapse';
import { FaAngleDown } from 'react-icons/fa6';
import { Button } from '@mui/material';
import { FaAngleUp } from "react-icons/fa6";
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Rating from '@mui/material/Rating';
import { useCategories } from '../../context/CategoryContext';
import { formatNumber } from '../../utils/formatCurrency';



const Sidebar = ({ 
  selectedCategoryIds = [], 
  setSelectedCategoryIds,
  priceRange = [0, 5000000],
  setPriceRange,
  selectedRating = null,
  setSelectedRating
}) => {
  const { categories } = useCategories();
  const [isOpenCategoryFilter, setIsOpenCategoryFilter] = useState(true);
  const [isOpenAvailFilter, setIsOpenAvailFilter] = useState(true);
  const [isOpenSizeFilter, setIsOpenSizeFilter] = useState(true);
  const [isOpenPriceFilter, setIsOpenPriceFilter] = useState(true);
  const [isOpenRatingFilter, setIsOpenRatingFilter] = useState(true);

  // Handle checkbox change
  const handleCategoryChange = (categoryId, checked) => {
    if (!setSelectedCategoryIds) return;
    
    if (checked) {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    } else {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    }
  };

  return (
    <aside className="sidebar py-5">
      <div className="box">
        <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
          Danh mục sản phẩm
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenCategoryFilter(!isOpenCategoryFilter)}
          >
            {
                isOpenCategoryFilter===true ? <FaAngleUp /> : <FaAngleDown />
            }
          </Button>
        </h3>
        <Collapse isOpened={isOpenCategoryFilter}>
          <div className="scroll px-4 relative -left-[13px]">
            {/* Chỉ hiển thị categories cấp 1 */}
            {categories.map((cat) => (
              <FormControlLabel
                key={cat._id}
                control={
                  <Checkbox 
                    size="small" 
                    checked={selectedCategoryIds.includes(cat._id)}
                    onChange={(e) => handleCategoryChange(cat._id, e.target.checked)}
                  />
                }
                label={cat.name}
                className="w-full"
              />
            ))}
          </div>
        </Collapse>
      </div>

      <div className="box">
        <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
          Tình trạng
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenAvailFilter(!isOpenAvailFilter)}
          >
            {
                isOpenAvailFilter===true ? <FaAngleUp /> : <FaAngleDown />
            }
          </Button>
        </h3>
        <Collapse isOpened={isOpenAvailFilter}>
          <div className="scroll px-4 relative -left-[13px]">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Còn hàng (17)"
              className="w-full"
            />

            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Có sẵn (10)"
              className="w-full"
            />

            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Hết hàng (17)"
              className="w-full"
            />
            
          </div>
        </Collapse>
      </div>

      <div className="box mt-3">
        <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
          Kích thước
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenSizeFilter(!isOpenSizeFilter)}
          >
            {
                isOpenSizeFilter===true ? <FaAngleUp /> : <FaAngleDown />
            }
          </Button>
        </h3>
        <Collapse isOpened={isOpenSizeFilter}>
          <div className="scroll px-4 relative -left-[13px]">
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Nhỏ (17)"
              className="w-full"
            />

            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Trung bình (10)"
              className="w-full"
            />

            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Lớn (17)"
              className="w-full"
            />

            <FormControlLabel
              control={<Checkbox size="small" />}
              label="XL (17)"
              className="w-full"
            />

            <FormControlLabel
              control={<Checkbox size="small" />}
              label="XXL (17)"
              className="w-full"
            />
            
          </div>
        </Collapse>
      </div>

      <div className="box mt-4">
        <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
          Lọc theo giá
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenPriceFilter(!isOpenPriceFilter)}
          >
            {isOpenPriceFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>

        <Collapse isOpened={isOpenPriceFilter}>
          <div className="px-2">
            <RangeSlider 
              min={0} 
              max={5000000} 
              step={100000}
              value={priceRange}
              onInput={(value) => setPriceRange && setPriceRange(value)}
            />
            <div className='flex pt-4 pb-2 priceRange'>
                <span className='text-[13px]'>
                    Từ: <strong className='text-dark'>{formatNumber(priceRange[0])}đ</strong>
                </span>
                <span className='ml-auto text-[13px]'>
                    Đến: <strong className='text-dark'>{formatNumber(priceRange[1])}đ</strong>
                </span>
            </div>
          </div>
        </Collapse>
      </div>

      <div className="box mt-4">
        <h3 className="w-full mb-3 text-[16px] font-[600] flex items-center pr-5">
          Lọc theo đánh giá
          <Button
            className="!w-[30px] !h-[30px] !min-w-[30px] !rounded-full !ml-auto !text-[#000]"
            onClick={() => setIsOpenRatingFilter(!isOpenRatingFilter)}
          >
            {isOpenRatingFilter ? <FaAngleUp /> : <FaAngleDown />}
          </Button>
        </h3>
        
        <Collapse isOpened={isOpenRatingFilter}>
          <div className='px-2'>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div 
                key={rating}
                className={`w-full flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gray-100 ${selectedRating === rating ? 'bg-red-50 border border-red-200' : ''}`}
                onClick={() => setSelectedRating && setSelectedRating(selectedRating === rating ? null : rating)}
              >
                <Rating name={`rating-${rating}`} value={rating} size="small" readOnly />
                <span className='text-[12px] text-gray-600'>trở lên</span>
                {selectedRating === rating && (
                  <span className='ml-auto text-[10px] text-red-500 font-medium'>✓</span>
                )}
              </div>
            ))}
          </div>
        </Collapse>
      </div>

    </aside>
  );
};

export default Sidebar;
