import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-[#2AABAB] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Политика конфиденциальности</h1>
        <p className="text-gray-500 mb-8">Reklamix AI — защита персональных данных</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Общие положения</h2>
            <p>1.1. Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сервиса Reklamix AI (далее — «Сервис»), принадлежащего ИП Каралиев Ренат Мусаевич (ИНН: 263005525353).</p>
            <p>1.2. Используя Сервис, Пользователь выражает согласие с условиями настоящей Политики.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Собираемые данные</h2>
            <p>2.1. При использовании Сервиса могут собираться следующие данные:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Номер телефона (для регистрации и авторизации);</li>
              <li>Загруженные фотографии товаров (для генерации изображений);</li>
              <li>Информация об оплатах и транзакциях;</li>
              <li>Техническая информация (тип устройства, операционная система, IP-адрес).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Цели обработки данных</h2>
            <p>3.1. Персональные данные обрабатываются для:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Предоставления доступа к функциональности Сервиса;</li>
              <li>Обработки платежей и начисления кредитов;</li>
              <li>Генерации изображений по запросу Пользователя;</li>
              <li>Связи с Пользователем по техническим вопросам;</li>
              <li>Улучшения качества Сервиса.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Хранение и защита данных</h2>
            <p>4.1. Персональные данные хранятся на защищённых серверах с использованием шифрования.</p>
            <p>4.2. Загруженные фотографии товаров хранятся в облачном хранилище Microsoft Azure и используются исключительно для оказания Услуг.</p>
            <p>4.3. Доступ к персональным данным имеют только уполномоченные сотрудники Исполнителя.</p>
            <p>4.4. Данные хранятся в течение срока использования Сервиса и 1 года после удаления аккаунта.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Передача данных третьим лицам</h2>
            <p>5.1. Персональные данные не передаются третьим лицам, за исключением:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Платёжных систем для обработки оплат (Robokassa, Stripe);</li>
              <li>Облачных сервисов для хранения данных (Microsoft Azure);</li>
              <li>Сервисов ИИ для генерации изображений (Google Gemini, Azure OpenAI);</li>
              <li>Случаев, предусмотренных законодательством РФ.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Права пользователя</h2>
            <p>6.1. Пользователь имеет право:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Получить информацию о своих персональных данных;</li>
              <li>Потребовать исправления или удаления своих данных;</li>
              <li>Удалить свой аккаунт и все связанные данные;</li>
              <li>Отозвать согласие на обработку персональных данных.</li>
            </ul>
            <p>6.2. Для реализации своих прав Пользователь может обратиться по адресу: support@reklamix.ai</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Файлы cookie</h2>
            <p>7.1. Сервис может использовать файлы cookie для обеспечения корректной работы, авторизации и аналитики.</p>
            <p>7.2. Пользователь может отключить cookie в настройках браузера.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Изменение политики</h2>
            <p>8.1. Исполнитель оставляет за собой право вносить изменения в настоящую Политику.</p>
            <p>8.2. Актуальная версия Политики всегда доступна на сайте reklamix-ai.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Контакты</h2>
            <p>ИП Каралиев Ренат Мусаевич</p>
            <p>Email: support@reklamix.ai</p>
            <p>Телефон: +7 (928) 970 70 10</p>
            <p>Адрес: Ставропольский край, г. Минеральные Воды, ул. Мира, д. 75А</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
