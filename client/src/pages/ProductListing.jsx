import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import ProductItem from '../components/ProductItem/ProductItem';
import ProductItemListView from '../components/ProductItemListView/ProductItemListView';
import { Button } from '@mui/material';
import { IoGridSharp } from 'react-icons/io5';
import { LuMenu } from 'react-icons/lu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import { getProducts, getProductsByCategoryId, searchProducts } from '../api/productApi';
import { useCategories } from '../context/CategoryContext';

const ProductListing = () => {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { categories } = useCategories();
  
  const [itemView, setItemView] = useState('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Sales, highest to lowest');
  const productsPerPage = 12;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    handleClose();
  };

  // State cho sidebar filter
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [selectedRating, setSelectedRating] = useState(null);

  // Tìm tên category từ ID
  const findCategoryName = (catId, cats) => {
    for (const cat of cats) {
      if (cat._id === catId) return cat.name;
      if (cat.children) {
        const found = findCategoryName(catId, cat.children);
        if (found) return found;
      }
    }
    return null;
  };

  // Tìm đường dẫn breadcrumb từ category ID
  const findCategoryPath = (catId, cats, path = []) => {
    for (const cat of cats) {
      if (cat._id === catId) {
        return [...path, { id: cat._id, name: cat.name }];
      }
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryPath(catId, cat.children, [...path, { id: cat._id, name: cat.name }]);
        if (found) return found;
      }
    }
    return null;
  };

  const categoryPath = categoryId ? findCategoryPath(categoryId, categories) : [];

  // Thu thập tất cả ID của category và các con của nó
  const getAllCategoryIds = (catId, cats) => {
    const ids = [];
    
    const findAndCollect = (targetId, categories) => {
      for (const cat of categories) {
        if (cat._id === targetId) {
          // Tìm thấy category, thu thập ID của nó và tất cả con
          collectAllChildIds(cat, ids);
          return true;
        }
        if (cat.children && cat.children.length > 0) {
          if (findAndCollect(targetId, cat.children)) {
            return true;
          }
        }
      }
      return false;
    };

    const collectAllChildIds = (category, idList) => {
      idList.push(category._id);
      if (category.children && category.children.length > 0) {
        for (const child of category.children) {
          collectAllChildIds(child, idList);
        }
      }
    };

    findAndCollect(catId, cats);
    return ids;
  };

  const categoryName = categoryId ? findCategoryName(categoryId, categories) : 'All Products';

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        setCurrentPage(1); // Reset to first page when filters change
        
        // Nếu có search query, sử dụng search API
        if (searchQuery.trim()) {
          const response = await searchProducts(searchQuery, 100);
          if (response.success) {
            setProducts(response.products || []);
          } else {
            setError(response.message || 'Failed to search products');
          }
        } else if (categoryId && categories.length > 0) {
          // Lấy tất cả category IDs (bao gồm cả con)
          const allCategoryIds = getAllCategoryIds(categoryId, categories);
          
          // Fetch products cho tất cả categories
          const allProducts = [];
          const fetchPromises = allCategoryIds.map(id => getProductsByCategoryId(id));
          const responses = await Promise.all(fetchPromises);
          
          for (const response of responses) {
            if (response.success && response.products) {
              allProducts.push(...response.products);
            }
          }
          
          // Loại bỏ trùng lặp (nếu có)
          const uniqueProducts = allProducts.filter((product, index, self) =>
            index === self.findIndex(p => p._id === product._id)
          );
          
          setProducts(uniqueProducts);
        } else if (!categoryId && !searchQuery) {
          // Fetch tất cả products
          const response = await getProducts();
          if (response.success) {
            setProducts(response.products || []);
          } else {
            setError(response.message || 'Failed to fetch products');
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, categories, searchQuery]);

  // Thu thập tất cả category IDs (bao gồm con) cho filter sidebar
  const getFilterCategoryIds = (selectedIds) => {
    const allIds = [];
    for (const selectedId of selectedIds) {
      const ids = getAllCategoryIds(selectedId, categories);
      allIds.push(...ids);
    }
    // Loại bỏ trùng lặp
    return [...new Set(allIds)];
  };

  // Filter products dựa trên sidebar selection (bao gồm cả category con)
  const filterCatIds = getFilterCategoryIds(selectedCategoryIds);
  
  // Apply all filters: category, price, rating
  const filteredProducts = products.filter(product => {
    // Category filter
    if (selectedCategoryIds.length > 0 && !filterCatIds.includes(product.catId)) {
      return false;
    }
    
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Rating filter (show products with rating >= selected rating)
    if (selectedRating !== null && product.rating < selectedRating) {
      return false;
    }
    
    return true;
  });

  // Sort products (use filteredProducts)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price, low to high':
        return a.price - b.price;
      case 'Price, high to low':
        return b.price - a.price;
      case 'Name, A to Z':
        return a.name.localeCompare(b.name);
      case 'Name, Z to A':
        return b.name.localeCompare(a.name);
      case 'Rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-5 pb-0">
      <div className="container">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" color="inherit" href="/" className="link transition !text-[14px]">
            Home
          </Link>
          {categoryPath && categoryPath.map((cat, index) => (
            <Link 
              key={cat.id}
              underline="hover" 
              color={index === categoryPath.length - 1 ? "text.primary" : "inherit"} 
              href={`/productListing/${cat.id}`} 
              className="link transition !text-[14px]"
            >
              {cat.name}
            </Link>
          ))}
          {!categoryId && !searchQuery && (
            <Link underline="hover" color="text.primary" href="/productListing" className="link transition !text-[14px]">
              All Products
            </Link>
          )}
          {searchQuery && (
            <Typography color="text.primary" className="!text-[14px]">
              Search: "{searchQuery}"
            </Typography>
          )}
        </Breadcrumbs>
      </div>

      <div className="bg-white p-2 mt-4">
        <div className="container flex gap-3">
          <div className="sidebarWrapper w-[20%] h-full bg-white">
            <Sidebar 
              selectedCategoryIds={selectedCategoryIds}
              setSelectedCategoryIds={setSelectedCategoryIds}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
            />
          </div>

          <div className="rightContent w-[80%] py-3">
            <div className="bg-[#f1f1f1] p-2 w-full mb-4 rounded-md flex items-center justify-between">
              <div className="col1 flex items-center itemViewActions">
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === 'list' && 'active'
                  }`}
                  onClick={() => setItemView('list')}
                >
                  <LuMenu className="text-[rgba(0,0,0,0.7)]" />
                </Button>
                <Button
                  className={`!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] ${
                    itemView === 'grid' && 'active'
                  }`}
                  onClick={() => setItemView('grid')}
                >
                  <IoGridSharp className="text-[rgba(0,0,0,0.7)]" />
                </Button>

                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]">
                  There are {filteredProducts.length} products.
                </span>
              </div>

              <div className="col2 ml-auto flex items-center justify-end gap-3 pr-4">
                <span className="text-[14px] font-medium pl-3 text-[rgba(0,0,0,0.7)]">
                  Sort By:
                </span>

                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  className="!bg-white !text-[12px] !text-[#000] !capitalize !font-medium !border-2 !border-[#000]"
                >
                  {sortBy}
                </Button>

                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  slotProps={{
                    list: {
                      'aria-labelledby': 'basic-button',
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => handleSortChange('Sales, highest to lowest')}
                    className="!text-[13px] !text-[#000] !capitalize !font-medium"
                  >
                    Sales, highest to lowest
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('Relevance')}
                    className="!text-[13px] !text-[#000] !capitalize !font-medium"
                  >
                    Relevance
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('Name, A to Z')}
                    className="!text-[13px] !text-[#000] !capitalize !font-medium"
                  >
                    Name, A to Z
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('Name, Z to A')}
                    className="!text-[13px] !text-[#000] !capitalize !font-medium"
                  >
                    Name, Z to A
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('Price, low to high')}
                    className="!text-[13px] !text-[#000] !capitalize !font-medium"
                  >
                    Price, low to high
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleSortChange('Price, high to low')}
                    className="!text-[13px] !text-[#000] !capitalize !font-medium"
                  >
                    Price, high to low
                  </MenuItem>
                </Menu>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <CircularProgress />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="flex items-center justify-center py-20">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            )}

            {/* No Products */}
            {!loading && !error && paginatedProducts.length === 0 && (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && !error && paginatedProducts.length > 0 && (
              <div
                className={`grid ${
                  itemView === 'grid' ? 'grid-cols-4 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-1'
                } gap-4`}
              >
                {itemView === 'grid' ? (
                  paginatedProducts.map((product) => (
                    <ProductItem key={product._id} product={product} />
                  ))
                ) : (
                  paginatedProducts.map((product) => (
                    <ProductItemListView key={product._id} product={product} />
                  ))
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center mt-10">
                <Pagination 
                  count={totalPages} 
                  page={currentPage}
                  onChange={handlePageChange}
                  showFirstButton 
                  showLastButton 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListing;
