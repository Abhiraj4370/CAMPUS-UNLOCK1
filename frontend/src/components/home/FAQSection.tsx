import { Accordion } from '@/components/ui/Accordion';

const FAQS = [
  { question: 'Is Campus Unlock free to use for students?', answer: 'Yes — browsing universities, comparing programs, and getting mentor guidance is completely free for students.' },
  { question: 'Are all listed universities UGC-approved?', answer: 'Every university on Campus Unlock displays its current UGC entitlement and NAAC grade directly on its profile page, so you can verify before applying.' },
  { question: 'Can I compare more than two universities at once?', answer: 'Yes — you can add up to four universities to the comparison tool and see fees, ratings, placement rates and more side by side.' },
  { question: 'How do I talk to a mentor?', answer: 'Visit any university or course page and click "Talk to Mentor", or use the contact form — a counsellor will reach out within 24 hours.' },
];

export function FAQSection() {
  return (
    <section className="max-w-[760px] mx-auto px-6 py-14">
      <div className="text-center mb-8">
        <h2 className="text-[26px] font-extrabold text-ink-900">Frequently Asked Questions</h2>
      </div>
      <Accordion items={FAQS} />
    </section>
  );
}
