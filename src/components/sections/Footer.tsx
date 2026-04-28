import React,{useState} from "react";

const policies={
privacy:{title:"Privacy Policy",content:"আপনার তথ্য নিরাপদভাবে অর্ডার প্রসেসিংয়ের জন্য ব্যবহৃত হয়।"},
terms:{title:"Terms & Conditions",content:"অর্ডার কনফার্মের পর প্রসেস করা হয়।"},
return:{title:"Return Policy",content:"সমস্যা হলে সাপোর্ট দেওয়া হবে।"},
shipping:{title:"Shipping Policy",content:"সারা বাংলাদেশে হোম ডেলিভারি।"},
}

export function Footer(){
const [open,setOpen]=useState(null);

return(
<footer className="border-t border-gold/30 bg-[oklch(0.08_0.03_20)] px-4 pt-10 pb-32">

<div className="text-center mb-6">
<h3 className="text-2xl font-bold text-gold">Antarctic Fish Krill Oil</h3>
<p className="text-sm mt-2">প্রিমিয়াম অ্যান্টার্কটিক ক্রিল অয়েল</p>
</div>

<div className="flex flex-wrap justify-center gap-5 border-t border-gold/20 pt-6 text-sm">
<button onClick={()=>setOpen("privacy")}>Privacy Policy</button>
<button onClick={()=>setOpen("terms")}>Terms</button>
<button onClick={()=>setOpen("return")}>Return</button>
<button onClick={()=>setOpen("shipping")}>Shipping</button>
</div>

<p className="text-center text-xs mt-5">
* স্বাস্থ্য সহায়ক ফুড সাপ্লিমেন্ট
</p>

<p className="text-center text-xs mt-4">
© 2026 Antarctic Fish Krill Oil
</p>

{open && (
<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
<div className="max-w-md rounded-2xl border border-gold p-6 bg-black relative">
<button
onClick={()=>setOpen(null)}
className="absolute right-4 top-3 text-gold text-xl"
>
×
</button>

<h3 className="text-gold mb-4 font-bold">
{policies[open].title}
</h3>

<p className="text-sm leading-7">
{policies[open].content}
</p>

</div>
</div>
)}

</footer>
)
}
