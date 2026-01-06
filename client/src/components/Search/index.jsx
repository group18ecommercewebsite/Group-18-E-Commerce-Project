import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { BsSearch } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { searchProducts } from '../../api/productApi';
import CircularProgress from '@mui/material/CircularProgress';

export const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const response = await searchProducts(query, 8);
          if (response.success) {
            setResults(response.products || []);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/productListing?search=${encodeURIComponent(query)}`);
      setShowDropdown(false);
      setQuery('');
    }
  };

  const handleProductClick = () => {
    setShowDropdown(false);
    setQuery('');
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className='searchBox w-full h-[50px] bg-[#e5e5e5] rounded-md relative p-2 flex justify-center items-center' ref={searchRef}>
      <form onSubmit={handleSearch} className="flex w-full items-center">
        <input 
          type="text" 
          placeholder='Search for products...' 
          className='w-full h-10 focus:outline-none bg-inherit p-2 text-[15px]'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setShowDropdown(true)}
        />
        
        {query && (
          <Button 
            type="button"
            onClick={clearSearch}
            className='z-50 !min-w-8 h-8 rounded-full !p-0'
          >
            <IoCloseSharp className='text-[#4e4e4e] text-lg'/>
          </Button>
        )}
        
        <Button type="submit" className='z-50 !min-w-10 h-10 rounded-full'>
          {loading ? (
            <CircularProgress size={18} sx={{ color: '#4e4e4e' }} />
          ) : (
            <BsSearch className='text-[#4e4e4e] text-xl'/>
          )}
        </Button>
      </form>

      {/* Search Results Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-[9999]">
          <div className="py-2">
            {results.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                onClick={handleProductClick}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="w-[50px] h-[50px] flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={product.images?.[0] || 'https://via.placeholder.com/50'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium text-gray-800 line-clamp-1">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[14px] font-semibold text-[#ff5252]">{product.price?.toLocaleString('vi-VN')} đ</span>
                    {product.oldPrice > product.price && (
                      <span className="text-[12px] text-gray-400 line-through">{product.oldPrice?.toLocaleString('vi-VN')} đ</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* View all results */}
          <div className="border-t border-gray-200 p-3">
            <button
              onClick={handleSearch}
              className="w-full text-center text-[14px] text-[#ff5252] font-medium hover:underline"
            >
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}

      {/* No results message */}
      {showDropdown && query.trim().length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999]">
          <div className="py-6 text-center text-gray-500">
            <p>No products found for "{query}"</p>
          </div>
        </div>
      )}
    </div>
  );
};
