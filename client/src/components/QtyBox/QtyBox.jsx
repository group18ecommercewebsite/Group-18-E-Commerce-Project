import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { FaAngleUp } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa';

const QtyBox = ({ value = 1, onChange, max = 999 }) => {

    const [qtyVal, setQtyVal] = useState(value)

    // Sync với props khi value thay đổi từ bên ngoài
    useEffect(() => {
        setQtyVal(value);
    }, [value]);

    const plusQty = () => {
        if (qtyVal < max) {
            const newVal = qtyVal + 1;
            setQtyVal(newVal);
            onChange && onChange(newVal);
        }
    }

    const minusQty = () => {
        if (qtyVal > 1) {
            const newVal = qtyVal - 1;
            setQtyVal(newVal);
            onChange && onChange(newVal);
        }
    }

    const handleInputChange = (e) => {
        let val = parseInt(e.target.value) || 1;
        if (val < 1) val = 1;
        if (val > max) val = max;
        setQtyVal(val);
        onChange && onChange(val);
    }

  return (
    <div className="qtyBox flex items-center relative">
      <input
        type="number"
        className="w-full h-[40px] p-2 pl-5 text-[15px] focus:outline-none border border-[rgba(0,0,0,0.2)] rounded-md"
        value={qtyVal}
        onChange={handleInputChange}
        min={1}
        max={max}
      />

      <div className="flex items-center flex-col justify-between h-[40px] absolute top-0 right-0 z-50">
        <Button className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]" onClick={plusQty}>
          <FaAngleUp className='text-[12px] opacity-55'/>
        </Button>
        <Button className="!min-w-[25px] !w-[25px] !h-[20px] !text-[#000] !rounded-none hover:!bg-[#f1f1f1]" onClick={minusQty}>
          <FaAngleDown className='text-[12px] opacity-55'/>
        </Button>
      </div>

    </div>
  );
};

export default QtyBox;
