/**
 * Admin Panel Page
 * Manage samples, packages, users, and view generation logs
 *
 * TODO: Implement full admin panel with:
 * - SampleManager component
 * - PackageManager component
 * - UserList component
 * - GenerationLogs component
 */

import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Image, Package, Users, FileText } from 'lucide-react';

const AdminApp = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Панель администратора</h1>
            <p className="text-lg text-muted-foreground">
              Добро пожаловать, {user?.phone_number}
            </p>
          </div>

          {/* Quick Stats / Admin Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Image className="w-5 h-5 text-primary" />
                  Образцы
                </CardTitle>
                <CardDescription>Управление примерами изображений</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Добавляйте и редактируйте образцы для главной страницы
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="w-5 h-5 text-primary" />
                  Пакеты
                </CardTitle>
                <CardDescription>Управление тарифами</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Создавайте и редактируйте пакеты подписок
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="w-5 h-5 text-primary" />
                  Пользователи
                </CardTitle>
                <CardDescription>Управление пользователями</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Просмотр и управление аккаунтами пользователей
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="w-5 h-5 text-primary" />
                  Логи генераций
                </CardTitle>
                <CardDescription>История генераций</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Просмотр всех заданий на генерацию
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Placeholder Notice */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Административная панель (в разработке)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Полнофункциональная административная панель с управлением образцами, пакетами,
                пользователями и логами генераций будет доступна в следующей версии.
              </p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Доступные API endpoints для администраторов:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>GET /api/v1/admin/users/ - Список пользователей</li>
                  <li>POST /api/v1/admin/users/{'{id}'}/adjust-credits/ - Коррекция кредитов</li>
                  <li>GET /api/v1/admin/samples/ - Управление образцами</li>
                  <li>GET /api/v1/admin/packages/ - Управление пакетами</li>
                  <li>GET /api/v1/admin/generation-logs/ - Логи генераций</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminApp;
