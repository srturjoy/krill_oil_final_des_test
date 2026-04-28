export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-bold">Antarctic Fish Krill Oil</h3>
          <p className="mt-3 text-sm text-white/70">
            প্রিমিয়াম অ্যান্টার্কটিক উৎস থেকে উন্নত মানের ক্রিল অয়েল।
          </p>
        </div>

        <div>
          <h4 className="font-semibold">সুবিধাসমূহ</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>✔ হার্ট, জয়েন্ট ও ব্রেইন সাপোর্ট</li>
            <li>✔ ৬০ সফটজেল ক্যাপসুল</li>
            <li>✔ সারা বাংলাদেশে হোম ডেলিভারি</li>
            <li>✔ ক্যাশ অন ডেলিভারি সুবিধা</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">যোগাযোগ</h4>
          <p className="mt-3 text-sm text-white/70">📞 01518961899</p>
          <p className="text-sm text-white/70">💬 WhatsApp Support Available</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/70">
            <span>🔒 Secure Checkout</span>
            <span>🚚 Free Delivery</span>
            <span>💯 Quality Assured</span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-5 text-center text-xs text-white/50">
        <div className="mb-3 flex flex-wrap justify-center gap-4">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
          <span>Return Policy</span>
          <span>Shipping Policy</span>
        </div>
        <p>এই পণ্য কোনো রোগ নির্ণয়, চিকিৎসা বা প্রতিরোধের বিকল্প নয়।</p>
        <p className="mt-2">© 2026 Antarctic Fish Krill Oil. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
