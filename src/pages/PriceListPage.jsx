import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Receipt, Loader2, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSEO } from "../lib/seo";
import { restaurantInfo } from "../lib/data";
import { getCategories, getMenuItems } from "../lib/api";

export default function PriceListPage({ onBack }) {
  useSEO({
    title: `Price List | ${restaurantInfo.name}`,
    description: `Full price list of crackers and fireworks available at ${restaurantInfo.name}, ${restaurantInfo.address}.`,
    path: "/price-list",
  });

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    Promise.all([getCategories(), getMenuItems()])
      .then(([cats, its]) => {
        if (!alive) return;
        setCategories(cats);
        setItems(its);
      })
      .catch(() => {})
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const grouped = useMemo(() => {
    return categories
      .map((cat) => ({
        category: cat,
        items: items.filter((i) => i.category_id === cat.id),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, items]);

  function downloadPdf() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(restaurantInfo.name, 14, 18);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(restaurantInfo.address, 14, 25);
    doc.text(`Phone: ${restaurantInfo.phone}`, 14, 30);

    let y = 40;
    grouped.forEach(({ category, items: catItems }) => {
      const rows = [];
      catItems.forEach((item) => {
        const variants = item.variants?.length
          ? item.variants
          : [{ id: "default", name: null, price: 0 }];
        variants.forEach((v) => {
          rows.push([
            v.name ? `${item.name} — ${v.name}` : item.name,
            `Rs.${v.price}`,
          ]);
        });
      });

      autoTable(doc, {
        startY: y,
        head: [[category.name, "Price"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [204, 8, 34] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
      });

      y = doc.lastAutoTable.finalY + 8;
    });

    doc.save(`${restaurantInfo.name.replace(/\s+/g, "-").toLowerCase()}-price-list.pdf`);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pt-6 pb-28 md:pb-16">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gold-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}

      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <span className="flex items-center gap-1.5 text-gold-500 text-xs font-bold tracking-[0.2em] uppercase mb-1">
            <Receipt size={14} /> Full Catalogue
          </span>
          <h1 className="font-display font-black text-2xl md:text-4xl text-gray-900 tracking-tight">
            Price List
          </h1>
        </div>

        {!loading && grouped.length > 0 && (
          <button
            onClick={downloadPdf}
            className="shrink-0 flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs md:text-sm font-bold px-3.5 md:px-4 py-2.5 rounded-xl shadow-md shadow-primary-500/10 transition-all active:scale-95"
          >
            <Download size={15} /> Download PDF
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-8">
        Prices are per pack. Contact us for bulk / wholesale rates.
      </p>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
        </div>
      ) : grouped.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-16">
          Price list will be updated soon.
        </p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ category, items: catItems }) => (
            <section key={category.id}>
              <h2 className="font-display font-bold text-lg text-gray-900 mb-3 pb-2 border-b border-gray-100">
                {category.name}
              </h2>
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                {catItems.map((item) =>
                  (item.variants?.length ? item.variants : [{ id: "default", name: null, price: 0 }]).map(
                    (v) => (
                      <div
                        key={`${item.id}-${v.id}`}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {item.name}
                          {v.name ? (
                            <span className="text-gray-400"> — {v.name}</span>
                          ) : null}
                        </span>
                        <span className="text-sm font-bold text-gold-700 shrink-0">
                          ₹{v.price}
                        </span>
                      </div>
                    ),
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}