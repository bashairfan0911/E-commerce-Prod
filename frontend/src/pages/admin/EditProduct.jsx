import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brandName, setBrandName] = useState("");
  const [weight, setWeight] = useState("");
  const [originalprice, setOriginalPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [fetchedCategories, setFetchedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/singleproduct/${id}`);
        const product = response.data.singleProduct;
        
        setTitle(product.title);
        setDescription(product.description);
        setSelectedCategory(product.category);
        setBrandName(product.brandname);
        setWeight(product.weight);
        setOriginalPrice(product.originalprice);
        setDiscount(product.discount);
        setSelectedType(product.type);
        setSellingPrice(product.sellingprice);
        setCurrentImages(product.images || []);
        setLoading(false);
      } catch (error) {
        toast.error('Error loading product');
        console.error(error);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await api.get('/api/allcategory');
        setFetchedCategories(response.data.categories);
      } catch (error) {
        console.log(`Error in fetching category : ${error.response}`);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  useEffect(() => {
    if (originalprice === "") {
      setSellingPrice("");
    } else {
      setSellingPrice(Math.ceil(originalprice - ((originalprice * discount) / 100)));
    }
  }, [discount, originalprice]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  const handleRemoveImage = (imageToRemove) => {
    // Add to removal list
    setImagesToRemove([...imagesToRemove, imageToRemove.public_id]);
    // Remove from current images display
    setCurrentImages(currentImages.filter(img => img.public_id !== imageToRemove.public_id));
    toast.info("Image marked for removal. Click 'Update Product' to save changes.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !selectedCategory || !brandName || !weight || !originalprice || !discount) {
      toast.error("All fields are required");
      return;
    }

    // Validate that we have at least one image
    if (currentImages.length === 0 && newImages.length === 0) {
      toast.error("Product must have at least one image");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', selectedCategory);
    formData.append('brandname', brandName);
    formData.append('weight', weight);
    formData.append('originalprice', originalprice);
    formData.append('sellingprice', sellingPrice);
    formData.append('discount', discount);
    formData.append('type', selectedType);

    // Add images to remove
    if (imagesToRemove.length > 0) {
      console.log('Images to remove:', imagesToRemove);
      formData.append('imagesToRemove', JSON.stringify(imagesToRemove));
    }

    // Add remaining current images
    console.log('Current images to keep:', currentImages);
    console.log('Current images count:', currentImages.length);
    console.log('Current images public_ids:', currentImages.map(img => img.public_id));
    formData.append('keepImages', JSON.stringify(currentImages));

    // Add new images if any
    if (newImages.length > 0) {
      console.log('Adding new images:', newImages.length);
      newImages.forEach((image) => {
        formData.append('images', image);
      });
    }

    // Debug: Log what's in FormData
    console.log('=== FormData Contents ===');
    for (let pair of formData.entries()) {
      if (pair[0] === 'images') {
        console.log(pair[0], ':', 'File -', pair[1].name);
      } else {
        console.log(pair[0], ':', pair[1]);
      }
    }

    const toastId = toast.loading("Updating product...");
    try {
      console.log('Sending update request...');
      const response = await api.put(`/api/updateproduct/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Update response:', response.data);
      console.log('Updated product images count:', response.data.product?.images?.length);
      console.log('Updated product images:', response.data.product?.images);
      
      toast.update(toastId, {
        render: `Product updated successfully! Now has ${response.data.product?.images?.length || 0} image(s)`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
      setTimeout(() => {
        // Force refresh by adding timestamp
        navigate('/admin/allproducts?refresh=' + Date.now());
      }, 1500);
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Error response:', error.response?.data);
      toast.update(toastId, {
        render: error.response?.data?.message || "Error updating product",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading product...</div>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="account-details-area">
        <h2 className="title">Edit Product</h2>
        <div className="input-half-area">
          <div className="single-input">
            <input 
              type="text" 
              placeholder="Product name" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>
        </div>

        <select
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: "10px"
          }}
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option disabled value="">Select a Category</option>
          {fetchedCategories.map((category, index) => (
            <option value={category.catname} key={index}>{category.catname}</option>
          ))}
        </select>

        <select
          style={{
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '100%',
            backgroundColor: '#f9f9f9',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: "10px",
            marginBottom: "10px"
          }}
          onChange={(e) => setSelectedType(e.target.value)}
          value={selectedType}
        >
          <option disabled value="">Select a Type</option>
          <option value={"featuredGrocery"}>Featured Grocery</option>
          <option value={"productWithDiscount"}>Products With Discounts</option>
          <option value={"weeklyBestSellingGroceries"}>Weekly Best Selling Groceries</option>
          <option value={"topTrendingProducts"}>Top Trending Products</option>
        </select>

        <input 
          type="text" 
          placeholder="Product Description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
        />

        <div className="input-half-area">
          <div className="single-input">
            <input 
              type="text" 
              placeholder="Brand name" 
              value={brandName} 
              onChange={(e) => setBrandName(e.target.value)} 
            />
          </div>
          <div className="single-input">
            <input 
              type="text" 
              placeholder="Weight *" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
            />
          </div>
        </div>

        <div className="input-half-area">
          <div className="single-input">
            <input 
              type="number" 
              placeholder="Original Price" 
              value={originalprice} 
              onChange={(e) => setOriginalPrice(e.target.value)} 
            />
          </div>
          <div className="single-input">
            <input 
              type="number" 
              placeholder="Discount" 
              value={discount} 
              onChange={(e) => setDiscount(e.target.value)} 
            />
          </div>
          <div className="single-input">
            <input 
              type="number" 
              placeholder="Selling Price" 
              value={sellingPrice === "" ? "" : sellingPrice} 
              readOnly
            />
          </div>
        </div>

        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Current Images</h4>
          {currentImages.length === 0 ? (
            <p style={{ color: '#999', marginBottom: '15px' }}>No images. Please upload new images below.</p>
          ) : (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
              {currentImages.map((image, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img 
                    src={image.url} 
                    alt={`Product ${index + 1}`}
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '2px solid #ddd'
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveImage(image);
                    }}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      zIndex: 10,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#cc0000'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ff4444'}
                    title="Remove this image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              Add More Images
            </label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleImageChange}
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '100%',
                backgroundColor: '#f9f9f9'
              }}
            />
            {newImages.length > 0 && (
              <p style={{ marginTop: '8px', color: '#629D23' }}>
                {newImages.length} new image(s) selected
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="rts-btn btn-primary" type='submit'>Update Product</button>
          <button 
            className="rts-btn" 
            type='button'
            onClick={() => navigate('/admin/allproducts')}
            style={{ backgroundColor: '#666' }}
          >
            Cancel
          </button>
        </div>
      </form>    </>
  );
}

export default EditProduct;
