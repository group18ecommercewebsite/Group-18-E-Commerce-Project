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
          {/* Service icons - responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 py-6 md:py-8 border-b border-[rgba(0,0,0,0.1)]">
            <div className="col flex items-center justify-center flex-col group text-center">
              <LiaShippingFastSolid className="text-[36px] md:text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[13px] md:text-[16px] font-[600] mt-2 md:mt-3">Miễn phí vận chuyển</h3>
              <p className="text-[11px] md:text-[12px] font-[500] text-center !m-0">Cho đơn hàng trên 500.000đ</p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center">
              <PiKeyReturnLight className="text-[36px] md:text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[13px] md:text-[16px] font-[600] mt-2 md:mt-3">Đổi trả trong 30 ngày</h3>
              <p className="text-[11px] md:text-[12px] font-[500] text-center !m-0">Hoàn tiền hoặc đổi sản phẩm</p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center">
              <BsWallet2 className="text-[36px] md:text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[13px] md:text-[16px] font-[600] mt-2 md:mt-3">Thanh toán an toàn</h3>
              <p className="text-[11px] md:text-[12px] font-[500] text-center !m-0">Chấp nhận nhiều loại thẻ</p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center">
              <LiaGiftSolid className="text-[36px] md:text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[13px] md:text-[16px] font-[600] mt-2 md:mt-3">Quà tặng đặc biệt</h3>
              <p className="text-[11px] md:text-[12px] font-[500] text-center !m-0">Cho đơn hàng đầu tiên</p>
            </div>

            <div className="col flex items-center justify-center flex-col group text-center col-span-2 sm:col-span-1">
              <BiSupport className="text-[36px] md:text-[50px] transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-1" />
              <h3 className="text-[13px] md:text-[16px] font-[600] mt-2 md:mt-3">Hỗ trợ 24/7</h3>
              <p className="text-[11px] md:text-[12px] font-[500] text-center !m-0">Liên hệ bất cứ lúc nào</p>
            </div>
          </div>
          {/* Footer main content - responsive grid */}
          <div className="footer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 py-6 md:py-8">
            {/* Contact info */}
            <div className="part1">
              <h2 className="text-[18px] md:text-[20px] font-[600] mb-3 md:mb-4">Liên hệ chúng tôi</h2>
              <p className="text-[12px] md:text-[13px] font-[400] pb-3 md:pb-4 !mt-0">
                HustShop - Mega Super Store
                <br />
                1st Tran Dai Nghia Street, Hanoi, Vietnam
              </p>
              <Link className="link text-[12px] md:text-[13px]" to="mailto:support@hustshop.com">
                support@hustshop.com
              </Link>
              <span className="text-[18px] md:text-[22px] font-[600] block w-full mt-2 md:mt-3 text-[#ff5252]">
                (+84) 123 456 789
              </span>
              <div className="flex items-center gap-2 mt-2">
                <IoChatboxOutline className="text-[30px] md:text-[40px] text-[#ff5252]" />
                <span className="text-[14px] md:text-[16px] font-[600]">
                  Chat trực tuyến
                  <br />
                  Nhận tư vấn ngay
                </span>
              </div>
            </div>

            {/* Products links */}
            <div className="part2">
              <h2 className="text-[18px] md:text-[20px] font-[600] mb-3 md:mb-4">Sản phẩm</h2>
              <ul className="list">
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Giảm giá</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Sản phẩm mới</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Bán chạy</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Liên hệ</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Sitemap</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Cửa hàng</Link>
                </li>
              </ul>
            </div>

            {/* Company links */}
            <div className="part2">
              <h2 className="text-[18px] md:text-[20px] font-[600] mb-3 md:mb-4">Công ty</h2>
              <ul className="list">
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Giao hàng</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Thông báo pháp lý</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Điều khoản sử dụng</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Về chúng tôi</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Thanh toán an toàn</Link>
                </li>
                <li className="list-none text-[13px] md:text-[14px] w-full mb-2">
                  <Link to="/" className="link">Đăng nhập</Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="part3">
              <h2 className="text-[18px] md:text-[20px] font-[600] mb-3 md:mb-4">Đăng ký nhận tin</h2>
              <p className="text-[12px] md:text-[13px] font-[400] pb-3 md:pb-4 !mt-0">
                Đăng ký để nhận thông tin về các ưu đãi đặc biệt.
              </p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Địa chỉ email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-[rgba(0,0,0,0.2)] rounded px-3 md:px-4 py-2 md:py-3 text-[13px] md:text-[14px] mb-3 outline-none focus:border-[#ff5252]"
                />
                <button
                  type="submit"
                  className="bg-[#ff5252] text-white px-4 md:px-6 py-2 rounded text-[13px] md:text-[14px] font-[600] hover:bg-[#e04848] transition-all duration-300"
                >
                  ĐĂNG KÝ
                </button>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-[#ff5252]"
                  />
                  <label htmlFor="agreeTerms" className="text-[11px] md:text-[12px] font-[400]">
                    Tôi đồng ý với điều khoản và chính sách bảo mật
                  </label>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom Footer - responsive */}
          <div className="border-t border-[rgba(0,0,0,0.1)] pt-4 md:pt-6 mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Social Icons */}
              <div className="flex items-center gap-2 md:gap-3 order-2 sm:order-1">
                <Link
                  to="/"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#3b5998] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaFacebookF className="text-[14px] md:text-[16px]" />
                </Link>
                <Link
                  to="/"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#ff0000] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaYoutube className="text-[14px] md:text-[16px]" />
                </Link>
                <Link
                  to="/"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#bd081c] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaPinterestP className="text-[14px] md:text-[16px]" />
                </Link>
                <Link
                  to="/"
                  className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#e4405f] flex items-center justify-center text-white hover:opacity-80 transition-all duration-300"
                >
                  <FaInstagram className="text-[14px] md:text-[16px]" />
                </Link>
              </div>

              {/* Copyright */}
              <p className="text-[12px] md:text-[14px] font-[400] text-gray-600 !m-0 order-1 sm:order-2">© 2025 - Ecommerce HustShop</p>

              {/* Payment Icons */}
              <div className="flex items-center gap-1 md:gap-2 order-3">
                <div className="bg-[#1a1f71] text-white px-1.5 md:px-2 py-1 rounded">
                  <SiVisa className="text-[18px] md:text-[24px]" />
                </div>
                <div className="bg-[#eb001b] text-white px-1.5 md:px-2 py-1 rounded">
                  <SiMastercard className="text-[18px] md:text-[24px]" />
                </div>
                <div className="bg-[#006fcf] text-white px-1.5 md:px-2 py-1 rounded">
                  <SiAmericanexpress className="text-[18px] md:text-[24px]" />
                </div>
                <div className="bg-[#003087] text-white px-1.5 md:px-2 py-1 rounded">
                  <SiPaypal className="text-[18px] md:text-[24px]" />
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
              disableScrollLock={true}
              ModalProps={{
                keepMounted: true,
                disableScrollLock: true,
              }}
              PaperProps={{
                sx: { maxWidth: '400px', width: '100%' }
              }}
            >
              <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
                <h4>Giỏ hàng (0)</h4>
                <IoCloseSharp className="text-[20px] cursor-pointer" onClick={context.toggleCartPanel(false)} />
              </div>
      
              <CartPanel/>
            </Drawer>
    </>
  );
}
