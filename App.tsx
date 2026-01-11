
import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile, LoanRequest, LoanStatus } from './types';
import { STRINGS, COLORS } from './constants';
import Layout from './components/Layout';
import Button from './components/Button';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.LOGIN);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loans, setLoans] = useState<LoanRequest[]>([]);
  const [activeLoan, setActiveLoan] = useState<LoanRequest | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock initial setup
  useEffect(() => {
    const savedUser = localStorage.getItem('loan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // setCurrentScreen(AppScreen.DASHBOARD);
    }
  }, []);

  const handleLogin = () => {
    if (mobile.length < 11) return alert('সঠিক মোবাইল নম্বর দিন');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentScreen(AppScreen.OTP);
    }, 1000);
  };

  const handleVerifyOtp = () => {
    if (otp !== '1234') return alert('ভুল ওটিপি! (পরীক্ষার জন্য 1234 ব্যবহার করুন)');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newUser: UserProfile = {
        id: 'u1',
        mobile,
        name: '',
        address: '',
        nidNumber: '',
        isVerified: false
      };
      setUser(newUser);
      setCurrentScreen(AppScreen.PROFILE_SETUP);
    }, 800);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentScreen(AppScreen.DOC_UPLOAD);
  };

  const handleDocUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (user) {
        const verifiedUser = { ...user, isVerified: true };
        setUser(verifiedUser);
        localStorage.setItem('loan_user', JSON.stringify(verifiedUser));
      }
      setCurrentScreen(AppScreen.DASHBOARD);
    }, 1500);
  };

  const requestLoan = (amount: number) => {
    const deposit = (amount / 1000) * 100;
    const newLoan: LoanRequest = {
      id: 'L' + Date.now(),
      userId: user?.id || 'u1',
      amount,
      depositAmount: deposit,
      status: LoanStatus.PENDING_DEPOSIT,
      createdAt: new Date().toLocaleDateString('bn-BD')
    };
    setActiveLoan(newLoan);
    setCurrentScreen(AppScreen.PAYMENT);
  };

  const handlePaymentComplete = (txId: string) => {
    if (!activeLoan) return;
    const updatedLoan = { ...activeLoan, status: LoanStatus.PENDING_VERIFICATION, transactionId: txId };
    setLoans([updatedLoan, ...loans]);
    setActiveLoan(null);
    setCurrentScreen(AppScreen.HISTORY);
    alert('পেমেন্ট সফল হয়েছে! অ্যাডমিন অনুমোদনের জন্য অপেক্ষা করুন।');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.LOGIN:
        return (
          <div className="p-8 flex flex-col items-center justify-center min-h-[600px] text-center">
            <div className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl rotate-12">
              <i className="fas fa-hand-holding-usd text-5xl -rotate-12"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{STRINGS.bn.welcome}</h2>
            <p className="text-gray-500 mb-8">সহজ এবং দ্রুত লোন পেতে লগইন করুন</p>
            
            <div className="w-full space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+৮৮</span>
                <input 
                  type="tel" 
                  placeholder="মোবাইল নম্বর" 
                  className="w-full pl-16 pr-4 py-4 bg-gray-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none font-medium"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <Button onClick={handleLogin} disabled={loading} className="w-full py-4">
                {loading ? <i className="fas fa-circle-notch animate-spin"></i> : STRINGS.bn.sendOtp}
              </Button>
            </div>
          </div>
        );

      case AppScreen.OTP:
        return (
          <div className="p-8 flex flex-col items-center justify-center min-h-[600px] text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ওটিপি কোড দিন</h2>
            <p className="text-gray-500 mb-8">{mobile} নম্বরে একটি কোড পাঠানো হয়েছে</p>
            
            <div className="w-full space-y-6">
              <input 
                type="text" 
                placeholder="----" 
                maxLength={4}
                className="w-full py-4 text-center text-3xl tracking-[1rem] bg-gray-100 rounded-xl focus:ring-2 ring-emerald-500 outline-none font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button onClick={handleVerifyOtp} disabled={loading} className="w-full">
                {loading ? <i className="fas fa-circle-notch animate-spin"></i> : STRINGS.bn.verify}
              </Button>
              <button className="text-emerald-600 font-bold text-sm">কোড পাননি? আবার পাঠান</button>
            </div>
          </div>
        );

      case AppScreen.PROFILE_SETUP:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ব্যক্তিগত তথ্য</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">পূর্ণ নাম</label>
                <input type="text" required placeholder="নাম লিখুন" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">বর্তমান ঠিকানা</label>
                <textarea required placeholder="ঠিকানা লিখুন" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500 h-24" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-1 block">এনআইডি নম্বর</label>
                <input type="number" required placeholder="NID নম্বর লিখুন" className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500" />
              </div>
              <Button type="submit" className="w-full py-4">পরবর্তী ধাপে যান</Button>
            </form>
          </div>
        );

      case AppScreen.DOC_UPLOAD:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ডকুমেন্ট আপলোড</h2>
            <p className="text-gray-500 mb-8">আপনার তথ্য যাচাইয়ের জন্য নিচের ছবিগুলো আপলোড দিন</p>
            
            <div className="space-y-6">
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer">
                <i className="fas fa-id-card text-3xl text-gray-400 mb-2"></i>
                <span className="font-semibold text-gray-700">{STRINGS.bn.nidFront}</span>
                <span className="text-xs text-gray-400">ট্যাপ করে ছবি তুলুন</span>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer">
                <i className="fas fa-id-card text-3xl text-gray-400 mb-2"></i>
                <span className="font-semibold text-gray-700">{STRINGS.bn.nidBack}</span>
                <span className="text-xs text-gray-400">ট্যাপ করে ছবি তুলুন</span>
              </div>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer">
                <i className="fas fa-camera text-3xl text-gray-400 mb-2"></i>
                <span className="font-semibold text-gray-700">{STRINGS.bn.selfie}</span>
                <span className="text-xs text-gray-400">ট্যাপ করে সেলফি তুলুন</span>
              </div>
              <Button onClick={handleDocUpload} className="w-full py-4 mt-4" disabled={loading}>
                {loading ? <i className="fas fa-circle-notch animate-spin"></i> : "যাচাইয়ের জন্য পাঠান"}
              </Button>
            </div>
          </div>
        );

      case AppScreen.DASHBOARD:
        return (
          <div className="p-6 space-y-6">
            {/* Header Greeting */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-500 text-sm">স্বাগতম,</h3>
                <h2 className="text-xl font-bold text-gray-800">{user?.name || 'ব্যবহারকারী'}</h2>
              </div>
              <div className="p-1 rounded-full border-2 border-emerald-500">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">U</div>
              </div>
            </div>

            {/* Credit Limit Card */}
            <div className="bg-[#006a4e] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <i className="fas fa-coins text-8xl"></i>
              </div>
              <p className="text-emerald-100 text-sm mb-1">সর্বোচ্চ লোনের সীমা</p>
              <h2 className="text-4xl font-black mb-4">৳ ৫০,০০০</h2>
              <div className="flex justify-between items-center">
                <div className="text-xs text-emerald-100">
                  <i className="fas fa-check-circle mr-1"></i> আপনার আইডি ভেরিফাইড
                </div>
                <button className="bg-white text-[#006a4e] px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                  বৃদ্ধি করুন
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setCurrentScreen(AppScreen.LOAN_APPLY)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center space-y-2 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
                  <i className="fas fa-plus-circle"></i>
                </div>
                <span className="font-bold text-gray-700 text-sm">নতুন লোন</span>
              </button>
              <button 
                onClick={() => setCurrentScreen(AppScreen.HISTORY)}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center space-y-2 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                  <i className="fas fa-history"></i>
                </div>
                <span className="font-bold text-gray-700 text-sm">ইতিহাস</span>
              </button>
            </div>

            {/* Notification Banner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-4 items-start">
              <i className="fas fa-info-circle text-yellow-600 mt-1"></i>
              <div>
                <h4 className="font-bold text-yellow-800 text-sm">পেমেন্ট রিমাইন্ডার</h4>
                <p className="text-xs text-yellow-700">আপনার কোনো বকেয়া লোন নেই। নতুন লোনের জন্য আজই আবেদন করুন!</p>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-3">সহায়তা কেন্দ্র</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <i className="fab fa-whatsapp text-green-500 text-xl"></i>
                    <span className="text-sm font-medium">হোয়াটসঅ্যাপ চ্যাট</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-phone-alt text-blue-500 text-lg"></i>
                    <span className="text-sm font-medium">কাস্টমার কেয়ার</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        );

      case AppScreen.LOAN_APPLY:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">লোনের আবেদন</h2>
            <p className="text-gray-500 mb-8">{STRINGS.bn.depositNote}</p>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 mb-2 block">লোনের পরিমাণ (টাকা)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[1000, 2000, 5000, 10000, 15000, 20000].map(amt => (
                    <button 
                      key={amt}
                      onClick={() => setMobile(amt.toString())} // Using mobile temp state for amount selection
                      className={`p-3 rounded-xl border-2 font-bold transition-all ${mobile === amt.toString() ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-gray-200 text-gray-600'}`}
                    >
                      ৳ {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">নিরাপত্তা আমানত (ফেরতযোগ্য):</span>
                  <span className="font-bold text-emerald-700">৳ {mobile ? (parseInt(mobile) / 1000 * 100) : 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">প্রসেসিং ফি:</span>
                  <span className="font-bold text-gray-700">৳ ০.০০</span>
                </div>
                <div className="border-t border-emerald-100 my-2 pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">মোট প্রদেয়:</span>
                  <span className="font-black text-emerald-700">৳ {mobile ? (parseInt(mobile) / 1000 * 100) : 0}</span>
                </div>
              </div>

              <Button 
                onClick={() => mobile && requestLoan(parseInt(mobile))} 
                disabled={!mobile}
                className="w-full py-4 shadow-xl shadow-emerald-100"
              >
                আবেদন নিশ্চিত করুন
              </Button>
            </div>
          </div>
        );

      case AppScreen.PAYMENT:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">আমানত প্রদান</h2>
            <p className="text-gray-600 mb-8">নিরাপত্তা আমানত জমা দিতে পেমেন্ট মেথড বেছে নিন</p>
            
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mb-6 text-center">
              <p className="text-gray-500 text-sm mb-1">মোট আমানত</p>
              <h1 className="text-4xl font-black text-emerald-600 mb-2">৳ {activeLoan?.depositAmount}</h1>
              <p className="text-xs text-orange-600 font-bold bg-orange-50 inline-block px-3 py-1 rounded-full">
                {STRINGS.bn.nagadMerchant}
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handlePaymentComplete('TX'+Date.now())}
                className="w-full p-4 rounded-2xl border-2 border-gray-100 flex items-center justify-between hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2">
                    <img src="https://picsum.photos/seed/nagad/100/100" className="rounded" alt="Nagad" />
                  </div>
                  <span className="font-bold text-gray-700">Nagad Merchant Pay</span>
                </div>
                <i className="fas fa-chevron-right text-gray-300"></i>
              </button>
              <button className="w-full p-4 rounded-2xl border-2 border-gray-100 flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2">
                    <img src="https://picsum.photos/seed/bkash/100/100" className="rounded" alt="bKash" />
                  </div>
                  <span className="font-bold text-gray-700">bKash Payment</span>
                </div>
                <span className="text-xs font-bold text-gray-400">শীঘ্রই আসছে</span>
              </button>
            </div>
          </div>
        );

      case AppScreen.HISTORY:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">লেনদেনের ইতিহাস</h2>
            
            <div className="space-y-4">
              {loans.length === 0 ? (
                <div className="py-20 text-center">
                  <i className="fas fa-receipt text-5xl text-gray-200 mb-4"></i>
                  <p className="text-gray-400 font-medium">কোনো ইতিহাস পাওয়া যায়নি</p>
                </div>
              ) : (
                loans.map(loan => (
                  <div key={loan.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">৳ {loan.amount.toLocaleString()} লোন</h4>
                        <p className="text-xs text-gray-400">আইডি: {loan.id} • {loan.createdAt}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        loan.status === LoanStatus.PENDING_VERIFICATION ? 'bg-orange-100 text-orange-600' :
                        loan.status === LoanStatus.APPROVED ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {loan.status === LoanStatus.PENDING_VERIFICATION ? 'অপেক্ষমান' : 'অনুমোদিত'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-gray-50 pt-3">
                      <span className="text-gray-500">আমানত জমা: ৳ {loan.depositAmount}</span>
                      <span className="text-emerald-600 font-bold">বিস্তারিত</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case AppScreen.ADMIN_DASHBOARD:
        return (
          <div className="p-6 space-y-6">
            <div className="bg-slate-800 rounded-3xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-lock text-yellow-500"></i> অ্যাডমিন প্যানেল
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400">মোট পেন্ডিং লোন</p>
                  <h3 className="text-2xl font-bold">{loans.filter(l => l.status === LoanStatus.PENDING_VERIFICATION).length}</h3>
                </div>
                <div className="bg-slate-700 p-4 rounded-2xl">
                  <p className="text-xs text-slate-400">আজকের জমা</p>
                  <h3 className="text-2xl font-bold">৳ ৫,৪০০</h3>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-4">যাচাইয়ের জন্য লোন আবেদন</h3>
              <div className="space-y-4">
                {loans.filter(l => l.status === LoanStatus.PENDING_VERIFICATION).map(loan => (
                  <div key={loan.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">U</div>
                        <div>
                          <p className="font-bold text-sm">মোবাইল: {mobile}</p>
                          <p className="text-[10px] text-gray-400">TxID: {loan.transactionId}</p>
                        </div>
                      </div>
                      <p className="font-bold text-emerald-600">৳ {loan.amount}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="primary" 
                        className="py-2 text-xs"
                        onClick={() => {
                          const updated = loans.map(l => l.id === loan.id ? { ...l, status: LoanStatus.APPROVED } : l);
                          setLoans(updated);
                          alert('লোন অনুমোদিত হয়েছে!');
                        }}
                      >অনুমোদন</Button>
                      <Button variant="danger" className="py-2 text-xs">বাতিল</Button>
                    </div>
                  </div>
                ))}
                {loans.filter(l => l.status === LoanStatus.PENDING_VERIFICATION).length === 0 && (
                  <p className="text-center text-gray-400 py-10">কোনো পেন্ডিং আবেদন নেই</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return <div>Screen not found</div>;
    }
  };

  const showNav = ![AppScreen.LOGIN, AppScreen.OTP, AppScreen.PROFILE_SETUP, AppScreen.DOC_UPLOAD].includes(currentScreen);

  return (
    <Layout 
      title={currentScreen === AppScreen.DASHBOARD ? "LoanPro BD" : undefined}
      showBack={![AppScreen.LOGIN, AppScreen.DASHBOARD].includes(currentScreen)}
      onBack={() => {
        if (currentScreen === AppScreen.OTP) setCurrentScreen(AppScreen.LOGIN);
        else if (currentScreen === AppScreen.PROFILE_SETUP) setCurrentScreen(AppScreen.OTP);
        else setCurrentScreen(AppScreen.DASHBOARD);
      }}
      hideNav={!showNav}
      activeTab={currentScreen}
      onTabChange={(tab) => setCurrentScreen(tab as AppScreen)}
    >
      {renderScreen()}
    </Layout>
  );
};

export default App;
