import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Plus } from 'lucide-react';
import { STUDIO_FAQS } from '../../data/faqs';
import type { FAQCategory, FAQItem } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SectionHeading } from './SectionHeading';

interface CollapsibleFAQProps {
  items?: FAQItem[];
  id?: string;
}

type CategoryFilter = 'All' | FAQCategory;

const CATEGORY_ORDER: CategoryFilter[] = [
  'All',
  'Booking & Policies',
  'Delivery & Editing',
  'Prints & Albums',
  'Coverage & Travel',
];

const QUICK_REFERENCE_FACTS = [
  { label: 'Booking Retainer', value: '30% to Reserve Dates' },
  { label: 'Preview Delivery', value: '7 Working Days' },
  { label: 'Full Gallery & Film', value: '4–8 Weeks' },
  { label: 'Heirloom Prints', value: 'Layflat Albums & Cotton Rag' },
];

/**
 * Editorial collapsible FAQ section for the homepage with category filtering,
 * smooth motion/react expand/collapse transitions, expand-all toggle, and full
 * keyboard/ARIA accessibility.
 */
export function CollapsibleFAQ({ items = STUDIO_FAQS, id = 'faq' }: CollapsibleFAQProps) {
  const prefersReduced = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [openIds, setOpenIds] = useState<string[]>(() => (items[0] ? [items[0].id] : []));

  const availableCategories = useMemo(() => {
    const present = new Set<FAQCategory>();
    for (const item of items) {
      if (item.category) present.add(item.category);
    }
    return CATEGORY_ORDER.filter((cat) => cat === 'All' || present.has(cat));
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const openSet = useMemo(() => new Set(openIds), [openIds]);
  const allFilteredOpen =
    filteredItems.length > 0 && filteredItems.every((item) => openSet.has(item.id));

  const toggleItem = (faqId: string) => {
    setOpenIds((prev) =>
      prev.includes(faqId) ? prev.filter((entry) => entry !== faqId) : [...prev, faqId]
    );
  };

  const handleCategoryChange = (category: CategoryFilter) => {
    setSelectedCategory(category);
    const nextList =
      category === 'All' ? items : items.filter((item) => item.category === category);
    if (nextList.length > 0 && !nextList.some((item) => openSet.has(item.id))) {
      setOpenIds([nextList[0].id]);
    }
  };

  const handleToggleAll = () => {
    if (allFilteredOpen) {
      const filteredIdSet = new Set(filteredItems.map((i) => i.id));
      setOpenIds((prev) => prev.filter((entry) => !filteredIdSet.has(entry)));
    } else {
      setOpenIds((prev) => Array.from(new Set([...prev, ...filteredItems.map((i) => i.id)])));
    }
  };

  return (
    <section
      id={id}
      aria-labelledby="faq-section-heading"
      className="py-20 md:py-28 bg-[#F7F2E9] text-[#171615] border-t border-[#171615]/8"
    >
      <div className="studio-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Sticky Editorial Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
            <div id="faq-section-heading">
              <SectionHeading
                devanagari="प्रश्नोत्तरी"
                kicker="Frequently Asked Questions"
                title="Planning Details, Answered Transparently"
                description="Clear answers on wedding booking steps, editing and delivery schedules, archival albums, fine-art prints, and travel across Madhya Pradesh."
              />
            </div>

            {/* Quiet Quick-Reference Milestones */}
            <dl className="divide-y divide-[#171615]/10 border-y border-[#171615]/12">
              {QUICK_REFERENCE_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="py-3.5 flex items-baseline justify-between gap-4 text-sm"
                >
                  <dt className="text-[#5C554E]">{fact.label}</dt>
                  <dd className="font-medium text-[#171615] text-right tabular-nums">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Direct Consultation Links */}
            <div className="space-y-3 pt-1">
              <p className="text-sm text-[#5C554E] leading-relaxed">
                Planning a multi-day celebration or custom destination itinerary? Speak directly
                with our studio desk.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#57252F] px-5 py-2.5 text-sm font-medium text-[#F7F2E9] hover:bg-[#3E1820] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57252F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2E9]"
                >
                  <span>Check Date Availability</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#57252F] hover:text-[#171615] transition-colors underline underline-offset-4 whitespace-nowrap shrink-0"
                >
                  <span>Ask a Question</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Filter Controls & Collapsible Accordion */}
          <div className="lg:col-span-8">
            {/* Category Tabs + Expand/Collapse All Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#171615]/12">
              <div
                role="tablist"
                aria-label="Filter questions by topic"
                className="flex flex-wrap items-center gap-1.5"
              >
                {availableCategories.map((category) => {
                  const isActive = selectedCategory === category;
                  const count =
                    category === 'All'
                      ? items.length
                      : items.filter((item) => item.category === category).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleCategoryChange(category)}
                      className={`relative px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#57252F] ${
                        isActive
                          ? 'bg-[#57252F] text-[#F7F2E9]'
                          : 'text-[#5C554E] hover:text-[#171615] hover:bg-[#E8DCCB]/70'
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`ml-1.5 text-[11px] tabular-nums ${
                          isActive ? 'text-[#C5A46D]' : 'text-[#5C554E]/75'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleToggleAll}
                className="self-start sm:self-auto text-xs font-semibold tracking-[0.04em] text-[#57252F] hover:text-[#171615] transition-colors cursor-pointer whitespace-nowrap shrink-0 py-1.5 focus-visible:outline-none focus-visible:underline"
              >
                {allFilteredOpen ? 'Collapse All' : 'Expand All'}
              </button>
            </div>

            {/* Accordion List */}
            <div className="divide-y divide-[#171615]/12 border-b border-[#171615]/12">
              {filteredItems.map((faq, idx) => {
                const isOpen = openSet.has(faq.id);
                const buttonId = `faq-trigger-${faq.id}`;
                const panelId = `faq-panel-${faq.id}`;

                return (
                  <div key={faq.id} className="group">
                    <h3>
                      <button
                        id={buttonId}
                        type="button"
                        onClick={() => toggleItem(faq.id)}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        className="flex w-full items-start justify-between gap-6 py-6 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#57252F]"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C554E] mb-1.5">
                            <span className="font-medium tracking-[0.12em] text-[#57252F] tabular-nums">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span aria-hidden="true" className="text-[#C5A46D]">
                              ·
                            </span>
                            <span className="text-[#57252F] font-medium">{faq.topic}</span>
                            {faq.category && (
                              <>
                                <span aria-hidden="true" className="text-[#171615]/30">
                                  /
                                </span>
                                <span>{faq.category}</span>
                              </>
                            )}
                          </div>
                          <span
                            className={`block font-editorial text-xl sm:text-2xl font-medium leading-snug transition-colors ${
                              isOpen
                                ? 'text-[#57252F]'
                                : 'text-[#171615] group-hover:text-[#57252F]'
                            }`}
                          >
                            {faq.question}
                          </span>
                        </div>

                        <span
                          aria-hidden="true"
                          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                            isOpen
                              ? 'border-[#57252F] bg-[#57252F] text-[#F7F2E9]'
                              : 'border-[#171615]/15 bg-transparent text-[#57252F] group-hover:border-[#C5A46D] group-hover:bg-[#E8DCCB]/55'
                          }`}
                        >
                          <Plus
                            className={`w-4 h-4 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              isOpen ? 'rotate-45' : 'rotate-0'
                            }`}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={prefersReduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={
                            prefersReduced
                              ? { duration: 0.12 }
                              : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
                          }
                          className="overflow-hidden"
                        >
                          <div className="pb-7 pr-2 sm:pr-14 space-y-4">
                            <p className="text-sm sm:text-base text-[#5C554E] leading-relaxed prose-measure">
                              {faq.answer}
                            </p>

                            {faq.highlights && faq.highlights.length > 0 && (
                              <ul className="pt-3 border-t border-[#171615]/8 space-y-2 text-xs sm:text-sm text-[#171615]/85">
                                {faq.highlights.map((point, pointIdx) => (
                                  <li
                                    key={point}
                                    className="flex items-baseline gap-3 leading-relaxed"
                                  >
                                    <span className="text-[11px] font-medium text-[#C5A46D] tabular-nums shrink-0">
                                      {String(pointIdx + 1).padStart(2, '0')}.
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
