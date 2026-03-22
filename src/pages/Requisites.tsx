import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Requisites = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-[#2AABAB] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Реквизиты</h1>

        <div className="bg-gray-50 rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#2AABAB] flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Reklamix AI</span>
          </div>

          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 text-gray-500 font-medium w-1/2">Полное наименование</td>
                <td className="py-3 text-gray-900">Индивидуальный предприниматель Каралиев Ренат Мусаевич</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Краткое наименование ИП</td>
                <td className="py-3 text-gray-900">Каралиев Ренат Мусаевич</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Юридический адрес</td>
                <td className="py-3 text-gray-900">Ставропольский край, г. Минеральные Воды, ул. Мира, д. 75А</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Почтовый адрес</td>
                <td className="py-3 text-gray-900">Ставропольский край, г. Минеральные Воды, ул. Мира, д. 75А</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Контактный номер</td>
                <td className="py-3 text-gray-900">+7 (928) 970 70 10</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">Email</td>
                <td className="py-3 text-gray-900">support@reklamix.ai</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">ИНН</td>
                <td className="py-3 text-gray-900">263005525353</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-500 font-medium">ОГРНИП</td>
                <td className="py-3 text-gray-900">320265100040124</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Банковские реквизиты</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-3 text-gray-500 font-medium w-1/2">Наименование банка</td>
                  <td className="py-3 text-gray-900">ПАО СБЕРБАНК</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500 font-medium">Расчётный счёт</td>
                  <td className="py-3 text-gray-900">40802810660100059436</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500 font-medium">Корреспондентский счёт</td>
                  <td className="py-3 text-gray-900">30101810907020000615</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500 font-medium">БИК</td>
                  <td className="py-3 text-gray-900">040702615</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 p-6 bg-[#2AABAB]/5 rounded-2xl border border-[#2AABAB]/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Описание услуг</h3>
          <p className="text-gray-600 leading-relaxed">
            Reklamix AI — сервис для создания профессиональных изображений товаров для маркетплейсов
            и рекламы с помощью искусственного интеллекта. Пользователи загружают фотографии товаров,
            ИИ анализирует их и генерирует готовые изображения для размещения на площадках
            Wildberries, Ozon, Instagram и Telegram.
          </p>
        </div>

        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Стоимость услуг</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-gray-500 font-medium">Пакет</th>
                <th className="py-3 text-left text-gray-500 font-medium">Количество кредитов</th>
                <th className="py-3 text-right text-gray-500 font-medium">Стоимость</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 text-gray-900">Starter</td>
                <td className="py-3 text-gray-900">1 кредит</td>
                <td className="py-3 text-right text-gray-900">89 ₽</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-900">Basic</td>
                <td className="py-3 text-gray-900">10 кредитов</td>
                <td className="py-3 text-right text-gray-900">857 ₽</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-900">Standard</td>
                <td className="py-3 text-gray-900">60 кредитов</td>
                <td className="py-3 text-right text-gray-900">1 429 ₽</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-900">Pro</td>
                <td className="py-3 text-gray-900">120 кредитов</td>
                <td className="py-3 text-right text-gray-900">3 571 ₽</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-400 mt-4">1 кредит = 1 генерация изображения. Кредиты не имеют срока действия.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Requisites;
