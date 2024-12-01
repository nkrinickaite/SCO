import React, { useState, useRef, useEffect } from "react";
import BlogList from "./BlogList";
import useFetch from "./useFetch";

const Home = () => {
  const { error, data: initialBlogs } = useFetch("http://localhost:8000/blogs");
  const [blogs, setBlogs] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(0);
  const [isCodeMode, setIsCodeMode] = useState(false); 
  const [codeInput, setCodeInput] = useState("");
  const blogContainerRef = useRef(null);

  const productCodeMapping = {
    "123": {
      title: "Lietuviški pomidorai",
      pricePerKg: "1,69",
      weight: "1 kg",
      price: "1,69",
      type: "vegetable",
    },
    "234": {
      title: "Švieži agurkai",
      pricePerKg: "2,49",
      weight: "0.5 kg",
      price: "1,25",
      type: "vegetable",
    },
    "345": {
      title: "Coca-cola",
      pieces: "1 vnt.",
      price: "8,98",
      type: "product",
    },
    "456": {
      title: "Redbull",
      pieces: "1 vnt.",
      price: "1,5",
      type: "product",
    },
    "567": {
      title: "Akvile",
      pieces: "1 vnt.",
      price: "2,18",
      type: "product",
    },
    "678": {
      title: "Vynas",
      pieces: "1 vnt.",
      price: "12,89",
      type: "product",
    },
  };

  useEffect(() => {
    if (initialBlogs) {
      setBlogs(initialBlogs); 
    }
  }, [initialBlogs]);

  useEffect(() => {
    const total = blogs.reduce((sum, blog) => {
      const price = parseFloat(blog.price.replace(",", "."));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    setTotalPrice(total.toFixed(2));

    if (blogContainerRef.current) {
      blogContainerRef.current.scrollTop = blogContainerRef.current.scrollHeight;
    }
  }, [blogs]);

  useEffect(() => {
    if (blogContainerRef.current) {
      blogContainerRef.current.scrollTop = blogContainerRef.current.scrollHeight;
    }
  }, [blogs]);
  
  const handleCodeButtonClick = () => {
    setIsCodeMode(true); 
  };

  const handleExitCodeMode = () => {
    setIsCodeMode(false); 
    setCodeInput(""); 
  };

  const handleNumberClick = (number) => {
    setCodeInput((prev) => prev + number); 
  };

  const handleClearInput = () => {
    setCodeInput(""); 
  };

  const handleApplyCode = () => {
    const product = productCodeMapping[codeInput]; 
  
    if (product) {
      setBlogs((prevBlogs) => {
        const existingProductIndex = prevBlogs.findIndex(
          (blog) => blog.title === product.title
        );
  
        if (existingProductIndex !== -1) {
          const updatedBlogs = [...prevBlogs];
          const existingProduct = updatedBlogs[existingProductIndex];
  
          if (existingProduct.type === "product") {
            const updatedPieces = parseInt(existingProduct.pieces) + 1;
  
            const currentPrice = parseFloat(
              existingProduct.price.replace(",", ".").replace("€", "").trim()
            );
            const addedPrice = parseFloat(
              product.price.replace(",", ".").replace("€", "").trim()
            );
  
            const updatedPrice = currentPrice + addedPrice;
  
            updatedBlogs[existingProductIndex] = {
              ...existingProduct,
              pieces: `${updatedPieces} vnt.`, 
              price: updatedPrice.toFixed(2).replace(".", ",") + " €",
            };
          } else if (existingProduct.type === "vegetable") {
            const currentWeight = parseFloat(
              existingProduct.weight.replace(" kg", "").replace(",", ".")
            );
            const addedWeight = parseFloat(
              product.weight.replace(" kg", "").replace(",", ".")
            );
  
            const updatedWeight = currentWeight + addedWeight;
  
            const currentPrice = parseFloat(
              existingProduct.price.replace(",", ".").replace("€", "").trim()
            );
            const addedPrice = parseFloat(
              product.price.replace(",", ".").replace("€", "").trim()
            );
  
            const updatedPrice = currentPrice + addedPrice;
  
            updatedBlogs[existingProductIndex] = {
              ...existingProduct,
              weight: `${updatedWeight.toFixed(1).replace(".", ",")} kg`, 
              price: updatedPrice.toFixed(2).replace(".", ",") + " €", 
            };
          }
  
          return updatedBlogs; 
        } else {

          return [
            ...prevBlogs,
            {
              ...product,
              id: Date.now(),
              price: parseFloat(product.price.replace(",", "."))
                .toFixed(2)
                .replace(".", ",") + " €", 
            },
          ];
        }
      });
    } else {
      alert("Product code not found!"); 
    }
  
    handleExitCodeMode(); 
  };

  return (
    <div className="home">
      <div>
        <div className="blog-container" ref={blogContainerRef}>
          {error && <div>{error}</div>}
          {blogs && <BlogList blogs={blogs} />} {}
        </div>
        <div className="total-container">
          <div className="total-display">
            <span>Iš viso:</span>
            <span className="total-price">{totalPrice} €</span>
          </div>
        </div>
      </div>
      <div className="help-container">
        <button className="help-button">Pagalba</button>
        {!isCodeMode && (
          <>
            <div className="button-group">
              <button className="frame-button"></button>
              <button className="extra-button">Nuskaitykite QR kodą arba nuolaidų kortelę</button>
            </div>
            <div className="checkbox-container">
              <label className="checkbox-label">
                Elektroninis čekis
                <input type="checkbox" className="checkbox-input" />
              </label>
            </div>
          </>
        )}
        <div className="button-group">
          {!isCodeMode && (
            <>
              <button className="search-button">Prekės paieška</button>
              <button className="quantity-button">Įvesti kiekį</button>
              <button className="code-button" onClick={handleCodeButtonClick}>
                Įvesti kodą
              </button>
            </>
          )}
          {isCodeMode && (
            <div className="code-input-container">
              <input
                type="text"
                className="code-input"
                placeholder="Įveskite kodą"
                value={codeInput}
                readOnly 
              />
              <div className="keypad">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <button
                    key={num}
                    className="keypad-button"
                    onClick={() => handleNumberClick(num)}
                  >
                    {num}
                  </button>
                ))}
                <button className="keypad-button clear" onClick={handleClearInput}>
                  Clear
                </button>
                <button className="keypad-button apply" onClick={handleApplyCode}>
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="pay-button">Mokėjimas</button>
      </div>
    </div>
  );
};

export default Home;
