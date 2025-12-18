import React, { useContext, useState } from 'react';
import { LiaGiftSolid, LiaShippingFastSolid } from 'react-icons/lia';
import { PiKeyReturnLight } from 'react-icons/pi';
import { BsWallet2 } from 'react-icons/bs';
import { BiSupport } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { IoChatboxOutline } from 'react-icons/io5';
import { FaFacebookF, FaYoutube, FaPinterestP, FaInstagram } from 'react-icons/fa';
import { SiVisa, SiMastercard, SiAmericanexpress, SiPaypal } from 'react-icons/si';
import Drawer from '@mui/material/Drawer';
import CartPanel from '../CartPanel/CartPanel';
import { IoCloseSharp } from 'react-icons/io5';
import { MyContext } from '../../App';


export default function Footer() {
  const [email, setEmail] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const context = useContext(MyContext)

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && agreeTerms) {
      console.log('Subscribed:', email);
      setEmail('');
      setAgreeTerms(false);
    }
  };

  return (
    <>
      <footer className="py-6 bg-[#fafafa] border-t border-[rgba(0,0,0,0.1)]">
        <div className="container">
          <div className="flex items-center justify-between !w-[60%] mx-auto">
            <div className="flex items-center justify-center gap-2 py-8 pb-8">
              <div className="col flex items-center justify-center flex-col group">
                <LiaShippingFastSolid className="text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
                <h3 className="text-[16px] font-[600] mt-3">Free Shipping</h3>
                <p className="text-[12px] font-[500] text-center">For all orders over $100</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="col flex items-center justify-center flex-col group">
                <PiKeyReturnLight className="text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
                <h3 className="text-[16px] font-[600] mt-3">30 Days Return</h3>
                <p className="text-[12px] font-[500] text-center">For an Exchange Product</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="col flex items-center justify-center flex-col group">
                <BsWallet2 className="text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
                <h3 className="text-[16px] font-[600] mt-3">Secured Payment</h3>
                <p className="text-[12px] font-[500] text-center">Payment Cards Accepted</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="col flex items-center justify-center flex-col group">
                <LiaGiftSolid className="text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
                <h3 className="text-[16px] font-[600] mt-3">Special Gifts</h3>
                <p className="text-[12px] font-[500] text-center">Our First Product Order</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <div className="col flex items-center justify-center flex-col group">
                <BiSupport className="text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
                <h3 className="text-[16px] font-[600] mt-3">Support 24/7</h3>
                <p className="text-[12px] font-[500] text-center">Contact us Anytime</p>
              </div>
            </div>
            <hr />
          </div>
          <div className="footer flex items-center py-8">
            <div className="part1 w-[25%] border-r border-[rgba(0,0,0,0.2)] pr-4">
              <h2 className="text-[20px] font-[600] mb-4">Contact us</h2>
              <p className="text-[13px] font-[400] pb-4">
                HustShop - Mega Super Store
                <br />
                1st Tran Dai Nghia Street, Hanoi, Vietnam
              </p>
              <Link className="link text-[13px]" to="mailto:support@hustshop.com">
                support@hustshop.com
              </Link>
              <span className="text-[22px] font-[600] block w-full mt-3 text-[#ff5252]">
                (+84) 123 456 789
              </span>
              <div className="flex items-center gap-2">
                <IoChatboxOutline className="text-[40px] text-[#ff5252]" />
                <span className="text-[16px] font-[600]">
                  Online Chat
                  <br />
                  Get Expert Help
                </span>
              </div>
            </div>

            <div className="part2 w-[20%] flex pl-8">
              <div className="part_col1 w-[50%]">
                <h2 className="text-[20px] font-[600] mb-4">Products</h2>
                <ul className="list">
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Prices Drop
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      New Products
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Best Sales
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Contact Us
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Sitemap
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Stores
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="part2 w-[20%] flex">
              <div className="part_col2 w-[50%]">
                <h2 className="text-[20px] font-[600] mb-4">Our company</h2>
                <ul className="list">
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Delivery
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Legal Notice
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Terms and conditions of use
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      About us
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Secure payment
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link to="/" className="link">
                      Login
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="part3 w-[35%] pl-8">
              <h2 className="text-[20px] font-[600] mb-4">Subscribe to newsletter</h2>
              <p className="text-[13px] font-[400] pb-4">
                Subscribe to our latest newsletter to get news about special discounts.
              </p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[rgba(0,0,0,0.2)] rounded px-4 py-3 text-[14px] mb-3 outline-none focus:border-[#ff5252]"
                />
                <button
                  type="submit"
                  className="bg-[#ff5252] text-white px-6 py-2 rounded text-[14px] font-[600] hover:bg-[#e04848] transition-all duration-300"
                >
                  SUBSCRIBE
                </button>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-[#ff5252]"
                  />
                  <label htmlFor="agreeTerms" className="text-[12px] font-[400]">
                    I agree to the terms and conditions and the privacy policy
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-[rgba(0,0,0,0.1)] pt-6 mt-4">
            <div className="flex items-center justify-between">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="w-9 h-9 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaFacebookF className="text-[16px]" />
                </Link>
                <Link
                  to="/"
                  className="w-9 h-9 rounded-full bg-[#ff0000] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaYoutube className="text-[16px]" />
                </Link>
                <Link
                  to="/"
                  className="w-9 h-9 rounded-full bg-[#bd081c] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaPinterestP className="text-[16px]" />
                </Link>
                <Link
                  to="/"
                  className="w-9 h-9 rounded-full bg-[#e4405f] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaInstagram className="text-[16px]" />
                </Link>
              </div>

              {/* Copyright */}
              <p className="text-[14px] font-[400] text-gray-600">© 2025 - Ecommerce HustShop</p>

              {/* Payment Icons */}
              <div className="flex items-center gap-2">
                <div className="bg-[#1a1f71] text-white px-2 py-1 rounded">
                  <SiVisa className="text-[24px]" />
                </div>
                <div className="bg-[#eb001b] text-white px-2 py-1 rounded">
                  <SiMastercard className="text-[24px]" />
                </div>
                <div className="bg-[#006fcf] text-white px-2 py-1 rounded">
                  <SiAmericanexpress className="text-[24px]" />
                </div>
                <div className="bg-[#003087] text-white px-2 py-1 rounded">
                  <SiPaypal className="text-[24px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Cart panel */}
            <Drawer
              open={context.openCartPanel}
              onClose={()=>context.toggleCartPanel(false)}
              anchor={'right'}
              className="cartPanel"
            >
              <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
                <h4>Shopping Cart (0)</h4>
                <IoCloseSharp className="text-[20px] cursor-pointer" onClick={context.toggleCartPanel(false)} />
              </div>
      
              <CartPanel/>
            </Drawer>
    </>
  );
}
