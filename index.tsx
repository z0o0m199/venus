import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  GoogleGenAI, 
  Modality
} from "@google/genai";
import { 
  ShoppingBag, 
  Search, 
  User, 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Trash2, 
  Send, 
  Loader2, 
  Globe, 
  Sparkles, 
  MessageCircle,
  X,
  Plus,
  Heart,
  Mail,
  Lock,
  LogOut,
  MapPin,
  CheckCircle2,
  Menu,
  Settings,
  Image as ImageIcon,
  Tag,
  Package,
  Upload,
  ClipboardList,
  Layers,
  Edit3,
  Percent,
  Eye,
  Megaphone
} from 'lucide-react';

// --- Constants ---
const DELIVERY_FEE = 5000;
const WHATSAPP_NUMBER = "9647710092101"; 

// --- Initial Mock Data ---
const INITIAL_PRODUCTS = [
  { id: 1, name: "Anua HEARTLEAF PORE deep cleansing foam 150ml", description: "غسول رغوي عميق ينظف المسام بلطف ويترك البشرة رطبة.", price: 25000, discountPrice: null, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop", category: "العناية بالبشرة" },
  { id: 2, name: "QV Cream 100G كيو في كريم مرطب", description: "كريم مرطب عالي التركيز للبشرة الجافة والحساسة.", price: 15000, discountPrice: 12000, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop", category: "العناية بالبشرة" },
  { id: 3, name: "BIODERMA sensibio H2O 500ml بيوديرما سينسيبيو ماء ميسيلار", description: "ماء ميسيلار منظف ومزيل للمكياج للبشرة الحساسة.", price: 22000, discountPrice: null, image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=400&auto=format&fit=crop", category: "العناية بالبشرة" },
  { id: 4, name: "bioderma pigmentbio foaming cream 200ml كريم رغوي للتنظيف", description: "كريم منظف يساعد على تفتيح وتوحيد لون البشرة.", price: 23000, discountPrice: null, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&auto=format&fit=crop", category: "العناية بالبشرة" },
];

const INITIAL_CATEGORIES = [
  { id: 1, name: "المكياج", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "العناية بالشعر", image: "https://images.unsplash.com/photo-1527799822340-3fd2727a97c8?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "العناية بالجسم", image: "https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "العناية بالبشرة", image: "https://images.unsplash.com/photo-1570172619380-21c6b997931c?q=80&w=400&auto=format&fit=crop" },
];

const INITIAL_BRANDS = [
  { id: 1, name: "JOKO", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200&auto=format&fit=crop" },
  { id: 2, name: "CELIA", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=200&auto=format&fit=crop" },
  { id: 3, name: "REVUELE", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop" },
  { id: 4, name: "ANUA", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&auto=format&fit=crop" },
  { id: 5, name: "BIODERMA", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=200&auto=format&fit=crop" },
  { id: 6, name: "QV", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop" },
];

const INITIAL_CAROUSEL = [
  { id: 1, title: "بردنا جاف و قاسي", subtitle: "بس بشرتج مو هيج، لازم تكون ناعمة ومرطبة دائمًا", image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, title: "جمالكِ يبدأ من هنا", subtitle: "أفضل الماركات العالمية للعناية بالبشرة والمكياج بين يديكِ", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, title: "عروض الموسم الحصرية", subtitle: "احصلي على خصومات تصل إلى 40% على منتجاتك المفضلة", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1200&auto=format&fit=crop" },
];

// --- Components ---

const Drawer = ({ title, onClose, children, side = "left" }: { title: string, onClose: () => void, children?: React.ReactNode, side?: "left" | "right" }) => (
  <div className="fixed inset-0 z-[100] flex" style={{ justifyContent: side === "left" ? "flex-start" : "flex-end" }}>
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
    <div className={`relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-fade-in-${side}`}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-2xl font-black">{title}</h3>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  </div>
);

const Modal = ({ onClose, children }: { onClose: () => void, children?: React.ReactNode }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={onClose}></div>
    <div className="relative bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
      <button onClick={onClose} className="absolute top-8 left-8 p-2 text-gray-300 hover:text-pink-500 transition-colors"><X size={24}/></button>
      {children}
    </div>
  </div>
);

const EmptyState = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4 py-20">
    <div className="opacity-40">{icon}</div>
    <p className="font-bold text-lg">{text}</p>
  </div>
);

const NavLink = ({ children, active, onClick }: any) => (
  <a 
    onClick={onClick}
    className={`cursor-pointer hover:text-pink-500 transition-colors relative py-2 ${active ? 'text-pink-500 after:content-[""] after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-pink-500' : ''}`}
  >
    {children}
  </a>
);

const AIAction = ({ icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 px-8 py-4 rounded-2xl hover:bg-pink-50 transition-all text-gray-600 hover:text-pink-500 font-bold border border-transparent hover:border-pink-100 shadow-sm"
  >
    <div className="text-pink-500">{icon}</div>
    <span>{label}</span>
  </button>
);

const DevSection = ({ title, icon, children }: { title: string, icon: React.ReactNode, children?: React.ReactNode }) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 space-y-6">
    <div className="flex items-center gap-3 text-pink-500 mb-2">
      <div className="p-2 bg-pink-50 rounded-xl">{icon}</div>
      <h3 className="text-xl font-black">{title}</h3>
    </div>
    {children}
  </div>
);

const ProductCard = ({ product, onAdd, onToggleWishlist, isWishlisted, onViewDetails }: any) => {
  const displayPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice;

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden group border border-gray-100 hover:border-pink-200 transition-all hover:shadow-xl relative flex flex-col h-full animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={onViewDetails}>
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className={`absolute top-4 left-4 p-2.5 rounded-full shadow-lg transition-all border ${isWishlisted ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white/80 backdrop-blur-md border-white text-gray-400 hover:text-pink-500'}`}
        >
          <Heart size={20} className={isWishlisted ? "fill-current" : ""}/>
        </button>
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            خصم {Math.round((1 - product.discountPrice / product.price) * 100)}%
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
           <div className="bg-white/90 p-3 rounded-full text-pink-500 shadow-xl"><Eye size={24}/></div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 text-right">
        <div className="flex items-baseline gap-2 mb-2">
          <div className="text-pink-500 font-black text-2xl">{displayPrice.toLocaleString()} ع.د</div>
          {hasDiscount && (
            <div className="text-gray-400 line-through text-sm">{product.price.toLocaleString()} ع.د</div>
          )}
        </div>
        <h3 className="font-bold text-gray-800 leading-snug flex-1 mb-6 group-hover:text-pink-500 transition-colors">
          {product.name}
        </h3>
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="w-full py-4 bg-pink-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all transform hover:-translate-y-1 active:scale-95"
        >
          إضافة إلى عربة التسوق
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'store' | 'stylist' | 'dev'>('home');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [carouselItems, setCarouselItems] = useState(INITIAL_CAROUSEL);
  const [orders, setOrders] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  const [currentUser, setCurrentUser] = useState<{name: string, isAdmin?: boolean} | null>(null);
  const [loading, setLoading] = useState(false);
  const [stylistMessages, setStylistMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
  const [stylistInput, setStylistInput] = useState('');

  // --- Developer Dashboard State ---
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', discountPrice: '', image: '', category: '' });
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  const [newBrand, setNewBrand] = useState({ name: '', image: '' });
  const [newCarousel, setNewCarousel] = useState({ title: '', subtitle: '', image: '' });

  // --- Checkout Form State ---
  const [checkoutForm, setCheckoutForm] = useState({ phone: '', address: '', name: '' });

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? {...item, quantity: item.quantity + 1} : item);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.product.id !== id));

  const toggleWishlist = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]);
  };

  const getCartTotal = () => {
    return cart.reduce((acc, item) => {
      const price = item.product.discountPrice || item.product.price;
      return acc + (price * item.quantity);
    }, 0);
  };

  const handleFinalCheckout = () => {
    if (!checkoutForm.phone || !checkoutForm.address || !checkoutForm.name) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    const total = getCartTotal();
    const finalTotal = total + DELIVERY_FEE;
    const order = {
      id: Date.now(),
      date: new Date().toLocaleString('ar-IQ'),
      customer: checkoutForm,
      items: cart,
      subtotal: total,
      delivery: DELIVERY_FEE,
      total: finalTotal,
      status: 'pending'
    };

    setOrders(prev => [order, ...prev]);

    // Construct WhatsApp message
    let message = `*طلب جديد من متجر فينس*%0A%0A`;
    message += `*الاسم:* ${checkoutForm.name}%0A`;
    message += `*الهاتف:* ${checkoutForm.phone}%0A`;
    message += `*العنوان:* ${checkoutForm.address}%0A%0A`;
    message += `*المنتجات:*%0A`;
    cart.forEach(item => {
      const p = item.product;
      const price = p.discountPrice || p.price;
      message += `- ${p.name} (الكمية: ${item.quantity}) - ${price.toLocaleString()} ع.د%0A`;
    });
    message += `%0A*المجموع:* ${total.toLocaleString()} ع.د`;
    message += `%0A*أجور التوصيل:* ${DELIVERY_FEE.toLocaleString()} ع.د`;
    message += `%0A*السعر النهائي:* ${finalTotal.toLocaleString()} ع.د`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setCheckoutForm({ name: '', phone: '', address: '' });
  };

  const handleLogout = () => setCurrentUser(null);

  const handleStylistMessage = async () => {
    if (!stylistInput.trim() || loading) return;
    const userMsg = stylistInput;
    setStylistMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setStylistInput('');
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: "أنت خبير تجميل وعناية بالبشرة محترف في متجر Venus. مهمتك تقديم نصائح تجميلية دقيقة وروتين عناية بالبشرة بناءً على نوع بشرة العميل. كن ودوداً ومهنياً واستخدم مصطلحات تجميلية راقية."
        }
      });
      setStylistMessages(prev => [...prev, { role: 'ai', content: response.text || "أنا هنا لمساعدتك في الحصول على أفضل مظهر." }]);
    } catch (error) {
      setStylistMessages(prev => [...prev, { role: 'ai', content: "عذراً، المستشار مشغول حالياً." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-arabic overflow-x-hidden" dir="rtl">
      {/* Top Header Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-8">
            <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
              <Menu size={28} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <div className="text-pink-500 font-bold text-xl lg:text-2xl italic">V</div>
              </div>
              <span className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">VENUS</span>
            </div>
            <nav className="hidden lg:flex items-center gap-6 font-medium text-gray-600">
              <NavLink active={activeTab === 'home'} onClick={() => setActiveTab('home')}>الرئيسية</NavLink>
              <NavLink active={activeTab === 'store'} onClick={() => setActiveTab('store')}>المتجر</NavLink>
              <NavLink>خدماتنا</NavLink>
              <NavLink>من نحن</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
                <span className="hidden sm:inline text-sm font-bold text-pink-600">أهلاً، {currentUser.name}</span>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors"><LogOut size={18}/></button>
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="hidden md:flex items-center gap-2 px-5 py-2.5 border-2 border-pink-200 text-pink-500 rounded-full text-sm font-bold hover:bg-pink-50 transition-all">
                تسجيل الدخول
              </button>
            )}
            <div className="flex items-center gap-2">
              <button onClick={() => setIsWishlistOpen(true)} className="p-2 lg:p-2.5 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 relative">
                <Heart size={20} className={wishlist.length > 0 ? "fill-pink-500 text-pink-500" : ""} />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{wishlist.length}</span>}
              </button>
              <button onClick={() => setIsCartOpen(true)} className="p-2 lg:p-2.5 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 relative">
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {activeTab === 'home' && (
          <>
            {/* Dynamic Carousel */}
            <section className="relative h-[400px] lg:h-[600px] overflow-hidden group">
              {carouselItems.map((slide, idx) => (
                <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                  <img src={slide.image} className="w-full h-full object-cover" alt={slide.title} />
                  <div className="absolute inset-0 bg-gradient-to-l from-pink-900/40 via-transparent to-black/20 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full text-right">
                      <div className="max-w-xl space-y-4 lg:space-y-6 animate-fade-in">
                        <h2 className="text-4xl lg:text-7xl font-black text-white leading-[1.1] drop-shadow-lg">{slide.title}</h2>
                        <p className="text-xl lg:text-2xl text-pink-50 font-medium opacity-90 leading-relaxed drop-shadow-md">{slide.subtitle}</p>
                        <button onClick={() => setActiveTab('store')} className="mt-4 px-10 py-4 bg-pink-500 text-white rounded-full text-xl font-bold shadow-xl shadow-pink-900/20 hover:bg-pink-600 hover:scale-105 transition-all">تسوق الآن</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {carouselItems.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 transition-all rounded-full ${idx === currentSlide ? 'w-8 bg-pink-500' : 'w-2 bg-white/50'}`}
                  />
                ))}
              </div>
            </section>

            {/* Circular Brands */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
              <div className="flex items-center justify-center gap-6 lg:gap-12 flex-wrap">
                {brands.map(brand => (
                  <div key={brand.id} className="group cursor-pointer flex flex-col items-center gap-3">
                    <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden transition-transform group-hover:scale-110 group-hover:border-pink-200">
                      <img src={brand.image} className="w-full h-full object-cover" alt={brand.name} />
                    </div>
                    <span className="font-bold text-gray-700 group-hover:text-pink-500 transition-colors">{brand.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Action Button */}
            <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 mb-12">
              <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-wrap items-center justify-center gap-8 border border-pink-100">
                <AIAction icon={<Sparkles size={28}/>} label="خبير التجميل الذكي" onClick={() => setActiveTab('stylist')} />
              </div>
            </section>

            {/* Featured Products */}
            <section className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl lg:text-4xl font-black text-gray-900">المنتجات الأكثر طلباً</h2>
                <button onClick={() => setActiveTab('store')} className="text-pink-500 font-bold flex items-center gap-1 hover:underline">مشاهدة الكل <ChevronLeft size={20}/></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 4).map(p => (
                  <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)} isWishlisted={wishlist.includes(p.id)} onViewDetails={() => setSelectedProduct(p)} />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'store' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
            <h2 className="text-4xl font-black text-gray-900 mb-12">جميع المنتجات</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map(p => (
                <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)} isWishlisted={wishlist.includes(p.id)} onViewDetails={() => setSelectedProduct(p)} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stylist' && (
           <div className="max-w-4xl mx-auto px-4 py-12 h-[calc(100vh-80px)] flex flex-col">
           <div className="flex items-center gap-4 mb-8">
             <div className="p-3 bg-pink-500 text-white rounded-2xl shadow-lg shadow-pink-200"><Sparkles size={32}/></div>
             <div>
               <h2 className="text-3xl font-black">خبير التجميل الذكي</h2>
               <p className="text-gray-400 text-sm font-bold">استشارة مخصصة لبشرتك ومظهرك</p>
             </div>
           </div>
           
           <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-y-auto p-8 space-y-6 mb-6 custom-scrollbar">
             {stylistMessages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                 <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center text-pink-500"><MessageCircle size={64} /></div>
                 <div><p className="text-2xl font-black">أهلاً بك في فينس جات</p><p className="font-bold">أنا خبيرك التجميلي، كيف يمكنني مساعدتك اليوم؟</p></div>
               </div>
             )}
             {stylistMessages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl ${m.role === 'user' ? 'bg-pink-500 text-white shadow-xl shadow-pink-100' : 'bg-pink-50 border border-pink-100 text-gray-800 italic font-medium'}`}>
                   <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                 </div>
               </div>
             ))}
             {loading && <div className="p-4 bg-pink-50 rounded-full w-fit animate-bounce"><Loader2 className="animate-spin text-pink-500" /></div>}
           </div>

           <div className="bg-white p-4 rounded-[2rem] shadow-2xl border border-pink-100 flex items-center gap-4">
             <div className="p-3 bg-pink-100 rounded-full text-pink-500"><Heart size={20}/></div>
             <input value={stylistInput} onChange={setStylistInput} onKeyDown={e => e.key === 'Enter' && handleStylistMessage()} placeholder="أخبرني عن نوع بشرتك أو مشكلة تواجهينها..." className="flex-1 bg-transparent px-2 py-2 outline-none font-bold text-gray-700" />
             <button onClick={handleStylistMessage} disabled={loading || !stylistInput.trim()} className="bg-pink-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-pink-600 transition-all flex items-center gap-2">
               {loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>} إرسال
             </button>
           </div>
         </div>
        )}

        {/* --- Developer Dashboard Content --- */}
        {activeTab === 'dev' && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 space-y-12">
            <div className="flex items-center justify-between">
               <div><h2 className="text-4xl font-black text-gray-900">لوحة التحكم (المطور)</h2><p className="text-gray-500 font-bold mt-2">إدارة كاملة للمتجر</p></div>
               <div className="p-4 bg-gray-900 text-white rounded-3xl flex items-center gap-3"><Settings className="animate-spin-slow" /><span className="font-bold">وضع الإدارة نشط</span></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* 1. Manage Products */}
               <DevSection title="إضافة منتج" icon={<Package size={24}/>}>
                  <div className="space-y-4">
                    <input placeholder="اسم المنتج" className="dev-input" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    <textarea placeholder="وصف المنتج" className="dev-input resize-none" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="السعر" className="dev-input" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                      <input placeholder="سعر الخصم (اختياري)" className="dev-input" value={newProduct.discountPrice} onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value})} />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-pink-300 transition-all">
                        <Upload size={20} className="text-gray-400" /><span className="font-bold text-gray-500">رفع صورة المنتج</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setNewProduct({...newProduct, image: url}))} />
                      </label>
                      {newProduct.image && <img src={newProduct.image} className="w-14 h-14 rounded-xl object-cover" />}
                    </div>
                    <button onClick={() => { if (newProduct.name && newProduct.price) setProducts([...products, { ...newProduct, id: Date.now(), price: parseInt(newProduct.price), discountPrice: newProduct.discountPrice ? parseInt(newProduct.discountPrice) : null } as any]); setNewProduct({ name: '', description: '', price: '', discountPrice: '', image: '', category: '' }); }} className="dev-btn-pink">إضافة المنتج</button>
                  </div>
               </DevSection>

               {/* 2. Edit Prices & Discounts */}
               <DevSection title="تعديل الأسعار والخصومات" icon={<Edit3 size={24}/>}>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                     {products.map(p => (
                       <div key={p.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} className="w-12 h-12 rounded-lg object-cover" />
                            <span className="font-bold text-sm line-clamp-1 flex-1">{p.name}</span>
                            <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <div className="space-y-1">
                               <label className="text-[10px] font-black text-gray-400 pr-1">السعر الأصلي</label>
                               <input 
                                 className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-bold" 
                                 type="number" 
                                 value={p.price} 
                                 onChange={(e) => setProducts(products.map(item => item.id === p.id ? {...item, price: parseInt(e.target.value)} : item))} 
                               />
                             </div>
                             <div className="space-y-1">
                               <label className="text-[10px] font-black text-gray-400 pr-1">سعر الخصم</label>
                               <input 
                                 className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-bold" 
                                 type="number" 
                                 placeholder="لا يوجد"
                                 value={p.discountPrice || ''} 
                                 onChange={(e) => setProducts(products.map(item => item.id === p.id ? {...item, discountPrice: e.target.value ? parseInt(e.target.value) : null} : item))} 
                               />
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </DevSection>

               {/* 3. Orders */}
               <DevSection title="الطلبات" icon={<ClipboardList size={24}/>}>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {orders.length === 0 ? <p className="text-center text-gray-300 py-10 font-bold">لا توجد طلبات</p> : 
                      orders.map(order => (
                        <div key={order.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                           <div className="flex justify-between font-black text-[10px] text-gray-400 uppercase"><span>#{order.id}</span><span>{order.date}</span></div>
                           <div className="space-y-1">
                              <div className="font-black text-sm">{order.customer.name}</div>
                              <div className="text-xs text-pink-500 font-bold">{order.customer.phone}</div>
                              <div className="text-[10px] text-gray-500 leading-tight">{order.customer.address}</div>
                           </div>
                           <div className="pt-2 border-t border-gray-200">
                             {order.items.map((item: any) => (
                               <div key={item.product.id} className="flex justify-between text-[10px] font-bold">
                                 <span className="text-gray-600">{item.product.name} (x{item.quantity})</span>
                                 <span>{(item.product.discountPrice || item.product.price).toLocaleString()} ع.د</span>
                               </div>
                             ))}
                           </div>
                           <div className="flex justify-between font-black text-gray-900 pt-1"><span>الإجمالي:</span><span>{order.total.toLocaleString()} ع.د</span></div>
                        </div>
                      ))
                    }
                  </div>
               </DevSection>

               {/* 4. Advertisements (Carousel) Management */}
               <DevSection title="إدارة الإعلانات الدوارة" icon={<Megaphone size={24}/>}>
                 <div className="space-y-4">
                    <input placeholder="عنوان الإعلان" className="dev-input" value={newCarousel.title} onChange={e => setNewCarousel({...newCarousel, title: e.target.value})} />
                    <input placeholder="الوصف الفرعي للإعلان" className="dev-input" value={newCarousel.subtitle} onChange={e => setNewCarousel({...newCarousel, subtitle: e.target.value})} />
                    <label className="cursor-pointer flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-pink-300 transition-all">
                      <Upload size={20} className="text-gray-400" /><span className="font-bold text-gray-500">رفع صورة الإعلان</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setNewCarousel({...newCarousel, image: url}))} />
                    </label>
                    <button 
                      onClick={() => { if (newCarousel.title && newCarousel.image) setCarouselItems([...carouselItems, { ...newCarousel, id: Date.now() }]); setNewCarousel({title:'', subtitle:'', image:''}); }}
                      className="dev-btn-pink"
                    >
                      إضافة إعلان جديد
                    </button>
                 </div>
                 <div className="mt-6 space-y-3">
                   {carouselItems.map(item => (
                     <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                       <div className="flex items-center gap-3 overflow-hidden">
                         <img src={item.image} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                         <div className="min-w-0">
                           <p className="font-bold text-xs truncate">{item.title}</p>
                           <p className="text-[10px] text-gray-400 truncate">{item.subtitle}</p>
                         </div>
                       </div>
                       <button onClick={() => setCarouselItems(carouselItems.filter(i => i.id !== item.id))} className="text-red-400 p-2 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={16}/></button>
                     </div>
                   ))}
                 </div>
               </DevSection>

               {/* 5. Brands & Categories (Merged management) */}
               <DevSection title="إدارة الماركات والتصنيفات" icon={<Layers size={24}/>}>
                 <div className="space-y-6">
                    {/* Brands management */}
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                       <h4 className="text-xs font-black text-gray-400 uppercase">إضافة ماركة</h4>
                       <input placeholder="اسم الماركة" className="dev-input !p-3" value={newBrand.name} onChange={e => setNewBrand({...newBrand, name: e.target.value})} />
                       <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-pink-300 transition-all">
                        <Upload size={16} className="text-gray-400" /><span className="text-xs font-bold text-gray-500">رفع شعار الماركة</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setNewBrand({...newBrand, image: url}))} />
                       </label>
                       <button onClick={() => { if (newBrand.name && newBrand.image) setBrands([...brands, { ...newBrand, id: Date.now() }]); setNewBrand({name:'', image:''}); }} className="w-full py-2 bg-pink-500 text-white rounded-xl text-xs font-black transition-all">إضافة ماركة</button>
                    </div>
                    <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-100">
                       {brands.map(b => (
                         <div key={b.id} className="relative group w-10 h-10">
                           <img src={b.image} className="w-full h-full rounded-full object-cover border border-gray-200 shadow-sm" />
                           <button onClick={() => setBrands(brands.filter(i => i.id !== b.id))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={8}/></button>
                         </div>
                       ))}
                    </div>

                    {/* Categories management */}
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                       <h4 className="text-xs font-black text-gray-400 uppercase">إضافة تصنيف</h4>
                       <input placeholder="اسم التصنيف" className="dev-input !p-3" value={newCategory.name} onChange={e => setNewCategory({...newCategory, name: e.target.value})} />
                       <label className="cursor-pointer flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-200 rounded-xl hover:border-pink-300 transition-all">
                        <Upload size={16} className="text-gray-400" /><span className="text-xs font-bold text-gray-500">رفع صورة التصنيف</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setNewCategory({...newCategory, image: url}))} />
                       </label>
                       <button onClick={() => { if (newCategory.name && newCategory.image) setCategories([...categories, { ...newCategory, id: Date.now() }]); setNewCategory({name:'', image:''}); }} className="w-full py-2 bg-gray-900 text-white rounded-xl text-xs font-black transition-all">إضافة تصنيف</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       {categories.map(c => (
                         <div key={c.id} className="relative group p-2 bg-gray-100 rounded-xl flex items-center gap-2">
                           <img src={c.image} className="w-6 h-6 rounded object-cover" />
                           <span className="text-xs font-bold truncate">{c.name}</span>
                           <button onClick={() => setCategories(categories.filter(i => i.id !== c.id))} className="absolute top-0 left-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 -translate-y-1"><X size={8}/></button>
                         </div>
                       ))}
                    </div>
                 </div>
               </DevSection>
            </div>
          </div>
        )}
      </main>

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <Drawer title="فينس كوزمتك" side="right" onClose={() => setIsMenuOpen(false)}>
          <div className="flex flex-col gap-2 h-full">
             <button onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }} className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'home' ? 'bg-pink-50 text-pink-500' : 'text-gray-600 hover:bg-gray-50'}`}>الرئيسية</button>
             <button onClick={() => { setActiveTab('store'); setIsMenuOpen(false); }} className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'store' ? 'bg-pink-50 text-pink-500' : 'text-gray-600 hover:bg-gray-50'}`}>المتجر</button>
             <button onClick={() => { setActiveTab('stylist'); setIsMenuOpen(false); }} className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'stylist' ? 'bg-pink-50 text-pink-500' : 'text-gray-600 hover:bg-gray-50'}`}><Sparkles size={18}/> خبير التجميل الذكي</button>
             <div className="h-px bg-gray-100 my-4"></div>
             <div className="px-4 mb-4">
                <h4 className="text-xs font-black text-gray-400 uppercase mb-4">الماركات</h4>
                <div className="grid grid-cols-2 gap-2">{brands.map(brand => (<button key={brand.id} className="flex items-center gap-2 text-right py-2 px-3 text-sm font-bold text-gray-600 hover:text-pink-500 hover:bg-pink-50 rounded-xl transition-all"><img src={brand.image} className="w-6 h-6 rounded-full object-cover" />{brand.name}</button>))}</div>
             </div>
             <div className="mt-auto pt-8 pb-4">
                <button onClick={() => { setActiveTab('dev'); setIsMenuOpen(false); }} className={`w-full flex items-center justify-center gap-3 p-4 rounded-2xl font-black transition-all border-2 border-dashed ${activeTab === 'dev' ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-200 text-gray-400 hover:border-pink-300'}`}><Settings size={20} /> لوحة المطور</button>
             </div>
          </div>
        </Drawer>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <Drawer title="عربة التسوق" side="left" onClose={() => setIsCartOpen(false)}>
          {cart.length === 0 ? (<EmptyState icon={<ShoppingBag size={64}/>} text="العربة فارغة" />) : (
            <div className="space-y-6 h-full flex flex-col">
              <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
                {cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 items-center animate-fade-in">
                    <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                    <div className="flex-1">
                      <h5 className="font-bold text-xs line-clamp-1">{item.product.name}</h5>
                      <p className="text-pink-500 font-black mt-0.5 text-sm">{(item.product.discountPrice || item.product.price).toLocaleString()} ع.د</p>
                      <div className="text-[10px] text-gray-400 font-bold">الكمية: {item.quantity}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-gray-500"><span>المجموع الفرعي:</span><span>{getCartTotal().toLocaleString()} ع.د</span></div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-500"><span>أجور التوصيل:</span><span>{DELIVERY_FEE.toLocaleString()} ع.د</span></div>
                <div className="flex justify-between items-center text-xl font-black pt-2 border-t"><span>الإجمالي النهائي:</span><span className="text-pink-500">{(getCartTotal() + DELIVERY_FEE).toLocaleString()} ع.د</span></div>
                <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-pink-500 text-white py-4 rounded-2xl font-black hover:bg-pink-600 shadow-lg mt-2 transition-all active:scale-95">إتمام الطلب</button>
              </div>
            </div>
          )}
        </Drawer>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal onClose={() => setSelectedProduct(null)}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-square rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl">
                 <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
              </div>
              <div className="space-y-6 text-right">
                 <div>
                   <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2">{selectedProduct.name}</h3>
                   <div className="flex items-center gap-3">
                      <div className="text-3xl font-black text-pink-500">{(selectedProduct.discountPrice || selectedProduct.price).toLocaleString()} ع.د</div>
                      {selectedProduct.discountPrice && <div className="text-gray-400 line-through text-lg">{selectedProduct.price.toLocaleString()} ع.د</div>}
                   </div>
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-bold text-gray-400 text-sm uppercase">وصف المنتج</h4>
                    <p className="text-gray-600 leading-relaxed font-medium">{selectedProduct.description || "لا يوجد وصف متاح لهذا المنتج حالياً."}</p>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true); }} className="flex-1 py-4 bg-pink-500 text-white rounded-2xl font-black hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 flex items-center justify-center gap-2">
                       <ShoppingBag size={20}/> أضف للسلة
                    </button>
                    <button onClick={() => toggleWishlist(selectedProduct.id)} className={`p-4 rounded-2xl border transition-all ${wishlist.includes(selectedProduct.id) ? 'bg-pink-50 border-pink-200 text-pink-500' : 'border-gray-200 text-gray-400 hover:text-pink-500'}`}>
                       <Heart size={20} className={wishlist.includes(selectedProduct.id) ? "fill-current" : ""}/>
                    </button>
                 </div>
              </div>
           </div>
        </Modal>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Modal onClose={() => setIsCheckoutOpen(false)}>
           <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black">تفاصيل التوصيل</h3>
                <p className="text-gray-400 text-sm leading-relaxed">يرجى تزويدنا بعنوانك ورقم هاتفك لتوصيل طلبك. سنقوم بإرسال الطلب النهائي عبر واتساب.</p>
              </div>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-sm font-bold pr-2 flex items-center gap-2"><User size={14} className="text-pink-500"/>الاسم بالكامل</label>
                    <input className="dev-input" placeholder="مثال: سارة محمود جاسم" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-bold pr-2 flex items-center gap-2"><Phone size={14} className="text-pink-500"/>رقم الهاتف</label>
                    <input className="dev-input text-left" dir="ltr" placeholder="07XX XXX XXXX" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                    <label className="text-sm font-bold pr-2 flex items-center gap-2"><MapPin size={14} className="text-pink-500"/>العنوان بالتفصيل</label>
                    <textarea className="dev-input resize-none" rows={3} placeholder="المحافظة، المنطقة، الزقاق، أقرب نقطة دالة" value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} />
                 </div>
              </div>
              <div className="bg-pink-50 p-6 rounded-[2rem] space-y-3 border border-pink-100 shadow-inner">
                 <div className="flex justify-between font-bold text-xs text-gray-500"><span>مجموع المشتريات:</span><span>{getCartTotal().toLocaleString()} ع.د</span></div>
                 <div className="flex justify-between font-bold text-xs text-gray-500"><span>أجور التوصيل:</span><span>{DELIVERY_FEE.toLocaleString()} ع.د</span></div>
                 <div className="flex justify-between font-black text-xl text-gray-900 pt-2 border-t border-pink-200"><span>المبلغ الإجمالي:</span><span className="text-pink-600">{(getCartTotal() + DELIVERY_FEE).toLocaleString()} ع.د</span></div>
              </div>
              <button onClick={handleFinalCheckout} className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-95">
                <MessageCircle size={24}/> تأكيد وإرسال عبر واتساب
              </button>
           </div>
        </Modal>
      )}

      {/* Login Modal */}
      {isLoginOpen && (
        <Modal onClose={() => setIsLoginOpen(false)}>
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto text-pink-500"><User size={40} /></div>
            <div><h3 className="text-2xl font-black">تسجيل الدخول</h3><p className="text-gray-400 text-sm">أهلاً بك مجدداً في فينس</p></div>
            <div className="space-y-4 text-right">
              <input type="email" placeholder="البريد الإلكتروني" className="dev-input" />
              <input type="password" placeholder="كلمة المرور" className="dev-input" />
            </div>
            <button onClick={() => { setCurrentUser({name: "سارة محمود", isAdmin: true}); setIsLoginOpen(false); }} className="dev-btn-pink">دخول</button>
          </div>
        </Modal>
      )}

      {/* Footer */}
      <footer className="bg-white pt-20 pb-10 border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">
            <div className="space-y-4"><div className="flex items-center gap-2 font-black text-2xl"><div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white italic">V</div>VENUS</div><p className="text-gray-400 text-sm leading-relaxed">شريكك المثالي في رحلة العناية بالبشرة والجمال، نقدم أفضل المنتجات العالمية بعناية فائقة.</p></div>
            <div className="space-y-4 font-bold"><h4 className="text-lg">استكشف</h4><div className="flex flex-col gap-2 text-gray-500 text-sm"><a className="hover:text-pink-500 transition-colors">الرئيسية</a><a className="hover:text-pink-500 transition-colors">المتجر</a><a className="hover:text-pink-500 transition-colors">من نحن</a></div></div>
            <div className="space-y-4 font-bold"><h4 className="text-lg">تواصل</h4><div className="flex flex-col gap-2 text-gray-500 text-sm"><span>+964 771 009 2101</span><span>info@venus-beauty.iq</span></div></div>
            <div className="space-y-4 font-bold"><h4 className="text-lg">تابعنا</h4><div className="flex gap-4"><div className="p-2 bg-gray-50 rounded-full text-pink-500 hover:bg-pink-100 transition-all cursor-pointer"><Globe size={20}/></div><div className="p-2 bg-gray-50 rounded-full text-pink-500 hover:bg-pink-100 transition-all cursor-pointer"><Phone size={20}/></div></div></div>
          </div>
          <div className="mt-20 pt-8 border-t text-center text-gray-300 font-bold text-[10px] uppercase tracking-widest">© 2024 فينس كوزمتك. جميع الحقوق محفوظة</div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');
        .font-arabic { font-family: 'Almarai', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 10px; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        @keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .dev-input { @apply w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-pink-300 transition-all font-bold text-sm shadow-inner; }
        .dev-btn-pink { @apply w-full py-4 bg-pink-500 text-white rounded-2xl font-black text-lg hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-100 active:scale-95; }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);