import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from "@google/genai";
import { 
  ShoppingBag, 
  User, 
  Phone, 
  ChevronLeft, 
  Trash2, 
  Send, 
  Loader2, 
  Heart, 
  LogOut, 
  MapPin, 
  Menu, 
  Settings, 
  Package, 
  Upload, 
  ClipboardList, 
  Megaphone,
  X,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  LayoutDashboard,
  Mail,
  Lock,
  Smartphone,
  ArrowRight,
  Sun,
  Moon,
  CreditCard,
  History,
  TrendingUp,
  Users,
  Eye,
  Edit,
  CheckCircle2,
  Clock,
  Plus,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  DollarSign
} from 'lucide-react';

// --- Supabase Config ---
const SUPABASE_URL = 'https://ouxeprjiogwckzxcdcnd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91eGVwcmppb2d3Y2t6eGNkY25kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MDYzMDYsImV4cCI6MjA4NjQ4MjMwNn0.yrlKPnM3uxkSNjnLLkN6L3JO5NZSxkm94mS9hnBZgwo';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Gemini AI Config ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const WHATSAPP_NUMBER = "9647710092101"; 
const DELIVERY_FEE = 5000;

// --- Components ---

const Drawer = ({ title, onClose, children, side = "left", isDark }: { title: string, onClose: () => void, children?: React.ReactNode, side?: "left" | "right", isDark: boolean }) => (
  <div className="fixed inset-0 z-[100] flex" style={{ justifyContent: side === "left" ? "flex-start" : "flex-end" }}>
    <div className={`absolute inset-0 backdrop-blur-sm transition-opacity ${isDark ? 'bg-black/60' : 'bg-[#E8A0BF]/10'}`} onClick={onClose}></div>
    <div className={`relative w-full max-w-sm h-full shadow-2xl flex flex-col animate-fade-in-${side} ${isDark ? 'bg-[#1F0E15] text-white' : 'bg-[#FFFEFC] text-[#4A3B4E]'}`}>
      <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-[#FFFEFC] border-pink-50'}`}>
        <h3 className="text-xl font-black text-pink-500">{title}</h3>
        <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-pink-900/50 text-pink-300' : 'hover:bg-pink-50 text-pink-400'}`}><X size={20}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

const Modal = ({ onClose, children, isDark }: { onClose: () => void, children?: React.ReactNode, isDark: boolean }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <div className={`absolute inset-0 backdrop-blur-md ${isDark ? 'bg-black/70' : 'bg-pink-900/10'}`} onClick={onClose}></div>
    <div className={`relative w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar border ${isDark ? 'bg-[#1F0E15] border-pink-900/50 shadow-pink-900/20' : 'bg-[#FFFEFC] border-pink-50 shadow-pink-100/50'}`}>
      <button onClick={onClose} className={`absolute top-6 left-6 p-2 transition-colors ${isDark ? 'text-pink-500 hover:text-pink-300' : 'text-pink-300 hover:text-[#E8A0BF]'}`}><X size={24}/></button>
      {children}
    </div>
  </div>
);

const ProductCard = ({ product, onAdd, onToggleWishlist, isWishlisted, onViewDetails, isDark }: any) => {
  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price;

  return (
    <div className={`rounded-3xl overflow-hidden group border transition-all hover:shadow-xl relative flex flex-col h-full animate-fade-in ${isDark ? 'bg-[#2D1A24] border-pink-900/30 hover:border-pink-500/50 hover:shadow-pink-900/20' : 'bg-[#FFFEFC] border-pink-50 hover:border-pink-100 hover:shadow-pink-100/30'}`}>
      <div className={`relative aspect-square overflow-hidden cursor-pointer ${isDark ? 'bg-[#1F0E15]' : 'bg-pink-50/20'}`} onClick={onViewDetails}>
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className={`absolute top-3 left-3 p-2 rounded-full shadow-md transition-all border ${isWishlisted ? 'bg-pink-500 border-pink-500 text-white' : (isDark ? 'bg-[#1F0E15]/80 border-pink-800 text-pink-300' : 'bg-white/90 border-white text-pink-300 hover:text-[#E8A0BF]')}`}
        >
          <Heart size={18} className={isWishlisted ? "fill-current" : ""}/>
        </button>
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-pink-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-sm">
            خصم {Math.round((1 - product.discount_price / product.price) * 100)}%
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1 text-right">
        <div className="flex items-baseline gap-2 mb-1">
          <div className={`font-black text-xl ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>{Number(displayPrice).toLocaleString()} ع.د</div>
          {hasDiscount && (
            <div className={`line-through text-xs ${isDark ? 'text-pink-900' : 'text-pink-200'}`}>{Number(product.price).toLocaleString()} ع.د</div>
          )}
        </div>
        <h3 className={`font-bold text-sm leading-snug flex-1 mb-4 ${isDark ? 'text-pink-100' : 'text-[#4A3B4E]'}`}>
          {product.name}
        </h3>
        <button 
          onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 bg-[#E8A0BF] text-white hover:bg-[#D68BAA]"
        >
          أضف للسلة
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [activeTab, setActiveTab] = useState<'home' | 'store' | 'stylist' | 'dev'>('home');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'orders' | 'products' | 'carousel'>('overview');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [cart, setCart] = useState<{product: any, quantity: number}[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Search/Filter states for Admin
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Auth States
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // AI States
  const [aiInput, setAiInput] = useState("");
  const [aiChat, setAiChat] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Form States
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', discount_price: '', image: '', category: '' });
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    fetchInitialData();

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) updateUserState(session.user);
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        updateUserState(session.user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [isDark]);

  useEffect(() => {
    if (carouselItems.length > 0) {
      const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % carouselItems.length), 5000);
      return () => clearInterval(timer);
    }
  }, [carouselItems]);

  const toggleTheme = () => setIsDark(!isDark);

  const updateUserState = (user: any) => {
    if (user) {
      setCurrentUser({
        name: user.user_metadata.full_name || user.email?.split('@')[0] || "مستخدمة فينس",
        email: user.email,
        phone: user.user_metadata.phone_number || "",
        avatar: user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isAdmin: user.email === 'abswking@gmail.com' || user.email?.includes('admin')
      });
    } else {
      setCurrentUser(null);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) return alert("يرجى إدخال البريد الإلكتروني وكلمة المرور");
    setLoginLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { 
            data: { 
              full_name: userName, 
              phone_number: phoneNumber,
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            } 
          }
        });
        if (error) throw error;
        if (data.user && !data.session) {
           alert("تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني للدخول.");
        } else if (data.session) {
           updateUserState(data.user);
           setUserName(''); setPhoneNumber(''); setEmail(''); setPassword('');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
          updateUserState(data.user);
          setEmail(''); setPassword('');
        }
      }
    } catch (error: any) { 
      console.error("Auth error:", error);
      alert("خطأ: " + (error.message || "فشل العملية")); 
    } finally { 
      setLoginLoading(false); 
    }
  };

  const handleGoogleAuth = async () => {
    setLoginLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error: any) {
      alert("خطأ في تسجيل دخول Google: " + error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert(error.message);
    setCurrentUser(null);
    setIsMenuOpen(false);
    setActiveTab('home');
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const { data: p } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data: ads } = await supabase.from('carousel').select('*');
      const { data: ord } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (p) setProducts(p);
      if (ads) setCarouselItems(ads);
      if (ord) setOrders(ord);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    setLoading(true);
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchInitialData();
      alert("تم الحذف بنجاح");
    } catch (e) { alert("حدث خطأ أثناء الحذف"); }
    finally { setLoading(false); }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    setLoading(true);
    try {
      await supabase.from('orders').update({ status }).eq('id', id);
      fetchInitialData();
    } catch (e) { alert("فشل تحديث الحالة"); }
    finally { setLoading(false); }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
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
  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(wid => wid !== id) : [...prev, id]);
  const getCartTotal = () => cart.reduce((acc, item) => acc + (Number(item.product.discount_price || item.product.price) * item.quantity), 0);

  const handleFinalCheckout = async () => {
    if (!checkoutForm.name || !checkoutForm.phone || !checkoutForm.address) return alert("يرجى ملء جميع الحقول");
    setLoading(true);
    try {
      await supabase.from('orders').insert([{
        customer_name: checkoutForm.name,
        customer_phone: checkoutForm.phone,
        customer_address: checkoutForm.address,
        items: cart,
        total: getCartTotal() + DELIVERY_FEE,
        status: 'pending'
      }]);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=طلب جديد من ${checkoutForm.name}`, '_blank');
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      alert("تم إرسال طلبك!");
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  };

  const askAi = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    const userMsg = aiInput;
    setAiInput("");
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `خبير تجميل في فينس. هويتنا هي الزهري بالكامل. أجب بالعربية: ${userMsg}`,
      });
      setAiChat(prev => [...prev, { role: 'model', text: response.text || "عذراً، لم أفهم." }]);
    } catch (e) { setAiChat(prev => [...prev, { role: 'model', text: "خطأ في الاتصال." }]); }
    finally { setAiLoading(false); }
  };

  // Filtered Lists for Admin
  const filteredOrders = useMemo(() => orders.filter(o => 
    o.customer_name.toLowerCase().includes(orderSearch.toLowerCase()) || 
    o.customer_phone.includes(orderSearch)
  ), [orders, orderSearch]);

  const filteredProductsList = useMemo(() => products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  ), [products, productSearch]);

  return (
    <div className={`min-h-screen transition-colors duration-500 font-arabic ${isDark ? 'bg-[#12070B] text-pink-100' : 'bg-[#FFF9FA] text-[#4A3B4E]'}`} dir="rtl">
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-[#1F0E15]/90 border-pink-900/50 shadow-pink-900/10' : 'bg-[#FFFEFC]/90 border-pink-50 shadow-pink-100/10'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(true)} className={`p-2.5 rounded-2xl transition-colors ${isDark ? 'hover:bg-pink-900/50 text-pink-300' : 'hover:bg-pink-50 text-pink-400'}`}><Menu size={24}/></button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 bg-[#E8A0BF] rounded-2xl flex items-center justify-center text-white font-black text-xl rotate-3 shadow-lg shadow-pink-200/50">V</div>
              <span className={`text-xl font-black tracking-tight hidden sm:block ${isDark ? 'text-pink-100' : 'text-pink-600'}`}>VENUS</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={toggleTheme} className={`p-2.5 rounded-2xl transition-all ${isDark ? 'bg-pink-900/40 text-yellow-400' : 'bg-pink-50 text-pink-600'}`}>
                {isDark ? <Sun size={20}/> : <Moon size={20}/>}
             </button>
             <button onClick={() => setIsCartOpen(true)} className={`p-2.5 rounded-2xl text-white relative shadow-lg transition-all ${isDark ? 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/40' : 'bg-pink-500 hover:bg-pink-600'}`}>
                <ShoppingBag size={20}/>
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-pink-500 font-black">{cart.length}</span>}
             </button>
          </div>
        </div>
      </header>

      <main className="pb-20">
        {(loading || loginLoading) && (
          <div className={`fixed inset-0 z-[120] backdrop-blur-sm flex items-center justify-center flex-col gap-4 ${isDark ? 'bg-[#12070B]/60' : 'bg-[#FFF9FA]/60'}`}>
            <Loader2 className="animate-spin text-pink-500" size={48}/>
            <p className="font-black text-pink-500">جاري التحميل...</p>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="animate-fade-in">
             <section className={`relative h-[400px] lg:h-[500px] overflow-hidden ${isDark ? 'bg-[#1F0E15]' : 'bg-pink-50'}`}>
                {carouselItems.length > 0 ? carouselItems.map((item, idx) => (
                  <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                    <div className={`absolute inset-0 flex items-center pr-8 lg:pr-20 ${isDark ? 'bg-gradient-to-l from-[#12070B]/90 via-transparent' : 'bg-gradient-to-l from-[#FFF9FA]/80 via-transparent'}`}>
                       <div className="max-w-xl space-y-4">
                          <h2 className="text-4xl lg:text-6xl font-black text-pink-600">{item.title}</h2>
                          <button onClick={() => setActiveTab('store')} className={`px-8 py-3 rounded-xl font-black border transition-all shadow-sm ${isDark ? 'bg-pink-600 text-white border-pink-500 hover:bg-pink-500' : 'bg-[#FFFEFC] text-pink-600 border-pink-100 hover:bg-pink-500 hover:text-white'}`}>تسوقي الآن</button>
                       </div>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-pink-500/30" size={32}/></div>
                )}
             </section>

             <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-3xl font-black text-pink-600">وصل حديثاً</h2>
                   <button onClick={() => setActiveTab('store')} className="text-pink-400 font-bold hover:text-pink-600 transition-colors">كل المنتجات</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   {products.slice(0, 4).map(p => (
                     <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)} isWishlisted={wishlist.includes(p.id)} onViewDetails={() => setSelectedProduct(p)} isDark={isDark} />
                   ))}
                </div>
             </section>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
             <h2 className="text-4xl font-black mb-12 text-center text-pink-600">المتجر الوردي</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(p => (
                   <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} onToggleWishlist={() => toggleWishlist(p.id)} isWishlisted={wishlist.includes(p.id)} onViewDetails={() => setSelectedProduct(p)} isDark={isDark} />
                ))}
             </div>
          </div>
        )}

        {activeTab === 'stylist' && (
          <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in h-[70vh] flex flex-col">
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-pink-500/20"><Sparkles size={32}/></div>
                <h2 className="text-3xl font-black text-pink-600">خبير التجميل الذكي</h2>
             </div>
             <div className={`flex-1 rounded-[2rem] border shadow-sm flex flex-col overflow-hidden ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-[#FFFEFC] border-pink-50'}`}>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                   {aiChat.map((msg, i) => (
                     <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl font-bold text-sm leading-relaxed ${msg.role === 'user' ? (isDark ? 'bg-pink-900/30 text-pink-100' : 'bg-pink-50 text-pink-800') : 'bg-pink-500 text-white shadow-md'}`}>
                           {msg.text}
                        </div>
                     </div>
                   ))}
                   {aiLoading && <div className="flex justify-end animate-pulse"><div className="bg-pink-500/20 p-4 rounded-2xl"><Loader2 size={20} className="animate-spin text-pink-500"/></div></div>}
                </div>
                <div className={`p-4 border-t flex gap-2 ${isDark ? 'bg-pink-900/10 border-pink-900/50' : 'bg-pink-50 border-pink-50'}`}>
                   <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && askAi()} className={`dev-input flex-1 ${isDark ? 'dark-input' : ''}`} placeholder="اسألي عن روتين البشرة..." />
                   <button onClick={askAi} className="bg-pink-500 text-white p-4 rounded-xl shadow-lg hover:bg-pink-600 transition-colors"><Send size={20}/></button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'dev' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
             <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 ${isDark ? 'border-pink-900/50' : 'border-pink-100'}`}>
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><LayoutDashboard size={24}/></div>
                   <h2 className="text-3xl font-black text-pink-600">لوحة التحكم الإدارية</h2>
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                   {[
                     {id:'overview', label: 'الرئيسية', icon: TrendingUp},
                     {id:'orders', label: 'الطلبات', icon: ClipboardList},
                     {id:'products', label: 'المنتجات', icon: Package},
                     {id:'carousel', label: 'الإعلانات', icon: Megaphone},
                   ].map(tab => (
                     <button 
                       key={tab.id}
                       onClick={() => setAdminSubTab(tab.id as any)}
                       className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm whitespace-nowrap transition-all ${adminSubTab === tab.id ? 'bg-pink-500 text-white shadow-lg' : (isDark ? 'bg-pink-900/20 text-pink-300 hover:bg-pink-900/40' : 'bg-pink-50 text-pink-600 hover:bg-pink-100')}`}
                     >
                       <tab.icon size={18}/> {tab.label}
                     </button>
                   ))}
                </div>
             </div>

             {adminSubTab === 'overview' && (
               <div className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><TrendingUp size={24}/></div>
                           <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-xs font-black opacity-50 mb-1">إجمالي المبيعات</p>
                        <p className="text-2xl font-black text-pink-600">{(orders.reduce((acc, o) => acc + (o.total || 0), 0)).toLocaleString()} ع.د</p>
                     </div>
                     <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><ClipboardList size={24}/></div>
                        </div>
                        <p className="text-xs font-black opacity-50 mb-1">الطلبات الكلية</p>
                        <p className="text-2xl font-black text-pink-600">{orders.length}</p>
                     </div>
                     <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Package size={24}/></div>
                        </div>
                        <p className="text-xs font-black opacity-50 mb-1">عدد المنتجات</p>
                        <p className="text-2xl font-black text-pink-600">{products.length}</p>
                     </div>
                     <div className={`p-6 rounded-[2.5rem] border ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-4">
                           <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500"><Users size={24}/></div>
                        </div>
                        <p className="text-xs font-black opacity-50 mb-1">الطلبات النشطة</p>
                        <p className="text-2xl font-black text-pink-600">{orders.filter(o => o.status === 'pending').length}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className={`lg:col-span-2 p-8 rounded-[3rem] border ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                        <h3 className="text-lg font-black text-pink-600 mb-6 flex items-center gap-2"><BarChart3 size={20}/> أداء المبيعات</h3>
                        <div className="h-48 flex items-end gap-2 px-2">
                           {[65, 45, 75, 55, 90, 70, 85].map((h, i) => (
                              <div key={i} className="flex-1 bg-pink-500/20 rounded-t-xl relative group transition-all hover:bg-pink-500/40" style={{ height: `${h}%` }}>
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-pink-600 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{(h * 1000).toLocaleString()}</div>
                              </div>
                           ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-black opacity-30">
                           <span>السبت</span><span>الأحد</span><span>الاثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span>
                        </div>
                     </div>
                     <div className={`p-8 rounded-[3rem] border ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                        <h3 className="text-lg font-black text-pink-600 mb-6">أحدث الطلبات</h3>
                        <div className="space-y-4">
                           {orders.slice(0, 5).map(o => (
                              <div key={o.id} className="flex items-center justify-between border-b border-pink-50/50 pb-4 last:border-0 last:pb-0">
                                 <div>
                                    <p className="text-sm font-black">{o.customer_name}</p>
                                    <p className="text-[10px] opacity-40">#{o.id.toString().slice(-4)}</p>
                                 </div>
                                 <span className={`px-2 py-1 rounded-full text-[8px] font-black ${o.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                                    {o.status === 'pending' ? 'جديد' : 'تم'}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
             )}

             {adminSubTab === 'orders' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <h3 className="text-xl font-black text-pink-600 flex items-center gap-2"><ClipboardList/> إدارة الطلبات</h3>
                     <div className="relative w-full md:w-72">
                        <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className={`dev-input pr-10 ${isDark ? 'dark-input' : ''}`} placeholder="ابحث باسم العميل أو الهاتف..." />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                     </div>
                  </div>
                  <div className={`rounded-[2.5rem] border overflow-hidden ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                    <div className="overflow-x-auto custom-scrollbar">
                       <table className="w-full text-right border-collapse min-w-[600px]">
                          <thead className={`text-xs font-black opacity-60 ${isDark ? 'bg-pink-900/20' : 'bg-pink-50/50'}`}>
                             <tr>
                                <th className="p-5">رقم الطلب</th>
                                <th className="p-5">العميل</th>
                                <th className="p-5">العنوان</th>
                                <th className="p-5">الإجمالي</th>
                                <th className="p-5">الحالة</th>
                                <th className="p-5">الإجراء</th>
                             </tr>
                          </thead>
                          <tbody className="text-sm font-bold">
                             {filteredOrders.length > 0 ? filteredOrders.map(order => (
                               <tr key={order.id} className={`border-t transition-colors ${isDark ? 'border-pink-900/30 hover:bg-pink-900/10' : 'border-pink-50 hover:bg-pink-50/30'}`}>
                                  <td className="p-5 text-pink-400">#{order.id.toString().slice(-4)}</td>
                                  <td className="p-5">
                                     <div className="flex flex-col">
                                        <span className="font-black">{order.customer_name}</span>
                                        <span className="text-[10px] opacity-40">{order.customer_phone}</span>
                                     </div>
                                  </td>
                                  <td className="p-5 text-xs opacity-60 line-clamp-1 max-w-[150px]">{order.customer_address}</td>
                                  <td className="p-5 font-black text-pink-600">{Number(order.total).toLocaleString()} ع.د</td>
                                  <td className="p-5">
                                     <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                                       order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                       order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'
                                     }`}>
                                       {order.status === 'pending' ? 'قيد الانتظار' : order.status === 'completed' ? 'تم التوصيل' : order.status}
                                     </span>
                                  </td>
                                  <td className="p-5">
                                     <div className="flex gap-2">
                                        {order.status !== 'completed' && (
                                          <button onClick={() => updateOrderStatus(order.id, 'completed')} title="تحديد كتم التوصيل" className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"><CheckCircle2 size={18}/></button>
                                        )}
                                        <button className="p-2.5 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors"><Eye size={18}/></button>
                                     </div>
                                  </td>
                                </tr>
                             )) : (
                               <tr><td colSpan={6} className="p-20 text-center opacity-30 font-black">لا توجد طلبات تطابق البحث</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                  </div>
               </div>
             )}

             {adminSubTab === 'products' && (
               <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-xl font-black text-pink-600 flex items-center gap-2"><Package/> إدارة المنتجات</h3>
                    <div className="flex gap-3 w-full md:w-auto">
                       <div className="relative flex-1 md:w-64">
                          <input value={productSearch} onChange={e => setProductSearch(e.target.value)} className={`dev-input pr-10 ${isDark ? 'dark-input' : ''}`} placeholder="ابحث باسم المنتج..." />
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300" size={18} />
                       </div>
                       <button onClick={() => {}} className="bg-pink-500 text-white px-6 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg active:scale-95"><Plus size={18}/> إضافة منتج</button>
                    </div>
                  </div>
                  
                  {/* Quick Add Section */}
                  <div className={`p-8 rounded-[3rem] border transition-all ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white"><Plus size={20}/></div>
                       <h4 className="text-lg font-black text-pink-600">إضافة منتج جديد للمتجر</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <input className={`dev-input ${isDark ? 'dark-input' : ''}`} placeholder="اسم المنتج بالكامل" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                               <label className="text-[10px] font-black opacity-50 px-2">السعر الأصلي</label>
                               <input className={`dev-input ${isDark ? 'dark-input' : ''}`} type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-black opacity-50 px-2">سعر الخصم (اختياري)</label>
                               <input className={`dev-input ${isDark ? 'dark-input' : ''}`} type="number" value={newProduct.discount_price} onChange={e => setNewProduct({...newProduct, discount_price: e.target.value})} />
                            </div>
                        </div>
                        <textarea className={`dev-input h-32 resize-none ${isDark ? 'dark-input' : ''}`} placeholder="وصف المنتج وفوائده..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                      </div>
                      <div className="space-y-5">
                        <label className={`dev-upload-btn h-48 flex-col border-pink-100 border-2 border-dashed ${isDark ? 'dark-upload' : 'bg-pink-50/20 hover:bg-pink-50'}`}>
                            <div className="w-16 h-16 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center mb-3"><Upload size={32}/></div>
                            <span className="font-black text-pink-600">ارفع صورة المنتج هنا</span>
                            <span className="text-[10px] opacity-40">JPG, PNG (Max 5MB)</span>
                            <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, url => setNewProduct({...newProduct, image: url}))} />
                        </label>
                        {newProduct.image && (
                           <div className="flex items-center gap-4 p-4 rounded-3xl bg-pink-50/50 border border-pink-100">
                              <img src={newProduct.image} className="w-16 h-16 rounded-2xl object-cover border-2 border-pink-400" />
                              <div className="flex-1">
                                 <p className="text-xs font-black text-pink-600">تم اختيار الصورة</p>
                                 <button onClick={()=>setNewProduct({...newProduct, image: ''})} className="text-[10px] font-bold text-red-500 hover:underline">إلغاء</button>
                              </div>
                           </div>
                        )}
                        <button onClick={async () => {
                            if(!newProduct.name || !newProduct.price || !newProduct.image) return alert("يرجى ملء جميع الحقول المطلوبة");
                            setLoading(true);
                            await supabase.from('products').insert([newProduct]);
                            setNewProduct({ name: '', description: '', price: '', discount_price: '', image: '', category: '' });
                            setLoading(false);
                            fetchInitialData();
                            alert("تمت إضافة المنتج بنجاح!");
                        }} className="dev-submit-btn shadow-pink-200">تأكيد ونشر المنتج</button>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-[2.5rem] border overflow-hidden ${isDark ? 'bg-[#1F0E15] border-pink-900/50' : 'bg-white border-pink-50 shadow-sm'}`}>
                    <div className="overflow-x-auto custom-scrollbar">
                       <table className="w-full text-right border-collapse min-w-[600px]">
                          <thead className={`text-xs font-black opacity-60 ${isDark ? 'bg-pink-900/20' : 'bg-pink-50/50'}`}>
                             <tr>
                                <th className="p-5">المنتج</th>
                                <th className="p-5">السعر</th>
                                <th className="p-5">الخصم</th>
                                <th className="p-5">تاريخ الإضافة</th>
                                <th className="p-5">الإجراء</th>
                             </tr>
                          </thead>
                          <tbody className="text-sm font-bold">
                             {filteredProductsList.length > 0 ? filteredProductsList.map(p => (
                               <tr key={p.id} className={`border-t transition-colors ${isDark ? 'border-pink-900/30 hover:bg-pink-900/10' : 'border-pink-50 hover:bg-pink-50/30'}`}>
                                  <td className="p-5">
                                     <div className="flex items-center gap-4">
                                        <img src={p.image} className="w-12 h-12 rounded-2xl object-cover border border-pink-50 shadow-sm" />
                                        <span className="font-black line-clamp-1 max-w-[200px]">{p.name}</span>
                                     </div>
                                  </td>
                                  <td className="p-5">{Number(p.price).toLocaleString()} ع.د</td>
                                  <td className="p-5 text-pink-500">{p.discount_price ? `${Number(p.discount_price).toLocaleString()} ع.د` : '-'}</td>
                                  <td className="p-5 text-xs opacity-40">{new Date(p.created_at).toLocaleDateString('ar-IQ')}</td>
                                  <td className="p-5">
                                     <div className="flex gap-2">
                                        <button className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><Edit size={18}/></button>
                                        <button onClick={() => deleteProduct(p.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={18}/></button>
                                     </div>
                                  </td>
                                </tr>
                             )) : (
                                <tr><td colSpan={5} className="p-20 text-center opacity-30 font-black">لم يتم العثور على منتجات</td></tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                  </div>
               </div>
             )}

             {adminSubTab === 'carousel' && (
               <div className="space-y-8 animate-fade-in">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-pink-100 pb-6">
                     <div>
                        <h3 className="text-xl font-black text-pink-600 flex items-center gap-2"><Megaphone/> إدارة واجهة العرض</h3>
                        <p className="text-xs opacity-50 mt-1">أضيفي واحذفي البانرات الإعلانية التي تظهر في الصفحة الرئيسية</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {carouselItems.map(item => (
                      <div key={item.id} className={`group relative rounded-[3rem] overflow-hidden border transition-all ${isDark ? 'border-pink-900/50 hover:border-pink-500/50' : 'border-pink-50 shadow-md hover:shadow-xl'}`}>
                        <img src={item.image} className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent flex flex-col justify-end p-6">
                           <div className="flex justify-between items-end gap-4 translate-y-4 group-hover:translate-y-0 transition-transform">
                              <p className="font-black text-white text-lg leading-tight">{item.title}</p>
                              <button onClick={async () => {
                                if(!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;
                                setLoading(true);
                                await supabase.from('carousel').delete().eq('id', item.id);
                                fetchInitialData();
                                setLoading(false);
                                alert("تم حذف الإعلان");
                              }} className="bg-red-500 text-white p-4 rounded-2xl shadow-xl hover:bg-red-600 active:scale-90 transition-all"><Trash2 size={24}/></button>
                           </div>
                        </div>
                      </div>
                    ))}
                    <label className={`h-56 rounded-[3rem] border-4 border-dashed border-pink-200 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-pink-50/50 transition-all group ${isDark ? 'bg-pink-900/10 border-pink-900/50 hover:bg-pink-900/20' : 'bg-pink-50/20'}`}>
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-pink-500 shadow-lg group-hover:scale-110 transition-transform"><Plus size={32}/></div>
                      <span className="font-black text-pink-500">إضافة بانر جديد</span>
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            const title = prompt("اكتبي عنواناً جذاباً للإعلان:");
                            if(!title) return;
                            setLoading(true);
                            await supabase.from('carousel').insert([{ title, image: reader.result as string }]);
                            fetchInitialData();
                            setLoading(false);
                            alert("تم نشر الإعلان الجديد!");
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* Side Menu Drawer */}
      {isMenuOpen && (
        <Drawer title="فينس - القائمة" side="right" onClose={() => setIsMenuOpen(false)} isDark={isDark}>
           <div className="space-y-6">
              {!currentUser ? (
                <div className={`p-6 rounded-[2.5rem] space-y-4 border animate-fade-in ${isDark ? 'bg-pink-900/20 border-pink-900/50' : 'bg-pink-50/30 border-pink-100 shadow-sm'}`}>
                   <span className={`text-xs font-black block mb-2 ${isDark ? 'text-pink-400' : 'text-pink-400'}`}>{isSignUp ? "انضمي لعالم فينس الوردي" : "أهلاً بعودتكِ"}</span>
                   {isSignUp && <input className={`dev-input ${isDark ? 'dark-input' : ''}`} placeholder="الاسم" value={userName} onChange={e => setUserName(e.target.value)} />}
                   <input className={`dev-input ${isDark ? 'dark-input' : ''}`} placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} />
                   <input className={`dev-input ${isDark ? 'dark-input' : ''}`} type="password" placeholder="كلمة المرور" value={password} onChange={e => setPassword(e.target.value)} />
                   {isSignUp && <input className={`dev-input ${isDark ? 'dark-input' : ''}`} placeholder="رقم الهاتف" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />}
                   
                   <button onClick={handleEmailAuth} className="dev-submit-btn shadow-lg active:scale-95 transition-all mt-4">
                      {loginLoading ? <Loader2 className="animate-spin mx-auto" size={20}/> : (isSignUp ? "إنشاء حساب" : "تسجيل الدخول")}
                   </button>

                   {!isSignUp && (
                     <button onClick={handleGoogleAuth} className="w-full flex items-center justify-center gap-3 p-4 border-2 border-pink-100 rounded-[1.5rem] font-black text-pink-600 bg-white hover:bg-pink-50 active:scale-95 transition-all shadow-sm">
                       <span className="w-6 h-6 flex items-center justify-center font-bold border-2 border-pink-500 rounded-full text-[12px] text-pink-500">G</span>
                       تسجيل بواسطة Google
                     </button>
                   )}

                   <button onClick={() => setIsSignUp(!isSignUp)} className={`w-full text-xs font-black text-center mt-4 ${isDark ? 'text-pink-400' : 'text-pink-500'} hover:underline`}>
                      {isSignUp ? "لديكِ حساب بالفعل؟ تفضلي بالدخول" : "جديدة هنا؟ انضمي إلينا الآن"}
                   </button>
                </div>
              ) : (
                <div className={`p-6 rounded-[3rem] border animate-fade-in text-right space-y-6 ${isDark ? 'bg-[#2D1A24] border-pink-900/50 shadow-pink-900/20' : 'bg-white border-pink-50 shadow-xl shadow-pink-100/30'}`}>
                   <div className="flex flex-col items-center gap-4 border-b pb-6 border-pink-50">
                      <div className="relative group">
                        <img src={currentUser.avatar} className="w-24 h-24 rounded-full border-4 border-pink-400 shadow-xl shadow-pink-400/20 object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
                      </div>
                      <div className="text-center">
                        <p className="font-black text-2xl text-pink-600 leading-tight">{currentUser.name}</p>
                        <p className={`text-xs font-bold opacity-40 ${isDark ? 'text-pink-200' : 'text-pink-400'}`}>{currentUser.email}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className={`p-5 rounded-[2rem] text-center border transition-all hover:border-pink-300 ${isDark ? 'bg-pink-900/10 border-pink-900/50' : 'bg-pink-50/30 border-pink-50'}`}>
                        <p className="text-[10px] font-black opacity-30 block mb-1">المشتريات</p>
                        <p className="font-black text-pink-600 text-2xl">0</p>
                      </div>
                      <div className={`p-5 rounded-[2rem] text-center border transition-all hover:border-pink-300 ${isDark ? 'bg-pink-900/10 border-pink-900/50' : 'bg-pink-50/30 border-pink-50'}`}>
                        <p className="text-[10px] font-black opacity-30 block mb-1">المفضلة</p>
                        <p className="font-black text-pink-600 text-2xl">{wishlist.length}</p>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <button className={`w-full p-4 rounded-2xl flex items-center justify-between font-black text-sm transition-colors ${isDark ? 'hover:bg-pink-900/20' : 'hover:bg-pink-50 text-pink-800'}`}>
                        <div className="flex items-center gap-3"><History size={20} className="text-pink-400"/> سجل طلباتي</div>
                        <ChevronLeft size={16}/>
                      </button>
                      <button className={`w-full p-4 rounded-2xl flex items-center justify-between font-black text-sm transition-colors ${isDark ? 'hover:bg-pink-900/20' : 'hover:bg-pink-50 text-pink-800'}`}>
                        <div className="flex items-center gap-3"><CreditCard size={20} className="text-pink-400"/> المحفظة الوردية</div>
                        <ChevronLeft size={16}/>
                      </button>
                   </div>

                   <button onClick={handleLogout} className="w-full bg-pink-50 text-red-500 py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm active:scale-95">تسجيل الخروج <LogOut size={18}/></button>
                </div>
              )}
              
              <div className="space-y-1 mt-6">
                 <button onClick={() => {setActiveTab('home'); setIsMenuOpen(false);}} className={`nav-btn ${activeTab === 'home' ? (isDark ? 'dark-active' : 'active') : (isDark ? 'dark-inactive' : '')}`}><LayoutDashboard size={20}/> الرئيسية</button>
                 <button onClick={() => {setActiveTab('store'); setIsMenuOpen(false);}} className={`nav-btn ${activeTab === 'store' ? (isDark ? 'dark-active' : 'active') : (isDark ? 'dark-inactive' : '')}`}><ShoppingBag size={20}/> المتجر</button>
                 <button onClick={() => {setActiveTab('stylist'); setIsMenuOpen(false);}} className={`nav-btn ${activeTab === 'stylist' ? (isDark ? 'dark-active' : 'active') : (isDark ? 'dark-inactive' : '')}`}><Sparkles size={20}/> خبير التجميل</button>
                 {currentUser?.isAdmin && (
                   <button onClick={() => {setActiveTab('dev'); setIsMenuOpen(false);}} className={`nav-btn ${activeTab === 'dev' ? (isDark ? 'dark-active' : 'active') : (isDark ? 'dark-inactive' : '')}`}><Settings size={20}/> لوحة التحكم</button>
                 )}
              </div>
           </div>
        </Drawer>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <Drawer title="عربة مشترياتكِ" side="left" onClose={() => setIsCartOpen(false)} isDark={isDark}>
           {cart.length === 0 ? <div className="text-center py-20 opacity-40"><ShoppingBag size={64} className="mx-auto mb-4 text-pink-200"/><p className="font-bold text-pink-300 text-lg">عربتكِ فارغة حالياً</p></div> : (
             <div className="space-y-6">
                <div className="space-y-4 max-h-[55vh] overflow-y-auto custom-scrollbar pr-2">
                  {cart.map(item => (
                    <div key={item.product.id} className={`flex gap-4 items-center p-4 rounded-[1.5rem] border transition-all ${isDark ? 'bg-[#2D1A24] border-pink-900/30' : 'bg-white border-pink-50 shadow-sm'}`}>
                       <img src={item.product.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                       <div className="flex-1">
                          <p className="text-sm font-black line-clamp-1">{item.product.name}</p>
                          <p className="text-pink-500 font-black text-xs mt-1">{item.quantity} × {Number(item.product.discount_price || item.product.price).toLocaleString()} ع.د</p>
                       </div>
                       <button onClick={() => removeFromCart(item.product.id)} className="text-pink-300 hover:text-red-500 p-2 transition-colors"><Trash2 size={20}/></button>
                    </div>
                  ))}
                </div>
                <div className={`p-6 rounded-[2rem] border-2 border-pink-100 ${isDark ? 'bg-pink-900/10' : 'bg-pink-50/30'}`}>
                   <div className="flex justify-between items-center mb-2 font-bold text-xs opacity-50">
                      <span>قيمة المنتجات</span>
                      <span>{getCartTotal().toLocaleString()} ع.د</span>
                   </div>
                   <div className="flex justify-between items-center mb-4 font-bold text-xs opacity-50">
                      <span>توصيل ثابت</span>
                      <span>{DELIVERY_FEE.toLocaleString()} ع.د</span>
                   </div>
                   <div className="flex justify-between items-center font-black text-xl text-pink-600 border-t border-pink-100 pt-4">
                      <span>الإجمالي:</span>
                      <span>{(getCartTotal() + DELIVERY_FEE).toLocaleString()} ع.د</span>
                   </div>
                </div>
                <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-pink-500 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl hover:bg-pink-600 transition-all active:scale-95">متابعة إتمام الطلب</button>
             </div>
           )}
        </Drawer>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <Modal onClose={() => setIsCheckoutOpen(false)} isDark={isDark}>
           <div className="space-y-6 text-right">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-pink-500/10 text-pink-500 rounded-[2rem] flex items-center justify-center mx-auto mb-4"><MapPin size={40}/></div>
                <h3 className="text-2xl font-black text-pink-600 leading-tight">أين نرسل طلبكِ الوردي؟</h3>
                <p className="text-xs opacity-50 mt-1">يرجى كتابة العنوان بدقة لضمان سرعة التوصيل</p>
              </div>
              <div className="space-y-4">
                <input className={`dev-input ${isDark ? 'dark-input' : ''}`} placeholder="اسم المستلم الثلاثي" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} />
                <input className={`dev-input ${isDark ? 'dark-input' : ''}`} placeholder="رقم الهاتف (للتمكن من التواصل)" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} />
                <textarea className={`dev-input h-32 resize-none ${isDark ? 'dark-input' : ''}`} placeholder="العنوان: المحافظة، الحي، أقرب نقطة دالة..." value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} />
              </div>
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 flex items-center gap-3 text-pink-600">
                 <ShieldCheck size={20}/>
                 <p className="text-[10px] font-black">طلبكِ محمي ومؤمن. الدفع عند الاستلام بعد معاينة المنتج.</p>
              </div>
              <button onClick={handleFinalCheckout} className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10 hover:bg-emerald-500 transition-all active:scale-95">تأكيد الطلب عبر واتساب <Send size={20}/></button>
           </div>
        </Modal>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal onClose={() => setSelectedProduct(null)} isDark={isDark}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start text-right">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-pink-500/10 group">
                 <img src={selectedProduct.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="space-y-8 h-full flex flex-col justify-between">
                 <div className="space-y-4">
                    <div className="flex justify-between items-start">
                       <h3 className="text-3xl font-black leading-tight text-pink-600 flex-1">{selectedProduct.name}</h3>
                       <button onClick={()=>toggleWishlist(selectedProduct.id)} className={`p-3 rounded-2xl border transition-all ${wishlist.includes(selectedProduct.id) ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white border-pink-100 text-pink-300 hover:text-pink-500'}`}><Heart size={20} className={wishlist.includes(selectedProduct.id) ? "fill-current":""}/></button>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-3xl font-black text-pink-600">{(selectedProduct.discount_price || selectedProduct.price).toLocaleString()} ع.د</span>
                       {selectedProduct.discount_price && (
                         <span className="text-lg line-through opacity-30">{(selectedProduct.price).toLocaleString()} ع.د</span>
                       )}
                    </div>
                    <div className="h-1 w-20 bg-pink-500 rounded-full"></div>
                    <p className={`font-bold leading-relaxed text-sm ${isDark ? 'text-pink-300' : 'text-pink-800/70'}`}>{selectedProduct.description || "هذا المنتج مختار بعناية فائقة من فريق فينس لضمان أفضل نتائج لجمالكِ وإشراقتكِ. يتميز بتركيبته الفريدة التي تناسب كافة أنواع البشرة."}</p>
                 </div>
                 <div className="space-y-4">
                    <div className="flex gap-4">
                       <div className="flex-1 p-4 rounded-2xl bg-pink-50 border border-pink-100 text-center">
                          <p className="text-[10px] font-black opacity-30">توصيل سريع</p>
                          <p className="text-xs font-black text-pink-600">خلال 24-48 ساعة</p>
                       </div>
                       <div className="flex-1 p-4 rounded-2xl bg-pink-50 border border-pink-100 text-center">
                          <p className="text-[10px] font-black opacity-30">ضمان الجودة</p>
                          <p className="text-xs font-black text-pink-600">منتجات أصلية 100%</p>
                       </div>
                    </div>
                    <button onClick={() => {addToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true);}} className="w-full py-5 bg-pink-500 text-white rounded-[1.5rem] font-black text-xl hover:bg-pink-600 transition-all shadow-xl shadow-pink-200 active:scale-95 flex items-center justify-center gap-3"><Plus size={24}/> أضف لسلة مشترياتكِ</button>
                 </div>
              </div>
           </div>
        </Modal>
      )}

      <style>{`
        .dev-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: #FFF9FA;
          border-radius: 1.25rem;
          border: 2px solid #FFE4E6;
          outline: none;
          font-weight: 800;
          font-size: 0.9rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #4A3B4E;
        }
        .dev-input:focus {
          border-color: #FB7185;
          background-color: white;
          box-shadow: 0 0 0 4px rgba(251, 113, 133, 0.1);
          transform: translateY(-1px);
        }
        .dark-input {
          background-color: #2D1A24;
          color: white;
          border-color: #881337;
        }
        .dark-input:focus {
          background-color: #1F0E15;
          border-color: #FB7185;
        }
        .dev-upload-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border-radius: 1.5rem;
          font-weight: 900;
          transition: all 0.3s;
        }
        .dev-submit-btn {
          width: 100%;
          padding: 1.25rem;
          background-color: #E11D48;
          color: white;
          border-radius: 1.5rem;
          font-weight: 900;
          font-size: 1.1rem;
          box-shadow: 0 10px 25px -5px rgba(225, 29, 72, 0.3);
          transition: all 0.3s;
        }
        .dev-submit-btn:hover { 
          background-color: #BE123C; 
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(225, 29, 72, 0.4);
        }
        .dev-submit-btn:active { transform: translateY(0); }
        
        .nav-btn {
          width: 100%;
          text-align: right;
          padding: 1.1rem 1.5rem;
          border-radius: 1.5rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: all 0.3s;
        }
        .active { background-color: #E11D48; color: white; box-shadow: 0 8px 16px rgba(225, 29, 72, 0.2); }
        .dark-active { background-color: #FB7185; color: white; box-shadow: 0 8px 16px rgba(251, 113, 133, 0.3); }
        .dark-inactive { color: #FB7185; }
        .dark-inactive:hover { background-color: rgba(251, 113, 133, 0.15); }
        .active:hover, .dark-active:hover { opacity: 0.9; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FB7185; border-radius: 10px; }
        
        @keyframes fade-in { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        @keyframes fade-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-fade-in-right { animation: fade-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in-left { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-fade-in-left { animation: fade-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);