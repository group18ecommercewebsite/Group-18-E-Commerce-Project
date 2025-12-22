import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { IoCloseSharp } from "react-icons/io5";
import { Button } from '@mui/material';
import { LiaAngleDownSolid, LiaAngleUpSolid } from "react-icons/lia";
import { useState } from 'react';
import CategoryCollapse from '../../CategoryCollapse/CategoryCollapse';

export const CategoryPanel = ({ open, onClose }) => {
    
    const DrawerList = (
        <Box sx={{ width: 280 }} role="presentation">
            <h3 className="p-3 text-base font-[500] flex items-center justify-between border-b">
                Shop By Categories
                <IoCloseSharp onClick={onClose} className="cursor-pointer text-xl hover:text-[#ff5252]" />
            </h3>

            <CategoryCollapse onCategoryClick={onClose} />
        </Box>
    );

    return (
        <Drawer open={open} onClose={onClose}>
            {DrawerList}
        </Drawer>
    );
};
