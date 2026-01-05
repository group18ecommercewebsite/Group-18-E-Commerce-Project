import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { LiaAngleDownSolid, LiaAngleUpSolid } from "react-icons/lia";
import { useCategories } from '../../context/CategoryContext';
import CircularProgress from '@mui/material/CircularProgress';

const CategoryCollapse = ({ onCategoryClick }) => {
  const { categories, loading, error } = useCategories();
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (categoryId) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleCategoryClick = () => {
    if (onCategoryClick) {
      onCategoryClick();
    }
  };

  // Render subcategories recursively
  const renderSubCategories = (children, level = 1) => {
    if (!children || children.length === 0) return null;

    return (
      <ul className={`submenu pl-6`}>
        {children.map((subCat) => (
          <li key={subCat._id} className="list-none">
            <div className="flex items-center justify-between px-3">
              <Link 
                to={`/productListing/${subCat._id}`}
                onClick={handleCategoryClick}
                className="flex-1"
              >
                <Button
                  variant="text"
                  className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case !text-[13px]"
                >
                  {subCat.name}
                </Button>
              </Link>
              {subCat.children && subCat.children.length > 0 && (
                openSubmenus[subCat._id] ? (
                  <LiaAngleUpSolid
                    className="cursor-pointer text-[13px]"
                    onClick={() => toggleSubmenu(subCat._id)}
                  />
                ) : (
                  <LiaAngleDownSolid
                    className="cursor-pointer text-[13px]"
                    onClick={() => toggleSubmenu(subCat._id)}
                  />
                )
              )}
            </div>
            <div className={openSubmenus[subCat._id] ? 'block' : 'hidden'}>
              {renderSubCategories(subCat.children, level + 1)}
            </div>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress size={30} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500 text-sm">
        Failed to load categories
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No categories found
      </div>
    );
  }

  return (
    <div className="scroll max-h-[70vh] overflow-y-auto">
      <ul className="w-full">
        {categories.map((category) => (
          <li key={category._id} className="list-none">
            <div className="flex items-center justify-between px-3">
              <Link 
                to={`/productListing/${category._id}`}
                onClick={handleCategoryClick}
                className="flex-1"
              >
                <Button
                  variant="text"
                  className="w-full !justify-start !text-[rgba(0,0,0,0.8)] hover:!text-[#ff5252] !normal-case"
                >
                  {category.name}
                </Button>
              </Link>
              {category.children && category.children.length > 0 && (
                openSubmenus[category._id] ? (
                  <LiaAngleUpSolid
                    className="cursor-pointer text-[13px]"
                    onClick={() => toggleSubmenu(category._id)}
                  />
                ) : (
                  <LiaAngleDownSolid
                    className="cursor-pointer text-[13px]"
                    onClick={() => toggleSubmenu(category._id)}
                  />
                )
              )}
            </div>
            <div className={openSubmenus[category._id] ? 'block' : 'hidden'}>
              {renderSubCategories(category.children)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryCollapse;
