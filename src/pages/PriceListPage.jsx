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
          const actualRate = Number(v.actual_rate ?? 0);
          const discountPercent = Number(v.discount_percent ?? 0);
          const hasDiscount = actualRate > Number(v.price ?? 0);
          rows.push([
            v.name ? `${item.name} — ${v.name}` : item.name,
            hasDiscount ? `Rs.${actualRate}` : "-",
            hasDiscount ? `${discountPercent}%` : "-",
            `Rs.${v.price}`,
          ]);
        });
      });

      autoTable(doc, {
        startY: y,
        head: [[category.name, "MRP", "Discount", "Net Price"]],
        body: rows,
        theme: "grid",
        headStyles: { fillColor: [204, 8, 34] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
      });

      y = doc.lastAutoTable.finalY + 8;
    });

    doc.save(
      `${restaurantInfo.name.replace(/\s+/g, "-").toLowerCase()}-price-list.pdf`,
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 pt-6 pb-28 md:pb-16">
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
          <button onClick={downloadPdf}>
            
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
        <div className="space-y-10">
          {grouped.map(({ category, items: catItems }) => (
            <section key={category.id}>
              <h2 className="font-display font-bold text-xl text-gray-900 mb-4 pb-2 border-b-2 border-gray-100 flex items-center justify-between">
                <span>{category.name}</span>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
                  {catItems.length} items
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {catItems.flatMap((item) => {
                  const variants = item.variants?.length
                    ? item.variants
                    : [{ id: "default", name: null, price: 0 }];

                  return variants.map((v) => {
                    const actualRate = Number(v.actual_rate ?? 0);
                    const discountPercent = Number(v.discount_percent ?? 0);
                    const hasDiscount = actualRate > Number(v.price ?? 0);

                    return (
                      <div
                        key={`${item.id}-${v.id}`}
                        className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-gray-200 transition-all"
                      >
                        <span className="text-sm font-medium text-gray-800 pr-2">
                          {item.name}
                          {v.name ? (
                            <span className="text-gray-400 font-normal">
                              {" "}
                              — {v.name}
                            </span>
                          ) : null}
                        </span>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-gold-700 block">
                            ₹{v.price}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] font-semibold text-gray-400 flex items-center justify-end gap-1.5">
                              <span className="line-through">
                                ₹{actualRate}
                              </span>
                              {discountPercent > 0 && (
                                <span className="text-emerald-600 bg-emerald-50 px-1 rounded">
                                  {discountPercent}% off
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
