import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { LiaAngleDownSolid, LiaAngleUpSolid } from "react-icons/lia";
import { useState } from 'react';


const CategoryCollapse = () => {

    // luu trang thai mo tung submenu
    const [openSubmenus, setOpenSubmenus] = useState({
        fashion: false,
        electronics: false,
        bags: false,
        footwear: false,
    });

    // ham toggle cho tung menu
    const toggleSubmenu = (name) => {
        setOpenSubmenus((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };
    
  return (
    <>
      <div className="scroll">
        <ul className="w-full">
          {/* Fashion */}
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Fashion
            </Button>
            {openSubmenus.fashion ? (
              <LiaAngleUpSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('fashion')}
              />
            ) : (
              <LiaAngleDownSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('fashion')}
              />
            )}
          </li>
          <ul className={`submenu pl-6 ${openSubmenus.fashion ? 'block' : 'hidden'}`}>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Men
              </Button>
            </li>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Women
              </Button>
            </li>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Girls
              </Button>
            </li>
          </ul>

          {/* Electronics */}
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Electronics
            </Button>
            {openSubmenus.electronics ? (
              <LiaAngleUpSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('electronics')}
              />
            ) : (
              <LiaAngleDownSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('electronics')}
              />
            )}
          </li>
          <ul className={`submenu pl-6 ${openSubmenus.electronics ? 'block' : 'hidden'}`}>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Smart Watch
              </Button>
            </li>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Laptops
              </Button>
            </li>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Mobiles
              </Button>
            </li>
          </ul>

          {/* Bags */}
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Bags
            </Button>
            {openSubmenus.bags ? (
              <LiaAngleUpSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('bags')}
              />
            ) : (
              <LiaAngleDownSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('bags')}
              />
            )}
          </li>
          <ul className={`submenu pl-6 ${openSubmenus.bags ? 'block' : 'hidden'}`}>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Women Bags
              </Button>
            </li>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Men Bags
              </Button>
            </li>
          </ul>
          {/* Footwear */}
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Footwears
            </Button>
            {openSubmenus.footwear ? (
              <LiaAngleUpSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('footwear')}
              />
            ) : (
              <LiaAngleDownSolid
                className="cursor-pointer text-[13px]"
                onClick={() => toggleSubmenu('footwear')}
              />
            )}
          </li>
          <ul className={`submenu pl-6 ${openSubmenus.footwear ? 'block' : 'hidden'}`}>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Women Footwear
              </Button>
            </li>
            <li>
              <Button
                variant="text"
                className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
              >
                Men Footwear
              </Button>
            </li>
          </ul>
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Groceries
            </Button>
          </li>
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Beauty
            </Button>
          </li>
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Wellness
            </Button>
          </li>
          <li className="list-none flex items-center justify-between !px-3">
            <Button
              variant="text"
              className="w-full !justify-start !text-[rgba(0,0,0,0.8)] !normal-case"
            >
              Jewellery
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default CategoryCollapse;
