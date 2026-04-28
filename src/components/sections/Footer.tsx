import React from "react";

export function Footer() {
  return (
    <footer className="border-t border-gold/30 bg-[oklch(0.08_0.03_20)] px-4 pt-12 pb-28 text-foreground">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h3 className="mb-3 text-2xl font-bold text-gold">Antarctic Fish Krill Oil</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            প্রিমিয়াম অ্যান্টার্কটিক উৎস থেকে উন্নত মানের ক্রিল অয়েল।
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gold/20 p-5">
            <h4 className="mb-3 font-semibold text-gold">সুবিধাসমূহ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✔ হার্ট, জয়েন্ট ও ব্রেইন সাপোর্ট</li>
              <li>✔ ৬০ সফটজেল ক্যাপসুল</li>
              <li>✔ সারা বাংলাদেশে হোম ডেলিভারি</li>
              <li>✔ ক্যাশ অন ডেলিভারি সুবিধা</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gold/20 p-5">
            <h4 className="mb-3 font-semibold text-gold">যোগাযোগ</h4>
            <p className="text-sm text-muted-foreground">📞 01518961899</p>
            <p className="text-sm text-muted-foreground">💬 WhatsApp Support Available</p>
          </div>

          <div className="rounded-2xl border border-gold/20 p-5">
            <h4 className="mb-3 font-semibold text-gold">Trust</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🔒 Secure Checkout</p>
              <p>🚚 Free Delivery</p>
              <p>💯 Quality Assured</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-gold/20 pt-6 text-sm text-muted-foreground">
          <a href="#privacy-policy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
          <a href="#return-policy">Return Policy</a>
          <a href="#shipping-policy">Shipping Policy</a>
        </div>

        <div id="privacy-policy" className="rounded-2xl border border-gold/20 p-5 text-sm text-muted-foreground">
          <h4 className="mb-3 font-semibold text-gold">Privacy Policy</h4>
          <p>
           অর্ডার প্রসেসিং ও ডেলিভারির জন্য প্রয়োজনীয় তথ্য নিরাপদভাবে ব্যবহৃত হয়। আপনার গোপনীয়তা ও তথ্য সুরক্ষা আমাদের কাছে গুরুত্বপূর্ণ।
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Disclaimer:এটি একটি স্বাস্থ্য সহায়ক ফুড সাপ্লিমেন্ট, নিয়মিত পুষ্টি সাপোর্টের জন্য ব্যবহৃত।
        </p>

        <p className="text-center text-xs text-muted-foreground">
          © 2026 Antarctic Fish Krill Oil. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
