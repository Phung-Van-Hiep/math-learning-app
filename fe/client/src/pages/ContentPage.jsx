import React from 'react';
import { Link } from 'react-router-dom';

// Mock Data
const lessonData = {
  title: 'Bài 3: Phương trình bậc nhất một ẩn',
  sections: [
    { id: 'ly-thuyet', title: 'Tóm tắt lý thuyết' },
    { id: 'vi-du', title: 'Ví dụ minh họa' },
    { id: 'bai-tap-sgk', title: 'Bài tập SGK' },
    { id: 'tu-luyen', title: 'Bài tập tự luyện' },
  ],
  theory: {
    definition: 'Phương trình bậc nhất một ẩn là phương trình có dạng ax + b = 0, với a và b là hai số đã cho và a ≠ 0.',
    formula: 'x = -b/a',
    rules: [
      { title: 'Quy tắc chuyển vế', content: 'Khi chuyển một hạng tử từ vế này sang vế kia của phương trình, ta phải đổi dấu hạng tử đó.' },
      { title: 'Quy tắc nhân (chia)', content: 'Nhân (hoặc chia) cả hai vế của phương trình với cùng một số khác 0, ta được phương trình tương đương.' },
    ],
    steps: [
      'Chuyển các hạng tử chứa ẩn về một vế, các hạng tử tự do về vế kia.',
      'Rút gọn mỗi vế thành dạng ax = b.',
      'Chia cả hai vế cho hệ số a (a ≠ 0) để tìm x.',
      'Kết luận nghiệm.',
    ],
  },
  examples: [
    { title: 'Ví dụ 1: Giải phương trình 2x + 6 = 0', solution: ['2x = -6', 'x = -6 / 2', 'x = -3'] },
    { title: 'Ví dụ 2: Giải phương trình 5x - 15 = 0', solution: ['5x = 15', 'x = 15 / 5', 'x = 3'] },
  ],
  exercises: [
    { title: 'Bài tập 1 (Trang 10 - SGK)', problem: 'Giải phương trình: 4x - 20 = 0', hint: 'Áp dụng quy tắc chuyển vế và quy tắc chia.', answer: 'x = 5' },
    { title: 'Bài tập 2 (Trang 10 - SGK)', problem: 'Giải phương trình: 2x + 5 = 11', hint: 'Chuyển 5 sang vế phải trước.', answer: 'x = 3' },
  ],
};

const Section = ({ id, title, children }) => (
  <section id={id} className="mb-16 scroll-mt-24">
    <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-blue-500 pb-2 mb-8">{title}</h2>
    {children}
  </section>
);

const QuickNav = ({ sections }) => (
  <aside className="sticky top-24 h-screen">
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📑 Nội dung bài học</h3>
      <ul className="space-y-3">
        {sections.map(sec => (
          <li key={sec.id}>
            <a href={`#${sec.id}`} className="text-blue-600 hover:underline hover:font-semibold transition-all">
              → {sec.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);

export default function ContentPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="text-sm mb-8" aria-label="Breadcrumb">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <Link to="/" className="text-gray-500 hover:text-blue-600">🏠 Trang chủ</Link>
              <svg className="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>
            </li>
            <li>
              <span className="text-gray-700 font-bold">📝 Nội dung Toán học</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">📚 Nội dung Toán học</h1>
          <p className="text-2xl text-gray-600 mt-2">{lessonData.title}</p>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Quick Navigation (Sidebar) */}
          <div className="hidden lg:block lg:col-span-1">
            <QuickNav sections={lessonData.sections} />
          </div>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Section id="ly-thuyet" title="I. Tóm tắt lý thuyết">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h4 className="font-bold text-lg mb-2">📌 Định nghĩa</h4>
                  <p>{lessonData.theory.definition}</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-bold text-lg mb-2">Công thức nghiệm</h4>
                  <pre className="text-2xl font-mono bg-white p-4 rounded text-center">{lessonData.theory.formula}</pre>
                </div>
                {lessonData.theory.rules.map(rule => (
                  <div key={rule.title} className="bg-white p-6 rounded-lg shadow border">
                    <h4 className="font-bold text-lg mb-2">⚡ {rule.title}</h4>
                    <p>{rule.content}</p>
                  </div>
                ))}
                <div className="bg-white p-6 rounded-lg shadow border">
                  <h4 className="font-bold text-lg mb-2">📋 Các bước giải</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {lessonData.theory.steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ol>
                </div>
              </div>
            </Section>

            <Section id="vi-du" title="II. Ví dụ minh họa">
              <div className="space-y-8">
                {lessonData.examples.map((ex, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow border">
                    <h4 className="font-bold text-lg mb-4">{ex.title}</h4>
                    <div className="space-y-2">
                      <p className="font-semibold">✍️ Lời giải:</p>
                      {ex.solution.map((step, j) => <p key={j} className="ml-4 font-mono">{`→ ${step}`}</p>)}
                      <p className="font-bold text-green-600 pt-2">✅ Đáp án: {ex.solution[ex.solution.length - 1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="bai-tap-sgk" title="III. Bài tập SGK">
              <div className="space-y-8">
                {lessonData.exercises.map((ex, i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow border">
                    <h4 className="font-bold text-lg mb-2">{ex.title}</h4>
                    <p className="mb-4"><strong>📝 Đề bài:</strong> {ex.problem}</p>
                    <details className="bg-gray-50 p-4 rounded-lg cursor-pointer">
                      <summary className="font-semibold text-blue-600">💡 Hướng dẫn giải</summary>
                      <p className="mt-2 text-gray-700">{ex.hint}</p>
                      <p className="mt-2 font-bold">✅ Đáp số: {ex.answer}</p>
                    </details>
                  </div>
                ))}
              </div>
            </Section>
             <Section id="tu-luyen" title="IV. Bài tập tự luyện">
                <div className="bg-white p-6 rounded-lg shadow border text-center">
                    <p className="text-lg mb-4">Để củng cố kiến thức, hãy chuyển đến trang <Link to="/assessment" className="font-bold text-blue-600 hover:underline">Kiểm tra & Đánh giá</Link> để làm thêm bài tập nhé!</p>
                    <Link to="/assessment" className="inline-block px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300">
                        Làm bài tập ngay
                    </Link>
                </div>
            </Section>
          </main>
        </div>
      </div>
    </div>
  );
}
